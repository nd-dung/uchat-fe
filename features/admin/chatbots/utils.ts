export function getStatusLabel(status: string) {
  switch (status) {
    case "active":
      return "Hoạt động"
    case "inactive":
      return "Ngừng"
    default:
      return status
  }
}

export function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "active":
      return "default" as const
    case "inactive":
      return "secondary" as const
    default:
      return "outline" as const
  }
}
