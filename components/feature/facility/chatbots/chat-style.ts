"use client"

import type {
  ChatbotUiSettingResponseDto,
  UpdateChatbotUiSettingDto,
} from "@/lib/api/generated/model"

export type HeaderLayout = "simple" | "avatar_title" | "centered" | "compact"
export type SendButtonType = "icon" | "text" | "icon_text"
export type LauncherAnimation = "none" | "pulse" | "bounce"
export type ChatOpenAnimation = "none" | "fade" | "slide_up" | "scale"
export type MessageAnimation = "none" | "fade" | "slide"
export type TypingIndicatorStyle = "dots" | "text"
export type LauncherType = "circle" | "rounded_square" | "pill"
export type ChatWindowPosition = "bottom_right" | "bottom_left" | "top_right" | "top_left"

export interface ChatStyle {
  primaryColor: string
  backgroundColor: string
  headerBackgroundColor: string
  headerTextColor: string
  headerTitle: string
  headerSubtitle: string
  headerHeight: number
  headerShowStatus: boolean
  headerLayout: HeaderLayout
  headerStatusColor: string
  headerStatusText: string
  headerShowCloseButton: boolean
  botMessageBackgroundColor: string
  botMessageTextColor: string
  userMessageBackgroundColor: string
  userMessageTextColor: string
  chatWindowBorderColor: string
  chatWindowBorderWidth: number
  chatWindowWidth: number
  chatWindowHeight: number
  chatWindowShadow: boolean
  chatWindowPosition: ChatWindowPosition
  chatWindowZIndex: number
  mobileFullscreenEnabled: boolean
  borderRadius: number
  messageBubbleRadius: number
  messageAreaBackgroundColor: string
  messageAreaPadding: number
  messageSpacing: number
  showMessageTimestamp: boolean
  messageMaxWidthPercent: number
  baseFontSize: number
  fontFamily: string
  headerTitleFontSize: number
  headerSubtitleFontSize: number
  messageFontSize: number
  inputFontSize: number
  inputBackgroundColor: string
  inputBorderRadius: number
  inputTextColor: string
  inputPlaceholderColor: string
  inputBorderColor: string
  placeholderText: string
  sendButtonType: SendButtonType
  sendButtonBackgroundColor: string
  sendButtonIconColor: string
  sendButtonText: string
  welcomeMessage: string
  welcomeScreenEnabled: boolean
  welcomeTitle: string
  welcomeSubtitle: string
  welcomeBackgroundColor: string
  welcomeAvatarUrl: string
  showAvatar: boolean
  showLogo: boolean
  avatarUrl: string
  logoUrl: string
  launcherIconUrl: string
  animationEnabled: boolean
  launcherAnimation: LauncherAnimation
  chatOpenAnimation: ChatOpenAnimation
  messageAnimation: MessageAnimation
  typingIndicatorEnabled: boolean
  typingIndicatorStyle: TypingIndicatorStyle
  launcherType: LauncherType
  launcherSize: number
  launcherBackgroundColor: string
  launcherIconColor: string
  launcherText: string
  launcherTextColor: string
  launcherShadow: boolean
  launcherOffsetX: number
  launcherOffsetY: number
  footerEnabled: boolean
  footerText: string
  footerTextColor: string
  footerLinkUrl: string
  showPoweredBy: boolean
}

// Minimal fallback values only used when the backend returns an unexpected missing value.
// The backend is the single source of truth and provides defaults for every field.
const FALLBACK_PRIMARY_COLOR = "#4f46e5"
const FALLBACK_BACKGROUND_COLOR = "#ffffff"
const FALLBACK_TEXT_COLOR = "#111827"
const FALLBACK_MUTED_TEXT = "#6b7280"
const FALLBACK_BORDER_COLOR = "#e5e7eb"

function withFallback(value: string | null | undefined, fallback: string): string {
  if (typeof value === "string" && value.trim().length > 0) return value
  return fallback
}

function withFallbackNumber(value: number | null | undefined, fallback: number): number {
  return typeof value === "number" ? value : fallback
}

