"use client"

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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Link2Icon,
  AlertTriangleIcon,
  RefreshCwIcon,
  UnplugIcon,
  CheckCircle2Icon,
  InfoIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Platform = "facebook" | "instagram"

interface ConnectedPage {
  id: string
  name: string
  pageId: string
  platform: Platform
  username: string
  connectedAt: string
  tokenExpiresAt: string
  status: "active" | "expiring_soon" | "expired"
}

const MOCK_PAGES: ConnectedPage[] = [
  {
    id: "1",
    name: "Nha Khoa Smile",
    pageId: "1234567890",
    platform: "facebook",
    username: "@nhaKhoaSmile",
    connectedAt: "15/06/2025",
    tokenExpiresAt: "12/09/2025",
    status: "active",
  },
  {
    id: "2",
    name: "Phòng Khám Đa Khoa",
    pageId: "0987654321",
    platform: "facebook",
    username: "@phongKhamDaKhoa",
    connectedAt: "01/03/2025",
    tokenExpiresAt: "05/07/2025",
    status: "expiring_soon",
  },
]

function getTokenDaysLeft(expiresAt: string): number {
  const now = new Date()
  const expiry = new Date(expiresAt.split("/").reverse().join("-"))
  const diff = expiry.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function getTokenProgress(expiresAt: string): number {
  const days = getTokenDaysLeft(expiresAt)
  return Math.min(100, Math.max(0, (days / 60) * 100))
}

function PlatformIcon({ platform }: { platform: Platform }) {
  if (platform === "facebook") {
    return (
      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  }
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ig" x1="0" y1="24" x2="24" y2="0">
          <stop offset="0%" stopColor="#feda75"/>
          <stop offset="25%" stopColor="#fa7e1e"/>
          <stop offset="50%" stopColor="#d62976"/>
          <stop offset="75%" stopColor="#962fbf"/>
          <stop offset="100%" stopColor="#4f5bd5"/>
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig)" strokeWidth="2"/>
      <circle cx="12" cy="12" r="5" stroke="url(#ig)" strokeWidth="2"/>
      <circle cx="17.5" cy="6.5" r="1.5" fill="url(#ig)"/>
    </svg>
  )
}

function StatusBadge({ status }: { status: ConnectedPage["status"] }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-lg border border-green-200">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
        Hoạt động
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-lg border border-amber-200">
      <AlertTriangleIcon className="w-3.5 h-3.5" />
      Sắp hết hạn
    </span>
  )
}

function TokenStatus({ page }: { page: ConnectedPage }) {
  const daysLeft = getTokenDaysLeft(page.tokenExpiresAt)
  const progress = getTokenProgress(page.tokenExpiresAt)

  return (
    <div className="text-right shrink-0">
      <div
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border mb-2",
          page.status === "active"
            ? "bg-green-50 text-green-700 border-green-200"
            : "bg-amber-50 text-amber-700 border-amber-200"
        )}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
        Còn hạn {daysLeft} ngày
      </div>
      <div className="w-32 mx-auto">
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className={cn(
              "h-1.5 rounded-full transition-all duration-1000",
              page.status === "active" ? "bg-green-500" : "bg-amber-500"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">Hết hạn: {page.tokenExpiresAt}</p>
      </div>
    </div>
  )
}

