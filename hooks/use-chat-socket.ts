"use client"

import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { createSocket, updateSocketAuth } from "@/lib/realtime/socket"
import { REALTIME_EVENTS } from "@/lib/realtime/events"
import type {
  RealtimeConversationAssignedPayload,
  RealtimeConversationStatusPayload,
  RealtimeHandoffPayload,
  RealtimeMessagePayload,
  RealtimeTypingPayload,
} from "@/lib/realtime/types"
import type { ChatMessageResponseDto } from "@/lib/api/generated/model"
import {
  getFindConversationsQueryKey,
  getFindMessagesQueryKey,
} from "@/lib/api/generated/chat-conversations/chat-conversations"
import type { Socket } from "socket.io-client"

const debug = (...args: unknown[]) => {
  console.debug("[chat-socket]", ...args)
}

export interface UseChatSocketOptions {
  facilityId: number | null
}

export interface UseChatSocketReturn {
  socket: Socket | null
  joinConversation: (conversationId: number) => void
  leaveConversation: (conversationId: number) => void
}

const messageQueryKey = getFindMessagesQueryKey
const conversationsQueryKey = () => getFindConversationsQueryKey(undefined)

export function useChatSocket({
  facilityId,
}: UseChatSocketOptions): UseChatSocketReturn {
  const queryClient = useQueryClient()
  const socketRef = React.useRef<Socket | null>(null)
  const selectedIdRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    selectedIdRef.current = null
  }, [])

  React.useEffect(() => {
    const socket = createSocket()
    socketRef.current = socket

    const onConnect = () => {
      debug("connected", socket.id)

      const currentSelectedId = selectedIdRef.current
      if (currentSelectedId) {
        debug("rejoining selected conversation after connect", currentSelectedId)
        socket.emit(
          REALTIME_EVENTS.CONVERSATION_JOIN,
          { conversation_id: currentSelectedId },
          (result: boolean) => {
            debug("rejoin conversation callback", currentSelectedId, result)
            if (result) {
              queryClient.invalidateQueries({
                queryKey: messageQueryKey(currentSelectedId),
              })
            }
          }
        )
      }
    }

    const onDisconnect = (reason: Socket.DisconnectReason) => {
      debug("disconnected", reason)
    }

    const onConnectError = (error: Error) => {
      debug("connect_error", error.message)
    }

    const onReconnectAttempt = (attempt: number) => {
      debug("reconnect_attempt", attempt)
    }

    const onReconnect = (attempt: number) => {
      debug("reconnect", attempt)
      updateSocketAuth(socket)
    }

    const onMessageNew = (payload: RealtimeMessagePayload) => {
      debug("message:new", payload.conversation_id, payload.message?.id)

      const conversationId = payload.conversation_id
      const message = payload.message as ChatMessageResponseDto | undefined
      if (!conversationId || !message) return

      queryClient.setQueryData(
        messageQueryKey(conversationId),
        (old: unknown) => {
          if (!old || typeof old !== "object") return old
          const typedOld = old as { data?: ChatMessageResponseDto[] }
          const messages = typedOld.data ?? []
          if (messages.some((m) => m.id === message.id)) {
            return old
          }
          return {
            ...old,
            data: [...messages, message],
          }
        }
      )

      queryClient.setQueryData(
        conversationsQueryKey(),
        (old: unknown) => {
          if (!old || typeof old !== "object") return old
          const typedOld = old as { data?: { items?: unknown[] } }
          const items = typedOld.data?.items ?? []
          const itemIndex = items.findIndex(
            (item) =>
              item &&
              typeof item === "object" &&
              "id" in item &&
              (item as { id: number }).id === conversationId
          )
          if (itemIndex === -1) return old

          const nextItems = [...items]
          nextItems[itemIndex] = {
            ...(nextItems[itemIndex] as Record<string, unknown>),
            last_message: message,
            last_message_at: message.sent_at,
          }
          return {
            ...old,
            data: {
              ...typedOld.data,
              items: nextItems,
            },
          }
        }
      )
    }

    const onTypingStart = (payload: RealtimeTypingPayload) => {
      debug("typing:start", payload.conversation_id, payload.sender_type)
    }

    const onTypingStop = (payload: RealtimeTypingPayload) => {
      debug("typing:stop", payload.conversation_id, payload.sender_type)
    }

    const onStatusChanged = (payload: RealtimeConversationStatusPayload) => {
      debug("conversation:status_changed", payload.conversation_id, payload.status)
      queryClient.setQueryData(
        conversationsQueryKey(),
        (old: unknown) => {
          if (!old || typeof old !== "object") return old
          const typedOld = old as { data?: { items?: unknown[] } }
          const items = typedOld.data?.items ?? []
          const itemIndex = items.findIndex(
            (item) =>
              item &&
              typeof item === "object" &&
              "id" in item &&
              (item as { id: number }).id === payload.conversation_id
          )
          if (itemIndex === -1) return old
          const nextItems = [...items]
          nextItems[itemIndex] = {
            ...(nextItems[itemIndex] as Record<string, unknown>),
            status: payload.status,
          }
          return {
            ...old,
            data: {
              ...typedOld.data,
              items: nextItems,
            },
          }
        }
      )
    }

    const onConversationClosed = (payload: RealtimeConversationStatusPayload) => {
      debug("conversation:closed", payload.conversation_id)
      onStatusChanged({
        conversation_id: payload.conversation_id,
        status: "closed",
      })
    }

    const onHandoffNew = (payload: RealtimeHandoffPayload) => {
      debug("handoff:new", payload.conversation_id, payload.status)
      queryClient.invalidateQueries({ queryKey: conversationsQueryKey() })
    }

    const onHandoffUpdated = (payload: RealtimeHandoffPayload) => {
      debug("handoff:updated", payload.conversation_id, payload.status)
      queryClient.invalidateQueries({ queryKey: conversationsQueryKey() })
    }

    const onConversationAssigned = (payload: RealtimeConversationAssignedPayload) => {
      debug("conversation:assigned", payload.conversation_id, payload.assigned_staff_id)
      queryClient.invalidateQueries({ queryKey: conversationsQueryKey() })
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    socket.on("connect_error", onConnectError)
    socket.io.on("reconnect_attempt", onReconnectAttempt)
    socket.io.on("reconnect", onReconnect)

    socket.on(REALTIME_EVENTS.MESSAGE_NEW, onMessageNew)
    socket.on(REALTIME_EVENTS.TYPING_START, onTypingStart)
    socket.on(REALTIME_EVENTS.TYPING_STOP, onTypingStop)
    socket.on(REALTIME_EVENTS.CONVERSATION_STATUS_CHANGED, onStatusChanged)
    socket.on(REALTIME_EVENTS.CONVERSATION_CLOSED, onConversationClosed)
    socket.on(REALTIME_EVENTS.HANDOFF_NEW, onHandoffNew)
    socket.on(REALTIME_EVENTS.HANDOFF_UPDATED, onHandoffUpdated)
    socket.on(REALTIME_EVENTS.CONVERSATION_ASSIGNED, onConversationAssigned)

    updateSocketAuth(socket)
    socket.connect()
    debug("connecting...")

    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
      socket.off("connect_error", onConnectError)
      socket.io.off("reconnect_attempt", onReconnectAttempt)
      socket.io.off("reconnect", onReconnect)

      socket.off(REALTIME_EVENTS.MESSAGE_NEW, onMessageNew)
      socket.off(REALTIME_EVENTS.TYPING_START, onTypingStart)
      socket.off(REALTIME_EVENTS.TYPING_STOP, onTypingStop)
      socket.off(
        REALTIME_EVENTS.CONVERSATION_STATUS_CHANGED,
        onStatusChanged
      )
      socket.off(REALTIME_EVENTS.CONVERSATION_CLOSED, onConversationClosed)
      socket.off(REALTIME_EVENTS.HANDOFF_NEW, onHandoffNew)
      socket.off(REALTIME_EVENTS.HANDOFF_UPDATED, onHandoffUpdated)
      socket.off(REALTIME_EVENTS.CONVERSATION_ASSIGNED, onConversationAssigned)

      if (socket.connected) {
        socket.disconnect()
      }
    }
  }, [queryClient])

  const joinConversation = React.useCallback(
    (conversationId: number) => {
      selectedIdRef.current = conversationId
      const socket = socketRef.current
      if (!socket || !socket.connected) {
        debug("joinConversation skipped: not connected", conversationId)
        return
      }
      debug("joining conversation", conversationId)
      socket.emit(
        REALTIME_EVENTS.CONVERSATION_JOIN,
        { conversation_id: conversationId },
        (result: boolean) => {
          debug("join conversation callback", conversationId, result)
        }
      )
    },
    []
  )

  const leaveConversation = React.useCallback(
    (conversationId: number) => {
      const socket = socketRef.current
      if (!socket || !socket.connected) {
        debug("leaveConversation skipped: not connected", conversationId)
        return
      }
      debug("leaving conversation", conversationId)
      socket.emit(
        REALTIME_EVENTS.CONVERSATION_LEAVE,
        { conversation_id: conversationId },
        (result: boolean) => {
          debug("leave conversation callback", conversationId, result)
        }
      )
      if (selectedIdRef.current === conversationId) {
        selectedIdRef.current = null
      }
    },
    []
  )

  React.useEffect(() => {
    if (facilityId) {
      debug("facility context ready", facilityId)
    }
  }, [facilityId])

  return {
    socket: socketRef.current,
    joinConversation,
    leaveConversation,
  }
}
