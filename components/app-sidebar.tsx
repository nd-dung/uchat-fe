"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  BookOpenIcon,
  BuildingsIcon,
  ChartPieSliceIcon,
  FrameCornersIcon,
  GearSixIcon,
  MapTrifoldIcon,
  RobotIcon,
  SquaresFourIcon,
  TerminalWindowIcon,
  UsersIcon,
  WaveformIcon,
} from "@phosphor-icons/react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: <SquaresFourIcon weight="regular" className="size-5" />,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: <WaveformIcon weight="regular" className="size-5" />,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: <TerminalWindowIcon weight="regular" className="size-5" />,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Quản lý người dùng",
      url: "#",
      icon: <UsersIcon weight="regular" className="size-5" />,
      items: [
        {
          title: "Danh sách người dùng",
          url: "/admin/users",
        },
      ],
    },
    {
      title: "Quản lý khoa",
      url: "/admin/facilities",
      icon: <BuildingsIcon weight="regular" className="size-5" />,
    },
    {
      title: "Models",
      url: "#",
      icon: <RobotIcon weight="regular" className="size-5" />,
      items: [
        { title: "Genesis", url: "#" },
        { title: "Explorer", url: "#" },
        { title: "Quantum", url: "#" },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: <BookOpenIcon weight="regular" className="size-5" />,
      items: [
        { title: "Introduction", url: "#" },
        { title: "Get Started", url: "#" },
        { title: "Tutorials", url: "#" },
        { title: "Changelog", url: "#" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: <GearSixIcon weight="regular" className="size-5" />,
      items: [
        { title: "General", url: "#" },
        { title: "Team", url: "#" },
        { title: "Billing", url: "#" },
        { title: "Limits", url: "#" },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: <FrameCornersIcon weight="regular" className="size-5" />,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: <ChartPieSliceIcon weight="regular" className="size-5" />,
    },
    {
      name: "Travel",
      url: "#",
      icon: <MapTrifoldIcon weight="regular" className="size-5" />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
