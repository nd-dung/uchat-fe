"use client"

import { MessageSquare } from "lucide-react"

export function StaffEmptyState() {
  return (
    <div className="flex h-full flex-1 items-center justify-center text-muted-foreground">
      <div className="text-center">
        <div className="mb-3 inline-flex items-center justify-center rounded-full bg-muted p-3">
          <MessageSquare className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium">Chọn một cuộc trò chuyện để bắt đầu</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Bạn sẽ thấy toàn bộ lịch sử giữa khách hàng và bot tại đây
        </p>
      </div>
    </div>
  )
}
