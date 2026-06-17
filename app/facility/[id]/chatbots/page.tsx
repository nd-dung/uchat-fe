"use client"

export const dynamic = "force-dynamic"import * as React from "react"
import { useParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ChatbotToolbar } from "@/components/feature/facility/chatbots/chatbot-toolbar"
import { ChatbotTable } from "@/components/feature/facility/chatbots/chatbot-table"
import { ChatbotTableSkeleton } from "@/components/feature/facility/chatbots/chatbot-table-skeleton"
import { ChatbotFormDialog, type ChatbotFormValues } from "@/components/feature/facility/chatbots/chatbot-form-dialog"
import { ChatbotDeleteDialog } from "@/components/feature/facility/chatbots/chatbot-delete-dialog"
import { UserPagination } from "@/components/feature/admin/users/user-pagination"
import {
  useListChatbots,
  useCreateChatbot,
  useUpdateChatbot,
  useDeleteChatbot,
} from "@/lib/api/generated/chatbots/chatbots"
import { useChatbotFilters } from "@/features/facility/chatbots"
import type { ChatbotResponseDto } from "@/features/facility/chatbots"

export default function ChatbotsPage() {
  const params = useParams()
  const facilityId = Number(params.id)
  const queryClient = useQueryClient()

  const {
    search, setSearch,
    status, setStatus,
    page, setPage,
    limit,
    listParams,
    isFiltered,
    clearFilters,
  } = useChatbotFilters(facilityId)

  const { data: chatbotsData, isLoading: isLoadingChatbots } = useListChatbots(listParams as unknown as Parameters<typeof useListChatbots>[0])
  const chatbots = chatbotsData?.data?.items ?? []
  const pagination = chatbotsData?.data?.pagination

  const createMutation = useCreateChatbot()
  const updateMutation = useUpdateChatbot()
  const deleteMutation = useDeleteChatbot()

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingChatbot, setEditingChatbot] = React.useState<ChatbotResponseDto | null>(null)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deletingChatbot, setDeletingChatbot] = React.useState<ChatbotResponseDto | null>(null)

  const openCreate = () => { setEditingChatbot(null); setDialogOpen(true) }
  const openEdit = (c: ChatbotResponseDto) => { setEditingChatbot(c); setDialogOpen(true) }
  const openDelete = (c: ChatbotResponseDto) => { setDeletingChatbot(c); setDeleteOpen(true) }

  const handleSubmit = async (values: ChatbotFormValues) => {
    const payload = {
      name: values.name,
      display_name: values.display_name || undefined,
      description: values.description || undefined,
      status: values.status,
    }

    if (editingChatbot) {
      await updateMutation.mutateAsync({
        id: editingChatbot.id,
        data: payload as Parameters<typeof updateMutation.mutateAsync>[0]["data"],
      })
    } else {
      await createMutation.mutateAsync({
        data: { ...payload, facility_id: facilityId } as Parameters<typeof createMutation.mutateAsync>[0]["data"],
      })
    }

    queryClient.invalidateQueries({ queryKey: ["/api/chatbots"] })
    setDialogOpen(false)
  }

  const handleDelete = async () => {
    if (!deletingChatbot) return
    await deleteMutation.mutateAsync({ id: deletingChatbot.id })
    queryClient.invalidateQueries({ queryKey: ["/api/chatbots"] })
    setDeleteOpen(false)
    setDeletingChatbot(null)
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={`/facility/${facilityId}/dashboard`}>Khoa</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem><BreadcrumbPage>Danh s\u00e1ch chatbot</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <ChatbotToolbar
          search={search}
          onSearchChange={setSearch}
          statusFilter={status}
          onStatusChange={setStatus}
          isFiltered={isFiltered}
          onClearFilters={clearFilters}
          onAddChatbot={openCreate}
        />

        {isLoadingChatbots ? <ChatbotTableSkeleton /> : (
          <ChatbotTable chatbots={chatbots} onEdit={openEdit} onDelete={openDelete} />
        )}

        {!isLoadingChatbots && pagination && pagination.total_pages > 1 && (
          <UserPagination page={pagination.page} totalPages={pagination.total_pages} onPageChange={setPage} />
        )}

        <ChatbotFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          editingChatbot={editingChatbot}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onSubmit={handleSubmit}
        />

        <ChatbotDeleteDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          chatbot={deletingChatbot}
          isDeleting={deleteMutation.isPending}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  )
}
