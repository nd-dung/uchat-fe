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
import type { OmniAccountResponseDto } from "@/lib/api/manual/omni-accounts"

interface DisconnectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account: OmniAccountResponseDto | null
  onConfirm: () => void
  isLoading: boolean
}

export function DisconnectDialog({
  open,
  onOpenChange,
  account,
  onConfirm,
  isLoading,
}: DisconnectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-none">
        <DialogHeader>
          <DialogTitle>Ngắt kết nối tài khoản?</DialogTitle>
          <DialogDescription>
            Bạn có chắc muốn ngắt kết nối{" "}
            <strong>
              {account?.external_account_name ?? account?.external_account_id}
            </strong>
            ? Hành động này sẽ dừng nhận tin nhắn từ kênh này.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading} className="rounded-none">
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant="destructive"
            className="rounded-none"
          >
            {isLoading ? "Đang ngắt..." : "Ngắt kết nối"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
