"use client"

import * as React from "react"
import { useGetFacilityStatisticsOverview } from "@/lib/api/generated/facilities/facilities"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Building2,
  Building2Icon,
  CheckCircle2,
  XCircle,
  Users,
  UsersRound,
} from "lucide-react"

const STAT_CONFIG = [
  {
    key: "total",
    title: "T\u1ed5ng khoa",
    icon: Building2,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    key: "active",
    title: "Ho\u1ea1t \u0111\u1ed9ng",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    key: "inactive",
    title: "Ng\u1eebng",
    icon: XCircle,
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
  {
    key: "with_users",
    title: "C\u00f3 ng\u01b0\u1eddi d\u00f9ng",
    icon: Users,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    key: "without_users",
    title: "Kh\u00f4ng c\u00f3 ng\u01b0\u1eddi d\u00f9ng",
    icon: UsersRound,
    color: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-100",
  },
] as const

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bg,
  border,
}: {
  title: string
  value: number
  icon: typeof Building2
  color: string
  bg: string
  border: string
}) {
  return (
    <Card className={`${border} overflow-hidden`}>
      <CardContent className="p-4 py-0">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
            <Icon className={`h-4 w-4 ${color}`} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className="text-xl font-bold tracking-tight">{value.toLocaleString("vi-VN")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-10" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function FacilityStatCards() {
  const { data } = useGetFacilityStatisticsOverview({})
  const stats = data?.data

  if (!stats) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {STAT_CONFIG.map((cfg) => (
        <StatCard
          key={cfg.key}
          title={cfg.title}
          value={stats[cfg.key]}
          icon={cfg.icon}
          color={cfg.color}
          bg={cfg.bg}
          border={cfg.border}
        />
      ))}
    </div>
  )
}
