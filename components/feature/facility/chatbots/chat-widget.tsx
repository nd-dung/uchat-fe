"use client"

import * as React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { Send, Bot, X, MessageCircle } from "lucide-react"
import type { ChatStyle } from "./chat-style"
import "./chat-widget.css"

interface Message {
  id: string
  type: "user" | "bot"
  text: string
  timestamp: Date
}

interface ChatWidgetProps {
  style: ChatStyle
  onSendMessage?: (message: string) => void
  initialMessages?: Message[]
}

function getLauncherAnimationClass(animation: string): string {
  switch (animation) {
    case "pulse":
      return "uc-widget-launcher-animation-pulse"
    case "bounce":
      return "uc-widget-launcher-animation-bounce"
    default:
      return ""
  }
}

function getMessageAnimationClass(animation: string, enabled: boolean): string {
  if (!enabled) return ""
  switch (animation) {
    case "fade":
      return "uc-widget-msg-animation-fade"
    case "slide":
      return "uc-widget-msg-animation-slide"
    default:
      return ""
  }
}

function getMessageAnimationDelay(animation: string, enabled: boolean, index: number): React.CSSProperties {
  if (!enabled) return {}
  return { animationDelay: `${index * 100}ms` }
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function ChatWidget({
  style,
  onSendMessage,
  initialMessages = [],
}: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping, scrollToBottom])

  const isBottom = style.chatWindowPosition.startsWith("bottom")
  const isRight = style.chatWindowPosition.endsWith("right")

  const launcherMargin = 24
  const launcherPositionStyle: React.CSSProperties = {
    position: "fixed",
    bottom: isBottom ? `${launcherMargin}px` : "auto",
    top: isBottom ? "auto" : `${launcherMargin}px`,
    right: isRight ? `${launcherMargin}px` : "auto",
    left: isRight ? "auto" : `${launcherMargin}px`,
    zIndex: 99999,
  }

  const chatWindowPositionStyle: React.CSSProperties = {
    position: "fixed",
    bottom: isBottom ? `${launcherMargin + style.launcherSize + 16}px` : "auto",
    top: isBottom ? "auto" : `${launcherMargin}px`,
    right: isRight ? `${launcherMargin}px` : "auto",
    left: isRight ? "auto" : `${launcherMargin}px`,
    zIndex: 99998,
  }

  const getLauncherShapeClass = () => {
    switch (style.launcherType) {
      case "circle":
        return "uc-widget-launcher-circle"
      case "pill":
        return "uc-widget-launcher-pill"
      default:
        return "uc-widget-launcher-rounded"
    }
  }

  const getHeaderLayoutClass = () => {
    switch (style.headerLayout) {
      case "centered":
        return "uc-widget-justify-center uc-widget-text-center"
      case "avatar_title":
        return "uc-widget-justify-start"
      case "compact":
        return "uc-widget-justify-between"
      default:
        return "uc-widget-justify-start"
    }
  }

  const getChatAnimationClass = () => {
    if (!style.animationEnabled || style.chatOpenAnimation === "none") return ""
    switch (style.chatOpenAnimation) {
      case "fade":
        return "uc-widget-chat-animation-fade"
      case "slide_up":
        return "uc-widget-chat-animation-slide-up"
      case "scale":
        return "uc-widget-chat-animation-scale"
      default:
        return ""
    }
  }

  const showSendIcon = style.sendButtonType === "icon" || style.sendButtonType === "icon_text"
  const showSendText = style.sendButtonType === "text" || style.sendButtonType === "icon_text"

  const toggleChat = () => setIsChatOpen((prev) => !prev)

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: generateId(),
      type: "user",
      text: inputValue.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    if (onSendMessage) {
      onSendMessage(userMessage.text)
    }

    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
    }, 2000)
  }, [inputValue, onSendMessage])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
      }
    },
    [handleSendMessage]
  )

  return (
    <>
      {isChatOpen && (
        <div
          className={`uc-widget-chat-container ${getChatAnimationClass()}`}
          style={{
            ...chatWindowPositionStyle,
            width: `${style.chatWindowWidth}px`,
            maxWidth: "calc(100vw - 32px)",
            height: `${style.chatWindowHeight}px`,
            maxHeight: "calc(100vh - 120px)",
            fontFamily: style.fontFamily,
          }}
        >
          <div
            className="uc-widget-flex uc-widget-flex-col uc-widget-h-full uc-widget-overflow-hidden"
            style={{
              backgroundColor: style.backgroundColor,
              borderColor: style.chatWindowBorderColor,
              borderWidth: `${style.chatWindowBorderWidth}px`,
              borderStyle: "solid",
              borderRadius: `${style.borderRadius}px`,
              boxShadow: style.chatWindowShadow ? "0 8px 24px rgba(0,0,0,0.15)" : "none",
            }}
          >
            {/* Header */}
            <div
              className={`uc-widget-p-4 uc-widget-border-b uc-widget-flex ${getHeaderLayoutClass()}`}
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
                  className="uc-widget-w-10 uc-widget-h-10 uc-widget-rounded-full uc-widget-flex uc-widget-items-center uc-widget-justify-center uc-widget-shadow-lg uc-widget-shrink-0 uc-widget-overflow-hidden"
                  style={{ backgroundColor: style.primaryColor }}
                >
                  {style.avatarUrl ? (
                    <img src={style.avatarUrl} alt="" className="uc-widget-w-10 uc-widget-h-10 uc-widget-rounded-full uc-widget-object-cover" />
                  ) : (
                    <Bot className="uc-widget-w-5 uc-widget-h-5" style={{ color: style.userMessageTextColor }} />
                  )}
                </div>
              )}
              <div className="uc-widget-min-w-0">
                <h3
                  className="uc-widget-font-semibold uc-widget-truncate"
                  style={{
                    color: style.headerTextColor,
                    fontSize: `${style.headerTitleFontSize}px`,
                    fontFamily: style.fontFamily,
                  }}
                >
                  {style.headerTitle}
                </h3>
                <p
                  className="uc-widget-text-sm uc-widget-opacity-70"
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
                  onClick={toggleChat}
                  className="uc-widget-ml-auto uc-widget-shrink-0 uc-widget-p-1 uc-widget-rounded-md uc-widget-hover-bg-white-20"
                  style={{ color: style.headerTextColor }}
                >
                  <X className="uc-widget-w-4 uc-widget-h-4" />
                </button>
              )}
            </div>

            {/* Messages */}
            <div
              className="uc-widget-p-4 uc-widget-flex-1 uc-widget-overflow-y-auto uc-widget-relative"
              style={{
                backgroundColor: style.messageAreaBackgroundColor,
                paddingLeft: `${style.messageAreaPadding}px`,
                paddingRight: `${style.messageAreaPadding}px`,
              }}
            >
              {style.welcomeScreenEnabled && messages.length === 0 && (
                <div
                  className="uc-widget-absolute uc-widget-inset-0 uc-widget-z-10 uc-widget-flex uc-widget-flex-col uc-widget-items-center uc-widget-justify-center uc-widget-p-6 uc-widget-text-center"
                  style={{ backgroundColor: style.welcomeBackgroundColor }}
                >
                  <div
                    className="uc-widget-w-16 uc-widget-h-16 uc-widget-rounded-full uc-widget-flex uc-widget-items-center uc-widget-justify-center uc-widget-shadow-lg uc-widget-mb-4"
                    style={{ backgroundColor: style.primaryColor }}
                  >
                    {style.welcomeAvatarUrl ? (
                      <img src={style.welcomeAvatarUrl} alt="" className="uc-widget-w-16 uc-widget-h-16 uc-widget-rounded-full uc-widget-object-cover" />
                    ) : (
                      <Bot className="uc-widget-w-8 uc-widget-h-8" style={{ color: style.userMessageTextColor }} />
                    )}
                  </div>
                  <h3
                    className="uc-widget-font-semibold uc-widget-mb-1"
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
                      className="uc-widget-mb-3"
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
                    className="uc-widget-max-w-80"
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

              <div
                className="uc-widget-flex uc-widget-flex-col"
                style={{ gap: `${style.messageSpacing}px` }}
              >
                {messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`uc-widget-flex ${msg.type === "user" ? "uc-widget-justify-end" : "uc-widget-justify-start"}`}
                  >
                    <div
                      className={`uc-widget-flex uc-widget-items-end uc-widget-gap-3 ${getMessageAnimationClass(style.messageAnimation, style.animationEnabled)}`}
                      style={{
                        maxWidth: `${style.messageMaxWidthPercent}%`,
                        ...getMessageAnimationDelay(style.messageAnimation, style.animationEnabled, index),
                      }}
                    >
                      {msg.type === "bot" && style.showAvatar && (
                        <div
                          className="uc-widget-w-7 uc-widget-h-7 uc-widget-rounded-full uc-widget-flex uc-widget-items-center uc-widget-shrink-0 uc-widget-shadow-md"
                          style={{ backgroundColor: style.primaryColor }}
                        >
                          {style.avatarUrl ? (
                            <img src={style.avatarUrl} alt="" className="uc-widget-w-7 uc-widget-h-7 uc-widget-rounded-full uc-widget-object-cover" />
                          ) : (
                            <Bot className="uc-widget-w-4 uc-widget-h-4" style={{ color: style.userMessageTextColor }} />
                          )}
                        </div>
                      )}
                      <div
                        className="uc-widget-px-4 uc-widget-py-3 uc-widget-rounded-lg uc-widget-transition-all"
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
                          <p className="uc-widget-text-10px uc-widget-opacity-60 uc-widget-mt-1">
                            {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && style.typingIndicatorEnabled && (
                  <div className="uc-widget-flex uc-widget-justify-start">
                    <div className="uc-widget-flex uc-widget-items-end uc-widget-gap-3 uc-widget-max-w-85">
                      {style.showAvatar && (
                        <div
                          className="uc-widget-w-7 uc-widget-h-7 uc-widget-rounded-full uc-widget-flex uc-widget-items-center uc-widget-shrink-0 uc-widget-shadow-md"
                          style={{ backgroundColor: style.primaryColor }}
                        >
                          {style.avatarUrl ? (
                            <img src={style.avatarUrl} alt="" className="uc-widget-w-7 uc-widget-h-7 uc-widget-rounded-full uc-widget-object-cover" />
                          ) : (
                            <Bot className="uc-widget-w-4 uc-widget-h-4" style={{ color: style.userMessageTextColor }} />
                          )}
                        </div>
                      )}
                      <div
                        className="uc-widget-px-4 uc-widget-py-3 uc-widget-rounded-lg"
                        style={{
                          backgroundColor: style.botMessageBackgroundColor,
                          borderRadius: `${style.messageBubbleRadius}px`,
                          fontSize: `${style.messageFontSize}px`,
                          fontFamily: style.fontFamily,
                        }}
                      >
                        {style.typingIndicatorStyle === "text" ? (
                          <span style={{ color: style.botMessageTextColor, fontFamily: style.fontFamily }}>
                            Đang nhập...
                          </span>
                        ) : (
                          <div className="uc-widget-flex uc-widget-items-center uc-widget-gap-1" style={{ height: "20px" }}>
                            {[0, 1, 2].map((i) => (
                              <span
                                key={i}
                                className="uc-widget-dot"
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
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div
              className="uc-widget-p-4 uc-widget-border-t"
              style={{
                borderColor: style.chatWindowBorderColor,
                backgroundColor: style.inputBackgroundColor,
                paddingLeft: `${style.messageAreaPadding}px`,
                paddingRight: `${style.messageAreaPadding}px`,
              }}
            >
              <div className="uc-widget-flex uc-widget-gap-3">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={style.placeholderText}
                  className="uc-widget-flex-1 uc-widget-min-w-0 uc-widget-border uc-widget-truncate uc-widget-outline-none"
                  style={{
                    borderRadius: `${style.inputBorderRadius}px`,
                    borderColor: style.inputBorderColor,
                    color: style.inputTextColor,
                    fontSize: `${style.inputFontSize}px`,
                    backgroundColor: style.inputBackgroundColor,
                    fontFamily: style.fontFamily,
                    padding: "8px 12px",
                  }}
                />
                <button
                  onClick={handleSendMessage}
                  className="uc-widget-shadow-lg uc-widget-transition-shadow uc-widget-flex uc-widget-items-center uc-widget-gap-1"
                  style={{
                    backgroundColor: style.sendButtonBackgroundColor,
                    borderRadius: `${style.inputBorderRadius}px`,
                    color: style.sendButtonIconColor,
                    padding: "8px 16px",
                  }}
                >
                  {showSendIcon && <Send className="uc-widget-w-4 uc-widget-h-4" style={{ color: style.sendButtonIconColor }} />}
                  {showSendText && (
                    <span style={{ color: style.sendButtonIconColor, fontFamily: style.fontFamily }}>
                      {style.sendButtonText}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Footer */}
            {style.footerEnabled && (
              <div
                className="uc-widget-px-4 uc-widget-py-2 uc-widget-border-t uc-widget-text-center"
                style={{
                  borderColor: style.chatWindowBorderColor,
                  backgroundColor: style.backgroundColor,
                }}
              >
                {style.footerText ? (
                  <span className="uc-widget-text-xs" style={{ color: style.footerTextColor, fontFamily: style.fontFamily }}>
                    {style.footerText}
                  </span>
                ) : style.showPoweredBy ? (
                  <span className="uc-widget-text-xs" style={{ color: style.footerTextColor, opacity: 0.7, fontFamily: style.fontFamily }}>
                    Powered by Uchat
                  </span>
                ) : null}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Launcher */}
      <button
        onClick={toggleChat}
        className={`uc-widget-flex uc-widget-items-center uc-widget-justify-center uc-widget-shrink-0 ${getLauncherShapeClass()} uc-widget-shadow-lg uc-widget-transition-shadow ${style.animationEnabled ? getLauncherAnimationClass(style.launcherAnimation) : ""}`}
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
          <img src={style.launcherIconUrl} alt="" className="uc-widget-w-6 uc-widget-h-6 uc-widget-object-contain" />
        ) : (
          <MessageCircle className="uc-widget-w-6 uc-widget-h-6" style={{ color: style.launcherIconColor }} />
        )}
        {style.launcherType === "pill" && (
          <span
            className="uc-widget-ml-2 uc-widget-text-sm uc-widget-font-medium"
            style={{ color: style.launcherTextColor, fontFamily: style.fontFamily }}
          >
            {style.launcherText}
          </span>
        )}
      </button>
    </>
  )
}
