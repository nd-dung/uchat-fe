"use client"

export const dynamic = "force-dynamic"
import * as React from "react"
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
import { FacilityToolbar } from "@/components/feature/admin/facilities/facility-toolbar"
import { FacilityTable } from "@/components/feature/admin/facilities/facility-table"
import { FacilityTableSkeleton } from "@/components/feature/admin/facilities/facility-table-skeleton"
import {
  FacilityFormDialog,
  type FacilityFormValues,
} from "@/components/feature/admin/facilities/facility-form-dialog"
import { FacilityStatCards } from "@/components/feature/admin/facilities/facility-stat-cards"
import { FacilityDeleteDialog } from "@/components/feature/admin/facilities/facility-delete-dialog"
import { UserPagination } from "@/components/feature/admin/users/user-pagination"
import {
  useListFacilities,
  useCreateFacility,
  useUpdateFacility,
  useDeleteFacility,
} from "@/lib/api/generated/facilities/facilities"
import { useFacilityFilters } from "@/features/admin/facilities"
import type { FacilityResponseDto } from "@/features/admin/facilities"

export default function FacilitiesPage() {
  const queryClient = useQueryClient()
  const {
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    limit,
    listParams,
    isFiltered,
    clearFilters,
  } = useFacilityFilters()

  const { data: facilitiesData, isLoading: isLoadingFacilities } =
    useListFacilities(listParams)

  const prevFiltersRef = React.useRef({ search, status })
  React.useEffect(() => {
    const prev = prevFiltersRef.current
    if (prev.search !== search || prev.status !== status) {
      setPage(1)
      prevFiltersRef.current = { search, status }
    }
  }, [search, status, setPage])

  const facilities = facilitiesData?.data?.items ?? []
  const pagination = facilitiesData?.data?.pagination

  const createFacilityMutation = useCreateFacility()
  const updateFacilityMutation = useUpdateFacility()
  const deleteFacilityMutation = useDeleteFacility()

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingFacility, setEditingFacility] =
    React.useState<FacilityResponseDto | null>(null)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deletingFacility, setDeletingFacility] =
    React.useState<FacilityResponseDto | null>(null)

  const openCreate = () => {
    setEditingFacility(null)
    setDialogOpen(true)
  }

  const openEdit = (facility: FacilityResponseDto) => {
    setEditingFacility(facility)
    setDialogOpen(true)
  }

  const openDelete = (facility: FacilityResponseDto) => {
    setDeletingFacility(facility)
    setDeleteOpen(true)
  }

  const handleSubmit = async (values: FacilityFormValues) => {
    const payload = {
      name: values.name,
      code: values.code,
      slug: values.slug,
      description: values.description || undefined,
      status: values.status,
    }

    if (editingFacility) {
      await updateFacilityMutation.mutateAsync({
        id: editingFacility.id,
        data: payload as Parameters<typeof updateFacilityMutation.mutateAsync>[0]["data"],
      })
    } else {
      await createFacilityMutation.mutateAsync({
        data: payload as Parameters<typeof createFacilityMutation.mutateAsync>[0]["data"],
      })
    }

    queryClient.invalidateQueries({ queryKey: ["/api/facilities"] })
    setDialogOpen(false)
  }

  const handleDelete = async () => {
    if (!deletingFacility) return
    await deleteFacilityMutation.mutateAsync({ id: deletingFacility.id })
    queryClient.invalidateQueries({ queryKey: ["/api/facilities"] })
    setDeleteOpen(false)
    setDeletingFacility(null)
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
                <BreadcrumbPage>Quản lý khoa</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <FacilityStatCards />

        <FacilityToolbar
          search={search}
          onSearchChange={setSearch}
          statusFilter={status}
          onStatusChange={setStatus}
          isFiltered={isFiltered}
          onClearFilters={clearFilters}
          onAddFacility={openCreate}
        />

        {isLoadingFacilities ? (
          <FacilityTableSkeleton />
        ) : (
          <FacilityTable
            facilities={facilities}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        )}

        {!isLoadingFacilities && pagination && pagination.total_pages > 1 && (
          <UserPagination
            page={pagination.page}
            totalPages={pagination.total_pages}
            onPageChange={setPage}
          />
        )}

        <FacilityFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          editingFacility={editingFacility}
          isSubmitting={
            createFacilityMutation.isPending || updateFacilityMutation.isPending
          }
          onSubmit={handleSubmit}
        />

        <FacilityDeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          facility={deletingFacility}
          isDeleting={deleteFacilityMutation.isPending}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  )
}
