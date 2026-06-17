"use client"

export const dynamic = "force-dynamic"import * as React from "react"
import { useQueryState, parseAsStringLiteral } from "nuqs"
import { useQueryClient } from "@tanstack/react-query"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AdminTabs, AdminTabItem, AdminTabContent } from "@/components/feature/admin/users/admin-tabs"
import { ListIcon, BarChart3Icon } from "lucide-react"
import { UserToolbar } from "@/components/feature/admin/users/user-toolbar"
import { UserTable } from "@/components/feature/admin/users/user-table"
import { UserTableSkeleton } from "@/components/feature/admin/users/user-table-skeleton"
import { UserFormDialog, type UserFormValues } from "@/components/feature/admin/users/user-form-dialog"
import { UserDeleteDialog } from "@/components/feature/admin/users/user-delete-dialog"
import { UserPagination } from "@/components/feature/admin/users/user-pagination"
import { UserAnalytics } from "@/components/feature/admin/users/user-analytics"
import {
  useListUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/lib/api/generated/users/users"
import { useListFacilities } from "@/lib/api/generated/facilities/facilities"
import { useUserFilters } from "@/features/admin/users"
import type { UserResponseDto } from "@/features/admin/users"

export default function UsersPage() {
  const queryClient = useQueryClient()
  const {
    search,
    setSearch,
    role,
    setRole,
    status,
    setStatus,
    facility,
    setFacility,
    page,
    setPage,
    limit,
    listParams,
    isFiltered,
    clearFilters,
  } = useUserFilters()

  const [tab, setTab] = useQueryState(
    "tab",
    parseAsStringLiteral(["users", "analytics"] as const).withDefault("users")
  )

  const { data: usersData, isLoading: isLoadingUsers } = useListUsers(listParams)
  const { data: facilitiesData } = useListFacilities({})

  const prevFiltersRef = React.useRef({ search, role, status, facility })
  React.useEffect(() => {
    const prev = prevFiltersRef.current
    if (
      prev.search !== search ||
      prev.role !== role ||
      prev.status !== status ||
      prev.facility !== facility
    ) {
      setPage(1)
      prevFiltersRef.current = { search, role, status, facility }
    }
  }, [search, role, status, facility, setPage])

  const facilities = React.useMemo(
    () => facilitiesData?.data?.items ?? [],
    [facilitiesData]
  )
  const facilityMap = React.useMemo(() => {
    const map = new Map<number, string>()
    for (const f of facilities) {
      map.set(f.id, f.name)
    }
    return map
  }, [facilities])

  const users = usersData?.data?.items ?? []
  const pagination = usersData?.data?.pagination

  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingUser, setEditingUser] = React.useState<UserResponseDto | null>(null)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deletingUser, setDeletingUser] = React.useState<UserResponseDto | null>(null)

  const openCreate = () => {
    setEditingUser(null)
    setDialogOpen(true)
  }

  const openEdit = (user: UserResponseDto) => {
    setEditingUser(user)
    setDialogOpen(true)
  }

  const openDelete = (user: UserResponseDto) => {
    setDeletingUser(user)
    setDeleteOpen(true)
  }

  const handleSubmit = async (values: UserFormValues) => {
    const facilityId =
      values.facility_id && values.facility_id !== "none"
        ? Number(values.facility_id)
        : undefined

    if (editingUser) {
      const payload: Record<string, unknown> = {
        name: values.name,
        email: values.email,
        role: values.role,
        status: values.status,
      }
      if (values.password) payload.password = values.password
      if (facilityId !== undefined) payload.facility_id = facilityId

      await updateUserMutation.mutateAsync({
        id: editingUser.id,
        data: payload as Parameters<typeof updateUserMutation.mutateAsync>[0]["data"],
      })
    } else {
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("email", values.email)
      formData.append("password", values.password || "")
      formData.append("role", values.role)
      formData.append("status", values.status)
      if (facilityId !== undefined) {
        formData.append("facility_id", String(facilityId))
      }

      await createUserMutation.mutateAsync({
        data: Object.fromEntries(formData) as unknown as Parameters<typeof createUserMutation.mutateAsync>[0]["data"],
      })
    }

    queryClient.invalidateQueries({ queryKey: ["/api/users"] })
    setDialogOpen(false)
  }

  const handleToggleStatus = async (user: UserResponseDto, checked: boolean) => {
    await updateUserMutation.mutateAsync({
      id: user.id,
      data: { status: checked ? "active" : "inactive" },
    })
    queryClient.invalidateQueries({ queryKey: ["/api/users"] })
  }

  const handleDelete = async () => {
    if (!deletingUser) return
    await deleteUserMutation.mutateAsync({ id: deletingUser.id })
    queryClient.invalidateQueries({ queryKey: ["/api/users"] })
    setDeleteOpen(false)
    setDeletingUser(null)
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Quản lý người dùng</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <AdminTabs value={tab ?? "users"} onChange={(v) => setTab(v as "users" | "analytics")}>
          <AdminTabItem value="users" label="Danh sách" icon={<ListIcon className="h-3.5 w-3.5" />} />
          <AdminTabItem value="analytics" label="Thống kê" icon={<BarChart3Icon className="h-3.5 w-3.5" />} />
        </AdminTabs>

        <AdminTabContent value="users" current={tab ?? "users"}>
          <div className="flex flex-col gap-6">
            <UserToolbar
              search={search}
              onSearchChange={setSearch}
              roleFilter={role}
              onRoleChange={setRole}
              statusFilter={status}
              onStatusChange={setStatus}
              facilityFilter={facility}
              onFacilityChange={setFacility}
              facilities={facilities}
              isFiltered={isFiltered}
              onClearFilters={clearFilters}
              onAddUser={openCreate}
            />

            {isLoadingUsers ? (
              <UserTableSkeleton />
            ) : (
              <UserTable
                users={users}
                facilityMap={facilityMap}
                onToggleStatus={handleToggleStatus}
                onEdit={openEdit}
                onDelete={openDelete}
                isMutating={updateUserMutation.isPending}
              />
            )}

            {!isLoadingUsers && pagination && pagination.total_pages > 1 && (
              <UserPagination
                page={pagination.page}
                totalPages={pagination.total_pages}
                onPageChange={setPage}
              />
            )}

            <UserFormDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              editingUser={editingUser}
              facilities={facilities}
              isSubmitting={createUserMutation.isPending || updateUserMutation.isPending}
              onSubmit={handleSubmit}
            />

            <UserDeleteDialog
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              user={deletingUser}
              isDeleting={deleteUserMutation.isPending}
              onConfirm={handleDelete}
            />
          </div>
        </AdminTabContent>

        <AdminTabContent value="analytics" current={tab ?? "users"}>
          <UserAnalytics />
        </AdminTabContent>
      </div>
    </div>
  )
}
