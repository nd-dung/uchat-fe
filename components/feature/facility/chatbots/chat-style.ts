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

export const defaultStyle: ChatStyle = {
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

export function apiToStyle(api: ChatbotUiSettingResponseDto): ChatStyle {
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

export function styleToApiUpdate(style: ChatStyle): UpdateChatbotUiSettingDto {
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
