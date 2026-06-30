import { Monitor, Tablet, Smartphone, type LucideIcon } from "lucide-react"

export const deviceSizes = {
  desktop: { width: "100%", maxWidth: "420px", label: "Máy tính", icon: Monitor },
  tablet: { width: "100%", maxWidth: "340px", label: "Máy tính bảng", icon: Tablet },
  mobile: { width: "100%", maxWidth: "300px", label: "Di động", icon: Smartphone },
}

export const chatWindowPositions = [
  { value: "bottom_right", label: "Góc dưới bên phải" },
  { value: "bottom_left", label: "Góc dưới bên trái" },
  { value: "top_right", label: "Góc trên bên phải" },
  { value: "top_left", label: "Góc trên bên trái" },
]

export const headerLayouts = [
  { value: "simple", label: "Đơn giản" },
  { value: "avatar_title", label: "Avatar + Tiêu đề" },
  { value: "centered", label: "Căn giữa" },
  { value: "compact", label: "Gọn gọn" },
]

export const sendButtonTypes = [
  { value: "icon", label: "Biểu tượng" },
  { value: "text", label: "Văn bản" },
  { value: "icon_text", label: "Biểu tượng + Văn bản" },
]

export const launcherAnimations = [
  { value: "none", label: "Không" },
  { value: "pulse", label: "Nhấp nháy" },
  { value: "bounce", label: "Nảy" },
]

export const chatOpenAnimations = [
  { value: "none", label: "Không" },
  { value: "fade", label: "Mờ dần" },
  { value: "slide_up", label: "Trượt lên" },
  { value: "scale", label: "Phóng to" },
]

export const messageAnimations = [
  { value: "none", label: "Không" },
  { value: "fade", label: "Mờ dần" },
  { value: "slide", label: "Trượt" },
]

export const typingIndicatorStyles = [
  { value: "dots", label: "Chấm" },
  { value: "text", label: "Văn bản" },
]

export const launcherTypes = [
  { value: "circle", label: "Tròn" },
  { value: "rounded_square", label: "Vuông bo tròn" },
  { value: "pill", label: "Viên thuốc" },
]

export const fontFamilyOptions = [
  { value: "var(--font-sans), sans-serif", label: "Geist" },
  { value: "var(--font-inter), sans-serif", label: "Inter" },
  { value: "Times New Roman, serif", label: "Times New Roman" },
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
