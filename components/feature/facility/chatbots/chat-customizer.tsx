"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Monitor,
  Tablet,
  Smartphone,
  Send,
  User,
  Bot,
  ChevronDown,
  ChevronRight,
  Layers,
  Palette,
  Type,
  Settings,
  Copy,
  RotateCcw,
  Eye,
  EyeOff,
  Download,
  Minus,
  Plus,
  Square,
  Circle,
  MousePointer2,
  Hand,
} from "lucide-react"

interface ChatStyle {
  backgroundColor: string
  textColor: string
  borderRadius: number
  userBubbleColor: string
  botBubbleColor: string
  userTextColor: string
  botTextColor: string
  chatBackground: string
  borderColor: string
  borderWidth: number
  shadowIntensity: number
  messageSpacing: number
  fontSize: number
  fontWeight: string
  inputHeight: number
  headerHeight: number
  animationSpeed: number
  enableAnimations: boolean
  bubbleOpacity: number
  headerBackground: string
  inputBackground: string
  scrollbarColor: string
  glowEffect: boolean
  gradientBackground: boolean
  blurEffect: number
  letterSpacing: number
  lineHeight: number
  paddingX: number
  paddingY: number
  maxWidth: number
  headerShadow: boolean
  inputShadow: boolean
  bubbleShadow: boolean
}

const defaultStyle: ChatStyle = {
  backgroundColor: "oklch(1 0 0)",
  textColor: "oklch(0.148 0.004 228.8)",
  borderRadius: 12,
  userBubbleColor: "oklch(0.488 0.243 264.376)",
  botBubbleColor: "oklch(0.967 0.001 286.375)",
  userTextColor: "oklch(0.97 0.014 254.604)",
  botTextColor: "oklch(0.21 0.006 285.885)",
  chatBackground: "oklch(0.987 0.002 197.1)",
  borderColor: "oklch(0.925 0.005 214.3)",
  borderWidth: 1,
  shadowIntensity: 8,
  messageSpacing: 16,
  fontSize: 14,
  fontWeight: "400",
  inputHeight: 48,
  headerHeight: 72,
  animationSpeed: 200,
  enableAnimations: true,
  bubbleOpacity: 100,
  headerBackground: "oklch(1 0 0)",
  inputBackground: "oklch(1 0 0)",
  scrollbarColor: "oklch(0.56 0.021 213.5)",
  glowEffect: false,
  gradientBackground: false,
  blurEffect: 0,
  letterSpacing: 0,
  lineHeight: 1.5,
  paddingX: 16,
  paddingY: 12,
  maxWidth: 400,
  headerShadow: false,
  inputShadow: false,
  bubbleShadow: false,
}

const deviceSizes = {
  desktop: { width: "100%", maxWidth: "420px", label: "Desktop", icon: Monitor },
  tablet: { width: "100%", maxWidth: "340px", label: "Tablet", icon: Tablet },
  mobile: { width: "100%", maxWidth: "300px", label: "Mobile", icon: Smartphone },
}

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

export function ChatCustomizer() {
  const [style, setStyle] = useState<ChatStyle>(defaultStyle)
  const [activeDevice, setActiveDevice] = useState<keyof typeof deviceSizes>("desktop")
  const [message, setMessage] = useState("")
  const [selectedElement, setSelectedElement] = useState<string>("container")
  const [collapsedSections, setCollapsedSections] = useState<{ [key: string]: boolean }>({})
  const [zoomLevel, setZoomLevel] = useState(100)
  const [isDragging, setIsDragging] = useState(false)
  const [tool, setTool] = useState<"select" | "hand">("select")
  const [layerVisibility, setLayerVisibility] = useState<{ [key: string]: boolean }>({
    header: true,
    messages: true,
    bubble: true,
    input: true,
  })

  const canvasRef = useRef<HTMLDivElement>(null)

  const updateStyle = (key: keyof ChatStyle, value: string | number | boolean) => {
    setStyle((prev) => ({ ...prev, [key]: value }))
  }

  const handleElementClick = (elementType: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation()
    setSelectedElement(elementType)
  }

  const toggleSection = (sectionKey: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }

  const toggleLayerVisibility = (layerKey: string) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }))
  }

  const resetToDefault = () => {
    setStyle(defaultStyle)
    setSelectedElement("container")
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
  border: ${style.borderWidth}px solid ${style.borderColor};
  box-shadow: 0 ${style.shadowIntensity}px ${style.shadowIntensity * 2}px rgba(0,0,0,0.1);
  max-width: ${style.maxWidth}px;
  ${style.glowEffect ? `box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);` : ""}
}

