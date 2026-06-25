"use client"

export const dynamic = "force-dynamic"
import * as React from "react"
import { useParams } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Building2,
  Users,
  UserCheck,
  Clock,
} from "lucide-react"
import { useGetFacility } from "@/lib/api/generated/facilities/facilities"
import { useListUsers } from "@/lib/api/generated/users/users"

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bg,
}: {
  title: string
  value: number
  icon: typeof Building2
  color: string
  bg: string
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
            <Icon className={`h-5 w-5 ${color}`} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value.toLocaleString("vi-VN")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-12" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function FacilityDashboardPage() {
  const params = useParams()
  const facilityId = Number(params.id)

  const { data: facilityData } = useGetFacility(facilityId)
  const facility = facilityData?.data

  const { data: usersData } = useListUsers({ facility_id: facilityId, limit: 1 } as unknown as Parameters<typeof useListUsers>[0])
  const totalUsers = usersData?.data?.pagination?.total ?? 0

  const stats = [
    { title: "Tổng người dùng", value: totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Đang hoạt động", value: 0, icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Người dùng mới", value: 0, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  ]

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="mx-auto w-full max-w-7xl space-y-6">
          <div>
            <h1 className="text-lg font-semibold">{facility?.name || "Khoa"}</h1>
            <p className="text-sm text-muted-foreground">{facility?.description || "Dashboard quản lý khoa"}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {!facilityData
              ? Array.from({ length: 3 }).map((_, i) => <StatSkeleton key={i} />)
              : stats.map((s) => (
                  <StatCard key={s.title} {...s} />
                ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Hoạt động gần đây</CardTitle>
                <CardDescription>Cập nhật từ người dùng trong khoa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground py-8 text-center">
                  Chưa có dữ liệu
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Thông tin khoa</CardTitle>
                <CardDescription>Chi tiết thông tin cơ bản</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {facility ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Mã</span>
                      <span className="text-sm font-medium">{facility.code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Slug</span>
                      <span className="text-sm font-medium">{facility.slug}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Trạng thái</span>
                      <span className="text-sm font-medium">
                        {facility.status === "active" ? "Hoạt động" : "Ngừng"}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
