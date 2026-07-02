"use client"

import { io, type Socket } from "socket.io-client"

const SOCKET_NAMESPACE = "/chat"

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("access_token")
}

export function createSocket(): Socket {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001"
  const url = baseUrl.replace(/\/$/, "") + SOCKET_NAMESPACE
  const token = getToken()

  const socket = io(url, {
    autoConnect: false,
    transports: ["websocket", "polling"],
    withCredentials: true,
    ...(token ? { auth: { token } } : {}),
  })

  return socket
}

export function updateSocketAuth(socket: Socket): void {
  const token = getToken()
  if (token) {
    socket.auth = { token }
  }
}
