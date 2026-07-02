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
}: StaffMessageItemProps) {
  const align = getBubbleAlign(message.sender_type)
  const variant = getBubbleVariant(message.sender_type)
  const text = getMessageText(message)
  const senderLabel = getSenderLabel(message.sender_type)

  const showAvatar = !isGrouped

  return (
    <Message align={align} className="px-4">
      {showAvatar ? (
        <MessageAvatar>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-[10px]">
              {getInitials(senderLabel)}
            </AvatarFallback>
          </Avatar>
        </MessageAvatar>
      ) : (
        <MessageAvatar className="invisible">
          <div className="h-8 w-8" />
        </MessageAvatar>
      )}
      <MessageContent className={isGrouped ? "pt-0.5" : undefined}>
        {!isGrouped && (
          <MessageHeader>
            <span className="font-medium">{senderLabel}</span>
          </MessageHeader>
        )}
        <Bubble variant={variant} align={align}>
          <BubbleContent>{text}</BubbleContent>
        </Bubble>
        <MessageFooter>
          <span className="text-[10px]">{formatMessageTime(message.sent_at)}</span>
        </MessageFooter>
    </MessageContent>
    </Message>
  )
}
