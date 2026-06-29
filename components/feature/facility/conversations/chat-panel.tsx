"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  UserPlus,
  ArrowLeft,
  Pencil,
} from "lucide-react"
import { useCreateStaffMessage } from "@/lib/api/generated/chat-conversations/chat-conversations"
import type {
  ChatConversationDetailResponseDto,
  ChatMessageResponseDto,
} from "@/lib/api/generated/model"
import { cn } from "@/lib/utils"
import { EditVisitorDialog } from "./edit-visitor-dialog"

const STATUS_LABELS: Record<string, string> = {
  bot_active: "Bot đang trả lời",
  handoff_requested: "Chờ nhân viên",
  staff_assigned: "Đã phân công",
  staff_active: "Đang xử lý",
  closed: "Đã đóng",
}

interface ChatPanelProps {
  conversation: ChatConversationDetailResponseDto | null
  messages: ChatMessageResponseDto[]
  isLoadingMessages: boolean
  onHandoff: () => void
  onBack: () => void
  isMobile: boolean
}

function formatMessageTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function getVisitorName(visitor: ChatConversationDetailResponseDto["visitor"]): string {
  if (visitor.name) return String(visitor.name)
  if (visitor.email) return String(visitor.email)
  return `KH #${visitor.id}`
}

function getInitials(visitor: ChatConversationDetailResponseDto["visitor"]): string {
  const name = getVisitorName(visitor)
  return name
    .split(" ")
    .slice(-2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase()
}

export function ChatPanel({
  conversation,
  messages,
  isLoadingMessages,
  onHandoff,
  onBack,
  isMobile,
}: ChatPanelProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [editVisitorOpen, setEditVisitorOpen] = React.useState(false)
  const [visitorOverrides, setVisitorOverrides] = React.useState<Record<string, string>>({})
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const createMessage = useCreateStaffMessage()

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || !conversation) return
    const message = inputValue.trim()
    setInputValue("")
    try {
      await createMessage.mutateAsync({
        id: conversation.id,
        data: { content: message },
      })
    } catch {
      setInputValue(message)
    }
  }

  if (!conversation) {
    return (
      <div className="flex h-full flex-1 items-center justify-center text-muted-foreground">
        <div className="text-center">
          <div className="mb-2 text-4xl">💬</div>
          <p className="text-sm">Chọn một cuộc trò chuyện để bắt đầu</p>
        </div>
      </div>
    )
  }

  const conv = {
    ...conversation,
    visitor: {
      ...conversation.visitor,
      name: (visitorOverrides.name || conversation.visitor.name) as any,
      email: (visitorOverrides.email || conversation.visitor.email) as any,
      phone: (visitorOverrides.phone || conversation.visitor.phone) as any,
    },
  }

  return (
    <div className="flex h-full flex-1 flex-col">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
        {isMobile && (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Avatar className="h-9 w-9">
          <AvatarFallback className="text-xs">
            {getInitials(conv.visitor)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">
            {getVisitorName(conv.visitor)}
          </p>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="h-4 px-1 text-[10px]">
              {STATUS_LABELS[conv.status] || conv.status}
            </Badge>
            {conv.visitor.email && (
              <span className="truncate text-[10px] text-muted-foreground">
                {String(conv.visitor.email)}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {conv.status !== "closed" && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onHandoff}>
              <UserPlus className="h-4 w-4" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditVisitorOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Sửa thông tin khách hàng
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onHandoff}>Chuyển nhân viên</DropdownMenuItem>
              <DropdownMenuItem>Đóng cuộc trò chuyện</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        {isLoadingMessages ? (
          <div className="space-y-4 py-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={cn("flex", i % 2 === 0 ? "justify-start" : "justify-end")}>
                <Skeleton className="h-10 w-48 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <p className="text-sm">Chưa có tin nhắn</p>
          </div>
        ) : (
          <div className="space-y-3 py-4">
            {messages.map((msg) => {
              const isVisitor = msg.sender_type === "visitor"
              return (
                <div
                  key={msg.id}
                  className={cn("flex", isVisitor ? "justify-start" : "justify-end")}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2",
                      isVisitor
                        ? "bg-muted rounded-bl-sm"
                        : "bg-primary text-primary-foreground rounded-br-sm"
                    )}
                  >
                    <p className="whitespace-pre-wrap text-sm">
                      {typeof msg.content === "string"
                        ? msg.content
                        : msg.content && typeof msg.content === "object" && "text" in msg.content
                          ? String((msg.content as { text?: unknown }).text)
                          : ""}
                    </p>
                    <p
                      className={cn(
                        "mt-1 text-[10px]",
                        isVisitor ? "text-muted-foreground" : "text-primary-foreground/70"
                      )}
                    >
                      {formatMessageTime(msg.sent_at)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      {conversation.status !== "closed" && (
        <div className="shrink-0 border-t p-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
              <Smile className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Nhập tin nhắn..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              disabled={createMessage.isPending}
              className="flex-1"
            />
            <Button
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={handleSend}
              disabled={!inputValue.trim() || createMessage.isPending}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Visitor Dialog */}
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
