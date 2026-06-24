"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Palette, Settings, Type, Copy, RotateCcw, Download, Loader2Icon } from "lucide-react"
import { chatWindowPositions } from "./chat-constants"
import {
  PropertySection,
  NumericInput,
  ColorInput,
  TextInput,
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
  return (
    <div className="w-80 bg-card border-l border-border flex flex-col">
      <div className="p-4 border-b border-border">
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
          onToggle={onToggleSection}
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
          onToggle={onToggleSection}
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
          onToggle={onToggleSection}
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
        </PropertySection>

        <PropertySection
          title="Typography"
          icon={Type}
          sectionKey="typography"
          badge="Text"
          isCollapsed={collapsedSections.typography}
          onToggle={onToggleSection}
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
          onToggle={onToggleSection}
        >
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground">Enable Animations</Label>
            <Switch checked={style.animationEnabled} onCheckedChange={(checked) => updateStyle("animationEnabled", checked)} />
          </div>
        </PropertySection>
      </div>
    </div>
  )
})
