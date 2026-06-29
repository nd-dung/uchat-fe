"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Loader2,
} from "lucide-react"
import {
  useFindHandoffRequests,
  useAssignHandoffRequest,
  useUpdateHandoffStatus,
  useResolveHandoffRequest,
} from "@/lib/api/generated/chat-handoff-requests/chat-handoff-requests"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ChatHandoffRequestResponseDto } from "@/lib/api/generated/model"
import type { FindHandoffRequestsStatus } from "@/lib/api/generated/model/findHandoffRequestsStatus"
import { cn } from "@/lib/utils"

const HANDOFF_STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: "Chờ xử lý", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  assigned: { label: "Đã phân công", color: "bg-blue-100 text-blue-700 border-blue-200", icon: UserPlus },
  in_progress: { label: "Đang xử lý", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: Loader2 },
  resolved: { label: "Đã giải quyết", color: "bg-gray-100 text-gray-500 border-gray-200", icon: CheckCircle },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-600 border-red-200", icon: XCircle },
}

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  low: { label: "Thấp", color: "bg-slate-50 text-slate-600 border-slate-200" },
  medium: { label: "Trung bình", color: "bg-sky-50 text-sky-600 border-sky-200" },
  high: { label: "Cao", color: "bg-orange-50 text-orange-600 border-orange-200" },
  urgent: { label: "Khẩn cấp", color: "bg-red-50 text-red-600 border-red-200" },
}

function formatTime(dateStr: string | null | undefined): string {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMin / 60)

  if (diffMin < 1) return "vừa xong"
  if (diffMin < 60) return `${diffMin} phút trước`
  if (diffHour < 24) return `${diffHour} giờ trước`
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })
}

interface HandoffPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  facilityId?: string
}

export function HandoffPanel({ open, onOpenChange }: HandoffPanelProps) {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = React.useState<string>("pending")

  const { data: handoffData, isLoading } = useFindHandoffRequests(
    { status: statusFilter === "all" ? undefined : (statusFilter as FindHandoffRequestsStatus) },
    { query: { enabled: open } }
  )

  const assignMutation = useAssignHandoffRequest()
  const updateStatusMutation = useUpdateHandoffStatus()
  const resolveMutation = useResolveHandoffRequest()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handoffs: ChatHandoffRequestResponseDto[] = (handoffData as any)?.data?.items || []

  const handleAssign = async (id: number) => {
    try {
      await assignMutation.mutateAsync({ id, data: {} })
      toast.success("Đã tiếp nhận yêu cầu")
      queryClient.invalidateQueries({ queryKey: ["/api/chat-handoff-requests"] })
    } catch {
      toast.error("Không thể tiếp nhận yêu cầu")
    }
  }

  const handleResolve = async (id: number) => {
    try {
      await resolveMutation.mutateAsync({ id })
      toast.success("Đã giải quyết yêu cầu")
      queryClient.invalidateQueries({ queryKey: ["/api/chat-handoff-requests"] })
    } catch {
      toast.error("Không thể giải quyết yêu cầu")
    }
  }

  const handleCancel = async (id: number) => {
    try {
      await updateStatusMutation.mutateAsync({ id, data: { status: "cancelled" } })
      toast.success("Đã hủy yêu cầu")
      queryClient.invalidateQueries({ queryKey: ["/api/chat-handoff-requests"] })
    } catch {
      toast.error("Không thể hủy yêu cầu")
    }
  }

  const counts = React.useMemo(() => {
    return {
      total: handoffs.length,
      pending: handoffs.filter((h) => h.status === "pending").length,
    }
  }, [handoffs])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[420px] sm:w-[480px] p-0">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b px-6 py-5">
            <SheetHeader className="p-0">
              <SheetTitle className="text-base">Yêu cầu chuyển nhân viên</SheetTitle>
              <SheetDescription className="text-xs">
                Quản lý các yêu cầu handoff từ bot sang nhân viên
              </SheetDescription>
            </SheetHeader>

            {/* Stats */}
            <div className="mt-4 flex gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <div>
                  <p className="text-xs font-medium text-amber-700">Chờ xử lý</p>
                  <p className="text-lg font-semibold text-amber-700">{counts.pending}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                <AlertTriangle className="h-4 w-4 text-slate-600" />
                <div>
                  <p className="text-xs font-medium text-slate-600">Tổng cộng</p>
                  <p className="text-lg font-semibold text-slate-700">{counts.total}</p>
                </div>
              </div>
            </div>

            {/* Filter */}
            <div className="mt-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="assigned">Đã phân công</SelectItem>
                  <SelectItem value="in_progress">Đang xử lý</SelectItem>
                  <SelectItem value="resolved">Đã giải quyết</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1 px-6 py-4">
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-28" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="mt-3 h-3 w-40" />
                    <Skeleton className="mt-2 h-3 w-56" />
                    <div className="mt-3 flex gap-2">
                      <Skeleton className="h-7 w-20" />
                      <Skeleton className="h-7 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            ) : handoffs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <div className="rounded-full bg-muted p-4">
                  <AlertTriangle className="h-8 w-8" />
                </div>
                <p className="mt-3 text-sm font-medium">Không có yêu cầu nào</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {statusFilter === "pending"
                    ? "Tất cả yêu cầu đã được xử lý"
                    : "Không tìm thấy yêu cầu phù hợp"}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {handoffs.map((handoff: ChatHandoffRequestResponseDto) => {
                  const status = HANDOFF_STATUS_CONFIG[handoff.status] || HANDOFF_STATUS_CONFIG.pending
                  const priority = PRIORITY_CONFIG[handoff.priority] || PRIORITY_CONFIG.medium
                  const StatusIcon = status.icon
                  return (
                    <div
                      key={handoff.id}
                      className="group rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      {/* Top row: badges + ID */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn("h-6 border px-2 py-0.5 text-[11px] font-medium", status.color)}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {status.label}
                          </Badge>
                          <Badge variant="outline" className={cn("h-6 border px-2 py-0.5 text-[11px] font-medium", priority.color)}>
                            {priority.label}
                          </Badge>
                        </div>
                        <span className="text-[10px] text-muted-foreground">#{handoff.id}</span>
                      </div>

                      {/* Reason */}
                      {handoff.reason && (
                        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                          {String(handoff.reason)}
                        </p>
                      )}

                      {/* Meta */}
                      <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                          Cuộc #{handoff.conversation_id}
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                          {formatTime(handoff.requested_at)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex gap-2 border-t border-dashed pt-3">
                        {handoff.status === "pending" && (
                          <Button
                            size="sm"
                            className="h-8 px-3 text-xs"
                            onClick={() => handleAssign(handoff.id)}
                            disabled={assignMutation.isPending}
                          >
                            <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                            Tiếp nhận
                          </Button>
                        )}
                        {(handoff.status === "assigned" || handoff.status === "in_progress") && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-3 text-xs"
                            onClick={() => handleResolve(handoff.id)}
                            disabled={resolveMutation.isPending}
                          >
                            <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                            Giải quyết
                          </Button>
                        )}
                        {handoff.status !== "resolved" && handoff.status !== "cancelled" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-3 text-xs text-muted-foreground hover:text-destructive"
                            onClick={() => handleCancel(handoff.id)}
                            disabled={updateStatusMutation.isPending}
                          >
                            <XCircle className="mr-1.5 h-3.5 w-3.5" />
                            Hủy
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
