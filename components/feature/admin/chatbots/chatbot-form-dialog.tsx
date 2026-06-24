"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod/v4"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2Icon } from "lucide-react"
import type { ChatbotResponseDto } from "@/features/admin/chatbots"

const schema = z.object({
  name: z.string().min(1, "Vui l\u00f2ng nh\u1eadp t\u00ean"),
  display_name: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
})

export type ChatbotFormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingChatbot: ChatbotResponseDto | null
  isSubmitting: boolean
  onSubmit: (values: ChatbotFormValues) => Promise<void>
}

export function ChatbotFormDialog({
  open,
  onOpenChange,
  editingChatbot,
  isSubmitting,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ChatbotFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      display_name: undefined,
      description: undefined,
      status: "active",
    },
  })

  React.useEffect(() => {
    if (!open) return
    if (editingChatbot) {
      reset({
        name: editingChatbot.name,
        display_name: editingChatbot.display_name || undefined,
        description: editingChatbot.description || undefined,
        status: editingChatbot.status as ChatbotFormValues["status"],
      })
    } else {
      reset({
        name: "",
        display_name: undefined,
        description: undefined,
        status: "active",
      })
    }
  }, [open, editingChatbot, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingChatbot ? "Sửa chatbot" : "Thêm chatbot"}
          </DialogTitle>
          <DialogDescription>
            {editingChatbot
              ? "Cập nhật thông tin chatbot."
              : "Tạo chatbot mới."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(async (values) => {
            await onSubmit(values)
          })}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">Tên</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="display_name">Tên hiển thị</Label>
            <Input id="display_name" {...register("display_name")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Mô tả</Label>
            <Input id="description" {...register("description")} />
          </div>

          <div className="space-y-1.5">
            <Label>Trạng thái</Label>
            <Select
              value={watch("status")}
              onValueChange={(v) =>
                setValue("status", v as ChatbotFormValues["status"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Ngừng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Huỷ
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2Icon className="mr-1 h-4 w-4 animate-spin" />
              )}
              {editingChatbot ? "Lưu" : "Tạo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
