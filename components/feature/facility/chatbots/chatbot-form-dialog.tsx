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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2Icon } from "lucide-react"
import type { ChatbotResponseDto } from "@/features/facility/chatbots"

const schema = z.object({
  name: z.string().min(1, "Vui l\u00f2ng nh\u1eadp t\u00ean"),
  display_name: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(["active", "inactive", "draft"]),
})

export type ChatbotFormValues = z.infer<typeof schema>

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingChatbot: ChatbotResponseDto | null
  isSubmitting: boolean
  onSubmit: (values: ChatbotFormValues) => Promise<void>
}

export function ChatbotFormDialog({ open, onOpenChange, editingChatbot, isSubmitting, onSubmit }: Props) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<ChatbotFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", display_name: "", description: "", status: "draft" },
  })

  React.useEffect(() => {
    if (open) {
      if (editingChatbot) {
        reset({
          name: editingChatbot.name,
          display_name: editingChatbot.display_name || "",
          description: editingChatbot.description || "",
          status: editingChatbot.status,
        })
      } else {
        reset({ name: "", display_name: "", description: "", status: "draft" })
      }
    }
  }, [open, editingChatbot, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingChatbot ? "S\u1eeda chatbot" : "Th\u00eam chatbot"}</DialogTitle>
          <DialogDescription>
            {editingChatbot ? "C\u1eadp nh\u1eadt th\u00f4ng tin chatbot." : "T\u1ea1o chatbot m\u1edbi trong khoa."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(async (v) => await onSubmit(v))} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">T\u00ean chatbot</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="display_name">T\u00ean hi\u1ec3n th\u1ecb</Label>
            <Input id="display_name" {...register("display_name")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">M\u00f4 t\u1ea3</Label>
            <Input id="description" {...register("description")} />
          </div>
          <div className="space-y-1.5">
            <Label>Tr\u1ea1ng th\u00e1i</Label>
            <Select value={watch("status")} onValueChange={(v) => setValue("status", v as ChatbotFormValues["status"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ho\u1ea1t \u0111\u1ed9ng</SelectItem>
                <SelectItem value="inactive">Ng\u1eebng</SelectItem>
                <SelectItem value="draft">B\u1ea3n nh\u00e1p</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hu\u1ef7</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2Icon className="mr-1 h-4 w-4 animate-spin" />}
              {editingChatbot ? "L\u01b0u" : "T\u1ea1o"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
