"use client"

import * as React from "react"
import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  useGetChatbotUiSetting,
  useUpdateChatbotUiSetting,
} from "@/lib/api/generated/chatbots/chatbots"
import type {
  ChatbotUiSettingResponseDto,
  UpdateChatbotUiSettingDto,
  ApiErrorResponseDto,
} from "@/lib/api/generated/model"
import { AxiosError } from "axios"
import { toast } from "sonner"
import {
  Monitor,
  Tablet,
  Smartphone,
  Send,
  User,
  Bot,
  ChevronDown,
  ChevronRight,
  Palette,
  Type,
  Settings,
  Copy,
  RotateCcw,
  Download,
  Minus,
  Plus,
  Loader2Icon,
  type LucideIcon,
} from "lucide-react"

interface ChatStyle {
  primaryColor: string
  backgroundColor: string
  headerBackgroundColor: string
  headerTextColor: string
  headerTitle: string
  headerSubtitle: string
  headerHeight: number
  headerShowStatus: boolean
  botMessageBackgroundColor: string
  botMessageTextColor: string
  userMessageBackgroundColor: string
  userMessageTextColor: string
  chatWindowBorderColor: string
  chatWindowBorderWidth: number
  chatWindowWidth: number
  chatWindowHeight: number
  chatWindowShadow: boolean
  chatWindowPosition: "bottom_right" | "bottom_left" | "top_right" | "top_left"
  borderRadius: number
  messageBubbleRadius: number
  messageAreaBackgroundColor: string
  messageAreaPadding: number
  messageSpacing: number
  showMessageTimestamp: boolean
  baseFontSize: number
  inputBackgroundColor: string
  inputBorderRadius: number
  placeholderText: string
  welcomeMessage: string
  showAvatar: boolean
  showLogo: boolean
  animationEnabled: boolean
}

function apiToStyle(api: ChatbotUiSettingResponseDto): ChatStyle {
  const chatWindow = api.chat_window as {
    chat_window_border_color?: string
    chat_window_border_width?: number
    chat_window_width?: number
    chat_window_height?: number
    chat_window_shadow?: boolean
    chat_window_position?: "bottom_right" | "bottom_left" | "top_right" | "top_left"
    border_radius?: number
  } | undefined
  const header = api.header as {
    header_height?: number
    header_show_status?: boolean
  } | undefined
  const message = api.message as {
    message_area_background_color?: string
    message_area_padding?: number
    message_spacing?: number
    show_message_timestamp?: boolean
  } | undefined
  const typography = api.typography as {
    base_font_size?: number
  } | undefined
  const input = api.input as {
    input_background_color?: string
    input_border_radius?: number
    placeholder_text?: string
  } | undefined
  const animation = api.animation as {
    animation_enabled?: boolean
  } | undefined
  const welcome = api.welcome as {
    welcome_message?: string
  } | undefined

  return {
    primaryColor: api.primary_color,
    backgroundColor: api.background_color,
    headerBackgroundColor: api.header_background_color,
    headerTextColor: api.header_text_color,
    headerTitle: api.header_title ?? "Chat Support",
    headerSubtitle: api.header_subtitle ?? "Đang hoạt động",
    headerHeight: header?.header_height ?? 72,
    headerShowStatus: header?.header_show_status ?? true,
    botMessageBackgroundColor: api.bot_message_background_color,
    botMessageTextColor: api.bot_message_text_color,
    userMessageBackgroundColor: api.user_message_background_color,
    userMessageTextColor: api.user_message_text_color,
    chatWindowBorderColor: chatWindow?.chat_window_border_color ?? "oklch(0.925 0.005 214.3)",
    chatWindowBorderWidth: chatWindow?.chat_window_border_width ?? 1,
    chatWindowWidth: chatWindow?.chat_window_width ?? api.chat_window_width,
    chatWindowHeight: chatWindow?.chat_window_height ?? api.chat_window_height,
    chatWindowShadow: chatWindow?.chat_window_shadow ?? false,
    chatWindowPosition: chatWindow?.chat_window_position ?? api.chat_window_position,
    borderRadius: chatWindow?.border_radius ?? api.border_radius,
    messageBubbleRadius: api.message_bubble_radius,
    messageAreaBackgroundColor: message?.message_area_background_color ?? api.background_color,
    messageAreaPadding: message?.message_area_padding ?? 16,
    messageSpacing: message?.message_spacing ?? 16,
    showMessageTimestamp: message?.show_message_timestamp ?? false,
    baseFontSize: typography?.base_font_size ?? 14,
    inputBackgroundColor: input?.input_background_color ?? api.background_color,
    inputBorderRadius: input?.input_border_radius ?? 12,
    placeholderText: input?.placeholder_text ?? api.placeholder_text,
    welcomeMessage: welcome?.welcome_message ?? api.welcome_message,
    showAvatar: api.show_avatar,
    showLogo: api.show_logo,
    animationEnabled: animation?.animation_enabled ?? true,
  }
}

