"use client"

import * as React from "react"
import {
  useGetUserStatisticsOverview,
  useGetUserStatisticsTrend,
  useGetUserStatisticsByFacility,
} from "@/lib/api/generated/users/users"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Clock,
  Activity,
  Shield,
  Building2,
  TrendingUp,
  Calendar,
} from "lucide-react"

const STAT_CONFIG = [
  {
    key: "total",
    title: "Tổng người dùng",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    key: "active",
    title: "Đang hoạt động",
    icon: UserCheck,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    key: "inactive",
    title: "Ngừng hoạt động",
    icon: UserX,
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
  {
    key: "new_users",
    title: "Người dùng mới",
    icon: UserPlus,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    key: "never_logged_in",
    title: "Chưa đăng nhập",
    icon: Clock,
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
  total,
}: {
  title: string
  value: number
  icon: typeof Users
  color: string
  bg: string
  border: string
  total?: number
}) {
  const percent = total && total > 0 ? Math.round((value / total) * 100) : null

  return (
    <Card className={`${border} overflow-hidden`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value.toLocaleString("vi-VN")}</p>
            {percent !== null && (
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: color.replace("text-", "").replace("600", "500"),
                    }}
                  />
                </div>
                <span className="text-[11px] text-muted-foreground">{percent}%</span>
              </div>
            )}
          </div>
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-9 w-16" />
          </div>
          <Skeleton className="h-11 w-11 rounded-xl" />
        </div>
      </CardContent>
    </Card>
  )
}

