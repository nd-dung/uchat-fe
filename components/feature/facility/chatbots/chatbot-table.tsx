"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type ChatbotResponseDto, getStatusLabel, getStatusBadgeVariant } from "@/features/facility/chatbots"
import { PencilIcon, TrashIcon } from "lucide-react"

interface ChatbotTableProps {
  chatbots: ChatbotResponseDto[]
  onEdit: (chatbot: ChatbotResponseDto) => void
  onDelete: (chatbot: ChatbotResponseDto) => void
}

export function ChatbotTable({ chatbots, onEdit, onDelete }: ChatbotTableProps) {
  return (
    <div className="rounded-none border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>T\u00ean</TableHead>
            <TableHead>T\u00ean hi\u1ec3n th\u1ecb</TableHead>
            <TableHead>M\u00f4 t\u1ea3</TableHead>
            <TableHead>Tr\u1ea1ng th\u00e1i</TableHead>
            <TableHead className="text-right">Thao t\u00e1c</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chatbots.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                Kh\u00f4ng c\u00f3 d\u1eef li\u1ec7u
              </TableCell>
            </TableRow>
          ) : (
            chatbots.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell>{c.display_name || "-"}</TableCell>
                <TableCell className="max-w-[200px] truncate text-muted-foreground">
                  {c.description || "-"}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(c.status)}>
                    {getStatusLabel(c.status)}
                  </Badge>
                </TableCell>
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
