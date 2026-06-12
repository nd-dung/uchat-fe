"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SearchIcon, PlusIcon } from "lucide-react"

interface UserToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  roleFilter: string
  onRoleChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  facilityFilter: string
  onFacilityChange: (value: string) => void
  facilities: { id: number; name: string }[]
  isFiltered: boolean
  onClearFilters: () => void
  onAddUser: () => void
}

export function UserToolbar({
  search,
  onSearchChange,
  roleFilter,
  onRoleChange,
  statusFilter,
  onStatusChange,
  facilityFilter,
  onFacilityChange,
  facilities,
  isFiltered,
  onClearFilters,
  onAddUser,
}: UserToolbarProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc email..."
            className="pl-9"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <Button onClick={onAddUser}>
          <PlusIcon className="mr-1 h-4 w-4" />
          Thêm người dùng
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Select value={roleFilter} onValueChange={onRoleChange}>
          <SelectTrigger className="w-auto min-w-[140px]">
            <SelectValue placeholder="Tất cả vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vai trò</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="facility_admin">Facility Admin</SelectItem>
            <SelectItem value="facility_staff">Facility Staff</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-auto min-w-[140px]">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Ngừng</SelectItem>
          </SelectContent>
        </Select>
        <Select value={facilityFilter} onValueChange={onFacilityChange}>
          <SelectTrigger className="w-auto min-w-[140px]">
            <SelectValue placeholder="Tất cả khoa" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả khoa</SelectItem>
            {facilities.map((f) => (
              <SelectItem key={f.id} value={String(f.id)}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isFiltered && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Xoá bộ lọc
          </Button>
        )}
      </div>
    </div>
  )
}
