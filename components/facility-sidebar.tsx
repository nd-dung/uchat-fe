"use client"

import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
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
  Building2Icon,
  Settings2Icon,
  BotIcon,
  SlidersHorizontalIcon,
} from "lucide-react"
import { useGetFacility } from "@/lib/api/generated/facilities/facilities"

export function FacilitySidebar({
  facilityId,
  ...props
}: { facilityId: number } & React.ComponentProps<typeof Sidebar>) {
  const { data: facilityData } = useGetFacility(facilityId, {})
  const facilityName = facilityData?.data?.name || "Khoa"

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: `/facility/${facilityId}/dashboard`,
        icon: <LayoutDashboardIcon />,
      },
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
      {
        title: "Chatbot Studio",
        url: `/facility/${facilityId}/chatbots`,
        icon: <BotIcon />,
      },
      {
        title: "Thông tin khoa",
        url: `/facility/${facilityId}/profile`,
        icon: <Building2Icon />,
      },
      {
        title: "Cài đặt",
        url: `/facility/${facilityId}/settings`,
        icon: <Settings2Icon />,
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex h-14 items-center px-4 py-2 bg-white border-b">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500 text-white font-semibold text-sm shrink-0">
            {facilityName.charAt(0).toUpperCase()}
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
