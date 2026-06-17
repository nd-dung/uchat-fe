import { FacilityLayoutClient } from "./facility-layout-client"

export default function FacilityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <FacilityLayoutClient>{children}</FacilityLayoutClient>
}
