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
} from "./chat-constants"
import {
  PropertySection,
  NumericInput,
  ColorInput,
  TextInput,
  SelectInput,
} from "./chat-customizer-inputs"
import type { ChatStyle } from "./chat-style"

interface DesignPanelProps {
  style: ChatStyle
  updateStyle: (key: keyof ChatStyle, value: string | number | boolean) => void
  onSave: () => void
  onReset: () => void
  onExport: () => void
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
  onCopyCSS,
  hasLocalChanges,
  isSaving,
  collapsedSections,
  onToggleSection,
}: DesignPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const query = searchQuery.trim().toLowerCase()

  const sectionMatches = React.useCallback(
    (keywords: string) => {
      if (!query) return true
      return keywords.toLowerCase().includes(query)
    },
    [query]
  )

  const isSectionCollapsed = React.useCallback(
    (key: string) => (query ? false : collapsedSections[key]),
    [query, collapsedSections]
  )

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-foreground">Design</h3>
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
          title="Theme"
          icon={Palette}
          sectionKey="theme"
          isCollapsed={collapsedSections.theme}
          onToggle={onToggleSection}
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
          onToggle={onToggleSection}
        >
          <SelectInput
            label="Position"
            value={style.chatWindowPosition}
            options={chatWindowPositions}
            onChange={(value) => updateStyle("chatWindowPosition", value as ChatStyle["chatWindowPosition"])}
          />
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
          <NumericInput
            label="Z-Index"
            value={style.chatWindowZIndex}
            onChange={(value) => updateStyle("chatWindowZIndex", value)}
            min={0}
            max={2147483647}
            step={1000}
          />
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Shadow</Label>
            <Switch checked={style.chatWindowShadow} onCheckedChange={(checked) => updateStyle("chatWindowShadow", checked)} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Mobile Fullscreen</Label>
            <Switch checked={style.mobileFullscreenEnabled} onCheckedChange={(checked) => updateStyle("mobileFullscreenEnabled", checked)} />
          </div>
        </PropertySection>

        <PropertySection
          title="Header"
          icon={PanelTop}
          sectionKey="header"
          isCollapsed={collapsedSections.header}
          onToggle={onToggleSection}
        >
          <SelectInput
            label="Layout"
            value={style.headerLayout}
            options={headerLayouts}
            onChange={(value) => updateStyle("headerLayout", value as ChatStyle["headerLayout"])}
          />
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
          <ColorInput
            label="Status Color"
            value={style.headerStatusColor}
            onChange={(value) => updateStyle("headerStatusColor", value)}
          />
          <TextInput
            label="Status Text"
            value={style.headerStatusText}
            onChange={(value) => updateStyle("headerStatusText", value)}
            placeholder="Đang hoạt động"
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
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Show Close Button</Label>
            <Switch checked={style.headerShowCloseButton} onCheckedChange={(checked) => updateStyle("headerShowCloseButton", checked)} />
          </div>
        </PropertySection>

        <PropertySection
          title="Messages"
          icon={MessageSquare}
          sectionKey="messages"
          isCollapsed={collapsedSections.messages}
          onToggle={onToggleSection}
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
          <NumericInput
            label="Max Width"
            value={style.messageMaxWidthPercent}
            onChange={(value) => updateStyle("messageMaxWidthPercent", value)}
            min={50}
            max={100}
            unit="%"
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
          icon={SquareTerminal}
          sectionKey="input"
          isCollapsed={collapsedSections.input}
          onToggle={onToggleSection}
        >
          <ColorInput
            label="Background Color"
            value={style.inputBackgroundColor}
            onChange={(value) => updateStyle("inputBackgroundColor", value)}
          />
          <ColorInput
            label="Text Color"
            value={style.inputTextColor}
            onChange={(value) => updateStyle("inputTextColor", value)}
          />
          <ColorInput
            label="Placeholder Color"
            value={style.inputPlaceholderColor}
            onChange={(value) => updateStyle("inputPlaceholderColor", value)}
          />
          <ColorInput
            label="Border Color"
            value={style.inputBorderColor}
            onChange={(value) => updateStyle("inputBorderColor", value)}
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
          <SelectInput
            label="Send Button Type"
            value={style.sendButtonType}
            options={sendButtonTypes}
            onChange={(value) => updateStyle("sendButtonType", value as ChatStyle["sendButtonType"])}
          />
          <ColorInput
            label="Send Button Background"
            value={style.sendButtonBackgroundColor}
            onChange={(value) => updateStyle("sendButtonBackgroundColor", value)}
          />
          <ColorInput
            label="Send Button Icon Color"
            value={style.sendButtonIconColor}
            onChange={(value) => updateStyle("sendButtonIconColor", value)}
          />
          <TextInput
            label="Send Button Text"
            value={style.sendButtonText}
            onChange={(value) => updateStyle("sendButtonText", value)}
            placeholder="Gửi"
          />
        </PropertySection>

        <PropertySection
          title="Typography"
          icon={Type}
          sectionKey="typography"
          badge="Text"
          isCollapsed={collapsedSections.typography}
          onToggle={onToggleSection}
        >
          <TextInput
            label="Font Family"
            value={style.fontFamily}
            onChange={(value) => updateStyle("fontFamily", value)}
            placeholder="Inter, system-ui, sans-serif"
          />
          <NumericInput
            label="Base Font Size"
            value={style.baseFontSize}
            onChange={(value) => updateStyle("baseFontSize", value)}
            min={10}
            max={24}
            unit="px"
          />
          <NumericInput
            label="Header Title Size"
            value={style.headerTitleFontSize}
            onChange={(value) => updateStyle("headerTitleFontSize", value)}
            min={10}
            max={32}
            unit="px"
          />
          <NumericInput
            label="Header Subtitle Size"
            value={style.headerSubtitleFontSize}
            onChange={(value) => updateStyle("headerSubtitleFontSize", value)}
            min={8}
            max={24}
            unit="px"
          />
          <NumericInput
            label="Message Font Size"
            value={style.messageFontSize}
            onChange={(value) => updateStyle("messageFontSize", value)}
            min={8}
            max={24}
            unit="px"
          />
          <NumericInput
            label="Input Font Size"
            value={style.inputFontSize}
            onChange={(value) => updateStyle("inputFontSize", value)}
            min={8}
            max={24}
            unit="px"
          />
        </PropertySection>

        <PropertySection
          title="Welcome"
          icon={Hand}
          sectionKey="welcome"
          isCollapsed={collapsedSections.welcome}
          onToggle={onToggleSection}
        >
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Enable Welcome Screen</Label>
            <Switch checked={style.welcomeScreenEnabled} onCheckedChange={(checked) => updateStyle("welcomeScreenEnabled", checked)} />
          </div>
          <TextInput
            label="Welcome Title"
            value={style.welcomeTitle}
            onChange={(value) => updateStyle("welcomeTitle", value)}
            placeholder="Chat Support"
          />
          <TextInput
            label="Welcome Subtitle"
            value={style.welcomeSubtitle}
            onChange={(value) => updateStyle("welcomeSubtitle", value)}
            placeholder="Đang hoạt động"
          />
          <TextInput
            label="Welcome Message"
            value={style.welcomeMessage}
            onChange={(value) => updateStyle("welcomeMessage", value)}
            placeholder="Xin chào! Tôi có thể giúp gì cho bạn hôm nay?"
          />
          <ColorInput
            label="Welcome Background"
            value={style.welcomeBackgroundColor}
            onChange={(value) => updateStyle("welcomeBackgroundColor", value)}
          />
        </PropertySection>

        <PropertySection
          title="Animation"
          icon={Sparkles}
          sectionKey="animation"
          isCollapsed={collapsedSections.animation}
          onToggle={onToggleSection}
        >
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Enable Animations</Label>
            <Switch checked={style.animationEnabled} onCheckedChange={(checked) => updateStyle("animationEnabled", checked)} />
          </div>
          <SelectInput
            label="Launcher Animation"
            value={style.launcherAnimation}
            options={launcherAnimations}
            onChange={(value) => updateStyle("launcherAnimation", value as ChatStyle["launcherAnimation"])}
          />
          <SelectInput
            label="Chat Open Animation"
            value={style.chatOpenAnimation}
            options={chatOpenAnimations}
            onChange={(value) => updateStyle("chatOpenAnimation", value as ChatStyle["chatOpenAnimation"])}
          />
          <SelectInput
            label="Message Animation"
            value={style.messageAnimation}
            options={messageAnimations}
            onChange={(value) => updateStyle("messageAnimation", value as ChatStyle["messageAnimation"])}
          />
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Typing Indicator</Label>
            <Switch checked={style.typingIndicatorEnabled} onCheckedChange={(checked) => updateStyle("typingIndicatorEnabled", checked)} />
          </div>
          <SelectInput
            label="Typing Indicator Style"
            value={style.typingIndicatorStyle}
            options={typingIndicatorStyles}
            onChange={(value) => updateStyle("typingIndicatorStyle", value as ChatStyle["typingIndicatorStyle"])}
          />
        </PropertySection>

        <PropertySection
          title="Launcher"
          icon={Rocket}
          sectionKey="launcher"
          isCollapsed={collapsedSections.launcher}
          onToggle={onToggleSection}
        >
          <SelectInput
            label="Launcher Type"
            value={style.launcherType}
            options={launcherTypes}
            onChange={(value) => updateStyle("launcherType", value as ChatStyle["launcherType"])}
          />
          <NumericInput
            label="Size"
            value={style.launcherSize}
            onChange={(value) => updateStyle("launcherSize", value)}
            min={40}
            max={80}
            unit="px"
          />
          <ColorInput
            label="Background Color"
            value={style.launcherBackgroundColor}
            onChange={(value) => updateStyle("launcherBackgroundColor", value)}
          />
          <ColorInput
            label="Icon Color"
            value={style.launcherIconColor}
            onChange={(value) => updateStyle("launcherIconColor", value)}
          />
          <TextInput
            label="Launcher Text"
            value={style.launcherText}
            onChange={(value) => updateStyle("launcherText", value)}
            placeholder="Chat"
          />
          <ColorInput
            label="Text Color"
            value={style.launcherTextColor}
            onChange={(value) => updateStyle("launcherTextColor", value)}
          />
          <NumericInput
            label="Offset X"
            value={style.launcherOffsetX}
            onChange={(value) => updateStyle("launcherOffsetX", value)}
            min={0}
            max={100}
            unit="px"
          />
          <NumericInput
            label="Offset Y"
            value={style.launcherOffsetY}
            onChange={(value) => updateStyle("launcherOffsetY", value)}
            min={0}
            max={100}
            unit="px"
          />
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Shadow</Label>
            <Switch checked={style.launcherShadow} onCheckedChange={(checked) => updateStyle("launcherShadow", checked)} />
          </div>
        </PropertySection>

        <PropertySection
          title="Footer"
          icon={Footprints}
          sectionKey="footer"
          isCollapsed={collapsedSections.footer}
          onToggle={onToggleSection}
        >
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Enable Footer</Label>
            <Switch checked={style.footerEnabled} onCheckedChange={(checked) => updateStyle("footerEnabled", checked)} />
          </div>
          <TextInput
            label="Footer Text"
            value={style.footerText}
            onChange={(value) => updateStyle("footerText", value)}
            placeholder="Powered by Uchat"
          />
          <ColorInput
            label="Footer Text Color"
            value={style.footerTextColor}
            onChange={(value) => updateStyle("footerTextColor", value)}
          />
          <TextInput
            label="Footer Link URL"
            value={style.footerLinkUrl}
            onChange={(value) => updateStyle("footerLinkUrl", value)}
            placeholder="https://example.com"
          />
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Show Powered By</Label>
            <Switch checked={style.showPoweredBy} onCheckedChange={(checked) => updateStyle("showPoweredBy", checked)} />
          </div>
        </PropertySection>

        <PropertySection
          title="Branding"
          icon={Tags}
          sectionKey="branding"
          isCollapsed={collapsedSections.branding}
          onToggle={onToggleSection}
        >
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Show Avatar</Label>
            <Switch checked={style.showAvatar} onCheckedChange={(checked) => updateStyle("showAvatar", checked)} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Show Logo</Label>
            <Switch checked={style.showLogo} onCheckedChange={(checked) => updateStyle("showLogo", checked)} />
          </div>
          <TextInput
            label="Avatar URL"
            value={style.avatarUrl}
            onChange={(value) => updateStyle("avatarUrl", value)}
            placeholder="https://..."
          />
          <TextInput
            label="Logo URL"
            value={style.logoUrl}
            onChange={(value) => updateStyle("logoUrl", value)}
            placeholder="https://..."
          />
          <TextInput
            label="Launcher Icon URL"
            value={style.launcherIconUrl}
            onChange={(value) => updateStyle("launcherIconUrl", value)}
            placeholder="https://..."
          />
          <TextInput
            label="Welcome Avatar URL"
            value={style.welcomeAvatarUrl}
            onChange={(value) => updateStyle("welcomeAvatarUrl", value)}
            placeholder="https://..."
          />
        </PropertySection>
      </div>
    </div>
  )
})
