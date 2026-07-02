"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlatformIcon } from "./platform-icons"
import type { ChatbotListItemResponseDto } from "@/lib/api/generated/model"

interface ConnectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  platform: "facebook" | "instagram"
  chatbots: ChatbotListItemResponseDto[]
  selectedChatbotId: string
  onChatbotChange: (value: string) => void
  onConfirm: () => void
  isLoading: boolean
}

export function ConnectDialog({
  open,
  onOpenChange,
  platform,
  chatbots,
  selectedChatbotId,
  onChatbotChange,
  onConfirm,
  isLoading,
}: ConnectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-none">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-none text-white ${
                platform === "facebook"
                  ? "bg-blue-600"
                  : "bg-gradient-to-br from-pink-500 via-purple-600 to-orange-500"
              }`}
            >
              <PlatformIcon platform={platform} className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>
                Kết nối {platform === "facebook" ? "Facebook" : "Instagram"}
              </DialogTitle>
              <DialogDescription>
                Chọn chatbot để gắn kết nối này
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="chatbot">Chatbot</Label>
            <Select value={selectedChatbotId} onValueChange={onChatbotChange}>
              <SelectTrigger id="chatbot" className="rounded-none">
                <SelectValue placeholder="Chọn chatbot" />
              </SelectTrigger>
              <SelectContent>
                {chatbots.map((chatbot) => (
                  <SelectItem key={chatbot.id} value={String(chatbot.id)}>
                    {chatbot.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 rounded-none">
            Bạn sẽ được chuyển đến Meta để xác thực. Sau khi hoàn tất, tài khoản sẽ được kết nối với chatbot đã chọn.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading} className="rounded-none">
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            disabled={!selectedChatbotId || isLoading}
            className="rounded-none"
          >
            {isLoading ? "Đang chuyển hướng..." : "Tiếp tục kết nối"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
