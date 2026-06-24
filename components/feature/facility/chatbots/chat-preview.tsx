"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, User, Bot } from "lucide-react"
import { deviceSizes, sampleMessages } from "./chat-constants"
import type { ChatStyle } from "./chat-style"

interface ChatPreviewProps {
  style: ChatStyle
  activeDevice: keyof typeof deviceSizes
  zoomLevel: number
}

export const ChatPreview = React.memo(function ChatPreview({
  style,
  activeDevice,
  zoomLevel,
}: ChatPreviewProps) {
  const [message, setMessage] = useState("")

  return (
    <div className="flex justify-center items-center min-h-full">
      <div
        className="transition-all duration-300 figma-hover"
        style={{
          width: deviceSizes[activeDevice].width,
          maxWidth: deviceSizes[activeDevice].maxWidth,
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: "center",
        }}
      >
        <div
          className="rounded-lg overflow-hidden shadow-2xl relative"
          style={{
            backgroundColor: style.backgroundColor,
            borderColor: style.chatWindowBorderColor,
            borderWidth: `${style.chatWindowBorderWidth}px`,
            borderStyle: "solid",
            borderRadius: `${style.borderRadius}px`,
            boxShadow: style.chatWindowShadow ? "0 8px 24px rgba(0,0,0,0.15)" : "none",
            transition: style.animationEnabled ? "all 200ms cubic-bezier(0.4, 0, 0.2, 1)" : "none",
            maxWidth: `${style.chatWindowWidth}px`,
          }}
        >
          <div
            className="p-4 border-b"
            style={{
              borderColor: style.chatWindowBorderColor,
              backgroundColor: style.headerBackgroundColor,
              height: `${style.headerHeight}px`,
              display: "flex",
              alignItems: "center",
              paddingLeft: `${style.messageAreaPadding}px`,
              paddingRight: `${style.messageAreaPadding}px`,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: style.primaryColor }}
              >
                <Bot className="w-5 h-5" style={{ color: style.userMessageTextColor }} />
              </div>
              <div>
                <h3
                  className="font-semibold"
                  style={{
                    color: style.headerTextColor,
                    fontSize: `${style.baseFontSize + 2}px`,
                  }}
                >
                  {style.headerTitle}
                </h3>
                <p
                  className="text-sm opacity-70"
                  style={{
                    color: style.headerTextColor,
                    fontSize: `${style.baseFontSize - 2}px`,
                  }}
                >
                  {style.headerShowStatus && style.headerSubtitle}
                </p>
              </div>
            </div>
          </div>

          <div
            className="p-4 h-80 overflow-y-auto custom-scrollbar"
            style={{
              backgroundColor: style.messageAreaBackgroundColor,
              paddingLeft: `${style.messageAreaPadding}px`,
              paddingRight: `${style.messageAreaPadding}px`,
            }}
          >
            <div style={{ gap: `${style.messageSpacing}px` }} className="flex flex-col">
              {sampleMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-end gap-3 max-w-[85%]">
                    {msg.type === "bot" && style.showAvatar && (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-md"
                        style={{ backgroundColor: style.primaryColor }}
                      >
                        <Bot className="w-4 h-4" style={{ color: style.userMessageTextColor }} />
                      </div>
                    )}
                    <div
                      className="px-4 py-3 rounded-lg transition-all figma-transition"
                      style={{
                        backgroundColor: msg.type === "user" ? style.userMessageBackgroundColor : style.botMessageBackgroundColor,
                        color: msg.type === "user" ? style.userMessageTextColor : style.botMessageTextColor,
                        borderRadius: `${style.messageBubbleRadius}px`,
                        fontSize: `${style.baseFontSize}px`,
                        transition: style.animationEnabled ? "all 200ms cubic-bezier(0.4, 0, 0.2, 1)" : "none",
                      }}
                    >
                      <p>{msg.text}</p>
                      {style.showMessageTimestamp && (
                        <p className="text-[10px] opacity-60 mt-1">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      )}
                    </div>
                    {msg.type === "user" && style.showAvatar && (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-md"
                        style={{ backgroundColor: style.primaryColor }}
                      >
                        <User className="w-4 h-4" style={{ color: style.userMessageTextColor }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="p-4 border-t"
            style={{
              borderColor: style.chatWindowBorderColor,
              backgroundColor: style.inputBackgroundColor,
              paddingLeft: `${style.messageAreaPadding}px`,
              paddingRight: `${style.messageAreaPadding}px`,
            }}
          >
            <div className="flex gap-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={style.placeholderText}
                className="flex-1 bg-input border-border"
                style={{
                  borderRadius: `${style.inputBorderRadius}px`,
                  borderColor: style.chatWindowBorderColor,
                  fontSize: `${style.baseFontSize}px`,
                  backgroundColor: style.inputBackgroundColor,
                }}
              />
              <Button
                size="icon"
                className="shadow-lg hover:shadow-xl transition-shadow"
                style={{
                  backgroundColor: style.userMessageBackgroundColor,
                  borderRadius: `${style.inputBorderRadius}px`,
                }}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
