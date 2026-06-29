"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Users, Clock, AlertCircle, MessageSquare } from "lucide-react"
import type { ChatConversationDetailResponseDto } from "@/lib/api/generated/model"
import { cn } from "@/lib/utils"

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  bot_active: { label: "Bot", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  handoff_requested: { label: "Chờ xử lý", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  staff_assigned: { label: "Đã phân công", color: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
  staff_active: { label: "Đang xử lý", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  closed: { label: "Đã đóng", color: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
}

const FILTER_TABS = [
  { key: "all", label: "Tất cả", icon: Users },
  { key: "pending", label: "Chờ xử lý", icon: Clock },
  { key: "active", label: "Đang xử lý", icon: AlertCircle },
] as const

interface ConversationListProps {
  conversations: ChatConversationDetailResponseDto[]
  selectedId: number | null
  onSelect: (id: number) => void
  isLoading: boolean
  filter: string
  onFilterChange: (filter: string) => void
}

function formatTime(dateStr: string | null | undefined): string {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMin / 60)

  if (diffMin < 1) return "vừa xong"
  if (diffMin < 60) return `${diffMin}p`
  if (diffHour < 24) return `${diffHour}h`
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
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

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  isLoading,
  filter,
  onFilterChange,
}: ConversationListProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = React.useState(false)
  const dragState = React.useRef({ startX: 0, scrollLeft: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    dragState.current.startX = e.pageX - scrollRef.current.offsetLeft
    dragState.current.scrollLeft = scrollRef.current.scrollLeft
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - dragState.current.startX) * 1.5
    scrollRef.current.scrollLeft = dragState.current.scrollLeft - walk
  }

  const handleMouseUp = () => setIsDragging(false)

  return (
    <div className="flex h-full flex-col border-r bg-white">
      {/* Search */}
      <div className="shrink-0 border-b px-3 py-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm..."
            className="h-9 bg-muted/50 pl-8 text-sm"
          />
        </div>
      </div>

      {/* Draggable Filter Tabs */}
      <div
        ref={scrollRef}
        className={cn(
          "flex shrink-0 gap-1.5 overflow-x-auto border-b px-3 py-2.5",
          "scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          isDragging && "cursor-grabbing select-none"
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {FILTER_TABS.map((tab) => {
          const isActive = filter === tab.key
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => onFilterChange(tab.key)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}

            </button>
          )
        })}
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="space-y-1 p-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl p-3">
                <Skeleton className="h-11 w-11 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <Skeleton className="h-3 w-10" />
              </div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <div className="rounded-full bg-muted p-3">
              <MessageSquare className="h-6 w-6" />
            </div>
            <p className="mt-3 text-sm font-medium">Không có cuộc trò chuyện</p>
            <p className="mt-1 text-xs text-muted-foreground">Khi có khách hàng nhắn tin, nó sẽ xuất hiện ở đây</p>
          </div>
        ) : (
          <div className="space-y-0.5 p-1.5">
            {conversations.map((conv) => {
              const status = STATUS_CONFIG[conv.status] || STATUS_CONFIG.bot_active
              const isSelected = selectedId === conv.id
              return (
                <button
                  key={conv.id}
                  onClick={() => onSelect(conv.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all hover:bg-muted/60",
                    isSelected && "bg-muted shadow-sm"
                  )}
                >
                  <div className="relative shrink-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {getInitials(conv.visitor)}
                    </div>
                    <span
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white",
                        status.dot
                      )}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium">
                        {getVisitorName(conv.visitor)}
                      </span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {formatTime(conv.last_message_at || conv.created_at)}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      {conv.assigned_staff ? (
                        <span className="truncate text-[11px] text-emerald-600 font-medium">
                          {conv.assigned_staff.name}
                        </span>
                      ) : (
                        <span className="truncate text-[11px] text-blue-600 font-medium">
                          Bot
                        </span>
                      )}
                      {conv.last_message?.content ? (
                        <>
                          <span className="text-muted-foreground/40">·</span>
                          <span className="truncate text-xs text-muted-foreground">
                            {String(conv.last_message.content)}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Chưa có tin nhắn</span>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
