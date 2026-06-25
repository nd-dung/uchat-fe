"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Loader2, Copy, Check, RefreshCw, Plus, X } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import {
  useGetChatbotEmbedSetting,
  useUpdateChatbotEmbedSetting,
  getGetChatbotEmbedSettingQueryKey,
} from "@/lib/api/generated/chatbots/chatbots"
import type { GetChatbotEmbedSettingResponse } from "@/lib/api/generated/model"
import { toast } from "sonner"

interface EmbedTabProps {
  chatbotId?: number
  facilityId: number
}

export function EmbedTab({ chatbotId, facilityId }: EmbedTabProps) {
  const queryClient = useQueryClient()
  const [copied, setCopied] = React.useState<string | null>(null)
  const [widgetUrl, setWidgetUrl] = React.useState("")
  const [newOrigin, setNewOrigin] = React.useState("")

  const queryKey = getGetChatbotEmbedSettingQueryKey(chatbotId ?? 0)

  const { data: embedData, isLoading } = useGetChatbotEmbedSetting(chatbotId ?? 0, {
    query: { enabled: !!chatbotId },
  })

  const updateMutation = useUpdateChatbotEmbedSetting()

  const embedSetting = embedData?.data

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setWidgetUrl(window.location.origin)
    }
  }, [])

  const scriptCode = chatbotId
    ? `<script src="${widgetUrl}/widget.js" data-facility="${facilityId}" data-chatbot="${chatbotId}" async></script>`
    : `<script src="${widgetUrl}/widget.js" data-facility="${facilityId}" async></script>`

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      console.error("Failed to copy")
    }
  }

  const optimisticUpdate = (updater: (prev: GetChatbotEmbedSettingResponse) => GetChatbotEmbedSettingResponse) => {
    const previous = queryClient.getQueryData<GetChatbotEmbedSettingResponse>(queryKey)
    queryClient.setQueryData<GetChatbotEmbedSettingResponse>(queryKey, (old) => {
      if (!old) return old
      return updater(old)
    })
    return { previous }
  }

  const rollback = (previous: GetChatbotEmbedSettingResponse | undefined) => {
    queryClient.setQueryData<GetChatbotEmbedSettingResponse>(queryKey, previous)
  }

  const handleToggleEnabled = async (enabled: boolean) => {
    if (!chatbotId) return
    const { previous } = optimisticUpdate((old) => ({
      ...old,
      data: { ...old.data!, enabled },
    }))
    try {
      await updateMutation.mutateAsync({
        id: chatbotId,
        data: { enabled },
      })
      toast.success(enabled ? "Đã bật nhúng widget" : "Đã tắt nhúng widget")
    } catch {
      rollback(previous)
      toast.error("Có lỗi xảy ra")
    }
  }

  const handleAddOrigin = async () => {
    if (!chatbotId || !newOrigin.trim()) return
    const origins = [...(embedSetting?.allowed_origins ?? []), newOrigin.trim()]
    const { previous } = optimisticUpdate((old) => ({
      ...old,
      data: { ...old.data!, allowed_origins: origins },
    }))
    try {
      await updateMutation.mutateAsync({
        id: chatbotId,
        data: { allowed_origins: origins },
      })
      setNewOrigin("")
      toast.success("Đã thêm origin")
    } catch {
      rollback(previous)
      toast.error("Có lỗi xảy ra")
    }
  }

  const handleRemoveOrigin = async (origin: string) => {
    if (!chatbotId) return
    const origins = (embedSetting?.allowed_origins ?? []).filter((o) => o !== origin)
    const { previous } = optimisticUpdate((old) => ({
      ...old,
      data: { ...old.data!, allowed_origins: origins },
    }))
    try {
      await updateMutation.mutateAsync({
        id: chatbotId,
        data: { allowed_origins: origins },
      })
      toast.success("Đã xóa origin")
    } catch {
      rollback(previous)
      toast.error("Có lỗi xảy ra")
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted-foreground">
        Đang tải...
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Enable/Disable */}
      <div className="rounded-none border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Bật nhúng widget</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Cho phép nhúng chatbot trên các trang web
            </p>
          </div>
          <Switch
            checked={embedSetting?.enabled ?? false}
            onCheckedChange={handleToggleEnabled}
            disabled={updateMutation.isPending}
          />
        </div>
      </div>

      {/* Public Key */}
      <div className="rounded-none border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Public Key</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Khóa công khai dùng để xác thực widget
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-none"
            onClick={() => copyToClipboard(embedSetting?.public_key ?? "", "key")}
          >
            {copied === "key" ? (
              <Check className="mr-2 h-4 w-4 text-green-500" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            {copied === "key" ? "Đã copy" : "Copy"}
          </Button>
        </div>
        <pre className="overflow-x-auto rounded-none border bg-muted p-4 text-sm">
          <code>{embedSetting?.public_key ?? "Chưa có"}</code>
        </pre>
      </div>

      {/* Allowed Origins */}
      <div className="rounded-none border p-4 space-y-3">
        <div>
          <h3 className="text-sm font-semibold">Nguồn được phép (Allowed Origins)</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Danh sách domain được phép nhúng widget
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="https://example.com"
            value={newOrigin}
            onChange={(e) => setNewOrigin(e.target.value)}
            className="rounded-none"
            onKeyDown={(e) => e.key === "Enter" && handleAddOrigin()}
          />
          <Button
            variant="outline"
            size="icon"
            className="rounded-none shrink-0"
            onClick={handleAddOrigin}
            disabled={!newOrigin.trim() || updateMutation.isPending}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {(embedSetting?.allowed_origins ?? []).length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Chưa có domain nào. Thêm domain để giới hạn truy cập widget.
            </p>
          ) : (
            (embedSetting?.allowed_origins ?? []).map((origin) => (
              <div
                key={origin}
                className="flex items-center justify-between rounded-none border px-3 py-2"
              >
                <span className="text-sm font-mono">{origin}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleRemoveOrigin(origin)}
                  disabled={updateMutation.isPending}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Script Code */}
      <div className="rounded-none border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Script Tag</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Thêm script tag này vào trang web của bạn
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-none"
            onClick={() => copyToClipboard(scriptCode, "script")}
          >
            {copied === "script" ? (
              <Check className="mr-2 h-4 w-4 text-green-500" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            {copied === "script" ? "Đã copy" : "Copy"}
          </Button>
        </div>
        <pre className="overflow-x-auto rounded-none border bg-muted p-4 text-sm">
          <code>{scriptCode}</code>
        </pre>
      </div>
    </div>
  )
}
