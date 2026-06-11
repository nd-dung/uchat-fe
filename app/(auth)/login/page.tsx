"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod/v4"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import type { ApiErrorResponseDto } from "@/lib/api/generated/model"
import type { AxiosError } from "axios"

const loginSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { signIn, isSigningIn, signInError } = useAuth()
  const [showPassword, setShowPassword] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const apiError = signInError as AxiosError<ApiErrorResponseDto> | null
  const apiErrorMessage = apiError?.response?.data?.message

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await signIn(data)
    } catch {
      // Error is already captured in signInError
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-background"
            >
              <path d="M4 4c0 2.5 2 5 6 5s6-2.5 6-5" />
              <path d="M4 4v12c0 2.5 2 5 6 5s6-2.5 6-5V4" />
              <path d="M10 9v7" />
              <path d="M14 9v7" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {apiErrorMessage && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {apiErrorMessage}
            </div>
          )}

          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              autoComplete="email"
              className="rounded border-transparent bg-muted px-4 py-2.5 focus-visible:ring-0 focus-visible:ring-offset-0"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                autoComplete="current-password"
                className="rounded border-transparent bg-muted px-4 py-2.5 pr-10 focus-visible:ring-0 focus-visible:ring-offset-0"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="mt-2 w-full"
            disabled={isSigningIn}
          >
            {isSigningIn && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isSigningIn ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  )
}