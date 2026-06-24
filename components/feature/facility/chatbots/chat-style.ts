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

const DEFAULT_MUTED_GRAY = "#9ca3af"
const DEFAULT_STATUS_GREEN = "#22c55e"

export const defaultStyle: ChatStyle = {
  primaryColor: "#4f46e5",
  backgroundColor: "#ffffff",
  headerBackgroundColor: "#ffffff",
  headerTextColor: "#111827",
  headerTitle: "Chat Support",
  headerSubtitle: "Đang hoạt động",
  headerHeight: 72,
  headerShowStatus: true,
  botMessageBackgroundColor: "#f3f4f6",
  botMessageTextColor: "#111827",
  userMessageBackgroundColor: "#4f46e5",
  userMessageTextColor: "#ffffff",
  chatWindowBorderColor: "#e5e7eb",
  chatWindowBorderWidth: 1,
  chatWindowWidth: 400,
  chatWindowHeight: 600,
  chatWindowShadow: false,
  chatWindowPosition: "bottom_right",
  borderRadius: 12,
  messageBubbleRadius: 12,
  messageAreaBackgroundColor: "#f9fafb",
  messageAreaPadding: 16,
  messageSpacing: 16,
  showMessageTimestamp: false,
  baseFontSize: 14,
  inputBackgroundColor: "#ffffff",
  inputBorderRadius: 12,
  placeholderText: "Nhập tin nhắn của bạn...",
  welcomeMessage: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
  showAvatar: true,
  showLogo: false,
  animationEnabled: true,
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
    primaryColor: api.primary_color ?? defaultStyle.primaryColor,
    backgroundColor: api.background_color ?? defaultStyle.backgroundColor,
    headerBackgroundColor: api.header_background_color ?? defaultStyle.headerBackgroundColor,
    headerTextColor: api.header_text_color ?? defaultStyle.headerTextColor,
    headerTitle: api.header_title ?? header?.header_title ?? defaultStyle.headerTitle,
    headerSubtitle: api.header_subtitle ?? header?.header_subtitle ?? defaultStyle.headerSubtitle,
    headerHeight: header?.header_height ?? defaultStyle.headerHeight,
    headerShowStatus: header?.header_show_status ?? defaultStyle.headerShowStatus,
    botMessageBackgroundColor: api.bot_message_background_color ?? defaultStyle.botMessageBackgroundColor,
    botMessageTextColor: api.bot_message_text_color ?? defaultStyle.botMessageTextColor,
    userMessageBackgroundColor: api.user_message_background_color ?? defaultStyle.userMessageBackgroundColor,
    userMessageTextColor: api.user_message_text_color ?? defaultStyle.userMessageTextColor,
    chatWindowBorderColor: chatWindow?.chat_window_border_color ?? defaultStyle.chatWindowBorderColor,
    chatWindowBorderWidth: chatWindow?.chat_window_border_width ?? defaultStyle.chatWindowBorderWidth,
    chatWindowWidth: chatWindow?.chat_window_width ?? api.chat_window_width ?? defaultStyle.chatWindowWidth,
    chatWindowHeight: chatWindow?.chat_window_height ?? api.chat_window_height ?? defaultStyle.chatWindowHeight,
    chatWindowShadow: chatWindow?.chat_window_shadow ?? defaultStyle.chatWindowShadow,
    chatWindowPosition: chatWindow?.chat_window_position ?? api.chat_window_position ?? defaultStyle.chatWindowPosition,
    borderRadius: chatWindow?.border_radius ?? api.border_radius ?? defaultStyle.borderRadius,
    messageBubbleRadius: api.message_bubble_radius ?? defaultStyle.messageBubbleRadius,
    messageAreaBackgroundColor: message?.message_area_background_color ?? api.background_color ?? defaultStyle.messageAreaBackgroundColor,
    messageAreaPadding: message?.message_area_padding ?? defaultStyle.messageAreaPadding,
    messageSpacing: message?.message_spacing ?? defaultStyle.messageSpacing,
    showMessageTimestamp: message?.show_message_timestamp ?? defaultStyle.showMessageTimestamp,
    baseFontSize: typography?.base_font_size ?? defaultStyle.baseFontSize,
    inputBackgroundColor: input?.input_background_color ?? api.background_color ?? defaultStyle.inputBackgroundColor,
    inputBorderRadius: input?.input_border_radius ?? defaultStyle.inputBorderRadius,
    placeholderText: input?.placeholder_text ?? api.placeholder_text ?? defaultStyle.placeholderText,
    welcomeMessage: welcome?.welcome_message ?? api.welcome_message ?? defaultStyle.welcomeMessage,
    showAvatar: api.show_avatar ?? defaultStyle.showAvatar,
    showLogo: api.show_logo ?? defaultStyle.showLogo,
    animationEnabled: animation?.animation_enabled ?? defaultStyle.animationEnabled,
  }
}

