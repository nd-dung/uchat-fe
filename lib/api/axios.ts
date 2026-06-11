import Axios, { type AxiosError, type AxiosRequestConfig } from "axios"

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001",
})

AXIOS_INSTANCE.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401 &&
      !window.location.pathname.startsWith("/login")
    ) {
      localStorage.removeItem("access_token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export const apiClient = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig
): Promise<T> => {
  return AXIOS_INSTANCE({
    ...config,
    ...options,
  }).then(({ data }) => data)
}

export type ErrorType<Error> = AxiosError<Error>
export type BodyType<BodyData> = BodyData