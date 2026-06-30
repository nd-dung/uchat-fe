"use client"

import * as React from "react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Palette,
  Settings,
  Type,
  Copy,
  RotateCcw,
  Download,
  Upload,
  ClipboardPaste,
  Loader2Icon,
  PanelTop,
  MessageSquare,
  SquareTerminal,
  Hand,
  Sparkles,
  Rocket,
  Footprints,
  Tags,
  Search,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  chatWindowPositions,
  headerLayouts,
  sendButtonTypes,
  launcherAnimations,
  chatOpenAnimations,
  messageAnimations,
  typingIndicatorStyles,
  launcherTypes,
  fontFamilyOptions,
} from "./chat-constants"
import {
  PropertySection,
  NumericInput,
  ColorInput,
  TextInput,
  SelectInput,
  UploadInput,
} from "./chat-customizer-inputs"
import type { ChatStyle } from "./chat-style"

interface DesignPanelProps {
  style: ChatStyle
  updateStyle: (key: keyof ChatStyle, value: string | number | boolean) => void
  onSave: () => void
  onReset: () => void
  onExport: () => void
  onImport: (config: ChatStyle) => void
  onCopyCSS: () => void
  hasLocalChanges: boolean
  isSaving: boolean
  collapsedSections: { [key: string]: boolean }
  onToggleSection: (key: string) => void
}

