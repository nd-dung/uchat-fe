"use client"

import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"

export function useSocialIntegrationFilters() {
  const [filters, setFilters] = useQueryStates(
    {
      channel: parseAsString.withDefault("facebook"),
      search: parseAsString.withDefault(""),
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(20),
    },
    {
      shallow: false,
      throttleMs: 300,
    }
  )

  const setChannel = (channel: string) => {
    void setFilters({ channel, page: 1 })
  }

  const setSearch = (search: string) => {
    void setFilters({ search, page: 1 })
  }

  const setPage = (page: number) => {
    void setFilters({ page })
  }

  const clearFilters = () => {
    void setFilters({ channel: "facebook", search: "", page: 1, limit: 20 })
  }

  const isFiltered = filters.search !== "" || filters.channel !== "facebook"

  return {
    ...filters,
    filters,
    setFilters,
    setChannel,
    setSearch,
    setPage,
    clearFilters,
    isFiltered,
  }
}