export function apiToStyle(api: ChatbotUiSettingResponseDto): ChatStyle {
  const chatWindow = api.chat_window
  const header = api.header
  const message = api.message
  const typography = api.typography
  const input = api.input
  const animation = api.animation
  const welcome = api.welcome
  const launcher = api.launcher
  const footer = api.footer

  return {
    primaryColor: withFallback(api.primary_color, FALLBACK_PRIMARY_COLOR),
    backgroundColor: withFallback(api.background_color, FALLBACK_BACKGROUND_COLOR),
    headerBackgroundColor: withFallback(api.header_background_color, FALLBACK_BACKGROUND_COLOR),
    headerTextColor: withFallback(api.header_text_color, FALLBACK_TEXT_COLOR),
    headerTitle: api.header_title ?? header.header_title ?? "Chat Support",
    headerSubtitle: api.header_subtitle ?? header.header_subtitle ?? "Đang hoạt động",
    headerHeight: withFallbackNumber(header.header_height, 64),
    headerShowStatus: header.header_show_status ?? true,
    headerLayout: header.header_layout ?? "avatar_title",
    headerStatusColor: withFallback(header.header_status_color, "#22c55e"),
    headerStatusText: withFallback(header.header_status_text, "Đang hoạt động"),
    headerShowCloseButton: header.header_show_close_button ?? true,
    botMessageBackgroundColor: withFallback(api.bot_message_background_color, "#f3f4f6"),
    botMessageTextColor: withFallback(api.bot_message_text_color, FALLBACK_TEXT_COLOR),
    userMessageBackgroundColor: withFallback(api.user_message_background_color, FALLBACK_PRIMARY_COLOR),
    userMessageTextColor: withFallback(api.user_message_text_color, FALLBACK_BACKGROUND_COLOR),
    chatWindowBorderColor: withFallback(chatWindow.chat_window_border_color, FALLBACK_BORDER_COLOR),
    chatWindowBorderWidth: withFallbackNumber(chatWindow.chat_window_border_width, 1),
    chatWindowWidth: withFallbackNumber(chatWindow.chat_window_width, 380),
    chatWindowHeight: withFallbackNumber(chatWindow.chat_window_height, 600),
    chatWindowShadow: chatWindow.chat_window_shadow ?? true,
    chatWindowPosition: chatWindow.chat_window_position ?? "bottom_right",
    chatWindowZIndex: withFallbackNumber(chatWindow.chat_window_z_index, 9999),
    mobileFullscreenEnabled: chatWindow.mobile_fullscreen_enabled ?? false,
    borderRadius: chatWindow.border_radius ?? 16,
    messageBubbleRadius: withFallbackNumber(api.message_bubble_radius, 16),
    messageAreaBackgroundColor: withFallback(message.message_area_background_color, api.background_color),
    messageAreaPadding: withFallbackNumber(message.message_area_padding, 16),
    messageSpacing: withFallbackNumber(message.message_spacing, 12),
    showMessageTimestamp: message.show_message_timestamp ?? false,
    messageMaxWidthPercent: withFallbackNumber(message.message_max_width_percent, 80),
    baseFontSize: withFallbackNumber(typography.base_font_size, 14),
    fontFamily: withFallback(typography.font_family, "Inter, sans-serif"),
    headerTitleFontSize: withFallbackNumber(typography.header_title_font_size, 16),
    headerSubtitleFontSize: withFallbackNumber(typography.header_subtitle_font_size, 12),
    messageFontSize: withFallbackNumber(typography.message_font_size, 14),
    inputFontSize: withFallbackNumber(typography.input_font_size, 14),
    inputBackgroundColor: withFallback(input.input_background_color, api.background_color),
    inputBorderRadius: withFallbackNumber(input.input_border_radius, 24),
    inputTextColor: withFallback(input.input_text_color, FALLBACK_TEXT_COLOR),
    inputPlaceholderColor: withFallback(input.input_placeholder_color, FALLBACK_MUTED_TEXT),
    inputBorderColor: withFallback(input.input_border_color, FALLBACK_BORDER_COLOR),
    placeholderText: input.placeholder_text ?? api.placeholder_text ?? "Nhập tin nhắn của bạn...",
    sendButtonType: input.send_button_type ?? "icon",
    sendButtonBackgroundColor: withFallback(input.send_button_background_color, FALLBACK_PRIMARY_COLOR),
    sendButtonIconColor: withFallback(input.send_button_icon_color, FALLBACK_BACKGROUND_COLOR),
    sendButtonText: input.send_button_text ?? "Gửi",
    welcomeMessage: welcome.welcome_message ?? api.welcome_message ?? "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
    welcomeScreenEnabled: welcome.welcome_screen_enabled ?? false,
    welcomeTitle: withFallback(welcome.welcome_title, api.header_title ?? header.header_title ?? "Chat Support"),
    welcomeSubtitle: withFallback(welcome.welcome_subtitle, api.header_subtitle ?? header.header_subtitle ?? ""),
    welcomeBackgroundColor: withFallback(welcome.welcome_background_color, api.background_color),
    welcomeAvatarUrl: withFallback(welcome.welcome_avatar_url, api.avatar_url ?? ""),
    showAvatar: api.show_avatar ?? true,
    showLogo: api.show_logo ?? false,
    avatarUrl: api.avatar_url ?? "",
    logoUrl: api.logo_url ?? "",
    launcherIconUrl: api.launcher_icon_url ?? launcher.launcher_icon_url ?? "",
    animationEnabled: animation.animation_enabled ?? true,
    launcherAnimation: animation.launcher_animation ?? "pulse",
    chatOpenAnimation: animation.chat_open_animation ?? "fade",
    messageAnimation: animation.message_animation ?? "fade",
    typingIndicatorEnabled: animation.typing_indicator_enabled ?? true,
    typingIndicatorStyle: animation.typing_indicator_style ?? "dots",
    launcherType: launcher.launcher_type ?? "circle",
    launcherSize: withFallbackNumber(launcher.launcher_size, 56),
    launcherBackgroundColor: withFallback(launcher.launcher_background_color, FALLBACK_PRIMARY_COLOR),
    launcherIconColor: withFallback(launcher.launcher_icon_color, FALLBACK_BACKGROUND_COLOR),
    launcherText: launcher.launcher_text ?? "Chat",
    launcherTextColor: withFallback(launcher.launcher_text_color, FALLBACK_BACKGROUND_COLOR),
    launcherShadow: launcher.launcher_shadow ?? true,
    launcherOffsetX: withFallbackNumber(launcher.launcher_offset_x, 20),
    launcherOffsetY: withFallbackNumber(launcher.launcher_offset_y, 20),
    footerEnabled: footer.footer_enabled ?? false,
    footerText: footer.footer_text ?? "",
    footerTextColor: withFallback(footer.footer_text_color, FALLBACK_MUTED_TEXT),
    footerLinkUrl: footer.footer_link_url ?? "",
    showPoweredBy: footer.show_powered_by ?? true,
  }
}

