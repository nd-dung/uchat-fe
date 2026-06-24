import { Monitor, Tablet, Smartphone, type LucideIcon } from "lucide-react"

export const deviceSizes = {
  desktop: { width: "100%", maxWidth: "420px", label: "Desktop", icon: Monitor },
  tablet: { width: "100%", maxWidth: "340px", label: "Tablet", icon: Tablet },
  mobile: { width: "100%", maxWidth: "300px", label: "Mobile", icon: Smartphone },
}

export const chatWindowPositions = [
  { value: "bottom_right", label: "Bottom Right" },
  { value: "bottom_left", label: "Bottom Left" },
  { value: "top_right", label: "Top Right" },
  { value: "top_left", label: "Top Left" },
]

export const headerLayouts = [
  { value: "simple", label: "Simple" },
  { value: "avatar_title", label: "Avatar + Title" },
  { value: "centered", label: "Centered" },
  { value: "compact", label: "Compact" },
]

export const sendButtonTypes = [
  { value: "icon", label: "Icon" },
  { value: "text", label: "Text" },
  { value: "icon_text", label: "Icon + Text" },
]

export const launcherAnimations = [
  { value: "none", label: "None" },
  { value: "pulse", label: "Pulse" },
  { value: "bounce", label: "Bounce" },
]

export const chatOpenAnimations = [
  { value: "none", label: "None" },
  { value: "fade", label: "Fade" },
  { value: "slide_up", label: "Slide Up" },
  { value: "scale", label: "Scale" },
]

export const messageAnimations = [
  { value: "none", label: "None" },
  { value: "fade", label: "Fade" },
  { value: "slide", label: "Slide" },
]

export const typingIndicatorStyles = [
  { value: "dots", label: "Dots" },
  { value: "text", label: "Text" },
]

export const launcherTypes = [
  { value: "circle", label: "Circle" },
  { value: "rounded_square", label: "Rounded Square" },
  { value: "pill", label: "Pill" },
]

export const sampleMessages = [
  { type: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?" },
  { type: "user", text: "Tôi muốn tìm hiểu về sản phẩm của bạn" },
  { type: "bot", text: "Tuyệt vời! Chúng tôi có nhiều sản phẩm tuyệt vời. Bạn quan tâm đến loại sản phẩm nào cụ thể?" },
  { type: "user", text: "Tôi đang tìm kiếm giải pháp cho doanh nghiệp nhỏ" },
  {
    type: "bot",
    text: "Chúng tôi có gói doanh nghiệp phù hợp với nhu cầu của bạn. Tôi có thể gửi thông tin chi tiết không?",
  },
]

export type DeviceKey = keyof typeof deviceSizes
