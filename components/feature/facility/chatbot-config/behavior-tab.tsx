"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import type {
  ChatbotBehaviorSettingResponseDtoResponseTone,
  ChatbotBehaviorSettingResponseDtoResponseStyle,
} from "@/lib/api/generated/model"

interface BehaviorForm {
  system_prompt: string
  support_scope: string
  response_tone: ChatbotBehaviorSettingResponseDtoResponseTone
  response_style: ChatbotBehaviorSettingResponseDtoResponseStyle
  fallback_message: string
  out_of_scope_message: string
  enable_human_handoff: boolean
  handoff_trigger_message: string
  temperature: number
  max_response_length: number
}

interface BehaviorTabProps {
  form: BehaviorForm
  onChange: (form: BehaviorForm) => void
}

const RESPONSE_TONES = [
  { value: "friendly", label: "Thân thiện", icon: "😊" },
  { value: "professional", label: "Chuyên nghiệp", icon: "💼" },
  { value: "formal", label: "Trang trọng", icon: "🎩" },
  { value: "concise", label: "Ngắn gọn", icon: "⚡" },
] as const

const RESPONSE_STYLES = [
  { value: "short_answer", label: "Trả lời ngắn gọn" },
  { value: "detailed_answer", label: "Trả lời chi tiết" },
  { value: "step_by_step", label: "Trả lời từng bước" },
  { value: "faq_style", label: "Phong cách FAQ" },
] as const

export function BehaviorTab({ form, onChange }: BehaviorTabProps) {
  const update = <K extends keyof BehaviorForm>(
    key: K,
    value: BehaviorForm[K]
  ) => {
    onChange({ ...form, [key]: value })
  }

  return (
    <div className="space-y-4">
      {/* System Prompt */}
      <div className="rounded-none border p-4 space-y-3">
        <div>
          <h3 className="text-sm font-semibold">Hướng dẫn hệ thống</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Hướng dẫn cho AI cách phản hồi và cư xử với người dùng
          </p>
        </div>
        <Textarea
          placeholder="Bạn là trợ lý AI hỗ trợ khách hàng về dịch vụ y tế. Bạn sẽ tư vấn và hướng dẫn người dùng đặt lịch hẹn..."
          value={form.system_prompt}
          onChange={(e) => update("system_prompt", e.target.value)}
          rows={5}
          className="rounded-none"
        />
      </div>

      {/* Support Scope */}
      <div className="rounded-none border p-4 space-y-3">
        <div>
          <h3 className="text-sm font-semibold">Phạm vi hỗ trợ</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Chatbot hỗ trợ những lĩnh vực gì
          </p>
        </div>
        <Textarea
          placeholder="Đặt lịch hẹn, tư vấn sức khỏe, giải đáp thắc mắc về y tế..."
          value={form.support_scope}
          onChange={(e) => update("support_scope", e.target.value)}
          rows={3}
          className="rounded-none"
        />
      </div>

      {/* Tone & Style */}
      <div className="rounded-none border p-4 space-y-5">
        <div>
          <h3 className="text-sm font-semibold">Giọng điệu & Phong cách</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Chọn giọng điệu và phong cách phản hồi của chatbot
          </p>
        </div>

        {/* Tone */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Giọng điệu
          </Label>
          <div className="grid grid-cols-4 gap-3">
            {RESPONSE_TONES.map((tone) => (
              <button
                key={tone.value}
                onClick={() =>
                  update(
                    "response_tone",
                    tone.value as ChatbotBehaviorSettingResponseDtoResponseTone
                  )
                }
                className={cn(
                  "flex flex-col items-center gap-2 rounded-none border p-3 transition-all",
                  form.response_tone === tone.value
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <span className="text-2xl">{tone.icon}</span>
                <span className="text-xs font-medium">{tone.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Style */}
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Phong cách trả lời
          </Label>
          <div className="space-y-2">
            {RESPONSE_STYLES.map((style) => (
              <label
                key={style.value}
                className={cn(
                  "flex items-center gap-3 rounded-none border p-3 transition-all cursor-pointer",
                  form.response_style === style.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <input
                  type="radio"
                  name="response_style"
                  value={style.value}
                  checked={form.response_style === style.value}
                  onChange={(e) =>
                    update(
                      "response_style",
                      e.target.value as ChatbotBehaviorSettingResponseDtoResponseStyle
                    )
                  }
                  className="h-4 w-4 border-primary text-primary focus:ring-primary"
                />
                <span className="text-sm">{style.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Fallback Messages */}
      <div className="rounded-none border p-4 space-y-3">
        <div>
          <h3 className="text-sm font-semibold">Tin nhắn dự phòng</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Cấu hình tin nhắn khi chatbot không hiểu hoặc ngoài phạm vi
          </p>
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Khi không hiểu
          </Label>
          <Input
            placeholder="Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn..."
            value={form.fallback_message}
            onChange={(e) => update("fallback_message", e.target.value)}
            className="rounded-none"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Ngoài phạm vi
          </Label>
          <Input
            placeholder="Hiện tại tôi chỉ hỗ trợ về lĩnh vực y tế..."
            value={form.out_of_scope_message}
            onChange={(e) => update("out_of_scope_message", e.target.value)}
            className="rounded-none"
          />
        </div>
      </div>

      {/* Human Handoff */}
      <div className="rounded-none border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Chuyển cho nhân viên</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Cho phép chatbot chuyển cuộc trò chuyện cho nhân viên khi cần
            </p>
          </div>
          <Switch
            checked={form.enable_human_handoff}
            onCheckedChange={(v) => update("enable_human_handoff", v)}
          />
        </div>

        {form.enable_human_handoff && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Tin nhắn kích hoạt chuyển
            </Label>
            <Input
              placeholder="gặp nhân viên, chuyển cho nhân viên..."
              value={form.handoff_trigger_message}
              onChange={(e) =>
                update("handoff_trigger_message", e.target.value)
              }
              className="rounded-none"
            />
            <p className="text-xs text-muted-foreground">
              Khi người dùng nhắn tin này, chatbot sẽ chuyển cho nhân viên
            </p>
          </div>
        )}
      </div>

      {/* Advanced */}
      <div className="rounded-none border p-4 space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Cài đặt nâng cao</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Điều chỉnh các tham số nâng cao cho chatbot
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Temperature
            </Label>
            <span className="text-sm font-medium">{form.temperature.toFixed(1)}</span>
          </div>
          <Slider
            value={[form.temperature]}
            onValueChange={(v) => update("temperature", v[0])}
            min={0}
            max={1}
            step={0.1}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            Thấp = tập trung | Cao = sáng tạo
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Độ dài phản hồi tối đa
            </Label>
            <span className="text-sm font-medium">{form.max_response_length} ký tự</span>
          </div>
          <Slider
            value={[form.max_response_length]}
            onValueChange={(v) => update("max_response_length", v[0])}
            min={200}
            max={3000}
            step={100}
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
