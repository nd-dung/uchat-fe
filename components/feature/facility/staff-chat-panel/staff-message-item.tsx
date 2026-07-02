"use client"

import * as React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { cn } from "@/lib/utils"
import {
  getBubbleAlign,
  getBubbleVariant,
  getInitials,
  getMessageText,
  getSenderLabel,
  formatMessageTime,
} from "./utils"
import type { StaffMessageItemProps } from "./utils"

export function StaffMessageItem({
  message,
  isGrouped,
  isGroupedWithNext,
}: StaffMessageItemProps) {
  const align = getBubbleAlign(message.sender_type)
  const variant = getBubbleVariant(message.sender_type)
  const text = getMessageText(message)
  const senderLabel = getSenderLabel(message.sender_type)

  const isOwnMessage = align === "end"
  const showAvatar = !isOwnMessage && !isGroupedWithNext

  const bubbleShapeClass = (() => {
    if (align === "end") {
      return cn(
        "rounded-[18px] rounded-br-[4px]",
        isGrouped && "rounded-tr-[4px]",
        isGroupedWithNext && "rounded-br-[4px]",
        !isGrouped && "rounded-tr-[18px]",
        !isGroupedWithNext && "rounded-br-[18px]"
      )
    }

    return cn(
      "rounded-[18px] rounded-bl-[4px]",
      isGrouped && "rounded-tl-[4px]",
      isGroupedWithNext && "rounded-bl-[4px]",
      !isGrouped && "rounded-tl-[18px]",
      !isGroupedWithNext && "rounded-bl-[18px]"
    )
  })()

  return (
    <Message align={align} className="gap-2 px-4">
      {!isOwnMessage && (
        showAvatar ? (
          <MessageAvatar className="w-8 translate-y-0">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="text-[10px]">
                {getInitials(senderLabel)}
              </AvatarFallback>
            </Avatar>
          </MessageAvatar>
        ) : (
          <MessageAvatar className="invisible w-8 translate-y-0">
            <div className="h-7 w-7" />
          </MessageAvatar>
        )
      )}
      <MessageContent className={cn("gap-1", isGrouped ? "pt-0" : undefined)}>
        {!isOwnMessage && !isGrouped && (
          <MessageHeader className="px-1.5 pb-0.5">
            <span className="font-medium">{senderLabel}</span>
          </MessageHeader>
        )}
        <Bubble variant={variant} align={align}>
          <BubbleContent className={cn("px-3 py-2 text-sm leading-snug", bubbleShapeClass)}>
            {text}
          </BubbleContent>
        </Bubble>
        {!isGroupedWithNext && (
          <MessageFooter className="px-1.5 pt-0.5">
            <span className="text-[10px]">{formatMessageTime(message.sent_at)}</span>
          </MessageFooter>
        )}
    </MessageContent>
    </Message>
  )
}
