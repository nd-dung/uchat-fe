"use client"

import type {
  ChatbotUiSettingResponseDto,
  UpdateChatbotUiSettingDto,
} from "@/lib/api/generated/model"

export interface ChatStyle {
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

export function apiToStyle(api: ChatbotUiSettingResponseDto): ChatStyle {
  const chatWindow = api.chat_window
  const header = api.header
  const message = api.message
  const typography = api.typography
  const input = api.input
  const animation = api.animation
  const welcome = api.welcome

  return {
    primaryColor: withFallback(api.primary_color, FALLBACK_PRIMARY_COLOR),
    backgroundColor: withFallback(api.background_color, FALLBACK_BACKGROUND_COLOR),
    headerBackgroundColor: withFallback(api.header_background_color, FALLBACK_BACKGROUND_COLOR),
    headerTextColor: withFallback(api.header_text_color, FALLBACK_TEXT_COLOR),
    headerTitle: api.header_title ?? header.header_title ?? "Chat Support",
    headerSubtitle: api.header_subtitle ?? header.header_subtitle ?? "Đang hoạt động",
    headerHeight: header.header_height,
    headerShowStatus: header.header_show_status,
    botMessageBackgroundColor: withFallback(api.bot_message_background_color, "#f3f4f6"),
    botMessageTextColor: withFallback(api.bot_message_text_color, FALLBACK_TEXT_COLOR),
    userMessageBackgroundColor: withFallback(api.user_message_background_color, FALLBACK_PRIMARY_COLOR),
    userMessageTextColor: withFallback(api.user_message_text_color, FALLBACK_BACKGROUND_COLOR),
    chatWindowBorderColor: withFallback(chatWindow.chat_window_border_color, FALLBACK_BORDER_COLOR),
    chatWindowBorderWidth: chatWindow.chat_window_border_width,
    chatWindowWidth: chatWindow.chat_window_width,
    chatWindowHeight: chatWindow.chat_window_height,
    chatWindowShadow: chatWindow.chat_window_shadow,
    chatWindowPosition: chatWindow.chat_window_position,
    borderRadius: chatWindow.border_radius,
    messageBubbleRadius: api.message_bubble_radius,
    messageAreaBackgroundColor: withFallback(message.message_area_background_color, api.background_color),
    messageAreaPadding: message.message_area_padding,
    messageSpacing: message.message_spacing,
    showMessageTimestamp: message.show_message_timestamp,
    baseFontSize: typography.base_font_size,
    inputBackgroundColor: withFallback(input.input_background_color, api.background_color),
    inputBorderRadius: input.input_border_radius,
    placeholderText: input.placeholder_text ?? api.placeholder_text ?? "Nhập tin nhắn của bạn...",
    welcomeMessage: welcome.welcome_message ?? api.welcome_message ?? "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
    showAvatar: api.show_avatar,
    showLogo: api.show_logo,
    animationEnabled: animation.animation_enabled,
  }
}

export function styleToApiUpdate(
  style: ChatStyle,
  baseApiSetting: ChatbotUiSettingResponseDto
): UpdateChatbotUiSettingDto {
  return {
    primary_color: style.primaryColor as unknown as UpdateChatbotUiSettingDto["primary_color"],
    background_color: style.backgroundColor as unknown as UpdateChatbotUiSettingDto["background_color"],
    avatar_url: baseApiSetting.avatar_url as unknown as UpdateChatbotUiSettingDto["avatar_url"],
    logo_url: baseApiSetting.logo_url as unknown as UpdateChatbotUiSettingDto["logo_url"],
    launcher_icon_url: baseApiSetting.launcher_icon_url as unknown as UpdateChatbotUiSettingDto["launcher_icon_url"],
    chat_window: {
      ...baseApiSetting.chat_window,
      chat_window_position: style.chatWindowPosition,
      chat_window_width: style.chatWindowWidth,
      chat_window_height: style.chatWindowHeight,
      chat_window_shadow: style.chatWindowShadow,
      chat_window_border_color: style.chatWindowBorderColor,
      chat_window_border_width: style.chatWindowBorderWidth,
      border_radius: style.borderRadius,
    } as unknown as UpdateChatbotUiSettingDto["chat_window"],
    header: {
      ...baseApiSetting.header,
      header_height: style.headerHeight,
      header_background_color: style.headerBackgroundColor,
      header_text_color: style.headerTextColor,
      header_title: style.headerTitle,
      header_subtitle: style.headerSubtitle,
      header_show_status: style.headerShowStatus,
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
    } as unknown as UpdateChatbotUiSettingDto["message"],
    typography: {
      ...baseApiSetting.typography,
      base_font_size: style.baseFontSize,
      header_title_font_size: style.baseFontSize + 2,
      header_subtitle_font_size: Math.max(10, style.baseFontSize - 2),
      message_font_size: style.baseFontSize,
      input_font_size: style.baseFontSize,
    } as unknown as UpdateChatbotUiSettingDto["typography"],
    input: {
      ...baseApiSetting.input,
      placeholder_text: style.placeholderText,
      input_background_color: style.inputBackgroundColor,
      input_border_radius: style.inputBorderRadius,
      input_text_color: style.headerTextColor,
      input_border_color: style.chatWindowBorderColor,
    } as unknown as UpdateChatbotUiSettingDto["input"],
    welcome: {
      ...baseApiSetting.welcome,
      welcome_message: style.welcomeMessage,
      welcome_title: style.headerTitle,
      welcome_subtitle: style.headerSubtitle,
      welcome_background_color: style.backgroundColor,
    } as unknown as UpdateChatbotUiSettingDto["welcome"],
    animation: {
      ...baseApiSetting.animation,
      animation_enabled: style.animationEnabled,
    } as unknown as UpdateChatbotUiSettingDto["animation"],
    footer: baseApiSetting.footer as unknown as UpdateChatbotUiSettingDto["footer"],
  }
}
