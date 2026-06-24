"use client"

import * as React from "react"
import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  useGetChatbotUiSetting,
  useUpdateChatbotUiSetting,
} from "@/lib/api/generated/chatbots/chatbots"
import type { ApiErrorResponseDto, ChatbotUiSettingResponseDto } from "@/lib/api/generated/model"
import { AxiosError } from "axios"
import { toast } from "sonner"
import { Minus, Plus, Loader2Icon, RotateCcw } from "lucide-react"
import { ChatPreview } from "./chat-preview"
import { DesignPanel } from "./design-panel"
import { DraggableCanvas } from "./draggable-canvas"
import { deviceSizes } from "./chat-constants"
import { apiToStyle, styleToApiUpdate, type ChatStyle } from "./chat-style"

interface ChatCustomizerProps {
  chatbotId: number
}

export function ChatCustomizer({ chatbotId }: ChatCustomizerProps) {
  const { data: uiSettingData, isLoading: isLoadingUiSetting } = useGetChatbotUiSetting(chatbotId, {})
  const uiSetting = uiSettingData?.data
  const [baseApiSetting, setBaseApiSetting] = useState<ChatbotUiSettingResponseDto | undefined>(undefined)
  const [savedStyle, setSavedStyle] = useState<ChatStyle | undefined>(undefined)
  const [style, setStyle] = useState<ChatStyle | undefined>(undefined)
  const [hasLocalChanges, setHasLocalChanges] = useState(false)
  const [activeDevice, setActiveDevice] = useState<keyof typeof deviceSizes>("desktop")
  const [collapsedSections, setCollapsedSections] = useState<{ [key: string]: boolean }>({})
  const [zoomLevel, setZoomLevel] = useState(100)
  const [showWelcomePreview, setShowWelcomePreview] = useState(true)

  const updateMutation = useUpdateChatbotUiSetting()

  useEffect(() => {
    if (uiSetting) {
      setBaseApiSetting(uiSetting)
      const loaded = apiToStyle(uiSetting)
      setSavedStyle(loaded)
      setStyle(loaded)
      setHasLocalChanges(false)
    }
  }, [uiSetting])

  const updateStyle = useCallback((key: keyof ChatStyle, value: string | number | boolean) => {
    setStyle((prev) => (prev ? { ...prev, [key]: value } : prev))
    setHasLocalChanges(true)
  }, [])

  const handleSave = async () => {
    if (!style || !baseApiSetting) return
    try {
      await updateMutation.mutateAsync({
        id: chatbotId,
        data: styleToApiUpdate(style, baseApiSetting),
      })
      toast.success("Lưu giao diện thành công")
      setHasLocalChanges(false)
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponseDto>
      const message = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      toast.error(message)
    }
  }

  const toggleSection = useCallback((sectionKey: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }, [])

  const resetToDefault = () => {
    if (savedStyle) {
      setStyle(savedStyle)
      setHasLocalChanges(true)
    }
  }

  const importConfig = (config: ChatStyle) => {
    setStyle(config)
    setHasLocalChanges(true)
  }

  const exportConfig = () => {
    if (!style) return
    const config = {
      style,
      timestamp: new Date().toISOString(),
      version: "1.0",
    }
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "chat-style-config.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyCSS = () => {
    if (!style) return
    const css = `
/* Chat Container */
.chat-container {
  background-color: ${style.backgroundColor};
  border-radius: ${style.borderRadius}px;
  border: ${style.chatWindowBorderWidth}px solid ${style.chatWindowBorderColor};
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  width: ${style.chatWindowWidth}px;
  height: ${style.chatWindowHeight}px;
}

/* Header */
.chat-header {
  background-color: ${style.headerBackgroundColor};
  color: ${style.headerTextColor};
  height: ${style.headerHeight}px;
}

/* Messages */
.chat-messages {
  background-color: ${style.messageAreaBackgroundColor};
  padding: ${style.messageAreaPadding}px;
  gap: ${style.messageSpacing}px;
}

/* Message Bubbles */
.message-bubble {
  border-radius: ${style.messageBubbleRadius}px;
  font-size: ${style.baseFontSize}px;
}

.user-bubble {
  background-color: ${style.userMessageBackgroundColor};
  color: ${style.userMessageTextColor};
}

.bot-bubble {
  background-color: ${style.botMessageBackgroundColor};
  color: ${style.botMessageTextColor};
}

/* Input */
.chat-input {
  background-color: ${style.inputBackgroundColor};
  border-radius: ${style.inputBorderRadius}px;
}
    `.trim()

    navigator.clipboard.writeText(css)
  }

  if (isLoadingUiSetting || !style) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        <Loader2Icon className="h-6 w-6 animate-spin" />
        <span className="ml-2 text-sm">Đang tải cấu hình giao diện...</span>
      </div>
    )
  }

  return (
    <div className="h-full flex bg-background text-foreground overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-muted/50 rounded-md p-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel(Math.max(25, zoomLevel - 25))}
                className="h-7 w-7 p-0"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="text-xs font-medium w-12 text-center">{zoomLevel}%</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setZoomLevel(Math.min(200, zoomLevel + 25))}
                className="h-7 w-7 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setZoomLevel(100)}
              className="h-7 w-7 p-0"
              title="Reset zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={showWelcomePreview ? "default" : "ghost"}
              size="sm"
              onClick={() => setShowWelcomePreview(!showWelcomePreview)}
              className="h-8"
            >
              <span className="text-xs">{showWelcomePreview ? "Hide" : "Show"} Welcome</span>
            </Button>
            {Object.entries(deviceSizes).map(([key, device]) => {
              const IconComponent = device.icon
              return (
                <Button
                  key={key}
                  variant={activeDevice === key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveDevice(key as keyof typeof deviceSizes)}
                  className="flex items-center gap-2 h-8"
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-xs">{device.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 relative">
          <DraggableCanvas zoomLevel={zoomLevel} onZoomChange={setZoomLevel}>
            <ChatPreview
              style={style}
              activeDevice={activeDevice}
              zoomLevel={100}
              showWelcomePreview={showWelcomePreview}
            />
          </DraggableCanvas>
        </div>
      </div>

      <DesignPanel
        style={style}
        updateStyle={updateStyle}
        onSave={handleSave}
        onReset={resetToDefault}
        onExport={exportConfig}
        onImport={importConfig}
        onCopyCSS={copyCSS}
        hasLocalChanges={hasLocalChanges}
        isSaving={updateMutation.isPending}
        collapsedSections={collapsedSections}
        onToggleSection={toggleSection}
      />
    </div>
  )
}
