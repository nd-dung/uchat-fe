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
import { Loader2Icon } from "lucide-react"
import type { UserResponseDto } from "@/features/admin/users"

interface UserDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: UserResponseDto | null
  isDeleting: boolean
  onConfirm: () => Promise<void>
}

export function UserDeleteDialog({
  open,
  onOpenChange,
  user,
  isDeleting,
  onConfirm,
}: UserDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Xoá người dùng</DialogTitle>
          <DialogDescription>
            Bạn có chắc muốn xoá <strong>{user?.name}</strong>? Thao tác này không thể
            hoàn tác.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting && (
              <Loader2Icon className="mr-1 h-4 w-4 animate-spin" />
            )}
            Xoá
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
