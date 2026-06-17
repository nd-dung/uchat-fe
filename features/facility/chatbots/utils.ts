export function getStatusLabel(status: string) {
  switch (status) {
    case "active":
      return "Ho\u1ea1t \u0111\u1ed9ng"
    case "inactive":
      return "Ng\u1eebng"
    case "draft":
      return "B\u1ea3n nh\u00e1p"
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
    case "draft":
      return "outline" as const
    default:
      return "outline" as const
  }
}
