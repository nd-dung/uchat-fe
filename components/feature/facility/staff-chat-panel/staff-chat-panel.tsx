"use client"

import * as React from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Loader2, MoreVertical, Pencil, UserCheck, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import { apiClient } from "@/lib/api/axios"
import { useCreateStaffMessage } from "@/lib/api/generated/chat-conversations/chat-conversations"
import { useListUsers } from "@/lib/api/generated/users/users"
import { CurrentUserResponseDtoRole } from "@/lib/api/generated/model/currentUserResponseDtoRole"
import { ListUsersRole } from "@/lib/api/generated/model/listUsersRole"
import { ListUsersStatus } from "@/lib/api/generated/model/listUsersStatus"
import type {
  ChatConversationDetailResponseDto,
  ChatMessageResponseDto,
  UserResponseDto,
} from "@/lib/api/generated/model"
import { EditVisitorDialog } from "../conversations/edit-visitor-dialog"
import { StaffMessageInput } from "./staff-message-input"
import { StaffMessageScroller } from "./staff-message-scroller"
import { StaffEmptyState } from "./staff-empty-state"
import { StaffMessageStatus } from "./staff-message-status"
import { getInitials, getVisitorName } from "./utils"

interface StaffChatPanelProps {
  conversation: ChatConversationDetailResponseDto | null
  messages: ChatMessageResponseDto[]
  isLoadingMessages: boolean
  onHandoff: () => void
  onBack: () => void
  isMobile: boolean
}

type OpenHandoff = {
  id: number
  conversation_id: number
  assigned_staff_id?: number | null
  requested_by_user_id?: number | null
  source?: string
  visitor_response_status?: string | null
  status: string
}

const STATUS_LABELS: Record<string, string> = {
  bot_active: "Bot đang trả lời",
  handoff_requested: "Chờ nhân viên",
  staff_assigned: "Đã phân công",
  staff_active: "Đang xử lý",
  closed: "Đã đóng",
}

