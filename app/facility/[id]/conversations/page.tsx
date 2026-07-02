"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { useFindConversations, useFindMessages } from "@/lib/api/generated/chat-conversations/chat-conversations"
import { ConversationList } from "@/components/feature/facility/conversations/conversation-list"
import { StaffChatPanel } from "@/components/feature/facility/staff-chat-panel/staff-chat-panel"
import { HandoffPanel } from "@/components/feature/facility/conversations/handoff-panel"
import { useChatSocket } from "@/hooks/use-chat-socket"
import type { ChatConversationDetailResponseDto } from "@/lib/api/generated/model"

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia(query).matches
  })
  React.useEffect(() => {
    const media = window.matchMedia(query)
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [query])
  return matches
}

export default function ConversationsPage() {
  const params = useParams()
  const facilityId = params.id as string
  const isMobile = useMediaQuery("(max-width: 768px)")

  const [selectedId, setSelectedId] = React.useState<number | null>(null)
  const [filter, setFilter] = React.useState("all")
  const [handoffOpen, setHandoffOpen] = React.useState(false)

  const { joinConversation, leaveConversation } = useChatSocket({
    facilityId: Number(facilityId) || null,
  })

  React.useEffect(() => {
    if (selectedId) {
      joinConversation(selectedId)
    }
    return () => {
      if (selectedId) {
        leaveConversation(selectedId)
      }
    }
  }, [selectedId])

  const { data: conversationsData, isLoading } = useFindConversations()

  const conversations = React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const all: any[] = (conversationsData as any)?.data?.items || []
    if (filter === "all") return all
    if (filter === "pending")
      return all.filter((c) => c.status === "handoff_requested" || c.status === "staff_assigned")
    if (filter === "active")
      return all.filter((c) => c.status === "staff_active")
    return all
  }, [conversationsData, filter])

  const selectedConversation = React.useMemo(() => {
    if (!selectedId) return null
    return conversations.find((c: ChatConversationDetailResponseDto) => c.id === selectedId) || null
  }, [selectedId, conversations])

  const { data: messagesData, isLoading: isLoadingMessages } = useFindMessages(
    selectedId as number,
    { query: { enabled: !!selectedId } }
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const messages: any[] = (messagesData as any)?.data || []

  const showDetail = isMobile ? !!selectedId : true

  return (
    <div className="flex h-full">
      {/* Conversation List */}
      {(!isMobile || !selectedId) && (
        <div className={isMobile ? "w-full" : "w-[340px] shrink-0"}>
          <ConversationList
            conversations={conversations}
            selectedId={selectedId}
            onSelect={setSelectedId}
            isLoading={isLoading}
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>
      )}

      {/* Chat Panel */}
      {showDetail && (
        <StaffChatPanel
          conversation={selectedConversation}
          messages={messages}
          isLoadingMessages={isLoadingMessages}
          onHandoff={() => setHandoffOpen(true)}
          onBack={() => setSelectedId(null)}
          isMobile={isMobile}
        />
      )}

      {/* Handoff Panel */}
      <HandoffPanel
        open={handoffOpen}
        onOpenChange={setHandoffOpen}
        facilityId={facilityId}
      />
    </div>
  )
}
