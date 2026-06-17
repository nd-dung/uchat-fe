"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2Icon } from "lucide-react"
import type { ChatbotResponseDto } from "@/features/admin/chatbots"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  chatbot: ChatbotResponseDto | null
  isDeleting: boolean
  onConfirm: () => void
}

export function ChatbotDeleteDialog({ open, onOpenChange, chatbot, isDeleting, onConfirm }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>X\u00f3a chatbot</DialogTitle>
          <DialogDescription>
            B\u1ea1n c\u00f3 ch\u1eafc ch\u1eafn mu\u1ed1n x\u00f3a chatbot{" "}
            <span className="font-semibold">{chatbot?.name}</span>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hu\u1ef7</Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting && <Loader2Icon className="mr-1 h-4 w-4 animate-spin" />}X\u00f3a
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
