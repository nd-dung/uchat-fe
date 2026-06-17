"use client"

import * as React from "react"
import { useQueryState, parseAsString, parseAsInteger } from "nuqs"

export function useUserFilters() {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""))
  const [role, setRole] = useQueryState("role", parseAsString.withDefault("all"))
  const [status, setStatus] = useQueryState("status", parseAsString.withDefault("all"))
  const [facility, setFacility] = useQueryState("facility", parseAsString.withDefault("all"))
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
  const [limit] = React.useState(10)

  const listParams = (() => {
    const params: Record<string, string | number> = { page, limit }
    if (search) params.search = search
    if (role !== "all") params.role = role
    if (status !== "all") params.status = status
    if (facility !== "all") {
      params.facility_id = Number(facility)
    }
    return params
  })()

  const isFiltered = role !== "all" || status !== "all" || facility !== "all"

  const clearFilters = () => {
    setRole("all")
    setStatus("all")
    setFacility("all")
    setPage(1)
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
    page,
    setPage,
    limit,
    listParams,
    isFiltered,
    clearFilters,
  }
}
