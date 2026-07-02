"use client"

import * as React from "react"
import { Suspense } from "react"
import { SocialIntegrationPageClient } from "./social-integration-page-client"

export const dynamic = "force-dynamic"

export default function SocialIntegrationPage() {
  return (
    <Suspense fallback={null}>
      <SocialIntegrationPageClient />
    </Suspense>
  )
}