export function styleToApiUpdate(
  style: ChatStyle,
  baseApiSetting: ChatbotUiSettingResponseDto
): UpdateChatbotUiSettingDto {
  return {
    primary_color: style.primaryColor as unknown as UpdateChatbotUiSettingDto["primary_color"],
    background_color: style.backgroundColor as unknown as UpdateChatbotUiSettingDto["background_color"],
    avatar_url: style.avatarUrl as unknown as UpdateChatbotUiSettingDto["avatar_url"],
    logo_url: style.logoUrl as unknown as UpdateChatbotUiSettingDto["logo_url"],
    launcher_icon_url: style.launcherIconUrl as unknown as UpdateChatbotUiSettingDto["launcher_icon_url"],
    launcher: {
      ...baseApiSetting.launcher,
      launcher_type: style.launcherType,
      launcher_size: style.launcherSize,
      launcher_background_color: style.launcherBackgroundColor,
      launcher_icon_color: style.launcherIconColor,
      launcher_icon_url: style.launcherIconUrl,
      launcher_text: style.launcherText,
      launcher_text_color: style.launcherTextColor,
      launcher_shadow: style.launcherShadow,
      launcher_offset_x: style.launcherOffsetX,
      launcher_offset_y: style.launcherOffsetY,
    } as unknown as UpdateChatbotUiSettingDto["launcher"],
    chat_window: {
      ...baseApiSetting.chat_window,
      chat_window_position: style.chatWindowPosition,
      chat_window_width: style.chatWindowWidth,
      chat_window_height: style.chatWindowHeight,
      chat_window_shadow: style.chatWindowShadow,
      chat_window_border_color: style.chatWindowBorderColor,
      chat_window_border_width: style.chatWindowBorderWidth,
      chat_window_z_index: style.chatWindowZIndex,
      mobile_fullscreen_enabled: style.mobileFullscreenEnabled,
      border_radius: style.borderRadius,
    } as unknown as UpdateChatbotUiSettingDto["chat_window"],
    header: {
      ...baseApiSetting.header,
      header_layout: style.headerLayout,
      header_height: style.headerHeight,
      header_background_color: style.headerBackgroundColor,
      header_text_color: style.headerTextColor,
      header_title: style.headerTitle,
      header_subtitle: style.headerSubtitle,
      header_show_status: style.headerShowStatus,
      header_status_color: style.headerStatusColor,
      header_status_text: style.headerStatusText,
      header_show_close_button: style.headerShowCloseButton,
    } as unknown as UpdateChatbotUiSettingDto["header"],
    message: {
      ...baseApiSetting.message,
      message_area_background_color: style.messageAreaBackgroundColor,
      message_area_padding: style.messageAreaPadding,
      message_spacing: style.messageSpacing,
      show_message_timestamp: style.showMessageTimestamp,
      bot_message_background_color: style.botMessageBackgroundColor,
      bot_message_text_color: style.botMessageTextColor,
      user_message_background_color: style.userMessageBackgroundColor,
      user_message_text_color: style.userMessageTextColor,
      message_bubble_radius: style.messageBubbleRadius,
      message_max_width_percent: style.messageMaxWidthPercent,
    } as unknown as UpdateChatbotUiSettingDto["message"],
    typography: {
      ...baseApiSetting.typography,
      font_family: style.fontFamily,
      base_font_size: style.baseFontSize,
      header_title_font_size: style.headerTitleFontSize,
      header_subtitle_font_size: style.headerSubtitleFontSize,
      message_font_size: style.messageFontSize,
      input_font_size: style.inputFontSize,
    } as unknown as UpdateChatbotUiSettingDto["typography"],
    input: {
      ...baseApiSetting.input,
      placeholder_text: style.placeholderText,
      input_background_color: style.inputBackgroundColor,
      input_border_radius: style.inputBorderRadius,
      input_text_color: style.inputTextColor,
      input_placeholder_color: style.inputPlaceholderColor,
      input_border_color: style.inputBorderColor,
      send_button_type: style.sendButtonType,
      send_button_background_color: style.sendButtonBackgroundColor,
      send_button_icon_color: style.sendButtonIconColor,
      send_button_text: style.sendButtonText,
    } as unknown as UpdateChatbotUiSettingDto["input"],
    welcome: {
      ...baseApiSetting.welcome,
      welcome_screen_enabled: style.welcomeScreenEnabled,
      welcome_title: style.welcomeTitle,
      welcome_subtitle: style.welcomeSubtitle,
      welcome_message: style.welcomeMessage,
      welcome_avatar_url: style.welcomeAvatarUrl,
      welcome_background_color: style.welcomeBackgroundColor,
    } as unknown as UpdateChatbotUiSettingDto["welcome"],
    animation: {
      ...baseApiSetting.animation,
      animation_enabled: style.animationEnabled,
      launcher_animation: style.launcherAnimation,
      chat_open_animation: style.chatOpenAnimation,
      message_animation: style.messageAnimation,
      typing_indicator_enabled: style.typingIndicatorEnabled,
      typing_indicator_style: style.typingIndicatorStyle,
    } as unknown as UpdateChatbotUiSettingDto["animation"],
    footer: {
      ...baseApiSetting.footer,
      footer_enabled: style.footerEnabled,
      footer_text: style.footerText,
      footer_text_color: style.footerTextColor,
      footer_link_url: style.footerLinkUrl,
      show_powered_by: style.showPoweredBy,
    } as unknown as UpdateChatbotUiSettingDto["footer"],
  }
}