/* Header */
.chat-header {
  background-color: ${style.headerBackground};
  height: ${style.headerHeight}px;
  padding: ${style.paddingY}px ${style.paddingX}px;
  ${style.headerShadow ? `box-shadow: 0 2px 8px rgba(0,0,0,0.1);` : ""}
}

/* Messages */
.chat-messages {
  background-color: ${style.chatBackground};
  padding: ${style.paddingX}px;
  gap: ${style.messageSpacing}px;
}

/* Message Bubbles */
.message-bubble {
  border-radius: ${style.borderRadius}px;
  padding: ${style.paddingY}px ${style.paddingX}px;
  font-size: ${style.fontSize}px;
  font-weight: ${style.fontWeight};
  letter-spacing: ${style.letterSpacing}px;
  line-height: ${style.lineHeight};
  opacity: ${style.bubbleOpacity / 100};
  ${style.bubbleShadow ? `box-shadow: 0 2px 8px rgba(0,0,0,0.1);` : ""}
}

.user-bubble {
  background-color: ${style.userBubbleColor};
  color: ${style.userTextColor};
}

.bot-bubble {
  background-color: ${style.botBubbleColor};
  color: ${style.botTextColor};
}

/* Input */
.chat-input {
  background-color: ${style.inputBackground};
  height: ${style.inputHeight}px;
  padding: ${style.paddingX}px;
  ${style.inputShadow ? `box-shadow: 0 -2px 8px rgba(0,0,0,0.1);` : ""}
}
    `.trim()

    navigator.clipboard.writeText(css)
  }

  const PropertySection = ({
    title,
    icon: Icon,
    sectionKey,
    children,
    badge,
  }: {
    title: string
    icon: any
    sectionKey: string
    children: React.ReactNode
    badge?: string
  }) => {
    const isCollapsed = collapsedSections[sectionKey]

    return (
      <div className="border border-border rounded-lg bg-card/50 backdrop-blur-sm">
        <button
          onClick={() => toggleSection(sectionKey)}
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
  }

  const NumericInput = ({
    label,
    value,
    onChange,
    min = 0,
    max = 100,
    step = 1,
    unit = "",
  }: {
    label: string
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
    step?: number
    unit?: string
  }) => {
    const [isDragging, setIsDragging] = useState(false)
    const [startValue, setStartValue] = useState(0)
    const [startY, setStartY] = useState(0)

    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true)
      setStartValue(value)
      setStartY(e.clientY)
      document.body.style.cursor = "ns-resize"
    }

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
              onChange={(e) => onChange(Number(e.target.value))}
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
          onValueChange={(val: number[]) => onChange(val[0])}
          min={min}
          max={max}
          step={step}
          className="w-full"
        />
      </div>
    )
  }

  const ColorInput = ({
    label,
    value,
    onChange,
  }: {
    label: string
    value: string
    onChange: (value: string) => void
  }) => (
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
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 h-8 text-xs font-mono bg-input border-border"
          placeholder="#000000"
        />
      </div>
    </div>
  )

  return (
    <div className="h-screen flex bg-background text-foreground">
      <div className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-sm flex items-center gap-2 text-foreground">
            <Layers className="w-4 h-4 text-primary" />
            Layers
          </h3>
        </div>
        <div className="flex-1 p-3 space-y-1 custom-scrollbar overflow-y-auto">
          {[
            { id: "container", name: "Container", icon: Square, color: "#8b5cf6" },
            { id: "header", name: "Header", icon: Square, color: "#10b981" },
            { id: "messages", name: "Messages Area", icon: Square, color: "#f59e0b" },
            { id: "bubble", name: "Message Bubble", icon: Circle, color: "#ef4444" },
            { id: "input", name: "Input Field", icon: Square, color: "#06b6d4" },
          ].map((layer) => (
            <div
              key={layer.id}
              onClick={() => handleElementClick(layer.id)}
              className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-accent/20 transition-all figma-transition group ${
                selectedElement === layer.id ? "bg-primary/20 text-primary" : "text-foreground"
              }`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleLayerVisibility(layer.id)
                }}
                className="opacity-60 hover:opacity-100 transition-opacity"
              >
                {layerVisibility[layer.id] ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              </button>
              <div className="w-3 h-3 rounded-sm border border-border/50" style={{ backgroundColor: layer.color }} />
              <span className="text-sm font-medium flex-1">{layer.name}</span>
              {selectedElement === layer.id && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-muted/50 rounded-md p-1">
              <Button
                variant={tool === "select" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTool("select")}
                className="h-7 w-7 p-0"
              >
                <MousePointer2 className="w-3 h-3" />
              </Button>
              <Button
                variant={tool === "hand" ? "default" : "ghost"}
                size="sm"
                onClick={() => setTool("hand")}
                className="h-7 w-7 p-0"
              >
                <Hand className="w-3 h-3" />
              </Button>
            </div>
            <Separator orientation="vertical" className="h-6" />
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

        <div
          ref={canvasRef}
          className="flex-1 p-8 overflow-auto bg-muted/20 custom-scrollbar"
          style={{ cursor: tool === "hand" ? "grab" : "default" }}
        >
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
                className={`rounded-lg overflow-hidden cursor-pointer shadow-2xl relative ${
                  selectedElement === "container" ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                } ${style.glowEffect ? "shadow-primary/20" : ""}`}
                style={{
                  backgroundColor: style.backgroundColor,
                  borderColor: style.borderColor,
                  borderWidth: `${style.borderWidth}px`,
                  borderStyle: "solid",
                  borderRadius: `${style.borderRadius}px`,
                  boxShadow: style.glowEffect
                    ? `0 0 30px oklch(0.488 0.243 264.376 / 0.2)`
                    : `0 ${style.shadowIntensity}px ${style.shadowIntensity * 3}px rgba(0,0,0,0.15)`,
                  transition: style.enableAnimations
                    ? `all ${style.animationSpeed}ms cubic-bezier(0.4, 0, 0.2, 1)`
                    : "none",
                  backdropFilter: style.blurEffect > 0 ? `blur(${style.blurEffect}px)` : "none",
                  maxWidth: `${style.maxWidth}px`,
                }}
                onClick={() => handleElementClick("container")}
              >
                {/* Header */}
                {layerVisibility.header && (
                  <div
                    className={`p-4 border-b cursor-pointer hover:bg-opacity-90 transition-all relative ${
                      selectedElement === "header" ? "ring-2 ring-primary ring-inset" : ""
                    }`}
                    style={{
                      borderColor: style.borderColor,
                      backgroundColor: style.headerBackground,
                      height: `${style.headerHeight}px`,
                      display: "flex",
                      alignItems: "center",
                      paddingLeft: `${style.paddingX}px`,
                      paddingRight: `${style.paddingX}px`,
                      boxShadow: style.headerShadow ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                    }}
                    onClick={(e) => handleElementClick("header", e)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                        <Bot className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h3
                          className="font-semibold"
                          style={{
                            color: style.textColor,
                            fontWeight: style.fontWeight,
                            fontSize: `${style.fontSize + 2}px`,
                            letterSpacing: `${style.letterSpacing}px`,
                          }}
                        >
                          Chat Support
                        </h3>
                        <p
                          className="text-sm opacity-70"
                          style={{
                            color: style.textColor,
                            fontSize: `${style.fontSize - 2}px`,
                          }}
                        >
                          Đang hoạt động
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages */}
                {layerVisibility.messages && (
                  <div
                    className={`p-4 h-80 overflow-y-auto cursor-pointer custom-scrollbar ${
                      selectedElement === "messages" ? "ring-2 ring-primary ring-inset" : ""
                    }`}
                    style={{
                      backgroundColor: style.chatBackground,
                      paddingLeft: `${style.paddingX}px`,
                      paddingRight: `${style.paddingX}px`,
                    }}
                    onClick={(e) => handleElementClick("messages", e)}
                  >
                    <div style={{ gap: `${style.messageSpacing}px` }} className="flex flex-col">
                      {sampleMessages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                          <div className="flex items-end gap-3 max-w-[85%]">
                            {msg.type === "bot" && (
                              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-md">
                                <Bot className="w-4 h-4 text-primary-foreground" />
                              </div>
                            )}
                            {layerVisibility.bubble && (
                              <div
                                className={`px-4 py-3 rounded-lg cursor-pointer hover:scale-[1.02] transition-all figma-transition relative ${
                                  selectedElement === "bubble" ? "ring-2 ring-primary" : ""
                                }`}
                                style={{
                                  backgroundColor: msg.type === "user" ? style.userBubbleColor : style.botBubbleColor,
                                  color: msg.type === "user" ? style.userTextColor : style.botTextColor,
                                  borderRadius: `${style.borderRadius}px`,
                                  opacity: style.bubbleOpacity / 100,
                                  fontSize: `${style.fontSize}px`,
                                  fontWeight: style.fontWeight,
                                  letterSpacing: `${style.letterSpacing}px`,
                                  lineHeight: style.lineHeight,
                                  paddingLeft: `${style.paddingX}px`,
                                  paddingRight: `${style.paddingX}px`,
                                  paddingTop: `${style.paddingY}px`,
                                  paddingBottom: `${style.paddingY}px`,
                                  boxShadow: style.bubbleShadow ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                                  transition: style.enableAnimations
                                    ? `all ${style.animationSpeed}ms cubic-bezier(0.4, 0, 0.2, 1)`
                                    : "none",
                                }}
                                onClick={(e) => handleElementClick("bubble", e)}
                              >
                                <p>{msg.text}</p>
                              </div>
                            )}
                            {msg.type === "user" && (
                              <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-md">
                                <User className="w-4 h-4 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                {layerVisibility.input && (
                  <div
                    className={`p-4 border-t cursor-pointer hover:bg-opacity-90 transition-colors ${
                      selectedElement === "input" ? "ring-2 ring-primary ring-inset" : ""
                    }`}
                    style={{
                      borderColor: style.borderColor,
                      backgroundColor: style.inputBackground,
                      paddingLeft: `${style.paddingX}px`,
                      paddingRight: `${style.paddingX}px`,
                      boxShadow: style.inputShadow ? "0 -2px 8px rgba(0,0,0,0.1)" : "none",
                    }}
                    onClick={(e) => handleElementClick("input", e)}
                  >
                    <div className="flex gap-3">
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Nhập tin nhắn của bạn..."
                        className="flex-1 bg-input border-border"
                        style={{
                          borderRadius: `${style.borderRadius}px`,
                          borderColor: style.borderColor,
                          height: `${style.inputHeight}px`,
                          fontSize: `${style.fontSize}px`,
                          backgroundColor: style.inputBackground,
                        }}
                      />
                      <Button
                        size="icon"
                        className="shadow-lg hover:shadow-xl transition-shadow"
                        style={{
                          backgroundColor: style.userBubbleColor,
                          borderRadius: `${style.borderRadius}px`,
                          height: `${style.inputHeight}px`,
                          width: `${style.inputHeight}px`,
                        }}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-80 bg-card border-l border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-foreground">Design</h3>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={resetToDefault} className="h-8 w-8 p-0">
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={copyCSS} className="h-8 w-8 p-0">
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={exportConfig} className="h-8 w-8 p-0">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {selectedElement && (
            <div className="mt-3 flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-medium">
                {selectedElement.charAt(0).toUpperCase() + selectedElement.slice(1)}
              </Badge>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-4 custom-scrollbar">
          <PropertySection title="Fill" icon={Palette} sectionKey="fill" badge="Color">
            <ColorInput
              label="Background"
              value={
                selectedElement === "header"
                  ? style.headerBackground
                  : selectedElement === "input"
                    ? style.inputBackground
                    : selectedElement === "messages"
                      ? style.chatBackground
                      : style.backgroundColor
              }
              onChange={(value) => {
                if (selectedElement === "header") updateStyle("headerBackground", value)
                else if (selectedElement === "input") updateStyle("inputBackground", value)
                else if (selectedElement === "messages") updateStyle("chatBackground", value)
                else updateStyle("backgroundColor", value)
              }}
            />

            {selectedElement === "bubble" && (
              <>
                <ColorInput
                  label="User Bubble"
                  value={style.userBubbleColor}
                  onChange={(value) => updateStyle("userBubbleColor", value)}
                />
                <ColorInput
                  label="Bot Bubble"
                  value={style.botBubbleColor}
                  onChange={(value) => updateStyle("botBubbleColor", value)}
                />
                <ColorInput
                  label="User Text"
                  value={style.userTextColor}
                  onChange={(value) => updateStyle("userTextColor", value)}
                />
                <ColorInput
                  label="Bot Text"
                  value={style.botTextColor}
                  onChange={(value) => updateStyle("botTextColor", value)}
                />
                <NumericInput
                  label="Opacity"
                  value={style.bubbleOpacity}
                  onChange={(value) => updateStyle("bubbleOpacity", value)}
                  min={10}
                  max={100}
                  step={5}
                  unit="%"
                />
              </>
            )}

            {(selectedElement === "container" || selectedElement === "header" || selectedElement === "input") && (
              <ColorInput
                label="Text Color"
                value={style.textColor}
                onChange={(value) => updateStyle("textColor", value)}
              />
            )}
          </PropertySection>

          <PropertySection title="Stroke" icon={Settings} sectionKey="stroke" badge="Border">
            <ColorInput
              label="Border Color"
              value={style.borderColor}
              onChange={(value) => updateStyle("borderColor", value)}
            />
            <NumericInput
              label="Border Width"
              value={style.borderWidth}
              onChange={(value) => updateStyle("borderWidth", value)}
              min={0}
              max={8}
              unit="px"
            />
          </PropertySection>

          <PropertySection title="Corner Radius" icon={Settings} sectionKey="radius" badge="Shape">
            <NumericInput
              label="Radius"
              value={style.borderRadius}
              onChange={(value) => updateStyle("borderRadius", value)}
              min={0}
              max={40}
              unit="px"
            />
          </PropertySection>

          <PropertySection title="Effects" icon={Settings} sectionKey="effects" badge="Visual">
            <NumericInput
              label="Drop Shadow"
              value={style.shadowIntensity}
              onChange={(value) => updateStyle("shadowIntensity", value)}
              min={0}
              max={20}
            />
            <NumericInput
              label="Blur Effect"
              value={style.blurEffect}
              onChange={(value) => updateStyle("blurEffect", value)}
              min={0}
              max={20}
              unit="px"
            />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground">Glow Effect</Label>
                <Switch checked={style.glowEffect} onCheckedChange={(checked) => updateStyle("glowEffect", checked)} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground">Animations</Label>
                <Switch
                  checked={style.enableAnimations}
                  onCheckedChange={(checked) => updateStyle("enableAnimations", checked)}
                />
              </div>
              {selectedElement === "header" && (
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-muted-foreground">Header Shadow</Label>
                  <Switch
                    checked={style.headerShadow}
                    onCheckedChange={(checked) => updateStyle("headerShadow", checked)}
                  />
                </div>
              )}
              {selectedElement === "input" && (
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-muted-foreground">Input Shadow</Label>
                  <Switch
                    checked={style.inputShadow}
                    onCheckedChange={(checked) => updateStyle("inputShadow", checked)}
                  />
                </div>
              )}
              {selectedElement === "bubble" && (
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-muted-foreground">Bubble Shadow</Label>
                  <Switch
                    checked={style.bubbleShadow}
                    onCheckedChange={(checked) => updateStyle("bubbleShadow", checked)}
                  />
                </div>
              )}
            </div>
            {style.enableAnimations && (
              <NumericInput
                label="Duration"
                value={style.animationSpeed}
                onChange={(value) => updateStyle("animationSpeed", value)}
                min={100}
                max={1000}
                step={50}
                unit="ms"
              />
            )}
          </PropertySection>

          <PropertySection title="Typography" icon={Type} sectionKey="typography" badge="Text">
            <NumericInput
              label="Font Size"
              value={style.fontSize}
              onChange={(value) => updateStyle("fontSize", value)}
              min={10}
              max={24}
              unit="px"
            />
            <NumericInput
              label="Letter Spacing"
              value={style.letterSpacing}
              onChange={(value) => updateStyle("letterSpacing", value)}
              min={-2}
              max={4}
              step={0.1}
              unit="px"
            />
            <NumericInput
              label="Line Height"
              value={style.lineHeight}
              onChange={(value) => updateStyle("lineHeight", value)}
              min={1}
              max={2}
              step={0.1}
            />
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Font Weight</Label>
              <Select value={style.fontWeight} onValueChange={(value) => updateStyle("fontWeight", value)}>
                <SelectTrigger className="h-8 text-xs bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="300">Light</SelectItem>
                  <SelectItem value="400">Regular</SelectItem>
                  <SelectItem value="500">Medium</SelectItem>
                  <SelectItem value="600">Semibold</SelectItem>
                  <SelectItem value="700">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PropertySection>

          <PropertySection title="Layout" icon={Settings} sectionKey="layout" badge="Spacing">
            <NumericInput
              label="Padding X"
              value={style.paddingX}
              onChange={(value) => updateStyle("paddingX", value)}
              min={8}
              max={32}
              step={2}
              unit="px"
            />
            <NumericInput
              label="Padding Y"
              value={style.paddingY}
              onChange={(value) => updateStyle("paddingY", value)}
              min={8}
              max={24}
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
              label="Max Width"
              value={style.maxWidth}
              onChange={(value) => updateStyle("maxWidth", value)}
              min={280}
              max={600}
              step={10}
              unit="px"
            />
            {selectedElement === "header" && (
              <NumericInput
                label="Header Height"
                value={style.headerHeight}
                onChange={(value) => updateStyle("headerHeight", value)}
                min={50}
                max={120}
                step={2}
                unit="px"
              />
            )}
            {selectedElement === "input" && (
              <NumericInput
                label="Input Height"
                value={style.inputHeight}
                onChange={(value) => updateStyle("inputHeight", value)}
                min={36}
                max={72}
                step={2}
                unit="px"
              />
            )}
          </PropertySection>
        </div>
      </div>
    </div>
  )
}