export const DesignPanel = React.memo(function DesignPanel({
  style,
  updateStyle,
  onSave,
  onReset,
  onExport,
  onImport,
  onCopyCSS,
  hasLocalChanges,
  isSaving,
  collapsedSections,
  onToggleSection,
}: DesignPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const query = searchQuery.trim().toLowerCase()
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const sectionMatches = React.useCallback(
    (keywords: string) => {
      if (!query) return true
      const keywordsLower = keywords.toLowerCase()
      return keywordsLower.includes(query)
    },
    [query]
  )

  const isSectionCollapsed = React.useCallback(
    (key: string) => (query ? false : collapsedSections[key]),
    [query, collapsedSections]
  )

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const result = event.target?.result
        if (typeof result !== "string") return
        const json = JSON.parse(result)
        const config = json.style || json
        onImport(config as ChatStyle)
      } catch {
        alert("File JSON không hợp lệ")
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const [showPasteModal, setShowPasteModal] = useState(false)
  const [pasteValue, setPasteValue] = useState("")

  const handlePasteImport = () => {
    try {
      const json = JSON.parse(pasteValue)
      const config = json.style || json
      onImport(config as ChatStyle)
      setShowPasteModal(false)
      setPasteValue("")
    } catch {
      alert("JSON không hợp lệ")
    }
  }

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">Thiết kế</h3>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onReset} className="h-8 w-8 p-0">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onCopyCSS} className="h-8 w-8 p-0">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onExport} className="h-8 w-8 p-0">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleImportClick} className="h-8 w-8 p-0">
              <Upload className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowPasteModal(true)} className="h-8 w-8 p-0">
              <ClipboardPaste className="w-4 h-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              size="sm"
              onClick={onSave}
              disabled={!hasLocalChanges || isSaving}
              className="h-8"
            >
              {isSaving ? <Loader2Icon className="mr-1 h-4 w-4 animate-spin" /> : null}
              Lưu
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm cấu hình..."
            className="h-8 pl-8 text-xs bg-white border-border"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4 custom-scrollbar">
        <PropertySection
          title="Chủ đề"
          icon={Palette}
          sectionKey="theme"
          isCollapsed={isSectionCollapsed("theme")}
          onToggle={onToggleSection}
          hidden={!sectionMatches("theme color primary background")}
        >
          <ColorInput
            label="Màu chính"
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
          title="Cửa sổ chat"
          icon={Settings}
          sectionKey="chatWindow"
          badge="Cửa sổ"
          isCollapsed={isSectionCollapsed("chatWindow")}
          onToggle={onToggleSection}
          hidden={!sectionMatches("chat window position width height border radius shadow mobile fullscreen z-index")}
        >
          <SelectInput
            label="Vị trí"
            value={style.chatWindowPosition}
            options={chatWindowPositions}
            onChange={(value) => updateStyle("chatWindowPosition", value as ChatStyle["chatWindowPosition"])}
          />
          <NumericInput
            label="Chiều rộng"
            value={style.chatWindowWidth}
            onChange={(value) => updateStyle("chatWindowWidth", value)}
            min={280}
            max={600}
            step={10}
            unit="px"
          />
          <NumericInput
            label="Chiều cao"
            value={style.chatWindowHeight}
            onChange={(value) => updateStyle("chatWindowHeight", value)}
            min={400}
            max={900}
            step={10}
            unit="px"
          />
          <ColorInput
            label="Màu viền"
            value={style.chatWindowBorderColor}
            onChange={(value) => updateStyle("chatWindowBorderColor", value)}
          />
          <NumericInput
            label="Độ dày viền"
            value={style.chatWindowBorderWidth}
            onChange={(value) => updateStyle("chatWindowBorderWidth", value)}
            min={0}
            max={8}
            unit="px"
          />
          <NumericInput
            label="Bán kính viền"
            value={style.borderRadius}
            onChange={(value) => updateStyle("borderRadius", value)}
            min={0}
            max={40}
            unit="px"
          />
          <NumericInput
            label="Z-Index"
            value={style.chatWindowZIndex}
            onChange={(value) => updateStyle("chatWindowZIndex", value)}
            min={0}
            max={2147483647}
            step={1000}
          />
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Đổ bóng</Label>
            <Switch checked={style.chatWindowShadow} onCheckedChange={(checked) => updateStyle("chatWindowShadow", checked)} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Toàn màn hình trên di động</Label>
            <Switch checked={style.mobileFullscreenEnabled} onCheckedChange={(checked) => updateStyle("mobileFullscreenEnabled", checked)} />
          </div>
        </PropertySection>

        <PropertySection
          title="Đầu trang"
          icon={PanelTop}
          sectionKey="header"
          isCollapsed={isSectionCollapsed("header")}
          onToggle={onToggleSection}
          hidden={!sectionMatches("header layout title subtitle status color height")}
        >
          <SelectInput
            label="Bố cục"
            value={style.headerLayout}
            options={headerLayouts}
            onChange={(value) => updateStyle("headerLayout", value as ChatStyle["headerLayout"])}
          />
          <TextInput
            label="Tiêu đề"
            value={style.headerTitle}
            onChange={(value) => updateStyle("headerTitle", value)}
            placeholder="Chat Support"
          />
          <TextInput
            label="Tiêu đề phụ"
            value={style.headerSubtitle}
            onChange={(value) => updateStyle("headerSubtitle", value)}
            placeholder="Đang hoạt động"
          />
          <ColorInput
            label="Màu nền"
            value={style.headerBackgroundColor}
            onChange={(value) => updateStyle("headerBackgroundColor", value)}
          />
          <ColorInput
            label="Màu chữ"
            value={style.headerTextColor}
            onChange={(value) => updateStyle("headerTextColor", value)}
          />
          <ColorInput
            label="Màu trạng thái"
            value={style.headerStatusColor}
            onChange={(value) => updateStyle("headerStatusColor", value)}
          />
          <TextInput
            label="Trạng thái"
            value={style.headerStatusText}
            onChange={(value) => updateStyle("headerStatusText", value)}
            placeholder="Đang hoạt động"
          />
          <NumericInput
            label="Chiều cao"
            value={style.headerHeight}
            onChange={(value) => updateStyle("headerHeight", value)}
            min={50}
            max={120}
            step={2}
            unit="px"
          />
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Hiển thị trạng thái</Label>
            <Switch checked={style.headerShowStatus} onCheckedChange={(checked) => updateStyle("headerShowStatus", checked)} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Hiển thị nút đóng</Label>
            <Switch checked={style.headerShowCloseButton} onCheckedChange={(checked) => updateStyle("headerShowCloseButton", checked)} />
          </div>
        </PropertySection>

        <PropertySection
          title="Tin nhắn"
          icon={MessageSquare}
          sectionKey="messages"
          isCollapsed={isSectionCollapsed("messages")}
          onToggle={onToggleSection}
          hidden={!sectionMatches("messages message bubble color text spacing padding width timestamp bot user")}
        >
          <ColorInput
            label="Màu nền khu vực"
            value={style.messageAreaBackgroundColor}
            onChange={(value) => updateStyle("messageAreaBackgroundColor", value)}
          />
          <NumericInput
            label="Khoảng cách khu vực"
            value={style.messageAreaPadding}
            onChange={(value) => updateStyle("messageAreaPadding", value)}
            min={8}
            max={32}
            step={2}
            unit="px"
          />
          <NumericInput
            label="Khoảng cách tin nhắn"
            value={style.messageSpacing}
            onChange={(value) => updateStyle("messageSpacing", value)}
            min={8}
            max={40}
            step={2}
            unit="px"
          />
          <NumericInput
            label="Bán kính bong bóng"
            value={style.messageBubbleRadius}
            onChange={(value) => updateStyle("messageBubbleRadius", value)}
            min={0}
            max={40}
            unit="px"
          />
          <NumericInput
            label="Chiều rộng tối đa"
            value={style.messageMaxWidthPercent}
            onChange={(value) => updateStyle("messageMaxWidthPercent", value)}
            min={50}
            max={100}
            unit="%"
          />
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Hiển thị thời gian</Label>
            <Switch checked={style.showMessageTimestamp} onCheckedChange={(checked) => updateStyle("showMessageTimestamp", checked)} />
          </div>
          <ColorInput
            label="Màu bong bóng bot"
            value={style.botMessageBackgroundColor}
            onChange={(value) => updateStyle("botMessageBackgroundColor", value)}
          />
          <ColorInput
            label="Màu chữ bot"
            value={style.botMessageTextColor}
            onChange={(value) => updateStyle("botMessageTextColor", value)}
          />
          <ColorInput
            label="Màu bong bóng người dùng"
            value={style.userMessageBackgroundColor}
            onChange={(value) => updateStyle("userMessageBackgroundColor", value)}
          />
          <ColorInput
            label="Màu chữ người dùng"
            value={style.userMessageTextColor}
            onChange={(value) => updateStyle("userMessageTextColor", value)}
          />
        </PropertySection>

        <PropertySection
          title="Ô nhập"
          icon={SquareTerminal}
          sectionKey="input"
          isCollapsed={isSectionCollapsed("input")}
          onToggle={onToggleSection}
          hidden={!sectionMatches("input color text placeholder border radius send button")}
        >
          <ColorInput
            label="Màu nền"
            value={style.inputBackgroundColor}
            onChange={(value) => updateStyle("inputBackgroundColor", value)}
          />
          <ColorInput
            label="Màu chữ"
            value={style.inputTextColor}
            onChange={(value) => updateStyle("inputTextColor", value)}
          />
          <ColorInput
            label="Màu placeholder"
            value={style.inputPlaceholderColor}
            onChange={(value) => updateStyle("inputPlaceholderColor", value)}
          />
          <ColorInput
            label="Màu viền"
            value={style.inputBorderColor}
            onChange={(value) => updateStyle("inputBorderColor", value)}
          />
          <NumericInput
            label="Bán kính viền"
            value={style.inputBorderRadius}
            onChange={(value) => updateStyle("inputBorderRadius", value)}
            min={0}
            max={40}
            unit="px"
          />
          <TextInput
            label="Văn bản placeholder"
            value={style.placeholderText}
            onChange={(value) => updateStyle("placeholderText", value)}
            placeholder="Nhập tin nhắn của bạn..."
          />
          <SelectInput
            label="Loại nút gửi"
            value={style.sendButtonType}
            options={sendButtonTypes}
            onChange={(value) => updateStyle("sendButtonType", value as ChatStyle["sendButtonType"])}
          />
          <ColorInput
            label="Màu nền nút gửi"
            value={style.sendButtonBackgroundColor}
            onChange={(value) => updateStyle("sendButtonBackgroundColor", value)}
          />
          <ColorInput
            label="Màu biểu tượng nút gửi"
            value={style.sendButtonIconColor}
            onChange={(value) => updateStyle("sendButtonIconColor", value)}
          />
          <TextInput
            label="Văn bản nút gửi"
            value={style.sendButtonText}
            onChange={(value) => updateStyle("sendButtonText", value)}
            placeholder="Gửi"
          />
        </PropertySection>

        <PropertySection
          title="Kiểu chữ"
          icon={Type}
          sectionKey="typography"
          badge="Văn bản"
          isCollapsed={isSectionCollapsed("typography")}
          onToggle={onToggleSection}
          hidden={!sectionMatches("typography font family size text header message input")}
        >
          <SelectInput
            label="Phông chữ"
            value={style.fontFamily}
            options={fontFamilyOptions}
            onChange={(value) => updateStyle("fontFamily", value)}
          />
          <NumericInput
            label="Kích thước phông cơ bản"
            value={style.baseFontSize}
            onChange={(value) => updateStyle("baseFontSize", value)}
            min={10}
            max={24}
            unit="px"
          />
          <NumericInput
            label="Kích thước tiêu đề đầu trang"
            value={style.headerTitleFontSize}
            onChange={(value) => updateStyle("headerTitleFontSize", value)}
            min={10}
            max={32}
            unit="px"
          />
          <NumericInput
            label="Kích thước tiêu đề phụ đầu trang"
            value={style.headerSubtitleFontSize}
            onChange={(value) => updateStyle("headerSubtitleFontSize", value)}
            min={8}
            max={24}
            unit="px"
          />
          <NumericInput
            label="Kích thước phông tin nhắn"
            value={style.messageFontSize}
            onChange={(value) => updateStyle("messageFontSize", value)}
            min={8}
            max={24}
            unit="px"
          />
          <NumericInput
            label="Kích thước phông ô nhập"
            value={style.inputFontSize}
            onChange={(value) => updateStyle("inputFontSize", value)}
            min={8}
            max={24}
            unit="px"
          />
        </PropertySection>

        <PropertySection
          title="Chào mừng"
          icon={Hand}
          sectionKey="welcome"
          isCollapsed={isSectionCollapsed("welcome")}
          onToggle={onToggleSection}
          hidden={!sectionMatches("welcome screen title subtitle message background")}
        >
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Bật màn hình chào mừng</Label>
            <Switch checked={style.welcomeScreenEnabled} onCheckedChange={(checked) => updateStyle("welcomeScreenEnabled", checked)} />
          </div>
          <TextInput
            label="Tiêu đề chào mừng"
            value={style.welcomeTitle}
            onChange={(value) => updateStyle("welcomeTitle", value)}
            placeholder="Chat Support"
          />
          <TextInput
            label="Tiêu đề phụ chào mừng"
            value={style.welcomeSubtitle}
            onChange={(value) => updateStyle("welcomeSubtitle", value)}
            placeholder="Đang hoạt động"
          />
          <TextInput
            label="Tin nhắn chào mừng"
            value={style.welcomeMessage}
            onChange={(value) => updateStyle("welcomeMessage", value)}
            placeholder="Xin chào! Tôi có thể giúp gì cho bạn hôm nay?"
          />
          <ColorInput
            label="Nền chào mừng"
            value={style.welcomeBackgroundColor}
            onChange={(value) => updateStyle("welcomeBackgroundColor", value)}
          />
        </PropertySection>

        <PropertySection
          title="Hoạt ảnh"
          icon={Sparkles}
          sectionKey="animation"
          isCollapsed={isSectionCollapsed("animation")}
          onToggle={onToggleSection}
          hidden={!sectionMatches("animation launcher chat open message typing indicator")}
        >
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Bật hoạt ảnh</Label>
            <Switch checked={style.animationEnabled} onCheckedChange={(checked) => updateStyle("animationEnabled", checked)} />
          </div>
          <SelectInput
            label="Hoạt ảnh khởi chạy"
            value={style.launcherAnimation}
            options={launcherAnimations}
            onChange={(value) => updateStyle("launcherAnimation", value as ChatStyle["launcherAnimation"])}
          />
          <SelectInput
            label="Hoạt ảnh mở chat"
            value={style.chatOpenAnimation}
            options={chatOpenAnimations}
            onChange={(value) => updateStyle("chatOpenAnimation", value as ChatStyle["chatOpenAnimation"])}
          />
          <SelectInput
            label="Hoạt ảnh tin nhắn"
            value={style.messageAnimation}
            options={messageAnimations}
            onChange={(value) => updateStyle("messageAnimation", value as ChatStyle["messageAnimation"])}
          />
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Chỉ báo đang nhập</Label>
            <Switch checked={style.typingIndicatorEnabled} onCheckedChange={(checked) => updateStyle("typingIndicatorEnabled", checked)} />
          </div>
          <SelectInput
            label="Kiểu chỉ báo đang nhập"
            value={style.typingIndicatorStyle}
            options={typingIndicatorStyles}
            onChange={(value) => updateStyle("typingIndicatorStyle", value as ChatStyle["typingIndicatorStyle"])}
          />
        </PropertySection>

        <PropertySection
          title="Nút khởi chạy"
          icon={Rocket}
          sectionKey="launcher"
          isCollapsed={isSectionCollapsed("launcher")}
          onToggle={onToggleSection}
          hidden={!sectionMatches("launcher type size color icon text offset shadow")}
        >
          <SelectInput
            label="Loại nút khởi chạy"
            value={style.launcherType}
            options={launcherTypes}
            onChange={(value) => updateStyle("launcherType", value as ChatStyle["launcherType"])}
          />
          <NumericInput
            label="Kích thước"
            value={style.launcherSize}
            onChange={(value) => updateStyle("launcherSize", value)}
            min={40}
            max={80}
            unit="px"
          />
          <ColorInput
            label="Màu nền"
            value={style.launcherBackgroundColor}
            onChange={(value) => updateStyle("launcherBackgroundColor", value)}
          />
          <ColorInput
            label="Màu biểu tượng"
            value={style.launcherIconColor}
            onChange={(value) => updateStyle("launcherIconColor", value)}
          />
          <TextInput
            label="Văn bản nút khởi chạy"
            value={style.launcherText}
            onChange={(value) => updateStyle("launcherText", value)}
            placeholder="Chat"
          />
          <ColorInput
            label="Màu chữ"
            value={style.launcherTextColor}
            onChange={(value) => updateStyle("launcherTextColor", value)}
          />
          <NumericInput
            label="Bù X"
            value={style.launcherOffsetX}
            onChange={(value) => updateStyle("launcherOffsetX", value)}
            min={0}
            max={100}
            unit="px"
          />
          <NumericInput
            label="Bù Y"
            value={style.launcherOffsetY}
            onChange={(value) => updateStyle("launcherOffsetY", value)}
            min={0}
            max={100}
            unit="px"
          />
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Đổ bóng</Label>
            <Switch checked={style.launcherShadow} onCheckedChange={(checked) => updateStyle("launcherShadow", checked)} />
          </div>
        </PropertySection>

        <PropertySection
          title="Chân trang"
          icon={Footprints}
          sectionKey="footer"
          isCollapsed={isSectionCollapsed("footer")}
          onToggle={onToggleSection}
          hidden={!sectionMatches("footer text color link powered by")}
        >
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Bật chân trang</Label>
            <Switch checked={style.footerEnabled} onCheckedChange={(checked) => updateStyle("footerEnabled", checked)} />
          </div>
          <TextInput
            label="Văn bản chân trang"
            value={style.footerText}
            onChange={(value) => updateStyle("footerText", value)}
            placeholder="Powered by Uchat"
          />
          <ColorInput
            label="Màu chữ chân trang"
            value={style.footerTextColor}
            onChange={(value) => updateStyle("footerTextColor", value)}
          />
          <TextInput
            label="Liên kết chân trang"
            value={style.footerLinkUrl}
            onChange={(value) => updateStyle("footerLinkUrl", value)}
            placeholder="https://example.com"
          />
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Hiển thị Powered By</Label>
            <Switch checked={style.showPoweredBy} onCheckedChange={(checked) => updateStyle("showPoweredBy", checked)} />
          </div>
        </PropertySection>

        <PropertySection
          title="Thương hiệu"
          icon={Tags}
          sectionKey="branding"
          isCollapsed={isSectionCollapsed("branding")}
          onToggle={onToggleSection}
          hidden={!sectionMatches("branding avatar logo icon")}
        >
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Hiển thị avatar</Label>
            <Switch checked={style.showAvatar} onCheckedChange={(checked) => updateStyle("showAvatar", checked)} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Hiển thị logo</Label>
            <Switch checked={style.showLogo} onCheckedChange={(checked) => updateStyle("showLogo", checked)} />
          </div>
          <UploadInput
            label="Avatar"
            value={style.avatarUrl}
            onChange={(value) => updateStyle("avatarUrl", value)}
            placeholder="https://..."
            crop
            cropShape="round"
          />
          <UploadInput
            label="Logo"
            value={style.logoUrl}
            onChange={(value) => updateStyle("logoUrl", value)}
            placeholder="https://..."
            crop
          />
          <UploadInput
            label="Biểu tượng khởi chạy"
            value={style.launcherIconUrl}
            onChange={(value) => updateStyle("launcherIconUrl", value)}
            placeholder="https://..."
            crop
          />
          <UploadInput
            label="Avatar chào mừng"
            value={style.welcomeAvatarUrl}
            onChange={(value) => updateStyle("welcomeAvatarUrl", value)}
            placeholder="https://..."
            crop
            cropShape="round"
          />
        </PropertySection>
      </div>

      {showPasteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-[480px] max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-sm">Dán JSON</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPasteModal(false)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <textarea
                value={pasteValue}
                onChange={(e) => setPasteValue(e.target.value)}
                placeholder='Dán JSON vào đây...\n\nVí dụ:\n{\n  "style": { ... }\n}'
                className="w-full h-64 p-3 text-xs font-mono border border-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPasteModal(false)}
              >
                Hủy
              </Button>
              <Button
                size="sm"
                onClick={handlePasteImport}
                disabled={!pasteValue.trim()}
              >
                Import
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})
