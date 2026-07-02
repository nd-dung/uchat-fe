import type {
  ChatConversationDetailResponseDto,
  ChatMessageResponseDto,
} from "@/lib/api/generated/model"

export type MessageSenderType =
  ChatMessageResponseDto["sender_type"]

export interface StaffMessageItemProps {
  message: ChatMessageResponseDto
  isLast: boolean
  isGrouped: boolean
  isGroupedWithNext: boolean
}

export interface StaffChatPanelProps {
  conversation: ChatConversationDetailResponseDto | null
  messages: ChatMessageResponseDto[]
  isLoadingMessages: boolean
  onHandoff: () => void
  onBack: () => void
  isMobile: boolean
}

export function formatMessageTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatMessageDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function isSameDay(a: string, b: string): boolean {
  const dateA = new Date(a)
  const dateB = new Date(b)
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  )
}

export function getVisitorName(
  visitor: ChatConversationDetailResponseDto["visitor"]
): string {
  if (visitor.name) return String(visitor.name)
  if (visitor.email) return String(visitor.email)
  return `KH #${visitor.id}`
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(-2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase()
}

export function getSenderLabel(senderType: MessageSenderType): string {
  switch (senderType) {
    case "visitor":
      return "Khách hàng"
    case "bot":
      return "Bot"
    case "staff":
      return "Nhân viên"
    case "system":
      return "Hệ thống"
    default:
      return "Không xác định"
  }
}

export function getMessageText(message: ChatMessageResponseDto): string {
  const content = message.content
  if (typeof content === "string") return content
  if (content && typeof content === "object" && "text" in content) {
    return String((content as { text?: unknown }).text ?? "")
  }
  return ""
}

export function getBubbleVariant(senderType: MessageSenderType) {
  switch (senderType) {
    case "visitor":
      return "muted"
    case "bot":
      return "tinted"
    case "staff":
      return "default"
    default:
      return "outline"
  }
}

export function getBubbleAlign(senderType: MessageSenderType): "start" | "end" {
  return senderType === "staff" ? "end" : "start"
}
