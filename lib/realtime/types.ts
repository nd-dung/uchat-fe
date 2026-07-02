import type {
  ChatConversationDetailResponseDto,
  ChatMessageResponseDto,
} from "@/lib/api/generated/model"

export interface RealtimeMessagePayload {
  conversation_id: number
  message: ChatMessageResponseDto
}

export interface RealtimeTypingPayload {
  conversation_id: number
  sender_type: "visitor" | "bot" | "staff"
  sender_id?: number | null
}

export interface RealtimeConversationStatusPayload {
  conversation_id: number
  status: string
}

export interface RealtimeHandoffPayload {
  handoff_request_id: number
  conversation_id: number
  chatbot_id: number
  facility_id: number
  status: string
  priority: string
}

export interface RealtimeConversationAssignedPayload {
  conversation_id: number
  assigned_staff_id: number
}

export type RealtimeConversationListItem =
  ChatConversationDetailResponseDto

export type RealtimeConversationPatchFn = (
  conversationId: number,
  patch: Partial<RealtimeConversationListItem>
) => void
