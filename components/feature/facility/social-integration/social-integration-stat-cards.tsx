"use client"

import * as React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle2, Link2, Unplug, AlertTriangle } from "lucide-react"
import { useGetOmniAccountStatistics } from "@/lib/api/manual/omni-accounts"

const STAT_CONFIG = [
  {
    key: "active" as const,
    title: "Hoạt động",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    key: "disabled" as const,
    title: "Ngắt kết nối",
    icon: Unplug,
    color: "text-slate-600",
    bg: "bg-slate-50",
  },
  {
    key: "error" as const,
    title: "Lỗi",
    icon: AlertTriangle,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    key: "total" as const,
    title: "Tổng kết nối",
    icon: Link2,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
]

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bg,
}: {
  title: string
  value: number
  icon: typeof Link2
  color: string
  bg: string
}) {
  return (
    <div className="rounded-none border p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value.toLocaleString("vi-VN")}</p>
        </div>
      </div>
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div className="rounded-none border p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-7 w-10" />
        </div>
      </div>
    </div>
  )
}

export function SocialIntegrationStatCards() {
  const { data, isLoading } = useGetOmniAccountStatistics()
  const stats = data?.data ?? null

  if (isLoading || !stats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STAT_CONFIG.map((cfg) => (
        <StatCard
          key={cfg.key}
          title={cfg.title}
          value={stats[cfg.key]}
          icon={cfg.icon}
          color={cfg.color}
          bg={cfg.bg}
        />
      ))}
    </div>
  )
}
