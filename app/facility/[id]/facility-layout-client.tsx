"use client"

import { useParams } from "next/navigation"
import { FacilitySidebar } from "@/components/facility-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export function FacilityLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const facilityId = Number(params.id)

  return (
    <SidebarProvider>
      <FacilitySidebar facilityId={facilityId} />
      <SidebarInset>
        <main className="min-h-svh">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
