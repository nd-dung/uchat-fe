"use client"

import * as React from "react"
import { Suspense } from "react"
import { UserTableSkeleton } from "@/components/feature/admin/users/user-table-skeleton"
import { UsersPageClient } from "./users-page-client"

export const dynamic = "force-dynamic"

export default function UsersPage() {
  return (
    <Suspense fallback={<UserTableSkeleton />}>
      <UsersPageClient />
    </Suspense>
  )
}
