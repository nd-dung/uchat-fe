"use client"

import * as React from "react"
import {
  useLogin,
  useLogout,
  useGetCurrentUser,
} from "@/lib/api/generated/auth/auth"
import { useRouter } from "next/navigation"
import type { LoginDto } from "@/lib/api/generated/model/loginDto"

function useHasToken() {
  const [hasToken, setHasToken] = React.useState(false)

  React.useEffect(() => {
    setHasToken(!!localStorage.getItem("access_token"))
    const handler = () => {
      setHasToken(!!localStorage.getItem("access_token"))
    }
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [])

  return hasToken
}

export function useAuth() {
  const router = useRouter()
  const hasToken = useHasToken()
  const loginMutation = useLogin()
  const logoutMutation = useLogout()

  const { data: userData, isLoading: isLoadingUser } = useGetCurrentUser(
    undefined,
    undefined
  )

  const signIn = async (credentials: LoginDto) => {
    const response = await loginMutation.mutateAsync({ data: credentials })
    if (response?.data?.access_token) {
      localStorage.setItem("access_token", response.data.access_token)
      router.push("/")
    }
    return response
  }

  const signOut = async () => {
    try {
      await logoutMutation.mutateAsync()
    } finally {
      localStorage.removeItem("access_token")
      router.push("/login")
    }
  }

  const user = userData?.data
  const isAuthenticated = hasToken && !!user

  return {
    user: isAuthenticated ? user : null,
    isAuthenticated,
    isLoadingUser: hasToken && isLoadingUser,
    signIn,
    signOut,
    isSigningIn: loginMutation.isPending,
    signInError: loginMutation.error,
    isSigningOut: logoutMutation.isPending,
  }
}