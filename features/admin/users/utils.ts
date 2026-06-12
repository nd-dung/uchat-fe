export function getRoleLabel(role: string) {
  switch (role) {
    case "super_admin":
      return "Super Admin"
    case "facility_admin":
      return "Facility Admin"
    case "facility_staff":
      return "Facility Staff"
    default:
      return role
  }
}

export function getRoleBadgeVariant(role: string) {
  switch (role) {
    case "super_admin":
      return "default" as const
    case "facility_admin":
      return "secondary" as const
    default:
      return "outline" as const
  }
}
