"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, X, MessageCircle } from "lucide-react"
import { deviceSizes, sampleMessages } from "./chat-constants"
import type { ChatStyle } from "./chat-style"

interface ChatPreviewProps {
  style: ChatStyle
  activeDevice: keyof typeof deviceSizes
  zoomLevel: number
  showWelcomePreview?: boolean
}

function getLauncherAnimationClass(animation: string): string {
  switch (animation) {
    case "pulse":
      return "animate-pulse"
    case "bounce":
      return "animate-bounce"
    default:
      return ""
  }
}

function getMessageAnimationStyle(animation: string, enabled: boolean, index: number): React.CSSProperties {
  if (!enabled) return {}

  const delay = `${index * 100}ms`

  switch (animation) {
    case "fade":
      return {
        animation: `fadeIn 0.3s ease-out ${delay} both`,
      }
    case "slide":
      return {
        animation: `slideIn 0.3s ease-out ${delay} both`,
      }
    default:
      return {}
  }
}

export const ChatPreview = React.memo(function ChatPreview({
  style,
  activeDevice,
  zoomLevel,
  showWelcomePreview = true,
}: ChatPreviewProps) {
  const [message, setMessage] = useState("")
  const [isChatOpen, setIsChatOpen] = useState(true)

  const isBottom = style.chatWindowPosition.startsWith("bottom")
  const isRight = style.chatWindowPosition.endsWith("right")

  const launcherMargin = 24
  const launcherPositionStyle: React.CSSProperties = {
    position: "absolute",
    bottom: isBottom ? `${launcherMargin}px` : "auto",
    top: isBottom ? "auto" : `${launcherMargin}px`,
    right: isRight ? `${launcherMargin}px` : "auto",
    left: isRight ? "auto" : `${launcherMargin}px`,
    zIndex: Math.max(1, style.chatWindowZIndex + 1),
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

  const getChatOpenAnimationStyle = (): React.CSSProperties => {
    if (!style.animationEnabled || style.chatOpenAnimation === "none") {
      return {}
    }

    switch (style.chatOpenAnimation) {
      case "fade":
        return {
          animation: "chatFadeIn 0.3s ease-out",
        }
      case "slide_up":
        return {
          animation: "chatSlideUp 0.3s ease-out",
        }
      case "scale":
        return {
          animation: "chatScaleIn 0.3s ease-out",
        }
      default:
        return {}
    }
  }

  const toggleChat = () => setIsChatOpen((prev) => !prev)

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes chatFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes chatScaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .launcher-animation-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .launcher-animation-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>
      <div
        className="flex justify-center items-center min-h-full"
        style={{ backgroundColor: `${style.backgroundColor}1f` }}
      >
        <div
          className="transition-all duration-300 figma-hover relative"
          style={{
            width: `${style.chatWindowWidth + Math.max(style.launcherSize, 80) + launcherMargin * 2}px`,
            maxWidth: "100%",
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: "center",
            padding: `${Math.max(style.launcherSize, 80) + launcherMargin}px`,
          }}
        >
          {isChatOpen && (
            <div
              className="chat-preview-container rounded-lg overflow-hidden shadow-2xl relative flex flex-col"
              style={{
                backgroundColor: style.backgroundColor,
                borderColor: style.chatWindowBorderColor,
                borderWidth: `${style.chatWindowBorderWidth}px`,
                borderStyle: "solid",
                borderRadius: `${style.borderRadius}px`,
                boxShadow: style.chatWindowShadow ? "0 8px 24px rgba(0,0,0,0.15)" : "none",
                width: `${style.chatWindowWidth}px`,
                maxWidth: "100%",
                height: `${style.chatWindowHeight}px`,
                fontFamily: style.fontFamily,
                ...getChatOpenAnimationStyle(),
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
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg shrink-0 overflow-hidden"
                style={{ backgroundColor: style.primaryColor }}
              >
                {style.avatarUrl ? (
                  <img src={style.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <Bot className="w-5 h-5" style={{ color: style.userMessageTextColor }} />
                )}
              </div>
            )}
            <div className="min-w-0">
              <h3
                className="font-semibold truncate"
                style={{
                  color: style.headerTextColor,
                  fontSize: `${style.headerTitleFontSize}px`,
                  fontFamily: style.fontFamily,
                }}
              >
                {style.headerTitle}
              </h3>
              <p
                className="text-sm opacity-70"
                style={{
                  color: style.headerTextColor,
                  fontSize: `${style.headerSubtitleFontSize}px`,
                  fontFamily: style.fontFamily,
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
            {style.welcomeScreenEnabled && showWelcomePreview && (
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
                    color: style.botMessageTextColor,
                    fontSize: `${style.headerTitleFontSize}px`,
                    fontFamily: style.fontFamily,
                  }}
                >
                  {style.welcomeTitle}
                </h3>
                {style.welcomeSubtitle && (
                  <p
                    className="mb-3"
                    style={{
                      color: style.botMessageTextColor,
                      fontSize: `${style.headerSubtitleFontSize}px`,
                      opacity: 0.85,
                      fontFamily: style.fontFamily,
                    }}
                  >
                    {style.welcomeSubtitle}
                  </p>
                )}
                <p
                  className="max-w-[80%]"
                  style={{
                    color: style.botMessageTextColor,
                    fontSize: `${style.messageFontSize}px`,
                    fontFamily: style.fontFamily,
                  }}
                >
                  {style.welcomeMessage}
                </p>
              </div>
            )}

            <div style={{ gap: `${style.messageSpacing}px` }} className="flex flex-col">
              {sampleMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                  style={getMessageAnimationStyle(style.messageAnimation, style.animationEnabled, index)}
                >
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
                        fontFamily: style.fontFamily,
                      }}
                    >
                      <p>{msg.text}</p>
                      {style.showMessageTimestamp && (
                        <p className="text-[10px] opacity-60 mt-1">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                      )}
                    </div>
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
                        fontFamily: style.fontFamily,
                      }}
                    >
                      {style.typingIndicatorStyle === "text" ? (
                        <span style={{ color: style.botMessageTextColor, fontFamily: style.fontFamily }}>Đang nhập...</span>
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
                className="flex-1 min-w-0 bg-input border-border truncate"
                style={{
                  borderRadius: `${style.inputBorderRadius}px`,
                  borderColor: style.inputBorderColor,
                  color: style.inputTextColor,
                  fontSize: `${style.inputFontSize}px`,
                  backgroundColor: style.inputBackgroundColor,
                  fontFamily: style.fontFamily,
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
                {showSendText && <span style={{ color: style.sendButtonIconColor, fontFamily: style.fontFamily }}>{style.sendButtonText}</span>}
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
              {style.footerText ? (
                <span className="text-xs" style={{ color: style.footerTextColor, fontFamily: style.fontFamily }}>
                  {style.footerText}
                </span>
              ) : style.showPoweredBy ? (
                <span className="text-xs" style={{ color: style.footerTextColor, opacity: 0.7, fontFamily: style.fontFamily }}>
                  Powered by Uchat
                </span>
              ) : null}
            </div>
          )}
        </div>
          )}

        <button
          onClick={toggleChat}
          className={`flex items-center justify-center shrink-0 ${launcherShapeClass} shadow-lg hover:shadow-xl transition-shadow ${style.animationEnabled ? getLauncherAnimationClass(style.launcherAnimation) : ""}`}
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
            <MessageCircle className="w-6 h-6" style={{ color: style.launcherIconColor }} />
          )}
          {style.launcherType === "pill" && (
            <span
              className="ml-2 text-sm font-medium"
              style={{ color: style.launcherTextColor, fontFamily: style.fontFamily }}
            >
              {style.launcherText}
            </span>
          )}
        </button>
      </div>
    </div>
    </>
  )
})