function styleToApiUpdate(style: ChatStyle): UpdateChatbotUiSettingDto {
  return {
    primary_color: style.primaryColor as unknown as UpdateChatbotUiSettingDto["primary_color"],
    background_color: style.backgroundColor as unknown as UpdateChatbotUiSettingDto["background_color"],
    chat_window: {
      chat_window_border_color: style.chatWindowBorderColor,
      chat_window_border_width: style.chatWindowBorderWidth,
      chat_window_width: style.chatWindowWidth,
      chat_window_height: style.chatWindowHeight,
      chat_window_shadow: style.chatWindowShadow,
      chat_window_position: style.chatWindowPosition,
      border_radius: style.borderRadius,
    } as unknown as UpdateChatbotUiSettingDto["chat_window"],
    header: {
      header_height: style.headerHeight,
      header_background_color: style.headerBackgroundColor,
      header_text_color: style.headerTextColor,
      header_title: style.headerTitle,
      header_subtitle: style.headerSubtitle,
      header_show_status: style.headerShowStatus,
    } as unknown as UpdateChatbotUiSettingDto["header"],
    message: {
      message_area_background_color: style.messageAreaBackgroundColor,
      message_area_padding: style.messageAreaPadding,
      message_spacing: style.messageSpacing,
      show_message_timestamp: style.showMessageTimestamp,
      bot_message_background_color: style.botMessageBackgroundColor,
      bot_message_text_color: style.botMessageTextColor,
      user_message_background_color: style.userMessageBackgroundColor,
      user_message_text_color: style.userMessageTextColor,
      message_bubble_radius: style.messageBubbleRadius,
    } as unknown as UpdateChatbotUiSettingDto["message"],
    typography: {
      base_font_size: style.baseFontSize,
    } as unknown as UpdateChatbotUiSettingDto["typography"],
    input: {
      input_background_color: style.inputBackgroundColor,
      input_border_radius: style.inputBorderRadius,
      placeholder_text: style.placeholderText,
    } as unknown as UpdateChatbotUiSettingDto["input"],
    animation: {
      animation_enabled: style.animationEnabled,
    } as unknown as UpdateChatbotUiSettingDto["animation"],
    welcome: {
      welcome_message: style.welcomeMessage,
    } as unknown as UpdateChatbotUiSettingDto["welcome"],
  }
}

const defaultStyle: ChatStyle = {
  primaryColor: "oklch(0.488 0.243 264.376)",
  backgroundColor: "oklch(1 0 0)",
  headerBackgroundColor: "oklch(1 0 0)",
  headerTextColor: "oklch(0.148 0.004 228.8)",
  headerTitle: "Chat Support",
  headerSubtitle: "Đang hoạt động",
  headerHeight: 72,
  headerShowStatus: true,
  botMessageBackgroundColor: "oklch(0.967 0.001 286.375)",
  botMessageTextColor: "oklch(0.21 0.006 285.885)",
  userMessageBackgroundColor: "oklch(0.488 0.243 264.376)",
  userMessageTextColor: "oklch(0.97 0.014 254.604)",
  chatWindowBorderColor: "oklch(0.925 0.005 214.3)",
  chatWindowBorderWidth: 1,
  chatWindowWidth: 400,
  chatWindowHeight: 600,
  chatWindowShadow: false,
  chatWindowPosition: "bottom_right",
  borderRadius: 12,
  messageBubbleRadius: 12,
  messageAreaBackgroundColor: "oklch(0.987 0.002 197.1)",
  messageAreaPadding: 16,
  messageSpacing: 16,
  showMessageTimestamp: false,
  baseFontSize: 14,
  inputBackgroundColor: "oklch(1 0 0)",
  inputBorderRadius: 12,
  placeholderText: "Nhập tin nhắn của bạn...",
  welcomeMessage: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
  showAvatar: true,
  showLogo: false,
  animationEnabled: true,
}

const deviceSizes = {
  desktop: { width: "100%", maxWidth: "420px", label: "Desktop", icon: Monitor },
  tablet: { width: "100%", maxWidth: "340px", label: "Tablet", icon: Tablet },
  mobile: { width: "100%", maxWidth: "300px", label: "Mobile", icon: Smartphone },
}

