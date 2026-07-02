"use client"

import { Marker, MarkerContent } from "@/components/ui/marker"
import { Bot, UserCheck, UserX, MessageCircleOff } from "lucide-react"
import type { ChatConversationDetailResponseDto } from "@/lib/api/generated/model"

interface StaffMessageStatusProps {
  status: ChatConversationDetailResponseDto["status"]
}

const STATUS_CONFIG: Record<
  ChatConversationDetailResponseDto["status"],
  { label: string; icon: React.ReactNode }
> = {
  bot_active: { label: "Bot đang trả lời", icon: <Bot className="size-3.5" /> },
  handoff_requested: {
    label: "Chờ nhân viên tiếp nhận",
    icon: <UserCheck className="size-3.5" />,
  },
  staff_assigned: {
    label: "Đã phân công nhân viên",
    icon: <UserCheck className="size-3.5" />,
  },
  staff_active: {
    label: "Nhân viên đang xử lý",
    icon: <UserCheck className="size-3.5" />,
  },
  closed: {
    label: "Cuộc trò chuyện đã đóng",
    icon: <MessageCircleOff className="size-3.5" />,
  },
}

export function StaffMessageStatus({ status }: StaffMessageStatusProps) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    icon: <UserX className="size-3.5" />,
  }

  return (
    <Marker variant="separator" className="px-4 py-2">
      <MarkerContent className="flex items-center gap-1.5">
        {config.icon}
        {config.label}
      </MarkerContent>
    </Marker>
  )
}
