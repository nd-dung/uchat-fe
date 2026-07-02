import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { apiClient, type ErrorType } from "../axios"
import type { ApiErrorResponseDto, ApiSuccessResponseDto } from "../generated/model"

export type OmniChannel = "facebook" | "instagram" | "zalo"
export type OmniAccountStatus = "active" | "disabled" | "error"

export interface OmniAccountResponseDto {
  id: number
  channel: OmniChannel
  facility_id: number
  chatbot_id: number
  external_account_id: string
  external_account_name: string | null
  status: OmniAccountStatus
  token_expires_at: string | null
  created_at: string
  updated_at: string
}

export interface OmniAccountListDataDto {
  items: OmniAccountResponseDto[]
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

export interface OmniAccountStatisticsDataDto {
  total: number
  active: number
  disabled: number
  error: number
}

export type OmniAccountListResponseDto = ApiSuccessResponseDto & {
  data?: OmniAccountListDataDto
}

export type OmniAccountStatisticsResponseDto = ApiSuccessResponseDto & {
  data?: OmniAccountStatisticsDataDto
}

export interface ListOmniAccountsParams {
  channel?: OmniChannel
  status?: OmniAccountStatus
  search?: string
  page?: number
  limit?: number
}

const OMNI_ACCOUNTS_QUERY_KEY = "/api/omni/accounts"
const OMNI_ACCOUNTS_STATISTICS_QUERY_KEY = "/api/omni/accounts/statistics"

export async function listOmniAccounts(
  params?: ListOmniAccountsParams,
  signal?: AbortSignal
) {
  return apiClient<OmniAccountListResponseDto>({
    url: OMNI_ACCOUNTS_QUERY_KEY,
    method: "GET",
    params,
    signal,
  })
}

export async function getOmniAccountStatistics(signal?: AbortSignal) {
  return apiClient<OmniAccountStatisticsResponseDto>({
    url: OMNI_ACCOUNTS_STATISTICS_QUERY_KEY,
    method: "GET",
    signal,
  })
}

export async function disconnectOmniAccount(id: number) {
  return apiClient<ApiSuccessResponseDto & { data?: { message: string } }>({
    url: `${OMNI_ACCOUNTS_QUERY_KEY}/${id}`,
    method: "DELETE",
  })
}

export function useListOmniAccounts(
  params?: ListOmniAccountsParams,
  options?: {
    query?: Partial<
      Parameters<typeof useQuery<OmniAccountListResponseDto, ErrorType<ApiErrorResponseDto>>>[0]
    >
  }
) {
  return useQuery<OmniAccountListResponseDto, ErrorType<ApiErrorResponseDto>>({
    queryKey: [OMNI_ACCOUNTS_QUERY_KEY, params],
    queryFn: ({ signal }) => listOmniAccounts(params, signal),
    ...options?.query,
  })
}

export function useGetOmniAccountStatistics(
  options?: {
    query?: Partial<
      Parameters<
        typeof useQuery<OmniAccountStatisticsResponseDto, ErrorType<ApiErrorResponseDto>>
      >[0]
    >
  }
) {
  return useQuery<OmniAccountStatisticsResponseDto, ErrorType<ApiErrorResponseDto>>({
    queryKey: [OMNI_ACCOUNTS_STATISTICS_QUERY_KEY],
    queryFn: ({ signal }) => getOmniAccountStatistics(signal),
    ...options?.query,
  })
}

export function useDisconnectOmniAccount(
  options?: {
    mutation?: Partial<
      Parameters<
        typeof useMutation<
          ApiSuccessResponseDto & { data?: { message: string } },
          ErrorType<ApiErrorResponseDto>,
          number
        >
      >[1]
    >
  }
) {
  const queryClient = useQueryClient()

  return useMutation<
    ApiSuccessResponseDto & { data?: { message: string } },
    ErrorType<ApiErrorResponseDto>,
    number
  >({
    mutationFn: disconnectOmniAccount,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [OMNI_ACCOUNTS_QUERY_KEY] })
      void queryClient.invalidateQueries({ queryKey: [OMNI_ACCOUNTS_STATISTICS_QUERY_KEY] })
    },
    ...options?.mutation,
  })
}