export function styleToApiUpdate(style: ChatStyle): UpdateChatbotUiSettingDto {
  return {
    primary_color: style.primaryColor as unknown as UpdateChatbotUiSettingDto["primary_color"],
    background_color: style.backgroundColor as unknown as UpdateChatbotUiSettingDto["background_color"],
    chat_window: {
      chat_window_position: style.chatWindowPosition,
      chat_window_width: style.chatWindowWidth,
      chat_window_height: style.chatWindowHeight,
      chat_window_shadow: style.chatWindowShadow,
      chat_window_border_color: style.chatWindowBorderColor,
      chat_window_border_width: style.chatWindowBorderWidth,
      chat_window_z_index: 1000,
      mobile_fullscreen_enabled: false,
      border_radius: style.borderRadius,
    } as unknown as UpdateChatbotUiSettingDto["chat_window"],
    header: {
      header_layout: "standard",
      header_height: style.headerHeight,
      header_background_color: style.headerBackgroundColor,
      header_text_color: style.headerTextColor,
      header_title: style.headerTitle,
      header_subtitle: style.headerSubtitle,
      header_show_status: style.headerShowStatus,
      header_status_text: "Đang hoạt động",
      header_status_color: DEFAULT_STATUS_GREEN,
      header_show_close_button: true,
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
      message_max_width_percent: 85,
    } as unknown as UpdateChatbotUiSettingDto["message"],
    typography: {
      font_family: "Inter",
      base_font_size: style.baseFontSize,
      header_title_font_size: style.baseFontSize + 2,
      header_subtitle_font_size: style.baseFontSize - 2,
      message_font_size: style.baseFontSize,
      input_font_size: style.baseFontSize,
    } as unknown as UpdateChatbotUiSettingDto["typography"],
    input: {
      placeholder_text: style.placeholderText,
      input_background_color: style.inputBackgroundColor,
      input_text_color: style.headerTextColor,
      input_placeholder_color: DEFAULT_MUTED_GRAY,
      input_border_color: style.chatWindowBorderColor,
      input_border_radius: style.inputBorderRadius,
      send_button_type: "icon",
      send_button_background_color: style.primaryColor,
      send_button_icon_color: "#ffffff",
      send_button_text: "Gửi",
    } as unknown as UpdateChatbotUiSettingDto["input"],
    welcome: {
      welcome_screen_enabled: false,
      welcome_title: style.headerTitle,
      welcome_subtitle: style.headerSubtitle,
      welcome_message: style.welcomeMessage,
      welcome_background_color: style.backgroundColor,
    } as unknown as UpdateChatbotUiSettingDto["welcome"],
    animation: {
      animation_enabled: style.animationEnabled,
      launcher_animation: "none",
      chat_open_animation: "fade",
      message_animation: "slide",
      typing_indicator_enabled: true,
      typing_indicator_style: "dots",
    } as unknown as UpdateChatbotUiSettingDto["animation"],
    footer: {
      footer_enabled: false,
      footer_text: "",
      footer_text_color: DEFAULT_MUTED_GRAY,
      footer_link_color: style.primaryColor,
      show_powered_by: true,
    } as unknown as UpdateChatbotUiSettingDto["footer"],
  }
}
