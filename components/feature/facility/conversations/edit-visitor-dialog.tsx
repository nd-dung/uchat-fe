"use client"

import * as React from "react"
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
import { useUpdateVisitor } from "@/lib/api/generated/chat-conversations/chat-conversations"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ChatConversationDetailResponseDto } from "@/lib/api/generated/model"

interface EditVisitorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  conversation: ChatConversationDetailResponseDto
  onUpdate: (data: { name?: string; email?: string; phone?: string }) => void
}

export function EditVisitorDialog({
  open,
  onOpenChange,
  conversation,
  onUpdate,
}: EditVisitorDialogProps) {
  const [name, setName] = React.useState(String(conversation.visitor.name || ""))
  const [email, setEmail] = React.useState(String(conversation.visitor.email || ""))
  const [phone, setPhone] = React.useState(String(conversation.visitor.phone || ""))
  const updateVisitor = useUpdateVisitor()
  const queryClient = useQueryClient()

  const handleSave = async () => {
    try {
      await updateVisitor.mutateAsync({
        id: conversation.id,
        data: {
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
        },
      })
      toast.success("Đã cập nhật thông tin khách hàng")
      queryClient.invalidateQueries({ queryKey: ["/api/chat-conversations"] })
      onUpdate({ name: name.trim(), email: email.trim(), phone: phone.trim() })
      onOpenChange(false)
    } catch {
      toast.error("Không thể cập nhật thông tin")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thông tin khách hàng</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin liên hệ của khách hàng
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Họ tên</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập họ tên"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Nhập số điện thoại"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={updateVisitor.isPending}>
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
