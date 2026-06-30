"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ChatbotEmptyState } from "@/components/feature/facility/chatbots/chatbot-empty-state"
import { ChatbotFormDialog, type ChatbotFormValues } from "@/components/feature/facility/chatbots/chatbot-form-dialog"
import { ChatCustomizer } from "@/components/feature/facility/chatbots/chat-customizer"
import { useListChatbots, useCreateChatbot } from "@/lib/api/generated/chatbots/chatbots"
import type { ListChatbotsParams, CreateChatbotDto, ApiErrorResponseDto } from "@/lib/api/generated/model"
import { AxiosError } from "axios"
import { toast } from "sonner"

export default function ChatbotStudioPage() {
  const params = useParams()
  const facilityId = Number(params.id)
  const queryClient = useQueryClient()

  const listParams: ListChatbotsParams = { facility_id: facilityId }
  const { data: chatbotsData, isLoading: isLoadingChatbots } = useListChatbots(listParams)
  const chatbots = chatbotsData?.data?.items ?? []
  const chatbot = chatbots[0]

  const createMutation = useCreateChatbot()
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const openCreate = () => setDialogOpen(true)

  const handleCreate = async (values: ChatbotFormValues) => {
    try {
      await createMutation.mutateAsync({
        data: { ...values, facility_id: facilityId, status: "draft" } as CreateChatbotDto,
      })
      toast.success("Tạo chatbot thành công")
      queryClient.invalidateQueries({ queryKey: ["/api/chatbots"] })
      setDialogOpen(false)
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponseDto>
      const message = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      toast.error(message)
    }
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
              <BreadcrumbItem><BreadcrumbPage>Chatbot Studio</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div>
          <h1 className="text-lg font-semibold">Chatbot Studio</h1>
          <p className="text-sm text-muted-foreground">Tạo và tùy chỉnh giao diện chatbot</p>
        </div>

        {isLoadingChatbots ? (
          <div className="h-[calc(100vh-12rem)] min-h-[500px] overflow-hidden rounded-lg border flex">
            <div className="flex-1 p-4 space-y-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60" />
              <div className="flex-1 flex items-center justify-center">
                <Skeleton className="h-[300px] w-[380px] rounded-lg" />
              </div>
            </div>
            <div className="w-80 border-l p-4 space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-4 w-32" />
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            </div>
          </div>
        ) : chatbot ? (
          <div className="h-[calc(100vh-12rem)] min-h-[500px] overflow-hidden rounded-lg border">
            <ChatCustomizer chatbotId={chatbot.id} />
          </div>
        ) : (
          <ChatbotEmptyState onCreate={openCreate} />
        )}

        <ChatbotFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          isSubmitting={createMutation.isPending}
          onSubmit={handleCreate}
        />
      </div>
    </div>
  )
}
