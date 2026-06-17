"use client"

import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type ChatbotResponseDto, getStatusLabel, getStatusBadgeVariant } from "@/features/admin/chatbots"
import { PencilIcon, TrashIcon } from "lucide-react"

interface ChatbotTableProps {
  chatbots: ChatbotResponseDto[]
  onEdit: (c: ChatbotResponseDto) => void
  onDelete: (c: ChatbotResponseDto) => void
}

export function ChatbotTable({ chatbots, onEdit, onDelete }: ChatbotTableProps) {
  return (
    <div className="rounded-none border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tên</TableHead>
            <TableHead>Tên hiển thị</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chatbots.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Không có dữ liệu</TableCell>
            </TableRow>
          ) : (
            chatbots.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.display_name || "-"}</TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground">{c.description || "-"}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(c.status)}>{getStatusLabel(c.status)}</Badge>
                </TableCell>
                <TableCell>{new Date(c.created_at).toLocaleDateString("vi-VN")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon-sm" onClick={() => onEdit(c)}>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => onDelete(c)}>
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
