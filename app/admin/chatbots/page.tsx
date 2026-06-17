"use client"

import * as React from "react"
import { Suspense } from "react"
import { useQueryClient } from "@tanstack/react-query"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ChatbotToolbar } from "@/components/feature/admin/chatbots/chatbot-toolbar"
import { ChatbotTable } from "@/components/feature/admin/chatbots/chatbot-table"
import { ChatbotTableSkeleton } from "@/components/feature/admin/chatbots/chatbot-table-skeleton"
import { ChatbotFormDialog, type ChatbotFormValues } from "@/components/feature/admin/chatbots/chatbot-form-dialog"
import { ChatbotDeleteDialog } from "@/components/feature/admin/chatbots/chatbot-delete-dialog"
import { UserPagination } from "@/components/feature/admin/users/user-pagination"
import {
  useListChatbots,
  useCreateChatbot,
  useUpdateChatbot,
  useDeleteChatbot,
} from "@/lib/api/generated/chatbots/chatbots"
import { useChatbotFilters } from "@/features/admin/chatbots"
import type { ChatbotResponseDto } from "@/features/admin/chatbots"

function ChatbotsPageContent() {
  const queryClient = useQueryClient()
  const {
    search, setSearch, status, setStatus, page, setPage, limit, listParams, isFiltered, clearFilters,
  } = useChatbotFilters()

  const { data: chatbotsData, isLoading: isLoadingChatbots } = useListChatbots(listParams)

  const prevFiltersRef = React.useRef({ search, status })
  React.useEffect(() => {
    const prev = prevFiltersRef.current
    if (prev.search !== search || prev.status !== status) {
      setPage(1)
      prevFiltersRef.current = { search, status }
    }
  }, [search, status, setPage])

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
        data: payload as Parameters<typeof createMutation.mutateAsync>[0]["data"],
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
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block"><BreadcrumbLink href="/admin">Admin</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem><BreadcrumbPage>Qu\u1ea3n l\u00fd chatbot</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <ChatbotToolbar
          search={search} onSearchChange={setSearch}
          statusFilter={status} onStatusChange={setStatus}
          isFiltered={isFiltered} onClearFilters={clearFilters}
          onAddChatbot={openCreate}
        />

        {isLoadingChatbots ? <ChatbotTableSkeleton /> : (
          <ChatbotTable chatbots={chatbots} onEdit={openEdit} onDelete={openDelete} />
        )}

        {!isLoadingChatbots && pagination && pagination.total_pages > 1 && (
          <UserPagination page={pagination.page} totalPages={pagination.total_pages} onPageChange={setPage} />
        )}

        <ChatbotFormDialog
          open={dialogOpen} onOpenChange={setDialogOpen}
          editingChatbot={editingChatbot}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          onSubmit={handleSubmit}
        />

        <ChatbotDeleteDialog
          open={deleteOpen} onOpenChange={setDeleteOpen}
          chatbot={deletingChatbot}
          isDeleting={deleteMutation.isPending}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  )
}

export default function ChatbotsPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <ChatbotsPageContent />
    </Suspense>
  )
}
