"use client"

import { useQueryState, parseAsString } from "nuqs"

export function useUserFilters() {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""))
  const [role, setRole] = useQueryState("role", parseAsString.withDefault("all"))
  const [status, setStatus] = useQueryState("status", parseAsString.withDefault("all"))
  const [facility, setFacility] = useQueryState("facility", parseAsString.withDefault("all"))

  const listParams = (() => {
    const params: Record<string, string | number> = {}
    if (search) params.search = search
    if (role !== "all") params.role = role
    if (status !== "all") params.status = status
    if (facility !== "all") {
      params.facility_id = Number(facility)
    }
    return Object.keys(params).length > 0 ? params : undefined
  })()

  const isFiltered = role !== "all" || status !== "all" || facility !== "all"

  const clearFilters = () => {
    setRole("all")
    setStatus("all")
    setFacility("all")
  }

  return {
    search,
    setSearch,
    role,
    setRole,
    status,
    setStatus,
    facility,
    setFacility,
    listParams,
    isFiltered,
    clearFilters,
  }
}
