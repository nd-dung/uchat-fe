"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { XIcon, SearchIcon, PlusIcon } from "lucide-react"

interface ChatbotToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  isFiltered: boolean
  onClearFilters: () => void
  onAddChatbot: () => void
}

export function ChatbotToolbar({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  isFiltered,
  onClearFilters,
  onAddChatbot,
}: ChatbotToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="T\u00ecm theo t\u00ean chatbot..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-8 text-xs"
          />
        </div>

        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue placeholder="Tr\u1ea1ng th\u00e1i" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">T\u1ea5t c\u1ea3</SelectItem>
            <SelectItem value="active">Ho\u1ea1t \u0111\u1ed9ng</SelectItem>
            <SelectItem value="inactive">Ng\u1eebng</SelectItem>
            <SelectItem value="draft">B\u1ea3n nh\u00e1p</SelectItem>
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={onClearFilters}>
            <XIcon className="h-3.5 w-3.5 mr-1" />
            X\u00f3a l\u1ecdc
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">1</Badge>
          </Button>
        )}
      </div>

      <Button size="sm" className="h-8 text-xs" onClick={onAddChatbot}>
        <PlusIcon className="h-3.5 w-3.5 mr-1" />
        Th\u00eam chatbot
      </Button>
    </div>
  )
}
