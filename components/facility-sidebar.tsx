"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { useAuth } from "@/hooks/use-auth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  UsersIcon,
  Settings2Icon,
  BotIcon,
  SlidersHorizontalIcon,
  MessageSquareIcon,
  Link2Icon,
} from "lucide-react"
import { useGetFacility } from "@/lib/api/generated/facilities/facilities"
import { CurrentUserResponseDtoRole } from "@/lib/api/generated/model/currentUserResponseDtoRole"

const CONVERSATION_PERMISSIONS = [
  "conversation.view",
  "conversation.reply",
  "conversation.close",
  "handoff_request.view",
  "handoff_request.assign",
  "handoff_request.resolve",
]

export function FacilitySidebar({
  facilityId,
  ...props
}: { facilityId: number } & React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const { data: facilityData } = useGetFacility(facilityId, {
    query: {
      staleTime: 5 * 60 * 1000,
    },
  })
  const facilityName = facilityData?.data?.name || "Khoa"
  const facilityCode = facilityData?.data?.code || facilityName.charAt(0).toUpperCase()
  const isFacilityAdmin = user?.role === CurrentUserResponseDtoRole.facility_admin
  const userPermissions = user?.permissions ?? []
  const canViewConversations =
    isFacilityAdmin ||
    CONVERSATION_PERMISSIONS.some((permission) =>
      userPermissions.includes(permission)
    )

  const data = {
    user: {
      name: user?.name ?? "Người dùng",
      email: user?.email ?? "",
      avatar: user?.avatar ?? "",
    },
    navMain: [
      {
        title: "Dashboard",
        url: `/facility/${facilityId}/dashboard`,
        icon: <LayoutDashboardIcon />,
      },
      ...(isFacilityAdmin
        ? [
            {
              title: "Người dùng khoa",
              url: `/facility/${facilityId}/users`,
              icon: <UsersIcon />,
            },
            {
              title: "Cấu hình Chatbot",
              url: `/facility/${facilityId}/chatbot-config`,
              icon: <SlidersHorizontalIcon />,
            },
          ]
        : []),
      ...(canViewConversations
        ? [
            {
              title: "Cuộc trò chuyện",
              url: `/facility/${facilityId}/conversations`,
              icon: <MessageSquareIcon />,
            },
          ]
        : []),
      ...(isFacilityAdmin
        ? [
            {
              title: "Chatbot Studio",
              url: `/facility/${facilityId}/chatbots`,
              icon: <BotIcon />,
            },
            {
              title: "Tích hợp MXH",
              url: `/facility/${facilityId}/social-integration`,
              icon: <Link2Icon />,
            },
            {
              title: "Cài đặt",
              url: `/facility/${facilityId}/settings`,
              icon: <Settings2Icon />,
            },
          ]
        : []),
    ].filter(Boolean),
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex h-14 items-center px-4 py-2 bg-white border-b">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-white font-semibold text-sm shrink-0">
            {facilityCode}
          </div>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-sm truncate">{facilityName}</span>
            <span className="text-xs text-muted-foreground truncate">Management</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