export function StaffChatPanel({
  conversation,
  messages,
  isLoadingMessages,
  onHandoff,
  onBack,
  isMobile,
}: StaffChatPanelProps) {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [editVisitorOpen, setEditVisitorOpen] = React.useState(false)
  const [assignOpen, setAssignOpen] = React.useState(false)
  const [selectedStaffId, setSelectedStaffId] = React.useState<string>("")
  const [visitorOverrides, setVisitorOverrides] = React.useState<Record<string, string>>({})
  const createMessage = useCreateStaffMessage()

  const isAdmin = user?.role === CurrentUserResponseDtoRole.facility_admin
  const isStaff = user?.role === CurrentUserResponseDtoRole.facility_staff

  const { data: staffData, isLoading: isLoadingStaff } = useListUsers(
    {
      facility_id: user?.facility_id ?? undefined,
      role: ListUsersRole.facility_staff,
      status: ListUsersStatus.active,
      limit: 100 as never,
    },
    { query: { enabled: isAdmin && !!user?.facility_id } }
  )

  const staffList: UserResponseDto[] = staffData?.data?.items ?? []

  const { data: openHandoffData } = useQuery({
    queryKey: ["conversation-open-handoff", conversation?.id],
    enabled: !!conversation?.id,
    queryFn: () =>
      apiClient<{ data?: { items?: OpenHandoff[] } }>({
        url: "/api/chat-handoff-requests",
        method: "GET",
        params: {
          conversation_id: conversation?.id,
          status: "pending",
          limit: 1,
        },
      }),
  })

  const openHandoff = openHandoffData?.data?.items?.[0]

  const invalidateChat = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["/api/chat-conversations"] }),
      queryClient.invalidateQueries({ queryKey: ["/api/chat-handoff-requests"] }),
      conversation?.id
        ? queryClient.invalidateQueries({ queryKey: [`/api/chat-conversations/${conversation.id}/messages`] })
        : Promise.resolve(),
      conversation?.id
        ? queryClient.invalidateQueries({ queryKey: ["conversation-open-handoff", conversation.id] })
        : Promise.resolve(),
    ])
  }

  const assignConversation = useMutation({
    mutationFn: (staffId?: number) =>
      apiClient({
        url: `/api/chat-conversations/${conversation?.id}/assign-staff`,
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        data: staffId ? { assigned_staff_id: staffId } : {},
      }),
    onSuccess: async () => {
      toast.success("Đã gán nhân viên")
      setAssignOpen(false)
      setSelectedStaffId("")
      await invalidateChat()
    },
    onError: () => toast.error("Không thể gán nhân viên"),
  })

  const requestStaffChat = useMutation({
    mutationFn: () =>
      apiClient({
        url: `/api/chat-conversations/${conversation?.id}/staff-chat-request`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        data: { reason: "Nhân viên muốn trò chuyện trực tiếp với visitor." },
      }),
    onSuccess: async () => {
      toast.success("Đã gửi yêu cầu trò chuyện tới visitor")
      await invalidateChat()
    },
    onError: () => toast.error("Không thể gửi yêu cầu trò chuyện"),
  })

  const acceptHandoff = useMutation({
    mutationFn: (handoffId: number) =>
      apiClient({
        url: `/api/chat-handoff-requests/${handoffId}/accept`,
        method: "PATCH",
      }),
    onSuccess: async () => {
      toast.success("Đã tiếp nhận trò chuyện")
      await invalidateChat()
    },
    onError: () => toast.error("Không thể tiếp nhận yêu cầu"),
  })

  const handleSend = async (text: string) => {
    if (!conversation) return
    try {
      await createMessage.mutateAsync({
        id: conversation.id,
        data: { content: text },
      })
    } catch {
      toast.error("Không thể gửi tin nhắn")
    }
  }

  if (!conversation) return <StaffEmptyState />

  const conv = {
    ...conversation,
    visitor: {
      ...conversation.visitor,
      name: (visitorOverrides.name || conversation.visitor.name) as any,
      email: (visitorOverrides.email || conversation.visitor.email) as any,
      phone: (visitorOverrides.phone || conversation.visitor.phone) as any,
    },
  }

  const visitorName = getVisitorName(conv.visitor)
  const isClosed = conv.status === "closed"
  const isAssignedToMe = user?.id === conv.assigned_staff_id
  const canSendMessage = conv.status === "staff_active" && (isAdmin || isAssignedToMe)
  const isStaffRequestPending = openHandoff?.source === "staff" && openHandoff?.visitor_response_status === "pending"
  const isVisitorRequestForMe = openHandoff?.source === "visitor" && (!openHandoff.assigned_staff_id || openHandoff.assigned_staff_id === user?.id)

  const primaryAction = (() => {
    if (isClosed) return null
    if (isAdmin) {
      return (
        <Button variant="secondary" size="sm" onClick={() => setAssignOpen(true)}>
          <UserPlus className="mr-1.5 h-3.5 w-3.5" />
          {conv.assigned_staff_id ? "Chuyển nhân viên" : "Gán nhân viên"}
        </Button>
      )
    }
    if (isStaff && isAssignedToMe && conv.status === "staff_assigned" && !openHandoff) {
      return (
        <Button size="sm" onClick={() => requestStaffChat.mutate()} disabled={requestStaffChat.isPending}>
          {requestStaffChat.isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <UserPlus className="mr-1.5 h-3.5 w-3.5" />}
          Yêu cầu trò chuyện
        </Button>
      )
    }
    if (isStaff && isVisitorRequestForMe && openHandoff) {
      return (
        <Button size="sm" onClick={() => acceptHandoff.mutate(openHandoff.id)} disabled={acceptHandoff.isPending}>
          {acceptHandoff.isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <UserCheck className="mr-1.5 h-3.5 w-3.5" />}
          Tiếp nhận
        </Button>
      )
    }
    return null
  })()

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <div className="flex h-14 shrink-0 items-center gap-3 border-b bg-background px-4">
        {isMobile && (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Avatar className="h-9 w-9">
          <AvatarFallback className="text-xs">{getInitials(visitorName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{visitorName}</p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="h-4 px-1 text-[10px]">
              {STATUS_LABELS[conv.status] || conv.status}
            </Badge>
            {conv.assigned_staff && (
              <span className="truncate text-[10px] text-muted-foreground">
                Phụ trách: {conv.assigned_staff.name}
              </span>
            )}
            {isStaffRequestPending && (
              <span className="text-[10px] text-amber-600">Đang chờ khách đồng ý</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {primaryAction}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Tùy chọn">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditVisitorOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Sửa thông tin khách hàng
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onHandoff}>Quản lý yêu cầu</DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem onClick={() => setAssignOpen(true)}>
                  {conv.assigned_staff_id ? "Chuyển nhân viên" : "Gán nhân viên"}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <StaffMessageStatus status={conv.status} />
      <StaffMessageScroller messages={messages} isLoading={isLoadingMessages} />
      <StaffMessageInput
        disabled={!canSendMessage}
        isSubmitting={createMessage.isPending}
        placeholder={canSendMessage ? "Nhập tin nhắn trả lời..." : "Cần được khách đồng ý hoặc tiếp nhận trước khi nhắn"}
        onSend={handleSend}
      />

      <Sheet open={assignOpen} onOpenChange={setAssignOpen}>
        <SheetContent className="w-[380px] sm:w-[440px]">
          <SheetHeader>
            <SheetTitle>{conv.assigned_staff_id ? "Chuyển nhân viên" : "Gán nhân viên"}</SheetTitle>
            <SheetDescription>Chọn một nhân viên active trong khoa để phụ trách cuộc trò chuyện này.</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <Select value={selectedStaffId} onValueChange={setSelectedStaffId} disabled={isLoadingStaff}>
              <SelectTrigger>
                <SelectValue placeholder={isLoadingStaff ? "Đang tải nhân viên..." : "Chọn nhân viên"} />
              </SelectTrigger>
              <SelectContent>
                {staffList.map((staff) => (
                  <SelectItem key={staff.id} value={String(staff.id)}>
                    {staff.name} - {staff.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="w-full"
              disabled={!selectedStaffId || assignConversation.isPending}
              onClick={() => assignConversation.mutate(Number(selectedStaffId))}
            >
              {assignConversation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xác nhận
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <EditVisitorDialog
        key={conv.id}
        open={editVisitorOpen}
        onOpenChange={setEditVisitorOpen}
        conversation={conv}
        onUpdate={(data) => {
          setVisitorOverrides((prev) => ({
            ...prev,
            ...(data.name && { name: data.name }),
            ...(data.email && { email: data.email }),
            ...(data.phone && { phone: data.phone }),
          }))
        }}
      />
    </div>
  )
}
