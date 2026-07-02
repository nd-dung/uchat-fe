"use client"

import * as React from "react"
import { Suspense } from "react"
import { FacilityTableSkeleton } from "@/components/feature/admin/facilities/facility-table-skeleton"
import { FacilitiesPageClient } from "./facilities-page-client"

export const dynamic = "force-dynamic"

export default function FacilitiesPage() {
  return (
    <Suspense fallback={<FacilityTableSkeleton />}>
      <FacilitiesPageClient />
    </Suspense>
  )
}
