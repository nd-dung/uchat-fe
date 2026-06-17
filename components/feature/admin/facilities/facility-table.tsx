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
import {
  type FacilityResponseDto,
  getStatusLabel,
  getStatusBadgeVariant,
} from "@/features/admin/facilities"
import { PencilIcon, TrashIcon } from "lucide-react"

interface FacilityTableProps {
  facilities: FacilityResponseDto[]
  onEdit: (facility: FacilityResponseDto) => void
  onDelete: (facility: FacilityResponseDto) => void
}

export function FacilityTable({
  facilities,
  onEdit,
  onDelete,
}: FacilityTableProps) {
  return (
    <div className="rounded-none border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tên khoa</TableHead>
            <TableHead>Mã</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {facilities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          ) : (
            facilities.map((f) => (
              <TableRow key={f.id}>
                <TableCell>{f.id}</TableCell>
                <TableCell className="font-medium">{f.name}</TableCell>
                <TableCell>{f.code}</TableCell>
                <TableCell>{f.slug}</TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground">
                  {f.description || "-"}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(f.status)}>
                    {getStatusLabel(f.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onEdit(f)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => onDelete(f)}
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
