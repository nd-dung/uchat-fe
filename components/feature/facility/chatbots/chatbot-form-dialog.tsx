"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod/v4"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Loader2Icon } from "lucide-react"

const schema = z.object({
  name: z.string().min(1, "Vui l\u00f2ng nh\u1eadp t\u00ean"),
  display_name: z.string().optional(),
  description: z.string().optional(),
})

export type ChatbotFormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  isSubmitting: boolean
  onSubmit: (values: ChatbotFormValues) => Promise<void>
}

export function ChatbotFormDialog({ open, onOpenChange, isSubmitting, onSubmit }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChatbotFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", display_name: "", description: "" },
  })

  React.useEffect(() => {
    if (open) {
      reset({ name: "", display_name: "", description: "" })
    }
  }, [open, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo chatbot</DialogTitle>
          <DialogDescription>Tạo chatbot mới trong khoa để bắt đầu tùy chỉnh giao diện.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(async (v) => await onSubmit(v))} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Tên chatbot</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="display_name">Tên hiển thị</Label>
            <Input id="display_name" {...register("display_name")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Mô tả</Label>
            <Input id="description" {...register("description")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Huỷ</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2Icon className="mr-1 h-4 w-4 animate-spin" />}
              Tạo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
