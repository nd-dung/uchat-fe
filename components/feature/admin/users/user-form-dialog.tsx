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
import type { UserResponseDto } from "@/features/admin/users"

const userFormSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên"),
  email: z.email("Email không hợp lệ"),
  password: z.string().optional(),
  role: z.enum(["super_admin", "facility_admin", "facility_staff"]),
  status: z.enum(["active", "inactive"]),
  facility_id: z.string().optional(),
})

export type UserFormValues = z.infer<typeof userFormSchema>

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingUser: UserResponseDto | null
  facilities: { id: number; name: string }[]
  isSubmitting: boolean
  onSubmit: (values: UserFormValues) => Promise<void>
}

export function UserFormDialog({
  open,
  onOpenChange,
  editingUser,
  facilities,
  isSubmitting,
  onSubmit,
}: UserFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "facility_staff",
      status: "active",
      facility_id: "none",
    },
  })

  React.useEffect(() => {
    if (open) {
      if (editingUser) {
        reset({
          name: editingUser.name,
          email: editingUser.email,
          password: "",
          role: editingUser.role,
          status: editingUser.status,
          facility_id: editingUser.facility_id
            ? String(editingUser.facility_id)
            : "none",
        })
      } else {
        reset({
          name: "",
          email: "",
          password: "",
          role: "facility_staff",
          status: "active",
          facility_id: "none",
        })
      }
    }
  }, [open, editingUser, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingUser ? "Sửa người dùng" : "Thêm người dùng"}
          </DialogTitle>
          <DialogDescription>
            {editingUser
              ? "Cập nhật thông tin người dùng."
              : "Tạo tài khoản người dùng mới."}
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
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">
              Mật khẩu {editingUser && "(để trống nếu không đổi)"}
            </Label>
            <Input id="password" type="password" {...register("password")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Vai trò</Label>
              <Select
                value={watch("role")}
                onValueChange={(v) =>
                  setValue("role", v as UserFormValues["role"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="facility_admin">Facility Admin</SelectItem>
                  <SelectItem value="facility_staff">Facility Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Trạng thái</Label>
              <Select
                value={watch("status")}
                onValueChange={(v) =>
                  setValue("status", v as UserFormValues["status"])
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
          </div>

          <div className="space-y-1.5">
            <Label>Khoa</Label>
            <Select
              value={watch("facility_id") || "none"}
              onValueChange={(v) => setValue("facility_id", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn khoa..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Không thuộc khoa</SelectItem>
                {facilities.map((f) => (
                  <SelectItem key={f.id} value={String(f.id)}>
                    {f.name}
                  </SelectItem>
                ))}
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
              {editingUser ? "Lưu" : "Tạo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
