"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, User, Bot, X } from "lucide-react"
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

  const isBottom = style.chatWindowPosition.startsWith("bottom")
  const isRight = style.chatWindowPosition.endsWith("right")

  const launcherPositionStyle: React.CSSProperties = {
    position: "absolute",
    bottom: isBottom ? `${style.launcherOffsetY}px` : "auto",
    top: isBottom ? "auto" : `${style.launcherOffsetY}px`,
    right: isRight ? `${style.launcherOffsetX}px` : "auto",
    left: isRight ? "auto" : `${style.launcherOffsetX}px`,
    zIndex: Math.max(1, style.chatWindowZIndex - 1),
  }

  const launcherShapeClass =
    style.launcherType === "circle"
      ? "rounded-full"
      : style.launcherType === "pill"
        ? "rounded-full px-4"
        : "rounded-2xl"

  const headerLayoutClass =
    style.headerLayout === "centered"
      ? "justify-center text-center"
      : style.headerLayout === "avatar_title"
        ? "justify-start"
        : style.headerLayout === "compact"
          ? "justify-between"
          : "justify-start"

  const showSendIcon = style.sendButtonType === "icon" || style.sendButtonType === "icon_text"
  const showSendText = style.sendButtonType === "text" || style.sendButtonType === "icon_text"

  return (
    <div
      className="flex justify-center items-center min-h-full"
      style={{ backgroundColor: `${style.backgroundColor}1f` }}
    >
      <div
        className="transition-all duration-300 figma-hover relative"
        style={{
          width: deviceSizes[activeDevice].width,
          maxWidth: deviceSizes[activeDevice].maxWidth,
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: "center",
        }}
      >
        <div
          className="rounded-lg overflow-hidden shadow-2xl relative flex flex-col"
          style={{
            backgroundColor: style.backgroundColor,
            borderColor: style.chatWindowBorderColor,
            borderWidth: `${style.chatWindowBorderWidth}px`,
            borderStyle: "solid",
            borderRadius: `${style.borderRadius}px`,
            boxShadow: style.chatWindowShadow ? "0 8px 24px rgba(0,0,0,0.15)" : "none",
            transition: style.animationEnabled ? "all 200ms cubic-bezier(0.4, 0, 0.2, 1)" : "none",
            maxWidth: `${style.chatWindowWidth}px`,
            height: `${style.chatWindowHeight}px`,
            fontFamily: style.fontFamily,
          }}
        >
          <div
            className={`p-4 border-b flex ${headerLayoutClass}`}
            style={{
              borderColor: style.chatWindowBorderColor,
              backgroundColor: style.headerBackgroundColor,
              height: `${style.headerHeight}px`,
              alignItems: "center",
              paddingLeft: `${style.messageAreaPadding}px`,
              paddingRight: `${style.messageAreaPadding}px`,
              gap: style.headerLayout === "compact" ? "8px" : "12px",
            }}
          >
            {style.headerLayout !== "simple" && (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg shrink-0"
                style={{ backgroundColor: style.primaryColor }}
              >
                <Bot className="w-5 h-5" style={{ color: style.userMessageTextColor }} />
              </div>
            )}
            <div className="min-w-0">
              <h3
                className="font-semibold truncate"
                style={{
                  color: style.headerTextColor,
                  fontSize: `${style.headerTitleFontSize}px`,
                }}
              >
                {style.headerTitle}
              </h3>
              <p
                className="text-sm opacity-70 truncate"
                style={{
                  color: style.headerTextColor,
                  fontSize: `${style.headerSubtitleFontSize}px`,
                }}
              >
                {style.headerShowStatus && style.headerStatusText}
              </p>
            </div>
            {style.headerShowCloseButton && (
              <button
                className="ml-auto shrink-0 p-1 rounded-md hover:bg-white/20"
                style={{ color: style.headerTextColor }}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div
            className="p-4 flex-1 overflow-y-auto custom-scrollbar relative"
            style={{
              backgroundColor: style.messageAreaBackgroundColor,
              paddingLeft: `${style.messageAreaPadding}px`,
              paddingRight: `${style.messageAreaPadding}px`,
            }}
          >
            {style.welcomeScreenEnabled && (
              <div
                className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center"
                style={{ backgroundColor: style.welcomeBackgroundColor }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg mb-4"
                  style={{ backgroundColor: style.primaryColor }}
                >
                  {style.welcomeAvatarUrl ? (
                    <img src={style.welcomeAvatarUrl} alt="" className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <Bot className="w-8 h-8" style={{ color: style.userMessageTextColor }} />
                  )}
                </div>
                <h3
                  className="font-semibold mb-1"
                  style={{
                    color: style.headerTextColor,
                    fontSize: `${style.headerTitleFontSize}px`,
                  }}
                >
                  {style.welcomeTitle}
                </h3>
                <p
                  className="mb-3"
                  style={{
                    color: style.headerTextColor,
                    fontSize: `${style.headerSubtitleFontSize}px`,
                    opacity: 0.7,
                  }}
                >
                  {style.welcomeSubtitle}
                </p>
                <p
                  className="max-w-[80%]"
                  style={{
                    color: style.botMessageTextColor,
                    fontSize: `${style.messageFontSize}px`,
                  }}
                >
                  {style.welcomeMessage}
                </p>
              </div>
            )}

            <div style={{ gap: `${style.messageSpacing}px` }} className="flex flex-col">
              {sampleMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-end gap-3" style={{ maxWidth: `${style.messageMaxWidthPercent}%` }}>
                    {msg.type === "bot" && style.showAvatar && (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-md"
                        style={{ backgroundColor: style.primaryColor }}
                      >
                        {style.avatarUrl ? (
                          <img src={style.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <Bot className="w-4 h-4" style={{ color: style.userMessageTextColor }} />
                        )}
                      </div>
                    )}
                    <div
                      className="px-4 py-3 rounded-lg transition-all figma-transition"
                      style={{
                        backgroundColor: msg.type === "user" ? style.userMessageBackgroundColor : style.botMessageBackgroundColor,
                        color: msg.type === "user" ? style.userMessageTextColor : style.botMessageTextColor,
                        borderRadius: `${style.messageBubbleRadius}px`,
                        fontSize: `${style.messageFontSize}px`,
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

              {style.typingIndicatorEnabled && (
                <div className="flex justify-start">
                  <div className="flex items-end gap-3 max-w-[85%]">
                    {style.showAvatar && (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-md"
                        style={{ backgroundColor: style.primaryColor }}
                      >
                        {style.avatarUrl ? (
                          <img src={style.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <Bot className="w-4 h-4" style={{ color: style.userMessageTextColor }} />
                        )}
                      </div>
                    )}
                    <div
                      className="px-4 py-3 rounded-lg"
                      style={{
                        backgroundColor: style.botMessageBackgroundColor,
                        borderRadius: `${style.messageBubbleRadius}px`,
                        fontSize: `${style.messageFontSize}px`,
                      }}
                    >
                      {style.typingIndicatorStyle === "text" ? (
                        <span style={{ color: style.botMessageTextColor }}>Đang nhập...</span>
                      ) : (
                        <div className="flex items-center gap-1 h-5">
                          {[0, 1, 2].map((i) => (
                            <span
                              key={i}
                              className="w-1.5 h-1.5 rounded-full animate-bounce"
                              style={{
                                backgroundColor: style.botMessageTextColor,
                                animationDelay: `${i * 150}ms`,
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
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
                  borderColor: style.inputBorderColor,
                  color: style.inputTextColor,
                  fontSize: `${style.inputFontSize}px`,
                  backgroundColor: style.inputBackgroundColor,
                }}
              />
              <Button
                className="shadow-lg hover:shadow-xl transition-shadow flex items-center gap-1"
                style={{
                  backgroundColor: style.sendButtonBackgroundColor,
                  borderRadius: `${style.inputBorderRadius}px`,
                  color: style.sendButtonIconColor,
                }}
              >
                {showSendIcon && <Send className="w-4 h-4" style={{ color: style.sendButtonIconColor }} />}
                {showSendText && <span style={{ color: style.sendButtonIconColor }}>{style.sendButtonText}</span>}
              </Button>
            </div>
          </div>

          {style.footerEnabled && (
            <div
              className="px-4 py-2 border-t text-center"
              style={{
                borderColor: style.chatWindowBorderColor,
                backgroundColor: style.backgroundColor,
              }}
            >
              <span
                className="text-xs"
                style={{ color: style.footerTextColor }}
              >
                {style.footerText}
              </span>
              {style.showPoweredBy && (
                <span
                  className="text-xs block mt-0.5"
                  style={{ color: style.footerTextColor, opacity: 0.7 }}
                >
                  Powered by Uchat
                </span>
              )}
            </div>
          )}
        </div>

        <button
          className={`flex items-center justify-center shrink-0 ${launcherShapeClass} shadow-lg hover:shadow-xl transition-shadow`}
          style={{
            ...launcherPositionStyle,
            width: style.launcherType === "pill" ? "auto" : `${style.launcherSize}px`,
            height: `${style.launcherSize}px`,
            minWidth: style.launcherType === "pill" ? `${style.launcherSize}px` : undefined,
            backgroundColor: style.launcherBackgroundColor,
            color: style.launcherIconColor,
            boxShadow: style.launcherShadow ? "0 4px 12px rgba(0,0,0,0.15)" : "none",
          }}
        >
          {style.launcherIconUrl ? (
            <img src={style.launcherIconUrl} alt="" className="w-6 h-6 object-contain" />
          ) : (
            <Send className="w-6 h-6" style={{ color: style.launcherIconColor }} />
          )}
          {style.launcherType === "pill" && (
            <span
              className="ml-2 text-sm font-medium"
              style={{ color: style.launcherTextColor }}
            >
              {style.launcherText}
            </span>
          )}
        </button>
      </div>
    </div>
  )
})
