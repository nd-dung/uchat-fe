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
        title: "Cấu hình chatbot",
        url: "#",
        icon: <BotIcon />,
        items: [
          {
            title: "Danh sách chatbot",
            url: `/facility/${facilityId}/chatbots`,
          },
        ],
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
      <SidebarHeader className="flex h-14 items-center px-4">
        <div className="flex items-center gap-2 font-semibold text-sm truncate">
          <Building2Icon className="h-5 w-5 shrink-0" />
          <span className="truncate">{facilityName}</span>
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
