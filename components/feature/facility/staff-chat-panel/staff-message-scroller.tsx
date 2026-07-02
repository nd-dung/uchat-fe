"use client"

import * as React from "react"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { Marker, MarkerContent } from "@/components/ui/marker"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar } from "lucide-react"
import type { ChatMessageResponseDto } from "@/lib/api/generated/model"
import { StaffMessageItem } from "./staff-message-item"
import { formatMessageDate, isSameDay } from "./utils"

interface StaffMessageScrollerProps {
  messages: ChatMessageResponseDto[]
  isLoading: boolean
}

const MESSAGE_GROUP_TIME_WINDOW_MS = 5 * 60 * 1000

function isWithinGroupTimeWindow(currentSentAt: string, previousSentAt: string) {
  const currentTime = new Date(currentSentAt).getTime()
  const previousTime = new Date(previousSentAt).getTime()

  if (Number.isNaN(currentTime) || Number.isNaN(previousTime)) return false
  return Math.abs(currentTime - previousTime) <= MESSAGE_GROUP_TIME_WINDOW_MS
}

export function StaffMessageScroller({
  messages,
  isLoading,
}: StaffMessageScrollerProps) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-6 px-4 py-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
            >
              <Skeleton className="h-10 w-56 rounded-2xl" />
            </div>
          ))}
        </div>
      )
    }

    if (messages.length === 0) {
      return (
        <div className="flex h-full items-center justify-center px-4">
          <Marker variant="separator">
            <MarkerContent className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              Chưa có tin nhắn
            </MarkerContent>
          </Marker>
        </div>
      )
    }

    const rows: React.ReactNode[] = []
    let lastDate = ""

    messages.forEach((message, index) => {
      const messageDate = new Date(message.sent_at).toDateString()
      const prevMessage = index > 0 ? messages[index - 1] : null
      const nextMessage = index < messages.length - 1 ? messages[index + 1] : null

      if (messageDate !== lastDate) {
        lastDate = messageDate
        rows.push(
          <MessageScrollerItem
            key={`date-${message.id}-${messageDate}`}
            messageId={`date-${message.id}`}
            className="px-4 py-2"
          >
            <Marker variant="separator">
              <MarkerContent className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                {formatMessageDate(message.sent_at)}
              </MarkerContent>
            </Marker>
          </MessageScrollerItem>
        )
      }

      const isGrouped =
        prevMessage?.sender_type === message.sender_type &&
        isSameDay(prevMessage.sent_at, message.sent_at) &&
        isWithinGroupTimeWindow(message.sent_at, prevMessage.sent_at)

      const isGroupedWithNext =
        nextMessage?.sender_type === message.sender_type &&
        isSameDay(nextMessage.sent_at, message.sent_at) &&
        isWithinGroupTimeWindow(nextMessage.sent_at, message.sent_at)

      const isLast = index === messages.length - 1
      const isAnchor = isLast || !isGroupedWithNext

      rows.push(
        <MessageScrollerItem
          key={message.id}
          messageId={String(message.id)}
          scrollAnchor={!!isAnchor}
          className={isGrouped ? "py-px" : "pt-3 pb-px"}
        >
          <StaffMessageItem
            message={message}
            isLast={isLast}
            isGrouped={isGrouped}
            isGroupedWithNext={!!isGroupedWithNext}
          />
        </MessageScrollerItem>
      )
    })

    return rows
  }

  return (
    <MessageScrollerProvider
      autoScroll
      defaultScrollPosition="last-anchor"
      scrollPreviousItemPeek={48}
    >
      <MessageScroller className="min-h-0 flex-1">
        <MessageScrollerViewport preserveScrollOnPrepend>
          <MessageScrollerContent className="gap-0 py-4">
            {renderContent()}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton direction="end" />
      </MessageScroller>
    </MessageScrollerProvider>
  )
}
