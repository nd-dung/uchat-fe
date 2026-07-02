"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Search, X, Plus } from "lucide-react"
import {
  SocialIntegrationStatCards,
} from "@/components/feature/facility/social-integration/social-integration-stat-cards"
import {
  AccountCard,
  AccountCardSkeleton,
  EmptyAccountCard,
} from "@/components/feature/facility/social-integration/account-cards"
import {
  ConnectDialog,
} from "@/components/feature/facility/social-integration/connect-dialog"
import {
  DisconnectDialog,
} from "@/components/feature/facility/social-integration/disconnect-dialog"
import { useSocialIntegrationFilters } from "@/features/facility/social-integration/use-social-integration-filters"
import {
  useListOmniAccounts,
  useDisconnectOmniAccount,
  type OmniAccountResponseDto,
} from "@/lib/api/manual/omni-accounts"
import { useListChatbots } from "@/lib/api/generated/chatbots/chatbots"
import type { ChatbotListItemResponseDto } from "@/lib/api/generated/model"
import { cn } from "@/lib/utils"
import { FacebookIcon, InstagramIcon } from "@/components/feature/facility/social-integration/platform-icons"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001"

export function SocialIntegrationPageClient() {
  const params = useParams()
  const facilityId = Number(params.id)
  const {
    channel,
    setChannel,
    search,
    setSearch,
    page,
    limit,
  } = useSocialIntegrationFilters()

  const {
    data: accountsData,
    isLoading: isLoadingAccounts,
    error: accountsError,
  } = useListOmniAccounts({
    channel: channel as "facebook" | "instagram",
    search: search || undefined,
    page,
    limit,
  })

  const { data: chatbotsData, isLoading: isLoadingChatbots } = useListChatbots({
    facility_id: facilityId,
  })

  const disconnectMutation = useDisconnectOmniAccount()

  const [connectDialogOpen, setConnectDialogOpen] = React.useState(false)
  const [disconnectDialogOpen, setDisconnectDialogOpen] = React.useState(false)
  const [selectedAccount, setSelectedAccount] =
    React.useState<OmniAccountResponseDto | null>(null)
  const [selectedChatbotId, setSelectedChatbotId] = React.useState("")

  const accounts = accountsData?.data?.items ?? []
  const allAccounts = React.useMemo(() => {
    if (!accountsData?.data?.items) return []
    return accountsData.data.items
  }, [accountsData])

  const facebookCount = allAccounts.filter(
    (a: OmniAccountResponseDto) => a.channel === "facebook"
  ).length
  const instagramCount = allAccounts.filter(
    (a: OmniAccountResponseDto) => a.channel === "instagram"
  ).length
  const filteredAccounts = accounts.filter(
    (a: OmniAccountResponseDto) => a.channel === channel
  )

  const chatbots = (chatbotsData?.data?.items ?? []) as ChatbotListItemResponseDto[]
  const defaultChatbot = chatbots.find((c) => c.status === "active") ?? chatbots[0]
  const safeChatbotId = selectedChatbotId || (defaultChatbot ? String(defaultChatbot.id) : "")

  React.useEffect(() => {
    if (accountsError) {
      toast.error("Không thể tải danh sách tài khoản kết nối.")
    }
  }, [accountsError])

  const handleConnect = () => {
    if (!defaultChatbot) {
      toast.error("Vui lòng tạo chatbot trước khi kết nối kênh MXH.")
      return
    }
    setConnectDialogOpen(true)
  }

  const handleConfirmConnect = () => {
    const chatbotId = Number(selectedChatbotId)
    if (!chatbotId) return
    const authUrl = `${API_BASE_URL}/api/omni/oauth/${channel}?chatbot_id=${chatbotId}`
    window.location.href = authUrl
  }

  const handleReconnect = (account: OmniAccountResponseDto) => {
    setSelectedChatbotId(String(account.chatbot_id))
    setChannel(account.channel as "facebook" | "instagram")
    setConnectDialogOpen(true)
  }

  const handleDisconnectClick = (account: OmniAccountResponseDto) => {
    setSelectedAccount(account)
    setDisconnectDialogOpen(true)
  }

  const handleConfirmDisconnect = async () => {
    if (!selectedAccount) return
    try {
      await disconnectMutation.mutateAsync(selectedAccount.id)
      toast.success("Đã ngắt kết nối tài khoản.")
      setDisconnectDialogOpen(false)
      setSelectedAccount(null)
    } catch {
      toast.error("Không thể ngắt kết nối. Vui lòng thử lại.")
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={`/facility/${facilityId}/dashboard`}>
                  Khoa
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Tích hợp Mạng xã hội</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div className="mx-auto w-full max-w-7xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">Tích hợp Mạng xã hội</h1>
              <p className="text-sm text-muted-foreground">
                Quản lý kết nối Facebook & Instagram với chatbot của khoa
              </p>
            </div>
            <Button onClick={handleConnect}>
              <Plus className="mr-2 h-4 w-4" />
              Kết nối mới
            </Button>
          </div>

          <SocialIntegrationStatCards />

          <div className="rounded-none border">
            <div className="flex flex-col sm:flex-row">
              <div className="flex border-b border-border sm:border-b-0 sm:border-r">
                <button
                  onClick={() => setChannel("facebook")}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors",
                    channel === "facebook"
                      ? "bg-muted text-foreground sm:border-r-2 sm:border-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <FacebookIcon className="h-4 w-4" />
                  Facebook
                  <Badge variant="secondary" className="ml-1 rounded-none">{facebookCount}</Badge>
                </button>
                <button
                  onClick={() => setChannel("instagram")}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors",
                    channel === "instagram"
                      ? "bg-muted text-foreground sm:border-r-2 sm:border-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <InstagramIcon className="h-4 w-4" />
                  Instagram
                  <Badge variant="secondary" className="ml-1 rounded-none">{instagramCount}</Badge>
                </button>
              </div>

              <div className="flex flex-1 items-center gap-3 p-3">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm tài khoản..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="rounded-none pl-9"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="hidden items-center gap-2 md:flex">
                  {(channel === "facebook" ? ["pages_messaging", "pages_show_list", "pages_read_engagement"] : ["instagram_basic", "instagram_manage_messages"]).map((scope) => (
                    <Badge key={scope} variant="outline" className="rounded-none font-mono text-xs">
                      {scope}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {isLoadingAccounts ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <AccountCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredAccounts.length === 0 ? (
            <EmptyAccountCard platform={channel as "facebook" | "instagram"} onConnect={handleConnect} />
          ) : (
            <div className="space-y-3">
              {filteredAccounts.map((account: OmniAccountResponseDto) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  onReconnect={handleReconnect}
                  onDisconnect={handleDisconnectClick}
                  isDisconnecting={
                    disconnectMutation.isPending && selectedAccount?.id === account.id
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ConnectDialog
        open={connectDialogOpen}
        onOpenChange={setConnectDialogOpen}
        platform={channel as "facebook" | "instagram"}
        chatbots={chatbots}
        selectedChatbotId={safeChatbotId}
        onChatbotChange={setSelectedChatbotId}
        onConfirm={handleConfirmConnect}
        isLoading={isLoadingChatbots}
      />

      <DisconnectDialog
        open={disconnectDialogOpen}
        onOpenChange={setDisconnectDialogOpen}
        account={selectedAccount}
        onConfirm={handleConfirmDisconnect}
        isLoading={disconnectMutation.isPending}
      />
    </div>
  )
}
