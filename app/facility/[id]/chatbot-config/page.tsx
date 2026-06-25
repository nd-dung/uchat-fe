"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
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
import { toast } from "sonner"
import { Loader2, Save, Settings, Code } from "lucide-react"
import { useListChatbots } from "@/lib/api/generated/chatbots/chatbots"
import {
  useGetBehaviorSetting,
  useUpdateBehaviorSetting,
} from "@/lib/api/generated/chatbot-behavior-settings/chatbot-behavior-settings"
import type {
  ChatbotBehaviorSettingResponseDtoResponseTone,
  ChatbotBehaviorSettingResponseDtoResponseStyle,
  UpdateChatbotBehaviorSettingDto,
} from "@/lib/api/generated/model"
import { BehaviorTab } from "@/components/feature/facility/chatbot-config/behavior-tab"
import { EmbedTab } from "@/components/feature/facility/chatbot-config/embed-tab"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type MainTab = "behavior" | "embed"

export default function ChatbotConfigPage() {
  const params = useParams()
  const facilityId = Number(params.id)
  const queryClient = useQueryClient()

  const [mainTab, setMainTab] = React.useState<MainTab>("behavior")

  const { data: chatbotsData } = useListChatbots({ facility_id: facilityId })
  const chatbot = chatbotsData?.data?.items?.[0]

  const { data: behaviorData, isLoading: isLoadingBehavior } =
    useGetBehaviorSetting(chatbot?.id ?? 0, {
      query: { enabled: !!chatbot?.id },
    })

  const updateMutation = useUpdateBehaviorSetting()

  const behavior = behaviorData?.data

  const [form, setForm] = React.useState({
    system_prompt: "",
    support_scope: "",
    response_tone: "friendly" as ChatbotBehaviorSettingResponseDtoResponseTone,
    response_style:
      "detailed_answer" as ChatbotBehaviorSettingResponseDtoResponseStyle,
    fallback_message: "",
    out_of_scope_message: "",
    enable_human_handoff: false,
    handoff_trigger_message: "",
    temperature: 0.7,
    max_response_length: 1000,
  })

  React.useEffect(() => {
    if (behavior) {
      setForm({
        system_prompt: behavior.system_prompt ?? "",
        support_scope: behavior.support_scope ?? "",
        response_tone: behavior.response_tone,
        response_style: behavior.response_style,
        fallback_message: behavior.fallback_message ?? "",
        out_of_scope_message: behavior.out_of_scope_message ?? "",
        enable_human_handoff: behavior.enable_human_handoff,
        handoff_trigger_message: behavior.handoff_trigger_message ?? "",
        temperature: behavior.temperature ?? 0.7,
        max_response_length: behavior.max_response_length ?? 1000,
      })
    }
  }, [behavior])

  const handleSave = async () => {
    if (!chatbot?.id) return
    try {
      await updateMutation.mutateAsync({
        chatbotId: chatbot.id,
        data: {
          system_prompt: form.system_prompt || null,
          support_scope: form.support_scope || null,
          response_tone: form.response_tone,
          response_style: form.response_style,
          fallback_message: form.fallback_message || null,
          out_of_scope_message: form.out_of_scope_message || null,
          enable_human_handoff: form.enable_human_handoff,
          handoff_trigger_message: form.handoff_trigger_message || null,
          temperature: form.temperature,
          max_response_length: form.max_response_length,
        } as unknown as UpdateChatbotBehaviorSettingDto,
      })
      toast.success("Lưu cấu hình thành công")
      queryClient.invalidateQueries({
        queryKey: [`/api/chatbots/${chatbot.id}/behavior-setting`],
      })
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại")
    }
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
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
                <BreadcrumbPage>Cấu hình Chatbot</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4 pt-0">
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold">Cấu hình Chatbot</h1>
              <p className="text-sm text-muted-foreground">
                Cấu hình hành vi và mã nhúng chatbot
              </p>
            </div>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Lưu cấu hình
            </Button>
          </div>

          {isLoadingBehavior ? (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              Đang tải...
            </div>
          ) : (
            <div className="flex flex-1 gap-4 overflow-hidden">
              {/* Sidebar */}
              <div className="flex w-48 shrink-0 flex-col gap-1">
                <button
                  onClick={() => setMainTab("behavior")}
                  className={cn(
                    "flex items-center gap-2 rounded-none px-3 py-2 text-left text-sm font-medium transition-colors",
                    mainTab === "behavior"
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted/50"
                  )}
                >
                  <Settings className="h-4 w-4" />
                  Hành vi
                </button>
                <button
                  onClick={() => setMainTab("embed")}
                  className={cn(
                    "flex items-center gap-2 rounded-none px-3 py-2 text-left text-sm font-medium transition-colors",
                    mainTab === "embed"
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted/50"
                  )}
                >
                  <Code className="h-4 w-4" />
                  Mã nhúng
                </button>
              </div>

              {/* Content */}
              <ScrollArea className="flex-1">
                {mainTab === "behavior" ? (
                  <BehaviorTab form={form} onChange={setForm} />
                ) : (
                  <EmbedTab chatbotId={chatbot?.id} facilityId={facilityId} />
                )}
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
