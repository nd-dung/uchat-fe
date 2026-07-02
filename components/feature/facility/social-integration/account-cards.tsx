"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import {
  AlertTriangle,
  CheckCircle2,
  Link2,
  RefreshCw,
  Unplug,
} from "lucide-react"
import { FacebookIcon, InstagramIcon } from "./platform-icons"
import type { OmniAccountResponseDto } from "@/lib/api/manual/omni-accounts"

interface AccountCardProps {
  account: OmniAccountResponseDto
  onReconnect?: (account: OmniAccountResponseDto) => void
  onDisconnect?: (account: OmniAccountResponseDto) => void
  isDisconnecting?: boolean
}

function getTokenStatus(tokenExpiresAt: string | null) {
  if (!tokenExpiresAt) return { status: "unknown" as const, daysLeft: 0 }
  const now = new Date()
  const expiry = new Date(tokenExpiresAt)
  const diff = expiry.getTime() - now.getTime()
  const daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  if (daysLeft <= 7) return { status: "expiring_soon" as const, daysLeft }
  if (daysLeft <= 0) return { status: "expired" as const, daysLeft }
  return { status: "active" as const, daysLeft }
}

function StatusBadge({ status }: { status: OmniAccountResponseDto["status"] }) {
  if (status === "active") {
    return (
      <Badge variant="outline" className="rounded-none border-emerald-200 bg-emerald-50 text-emerald-700">
        <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
        Hoạt động
      </Badge>
    )
  }
  if (status === "error") {
    return (
      <Badge variant="outline" className="rounded-none border-rose-200 bg-rose-50 text-rose-700">
        <AlertTriangle className="mr-1 h-3 w-3" />
        Lỗi
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="rounded-none border-slate-200 bg-slate-50 text-slate-700">
      <Unplug className="mr-1 h-3 w-3" />
      Đã ngắt
    </Badge>
  )
}

export function AccountCard({
  account,
  onReconnect,
  onDisconnect,
  isDisconnecting,
}: AccountCardProps) {
  const tokenStatus = getTokenStatus(account.token_expires_at)
  const isExpiringSoon = tokenStatus.status === "expiring_soon"
  const isExpired = tokenStatus.status === "expired"
  const showWarning = isExpiringSoon || isExpired
  const displayName = account.external_account_name ?? account.external_account_id

  return (
    <div
      className={cn(
        "rounded-none border p-5",
        showWarning ? "border-amber-200 bg-amber-50/30" : "border-border"
      )}
    >
      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-none text-white",
            account.channel === "facebook"
              ? "bg-blue-600"
              : "bg-gradient-to-br from-pink-500 via-purple-600 to-orange-500"
          )}
        >
          {account.channel === "facebook" ? (
            <FacebookIcon className="h-5 w-5" />
          ) : (
            <InstagramIcon className="h-5 w-5 text-white" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-foreground">{displayName}</h4>
            <StatusBadge status={account.status} />
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {account.channel === "facebook" ? "Facebook Page" : "Instagram Business"}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>ID: {account.external_account_id}</span>
            <span>Chatbot: #{account.chatbot_id}</span>
            <span>Cập nhật: {new Date(account.updated_at).toLocaleDateString("vi-VN")}</span>
          </div>
        </div>

        <div className="shrink-0 text-right hidden sm:block">
          {account.token_expires_at ? (
            <div
              className={cn(
                "inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-medium rounded-none",
                showWarning
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              )}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Còn {tokenStatus.daysLeft} ngày
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground rounded-none">
              Không xác định hạn token
            </div>
          )}
        </div>
      </div>

      {showWarning && (
        <div className="mt-4 flex items-start gap-3 border border-amber-200 bg-amber-50 p-3 rounded-none">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center bg-amber-100 rounded-none">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <p className="text-sm text-amber-700">
            Access Token {isExpired ? "đã hết hạn" : "sắp hết hạn"}. Vui lòng OAuth lại để tránh gián đoạn dịch vụ.
          </p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onReconnect?.(account)}
          className={cn(
            "rounded-none",
            showWarning && "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
          )}
        >
          <RefreshCw className="mr-1.5 h-4 w-4" />
          OAuth lại
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-none text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => onDisconnect?.(account)}
          disabled={isDisconnecting}
        >
          <Unplug className="mr-1 h-4 w-4" />
          {isDisconnecting ? "Đang ngắt..." : "Ngắt kết nối"}
        </Button>
      </div>
    </div>
  )
}

export function AccountCardSkeleton() {
  return (
    <div className="rounded-none border p-5">
      <div className="flex items-start gap-4">
        <Skeleton className="h-12 w-12 shrink-0 rounded-none" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-24 rounded-none" />
          </div>
          <Skeleton className="h-4 w-32" />
          <div className="flex gap-4 pt-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function EmptyAccountCard({
  platform,
  onConnect,
}: {
  platform: "facebook" | "instagram"
  onConnect?: () => void
}) {
  return (
    <div
      className="group cursor-pointer border border-dashed border-border bg-muted/30 transition-colors hover:border-foreground/30 p-8 rounded-none"
      onClick={onConnect}
    >
      <div className="flex flex-col items-center justify-center">
        <div
          className={cn(
            "mb-3 flex h-12 w-12 items-center justify-center rounded-none text-white transition-transform group-hover:scale-105",
            platform === "facebook"
              ? "bg-blue-600"
              : "bg-gradient-to-br from-pink-500 via-purple-600 to-orange-500"
          )}
        >
          {platform === "facebook" ? (
            <FacebookIcon className="h-5 w-5" />
          ) : (
            <InstagramIcon className="h-5 w-5 text-white" />
          )}
        </div>
        <p className="font-medium text-foreground">
          Kết nối {platform === "facebook" ? "Facebook Page" : "Instagram Business"}
        </p>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Nhấn để thêm tài khoản {platform === "facebook" ? "Facebook" : "Instagram"} mới
        </p>
        <Button variant="outline" size="sm" className="mt-4 rounded-none">
          <Link2 className="mr-1.5 h-4 w-4" />
          Kết nối ngay
        </Button>
      </div>
    </div>
  )
}
