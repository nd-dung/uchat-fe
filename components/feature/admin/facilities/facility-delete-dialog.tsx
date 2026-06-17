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
import type { FacilityResponseDto } from "@/features/admin/facilities"

interface FacilityDeleteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  facility: FacilityResponseDto | null
  isDeleting: boolean
  onConfirm: () => void
}

export function FacilityDeleteDialog({
  open,
  onOpenChange,
  facility,
  isDeleting,
  onConfirm,
}: FacilityDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>X\u00f3a khoa</DialogTitle>
          <DialogDescription>
            B\u1ea1n c\u00f3 ch\u1eafc ch\u1eafn mu\u1ed1n x\u00f3a khoa{" "}
            <span className="font-semibold">{facility?.name}</span>? H\u00e0nh \u0111\u1ed9ng n\u00e0y
            kh\u00f4ng th\u1ec3 ho\u00e0n t\u00e1c.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hu\u1ef7
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting && (
              <Loader2Icon className="mr-1 h-4 w-4 animate-spin" />
            )}
            X\u00f3a
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
