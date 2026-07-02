"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Paperclip, Send, Smile, UserPlus } from "lucide-react"

interface StaffMessageInputProps {
  disabled?: boolean
  isSubmitting?: boolean
  placeholder?: string
  onSend: (message: string) => void
  onHandoff?: () => void
}

export function StaffMessageInput({
  disabled,
  isSubmitting,
  placeholder = "Nhập tin nhắn...",
  onSend,
  onHandoff,
}: StaffMessageInputProps) {
  const [value, setValue] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled || isSubmitting) return
    onSend(trimmed)
    setValue("")

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`
  }

  return (
    <div className="shrink-0 border-t bg-background p-3">
      <div className="flex items-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0"
          disabled={disabled}
          aria-label="Đính kèm file"
        >
          <Paperclip className="h-4 w-4" />
        </Button>

        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isSubmitting}
            rows={1}
            className="min-h-[40px] max-h-[120px] resize-none py-2.5 pr-10"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-1 right-1 h-7 w-7"
            disabled={disabled}
            aria-label="Chèn emoji"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>

        <Button
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={handleSend}
          disabled={!value.trim() || disabled || isSubmitting}
          aria-label="Gửi tin nhắn"
        >
          <Send className="h-4 w-4" />
        </Button>

        {onHandoff && (
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={onHandoff}
            disabled={disabled || isSubmitting}
            aria-label="Chuyển nhân viên"
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