const chatWindowPositions = [
  { value: "bottom_right", label: "Bottom Right" },
  { value: "bottom_left", label: "Bottom Left" },
  { value: "top_right", label: "Top Right" },
  { value: "top_left", label: "Top Left" },
]

const sampleMessages = [
  { type: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?" },
  { type: "user", text: "Tôi muốn tìm hiểu về sản phẩm của bạn" },
  { type: "bot", text: "Tuyệt vời! Chúng tôi có nhiều sản phẩm tuyệt vời. Bạn quan tâm đến loại sản phẩm nào cụ thể?" },
  { type: "user", text: "Tôi đang tìm kiếm giải pháp cho doanh nghiệp nhỏ" },
  {
    type: "bot",
    text: "Chúng tôi có gói doanh nghiệp phù hợp với nhu cầu của bạn. Tôi có thể gửi thông tin chi tiết không?",
  },
]

interface PropertySectionProps {
  title: string
  icon: LucideIcon
  sectionKey: string
  children: React.ReactNode
  badge?: string
  isCollapsed: boolean
  onToggle: (key: string) => void
}

const PropertySection = React.memo(function PropertySection({
  title,
  icon: Icon,
  sectionKey,
  children,
  badge,
  isCollapsed,
  onToggle,
}: PropertySectionProps) {
  const handleToggle = useCallback(() => onToggle(sectionKey), [onToggle, sectionKey])

  return (
    <div className="border border-border rounded-lg bg-card/50 backdrop-blur-sm">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-accent/10 transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm text-foreground">{title}</span>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {!isCollapsed && <div className="p-3 pt-0 space-y-4 border-t border-border/50">{children}</div>}
    </div>
  )
})

interface NumericInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
}

const NumericInput = React.memo(function NumericInput({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
}: NumericInputProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [startValue, setStartValue] = useState(0)
  const [startY, setStartY] = useState(0)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    setStartValue(value)
    setStartY(e.clientY)
    document.body.style.cursor = "ns-resize"
  }, [value])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value)),
    [onChange]
  )

  const handleSliderChange = useCallback((val: number[]) => onChange(val[0]), [onChange])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaY = startY - e.clientY
      const newValue = Math.max(min, Math.min(max, startValue + deltaY * step))
      onChange(newValue)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.cursor = "default"
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, startY, startValue, min, max, step, onChange])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
        <div className="flex items-center gap-1">
          <Input
            type="number"
            value={value}
            onChange={handleInputChange}
            onMouseDown={handleMouseDown}
            className="w-16 h-7 text-xs text-right border-0 bg-input rounded px-2 cursor-ns-resize select-none"
            min={min}
            max={max}
            step={step}
          />
          <span className="text-xs text-muted-foreground min-w-[20px]">{unit}</span>
        </div>
      </div>
      <Slider
        value={[value]}
        onValueChange={handleSliderChange}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
    </div>
  )
})

interface ColorInputProps {
  label: string
  value: string
  onChange: (value: string) => void
}

const ColorInput = React.memo(function ColorInput({ label, value, onChange }: ColorInputProps) {
  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  )
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  )

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <div
          className="w-10 h-8 rounded-md border-2 border-border cursor-pointer relative overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          style={{ backgroundColor: value }}
        >
          <Input
            type="color"
            value={value}
            onChange={handleColorChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <Input
          value={value}
          onChange={handleTextChange}
          className="flex-1 h-8 text-xs font-mono bg-input border-border"
          placeholder="#000000"
        />
      </div>
    </div>
  )
})

interface TextInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const TextInput = React.memo(function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: TextInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  )

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <Input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="h-8 text-xs bg-input border-border"
      />
    </div>
  )
})

interface ChatCustomizerProps {
  chatbotId: number
}

