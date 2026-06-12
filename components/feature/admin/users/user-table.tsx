"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  type UserResponseDto,
  getRoleLabel,
  getRoleBadgeVariant,
} from "@/features/admin/users"
import { PencilIcon, TrashIcon } from "lucide-react"

interface UserTableProps {
  users: UserResponseDto[]
  facilityMap: Map<number, string>
  onToggleStatus: (user: UserResponseDto, checked: boolean) => Promise<void>
  onEdit: (user: UserResponseDto) => void
  onDelete: (user: UserResponseDto) => void
  isMutating: boolean
}

export function UserTable({
  users,
  facilityMap,
  onToggleStatus,
  onEdit,
  onDelete,
  isMutating,
}: UserTableProps) {
  return (
    <div className="rounded-none border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Khoa</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.facility_id
                    ? facilityMap.get(user.facility_id) || "-"
                    : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={user.status === "active"}
                      onCheckedChange={(checked) => onToggleStatus(user, checked)}
                      disabled={isMutating}
                    />
                    <span className="text-xs">
                      {user.status === "active" ? "Hoạt động" : "Ngừng"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString("vi-VN")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onEdit(user)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onDelete(user)}
                    >
                      <TrashIcon className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
