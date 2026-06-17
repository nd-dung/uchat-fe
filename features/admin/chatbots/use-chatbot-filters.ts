"use client"

import * as React from "react"
import { useQueryState, parseAsString, parseAsInteger } from "nuqs"

export function useChatbotFilters() {
  const [search, setSearch] = useQueryState("search", parseAsString.withDefault(""))
  const [status, setStatus] = useQueryState("status", parseAsString.withDefault("all"))
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
  const [limit] = React.useState(10)

  const listParams = (() => {
    const params: Record<string, string | number> = { page, limit }
    if (search) params.search = search
    if (status !== "all") params.status = status
    return params
  })()

  const isFiltered = status !== "all"

  const clearFilters = () => {
    setStatus("all")
    setPage(1)
  }

  return {
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    limit,
    listParams,
    isFiltered,
    clearFilters,
  }
}