export default function SocialIntegrationPage() {
  const params = useParams()
  const facilityId = Number(params.id)
  const [activeTab, setActiveTab] = React.useState<Platform>("facebook")

  const pages = MOCK_PAGES.filter((p) => p.platform === activeTab)
  const totalPages = MOCK_PAGES.length
  const activePages = MOCK_PAGES.filter((p) => p.status === "active").length
  const expiringPages = MOCK_PAGES.filter((p) => p.status === "expiring_soon").length

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={`/facility/${facilityId}/dashboard`}>
                  Khoa
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Tích hợp Mạng xã hội</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4 pt-0">
        <div className="mx-auto w-full max-w-5xl">

          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Link2Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tích hợp Mạng xã hội</h1>
                <p className="text-gray-500 text-sm mt-0.5">
                  Quản lý kết nối Facebook & Instagram với khoa
                </p>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card className="border-gray-100">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Đang hoạt động</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{activePages}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-100">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Sắp hết hạn</p>
                    <p className="text-3xl font-bold text-amber-600 mt-1">{expiringPages}</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                    <AlertTriangleIcon className="w-6 h-6 text-amber-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-100">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Tổng kết nối</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{totalPages}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Link2Icon className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("facebook")}
                  className={cn(
                    "px-6 py-4 text-sm font-semibold flex items-center gap-2 transition-colors",
                    activeTab === "facebook"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook Messenger
                  <Badge variant="secondary" className="ml-1">
                    {MOCK_PAGES.filter((p) => p.platform === "facebook").length}
                  </Badge>
                </button>
                <button
                  onClick={() => setActiveTab("instagram")}
                  className={cn(
                    "px-6 py-4 text-sm font-medium flex items-center gap-2 transition-colors",
                    activeTab === "instagram"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <defs>
                      <linearGradient id="ig-tab" x1="0" y1="24" x2="24" y2="0">
                        <stop offset="0%" stopColor="#feda75"/>
                        <stop offset="25%" stopColor="#fa7e1e"/>
                        <stop offset="50%" stopColor="#d62976"/>
                        <stop offset="75%" stopColor="#962fbf"/>
                        <stop offset="100%" stopColor="#4f5bd5"/>
                      </linearGradient>
                    </defs>
                    <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-tab)" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="5" stroke="url(#ig-tab)" strokeWidth="2"/>
                    <circle cx="17.5" cy="6.5" r="1.5" fill="url(#ig-tab)"/>
                  </svg>
                  Instagram Business
                  <Badge variant="secondary" className="ml-1">
                    {MOCK_PAGES.filter((p) => p.platform === "instagram").length}
                  </Badge>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Connect Card */}
              <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl border border-blue-100 p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
                    <PlatformIcon platform={activeTab} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      Kết nối {activeTab === "facebook" ? "Facebook Page" : "Instagram Business"}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Kết nối {activeTab === "facebook" ? "Facebook Page" : "Instagram Business"} của khoa với uChat để nhận và trả lời tin nhắn tự động.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {activeTab === "facebook" ? (
                        <>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                            <CheckCircle2Icon className="w-3 h-3" />
                            pages_messaging
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                            <CheckCircle2Icon className="w-3 h-3" />
                            pages_show_list
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                            <CheckCircle2Icon className="w-3 h-3" />
                            pages_read_engagement
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                            <CheckCircle2Icon className="w-3 h-3" />
                            instagram_basic
                          </span>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                            <CheckCircle2Icon className="w-3 h-3" />
                            instagram_manage_messages
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button className="shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all shrink-0">
                    <Link2Icon className="w-4 h-4 mr-2" />
                    Kết nối {activeTab === "facebook" ? "Facebook" : "Instagram"}
                  </Button>
                </div>
              </div>

              {/* Connected Pages */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Pages đã kết nối</h3>
                <Badge variant="secondary">{pages.length} pages</Badge>
              </div>

              {pages.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>Chưa có trang nào được kết nối</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pages.map((page) => (
                    <div
                      key={page.id}
                      className={cn(
                        "bg-white rounded-2xl border p-5 hover:shadow-md transition-shadow",
                        page.status === "expiring_soon"
                          ? "border-amber-200 ring-1 ring-amber-100"
                          : "border-gray-100"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                          <div
                            className={cn(
                              "w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md",
                              page.status === "active"
                                ? "bg-gradient-to-br from-blue-500 to-blue-600"
                                : "bg-gradient-to-br from-amber-400 to-orange-500"
                            )}
                          >
                            {page.name.charAt(0)}
                          </div>
                          <div
                            className={cn(
                              "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center",
                              page.status === "active" ? "bg-green-500" : "bg-amber-500"
                            )}
                          >
                            {page.status === "active" ? (
                              <CheckCircle2Icon className="w-2.5 h-2.5 text-white" />
                            ) : (
                              <AlertTriangleIcon className="w-2.5 h-2.5 text-white" />
                            )}
                          </div>
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-gray-900">{page.name}</h4>
                            <StatusBadge status={page.status} />
                          </div>
                          <p className="text-gray-400 text-sm mt-0.5">{page.username}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/>
                              </svg>
                              Page ID: {page.pageId}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                              </svg>
                              Kết nối: {page.connectedAt}
                            </span>
                          </div>
                        </div>
                        {/* Token Status */}
                        <TokenStatus page={page} />
                      </div>

                      {/* Warning Banner */}
                      {page.status === "expiring_soon" && (
                        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-3">
                          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                            <AlertTriangleIcon className="w-4 h-4 text-amber-600" />
                          </div>
                          <p className="text-sm text-amber-700">
                            Access Token sẽ hết hạn trong{" "}
                            <strong>{getTokenDaysLeft(page.tokenExpiresAt)} ngày</strong>.
                            Vui lòng OAuth lại ngay để tránh gián đoạn dịch vụ.
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
                        {page.status === "expiring_soon" ? (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-500/25"
                          >
                            <RefreshCwIcon className="w-4 h-4 mr-1.5" />
                            OAuth lại ngay
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm">
                            OAuth lại
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <UnplugIcon className="w-4 h-4 mr-1" />
                          Ngắt kết nối
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-sm">
                <InfoIcon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-semibold text-white mb-1">Access Token là gì?</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Access Token cho phép uChat gửi và nhận tin nhắn thay mặt Facebook Page của bạn.
                  Token có thời hạn và cần được gia hạn định kỳ. Khi token sắp hết hạn, hệ thống sẽ
                  gửi cảnh báo để bạn OAuth lại kịp thời.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
