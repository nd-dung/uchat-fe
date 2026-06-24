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
import type { FacilityResponseDto } from "@/features/admin/facilities"

const facilityFormSchema = z.object({
  name: z.string().min(1, "Vui l\u00f2ng nh\u1eadp t\u00ean khoa"),
  code: z.string().min(1, "Vui l\u00f2ng nh\u1eadp m\u00e3 khoa"),
  slug: z.string().min(1, "Vui l\u00f2ng nh\u1eadp slug"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]),
})

export type FacilityFormValues = z.infer<typeof facilityFormSchema>

interface FacilityFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingFacility: FacilityResponseDto | null
  isSubmitting: boolean
  onSubmit: (values: FacilityFormValues) => Promise<void>
}

export function FacilityFormDialog({
  open,
  onOpenChange,
  editingFacility,
  isSubmitting,
  onSubmit,
}: FacilityFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FacilityFormValues>({
    resolver: zodResolver(facilityFormSchema),
    defaultValues: {
      name: "",
      code: "",
      slug: "",
      description: "",
      status: "active",
    },
  })

  React.useEffect(() => {
    if (open) {
      if (editingFacility) {
        reset({
          name: editingFacility.name,
          code: editingFacility.code,
          slug: editingFacility.slug,
          description: editingFacility.description || "",
          status: editingFacility.status,
        })
      } else {
        reset({
          name: "",
          code: "",
          slug: "",
          description: "",
          status: "active",
        })
      }
    }
  }, [open, editingFacility, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingFacility ? "S\u1eeda khoa" : "Th\u00eam khoa"}
          </DialogTitle>
          <DialogDescription>
            {editingFacility
              ? "C\u1eadp nh\u1eadt th\u00f4ng tin khoa."
              : "T\u1ea1o khoa m\u1edbi trong h\u1ec7 th\u1ed1ng."}
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(async (values) => {
            await onSubmit(values)
          })}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">T\u00ean khoa</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="code">M\u00e3</Label>
              <Input id="code" {...register("code")} />
              {errors.code && (
                <p className="text-xs text-destructive">{errors.code.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" {...register("slug")} />
              {errors.slug && (
                <p className="text-xs text-destructive">{errors.slug.message}</p>
              )}
            </div>
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
                setValue("status", v as FacilityFormValues["status"])
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
              {editingFacility ? "L\u01b0u" : "T\u1ea1o"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