function DonutChart({
  data,
}: {
  data: { super_admin: number; facility_admin: number; facility_staff: number }
}) {
  const total = data.super_admin + data.facility_admin + data.facility_staff
  if (total === 0) return null

  const items = [
    {
      label: "Super Admin",
      value: data.super_admin,
      color: "#2563eb",
      bg: "bg-blue-500",
    },
    {
      label: "Facility Admin",
      value: data.facility_admin,
      color: "#059669",
      bg: "bg-emerald-500",
    },
    {
      label: "Facility Staff",
      value: data.facility_staff,
      color: "#64748b",
      bg: "bg-slate-500",
    },
  ]

  let cumulative = 0
  const segments = items.map((item) => {
    const start = cumulative
    const percent = item.value / total
    cumulative += percent
    return {
      ...item,
      start: start * 360,
      end: percent * 360,
      percent: Math.round(percent * 100),
    }
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm">Phân bố vai trò</CardTitle>
        </div>
        <CardDescription>Tỷ lệ người dùng theo vai trò hệ thống</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 sm:flex-row">
        {/* Donut SVG */}
        <div className="relative h-40 w-40 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="16" />
            {segments.map((seg) => (
              <circle
                key={seg.label}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={seg.color}
                strokeWidth="16"
                strokeDasharray={`${(seg.end / 360) * 251.2} 251.2`}
                strokeDashoffset={-((seg.start / 360) * 251.2)}
                className="transition-all duration-700"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{total}</span>
            <span className="text-[10px] text-muted-foreground">người dùng</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-1 flex-col gap-3">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${seg.bg}`} />
                <span className="text-sm text-muted-foreground">{seg.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold">{seg.value}</span>
                <Badge variant="outline" className="text-[10px]">
                  {seg.percent}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function TrendChart({
  data,
}: {
  data: { period: string; new_users: number }[]
}) {
  if (data.length === 0) return null

  const maxValue = Math.max(...data.map((d) => d.new_users), 1)
  const maxDisplay = Math.ceil(maxValue * 1.1)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm">Xu hướng người dùng mới</CardTitle>
        </div>
        <CardDescription>Số lượng người dùng đăng ký theo thời gian</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-48 w-full">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-6 text-[10px] text-muted-foreground">
                  {Math.round((maxDisplay / 4) * (4 - i))}
                </span>
                <div className="h-px flex-1 bg-muted" />
              </div>
            ))}
          </div>

          {/* Bars */}
          <div className="absolute inset-0 left-8 flex items-end gap-1 pt-4">
            {data.map((item, _i) => (
              <div key={item.period} className="group relative flex flex-1 flex-col items-center gap-1">
                <div className="relative w-full flex items-end justify-center">
                  {/* Tooltip */}
                  <div className="absolute -top-8 z-10 hidden rounded-md bg-foreground px-2 py-1 text-[10px] text-background group-hover:block">
                    {item.new_users} người
                  </div>
                  <div
                    className="w-full max-w-[28px] rounded-t-sm bg-primary/70 transition-all duration-500 hover:bg-primary"
                    style={{ height: `${(item.new_users / maxDisplay) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {item.period.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FacilityStatsTable({
  data,
}: {
  data: {
    facility_id: number
    facility_name: string
    total: number
    active: number
    inactive: number
    facility_admin: number
    facility_staff: number
    new_users: number
  }[]
}) {
  if (data.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm">Thống kê theo khoa</CardTitle>
        </div>
        <CardDescription>Phân bố người dùng qua từng khoa</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[200px]">Khoa</TableHead>
                <TableHead className="text-right">Tổng</TableHead>
                <TableHead className="text-right">Hoạt động</TableHead>
                <TableHead className="text-right">Ngừng</TableHead>
                <TableHead className="text-right">Admin</TableHead>
                <TableHead className="text-right">Staff</TableHead>
                <TableHead className="text-right">Mới</TableHead>
                <TableHead className="w-[100px]">Tỷ lệ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((f) => {
                const activePercent = f.total > 0 ? Math.round((f.active / f.total) * 100) : 0
                return (
                  <TableRow key={f.facility_id}>
                    <TableCell className="font-medium">{f.facility_name}</TableCell>
                    <TableCell className="text-right font-semibold">{f.total}</TableCell>
                    <TableCell className="text-right text-emerald-600">{f.active}</TableCell>
                    <TableCell className="text-right text-rose-600">{f.inactive}</TableCell>
                    <TableCell className="text-right">{f.facility_admin}</TableCell>
                    <TableCell className="text-right">{f.facility_staff}</TableCell>
                    <TableCell className="text-right">
                      {f.new_users > 0 ? (
                        <Badge variant="outline" className="text-[10px]">
                          +{f.new_users}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${activePercent}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground">{activePercent}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

function LoginActivity({
  data,
}: {
  data: {
    as_of_date: string
    last_7_days: number
    last_30_days: number
    over_30_days: number
    never_logged_in: number
  }
}) {
  const items = [
    { label: "7 ngày qua", value: data.last_7_days, color: "bg-emerald-500", text: "text-emerald-600" },
    { label: "30 ngày qua", value: data.last_30_days, color: "bg-blue-500", text: "text-blue-600" },
    { label: "Trên 30 ngày", value: data.over_30_days, color: "bg-amber-500", text: "text-amber-600" },
    { label: "Chưa từng đăng nhập", value: data.never_logged_in, color: "bg-slate-400", text: "text-slate-600" },
  ]

  const maxValue = Math.max(...items.map((i) => i.value), 1)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm">Hoạt động đăng nhập</CardTitle>
        </div>
        <CardDescription className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          Tính đến {new Date(data.as_of_date).toLocaleDateString("vi-VN")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.label} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className={`text-sm font-semibold ${item.text}`}>{item.value}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${item.color} transition-all duration-700`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function UserAnalytics() {
  const { data: overviewData } = useGetUserStatisticsOverview({})
  const { data: trendData } = useGetUserStatisticsTrend({})
  const { data: facilityData } = useGetUserStatisticsByFacility({})

  const overview = overviewData?.data
  const trend = trendData?.data?.items ?? []
  const facilities = facilityData?.data?.items ?? []

  const totals = overview?.totals
  const totalUsers = totals?.total ?? 0

  return (
    <div className="flex flex-col gap-4">
      {/* Stat Cards */}
      {!overviewData ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : totals ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {STAT_CONFIG.map((cfg) => (
            <StatCard
              key={cfg.key}
              title={cfg.title}
              value={totals[cfg.key]}
              icon={cfg.icon}
              color={cfg.color}
              bg={cfg.bg}
              border={cfg.border}
              total={totalUsers}
            />
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Login Activity */}
        {overview?.login_activity && (
          <LoginActivity data={overview.login_activity} />
        )}

        {/* Role Distribution */}
        {overview?.by_role && (
          <DonutChart data={overview.by_role} />
        )}
      </div>

      {/* Trend Chart */}
      {!trendData ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      ) : trend.length > 0 ? (
        <TrendChart data={trend} />
      ) : null}

      {/* Facility Table */}
      {!facilityData ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      ) : facilities.length > 0 ? (
        <FacilityStatsTable data={facilities} />
      ) : null}
    </div>
  )
}