export function ChatCustomizer({ chatbotId }: ChatCustomizerProps) {
  const { data: uiSettingData, isLoading: isLoadingUiSetting } = useGetChatbotUiSetting(chatbotId, {})
  const uiSetting = uiSettingData?.data
  const [style, setStyle] = useState<ChatStyle>(defaultStyle)
  const [hasLocalChanges, setHasLocalChanges] = useState(false)
  const [activeDevice, setActiveDevice] = useState<keyof typeof deviceSizes>("desktop")
  const [message, setMessage] = useState("")
  const [collapsedSections, setCollapsedSections] = useState<{ [key: string]: boolean }>({})
  const [zoomLevel, setZoomLevel] = useState(100)

  const updateMutation = useUpdateChatbotUiSetting()

  useEffect(() => {
    if (uiSetting) {
      setStyle(apiToStyle(uiSetting))
      setHasLocalChanges(false)
    }
  }, [uiSetting])

  const updateStyle = useCallback((key: keyof ChatStyle, value: string | number | boolean) => {
    setStyle((prev) => ({ ...prev, [key]: value }))
    setHasLocalChanges(true)
  }, [])

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ id: chatbotId, data: styleToApiUpdate(style) })
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
    setStyle(defaultStyle)
  }

  const exportConfig = () => {
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

  if (isLoadingUiSetting) {
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
          </div>

          <div className="flex items-center gap-2">
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

        <div className="flex-1 p-8 overflow-auto bg-muted/20 custom-scrollbar">
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
                {/* Header */}
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

                {/* Messages */}
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

                {/* Input */}
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
        </div>
      </div>

      <div className="w-80 bg-card border-l border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-foreground">Design</h3>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={resetToDefault} className="h-8 w-8 p-0">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={copyCSS} className="h-8 w-8 p-0">
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={exportConfig} className="h-8 w-8 p-0">
                <Download className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!hasLocalChanges || updateMutation.isPending}
                className="h-8"
              >
                {updateMutation.isPending ? <Loader2Icon className="mr-1 h-4 w-4 animate-spin" /> : null}
                Lưu
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4 custom-scrollbar">
          <PropertySection
            title="Theme"
            icon={Palette}
            sectionKey="theme"
            isCollapsed={collapsedSections.theme}
            onToggle={toggleSection}
          >
            <ColorInput
              label="Primary Color"
              value={style.primaryColor}
              onChange={(value) => updateStyle("primaryColor", value)}
            />
            <ColorInput
              label="Background Color"
              value={style.backgroundColor}
              onChange={(value) => updateStyle("backgroundColor", value)}
            />
          </PropertySection>

          <PropertySection
            title="Chat Window"
            icon={Settings}
            sectionKey="chatWindow"
            badge="Window"
            isCollapsed={collapsedSections.chatWindow}
            onToggle={toggleSection}
          >
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Position</Label>
              <Select value={style.chatWindowPosition} onValueChange={(value) => updateStyle("chatWindowPosition", value as ChatStyle["chatWindowPosition"])}>
                <SelectTrigger className="h-8 text-xs bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {chatWindowPositions.map((pos) => (
                    <SelectItem key={pos.value} value={pos.value}>
                      {pos.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <NumericInput
              label="Width"
              value={style.chatWindowWidth}
              onChange={(value) => updateStyle("chatWindowWidth", value)}
              min={280}
              max={600}
              step={10}
              unit="px"
            />
            <NumericInput
              label="Height"
              value={style.chatWindowHeight}
              onChange={(value) => updateStyle("chatWindowHeight", value)}
              min={400}
              max={900}
              step={10}
              unit="px"
            />
            <ColorInput
              label="Border Color"
              value={style.chatWindowBorderColor}
              onChange={(value) => updateStyle("chatWindowBorderColor", value)}
            />
            <NumericInput
              label="Border Width"
              value={style.chatWindowBorderWidth}
              onChange={(value) => updateStyle("chatWindowBorderWidth", value)}
              min={0}
              max={8}
              unit="px"
            />
            <NumericInput
              label="Border Radius"
              value={style.borderRadius}
              onChange={(value) => updateStyle("borderRadius", value)}
              min={0}
              max={40}
              unit="px"
            />
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground">Shadow</Label>
              <Switch checked={style.chatWindowShadow} onCheckedChange={(checked) => updateStyle("chatWindowShadow", checked)} />
            </div>
          </PropertySection>

          <PropertySection
            title="Header"
            icon={Settings}
            sectionKey="header"
            isCollapsed={collapsedSections.header}
            onToggle={toggleSection}
          >
            <TextInput
              label="Title"
              value={style.headerTitle}
              onChange={(value) => updateStyle("headerTitle", value)}
              placeholder="Chat Support"
            />
            <TextInput
              label="Subtitle"
              value={style.headerSubtitle}
              onChange={(value) => updateStyle("headerSubtitle", value)}
              placeholder="Đang hoạt động"
            />
            <ColorInput
              label="Background Color"
              value={style.headerBackgroundColor}
              onChange={(value) => updateStyle("headerBackgroundColor", value)}
            />
            <ColorInput
              label="Text Color"
              value={style.headerTextColor}
              onChange={(value) => updateStyle("headerTextColor", value)}
            />
            <NumericInput
              label="Height"
              value={style.headerHeight}
              onChange={(value) => updateStyle("headerHeight", value)}
              min={50}
              max={120}
              step={2}
              unit="px"
            />
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground">Show Status</Label>
              <Switch checked={style.headerShowStatus} onCheckedChange={(checked) => updateStyle("headerShowStatus", checked)} />
            </div>
          </PropertySection>

          <PropertySection
            title="Messages"
            icon={Settings}
            sectionKey="messages"
            isCollapsed={collapsedSections.messages}
            onToggle={toggleSection}
          >
            <ColorInput
              label="Area Background Color"
              value={style.messageAreaBackgroundColor}
              onChange={(value) => updateStyle("messageAreaBackgroundColor", value)}
            />
            <NumericInput
              label="Area Padding"
              value={style.messageAreaPadding}
              onChange={(value) => updateStyle("messageAreaPadding", value)}
              min={8}
              max={32}
              step={2}
              unit="px"
            />
            <NumericInput
              label="Message Spacing"
              value={style.messageSpacing}
              onChange={(value) => updateStyle("messageSpacing", value)}
              min={8}
              max={40}
              step={2}
              unit="px"
            />
            <NumericInput
              label="Bubble Radius"
              value={style.messageBubbleRadius}
              onChange={(value) => updateStyle("messageBubbleRadius", value)}
              min={0}
              max={40}
              unit="px"
            />
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground">Show Timestamp</Label>
              <Switch checked={style.showMessageTimestamp} onCheckedChange={(checked) => updateStyle("showMessageTimestamp", checked)} />
            </div>
            <ColorInput
              label="Bot Bubble Color"
              value={style.botMessageBackgroundColor}
              onChange={(value) => updateStyle("botMessageBackgroundColor", value)}
            />
            <ColorInput
              label="Bot Text Color"
              value={style.botMessageTextColor}
              onChange={(value) => updateStyle("botMessageTextColor", value)}
            />
            <ColorInput
              label="User Bubble Color"
              value={style.userMessageBackgroundColor}
              onChange={(value) => updateStyle("userMessageBackgroundColor", value)}
            />
            <ColorInput
              label="User Text Color"
              value={style.userMessageTextColor}
              onChange={(value) => updateStyle("userMessageTextColor", value)}
            />
          </PropertySection>

          <PropertySection
            title="Input"
            icon={Settings}
            sectionKey="input"
            isCollapsed={collapsedSections.input}
            onToggle={toggleSection}
          >
            <ColorInput
              label="Background Color"
              value={style.inputBackgroundColor}
              onChange={(value) => updateStyle("inputBackgroundColor", value)}
            />
            <NumericInput
              label="Border Radius"
              value={style.inputBorderRadius}
              onChange={(value) => updateStyle("inputBorderRadius", value)}
              min={0}
              max={40}
              unit="px"
            />
            <TextInput
              label="Placeholder Text"
              value={style.placeholderText}
              onChange={(value) => updateStyle("placeholderText", value)}
              placeholder="Nhập tin nhắn của bạn..."
            />
          </PropertySection>

          <PropertySection
            title="Welcome"
            icon={Settings}
            sectionKey="welcome"
            isCollapsed={collapsedSections.welcome}
            onToggle={toggleSection}
          >
            <TextInput
              label="Welcome Message"
              value={style.welcomeMessage}
              onChange={(value) => updateStyle("welcomeMessage", value)}
              placeholder="Xin chào! Tôi có thể giúp gì cho bạn hôm nay?"
            />
          </PropertySection>

          <PropertySection
            title="Branding"
            icon={Settings}
            sectionKey="branding"
            isCollapsed={collapsedSections.branding}
            onToggle={toggleSection}
          >
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground">Show Avatar</Label>
              <Switch checked={style.showAvatar} onCheckedChange={(checked) => updateStyle("showAvatar", checked)} />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground">Show Logo</Label>
              <Switch checked={style.showLogo} onCheckedChange={(checked) => updateStyle("showLogo", checked)} />
            </div>
          </PropertySection>

          <PropertySection
            title="Typography"
            icon={Type}
            sectionKey="typography"
            badge="Text"
            isCollapsed={collapsedSections.typography}
            onToggle={toggleSection}
          >
            <NumericInput
              label="Base Font Size"
              value={style.baseFontSize}
              onChange={(value) => updateStyle("baseFontSize", value)}
              min={10}
              max={24}
              unit="px"
            />
          </PropertySection>

          <PropertySection
            title="Animation"
            icon={Settings}
            sectionKey="animation"
            isCollapsed={collapsedSections.animation}
            onToggle={toggleSection}
          >
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground">Enable Animations</Label>
              <Switch checked={style.animationEnabled} onCheckedChange={(checked) => updateStyle("animationEnabled", checked)} />
            </div>
          </PropertySection>
        </div>
      </div>
    </div>
  )
}
