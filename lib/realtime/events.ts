export const REALTIME_EVENTS = {
  CONVERSATION_JOIN: "conversation:join",
  CONVERSATION_LEAVE: "conversation:leave",
  MESSAGE_NEW: "message:new",
  TYPING_START: "typing:start",
  TYPING_STOP: "typing:stop",
  CONVERSATION_STATUS_CHANGED: "conversation:status_changed",
  CONVERSATION_CLOSED: "conversation:closed",
  HANDOFF_NEW: "handoff:new",
  HANDOFF_UPDATED: "handoff:updated",
  CONVERSATION_ASSIGNED: "conversation:assigned",
} as const

export type RealtimeEventName =
  (typeof REALTIME_EVENTS)[keyof typeof REALTIME_EVENTS]
