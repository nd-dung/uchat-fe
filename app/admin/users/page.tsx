"use client"

import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { UserToolbar } from "@/components/feature/admin/users/user-toolbar"
import { UserTable } from "@/components/feature/admin/users/user-table"
import { UserTableSkeleton } from "@/components/feature/admin/users/user-table-skeleton"
import { UserFormDialog, type UserFormValues } from "@/components/feature/admin/users/user-form-dialog"
import { UserDeleteDialog } from "@/components/feature/admin/users/user-delete-dialog"
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
    listParams,
    isFiltered,
    clearFilters,
  } = useUserFilters()

  const { data: usersData, isLoading: isLoadingUsers } = useListUsers(listParams)
  const { data: facilitiesData } = useListFacilities({})

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
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
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
  )
}
