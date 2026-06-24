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
