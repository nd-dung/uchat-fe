# Chatbot Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the facility chatbot list page with a single "Chatbot Studio" page where a facility can own exactly one chatbot, create it if missing, and customize its UI using the generated UI-settings API.

**Architecture:** A thin `ChatbotStudioPage` container fetches the single facility chatbot and its UI setting, decides between an empty state (create) and the editor state (customize), and renders a reusable `ChatCustomizer` that only knows about UI-setting shapes and project theme tokens. Sidebar navigation and labels are updated to point to the studio.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query (Orval-generated hooks), Zod, react-hook-form, sonner.

---

## File Structure

- `app/facility/[id]/chatbots/page.tsx` — container page (fetch single bot, create bot, decide empty/editor view). Modified.
- `components/feature/facility/chatbots/chat-customizer.tsx` — pure UI customizer. Accepts `chatbotId`, `uiSetting`, `onChange`, `onSave`, `isSaving`. Modified (theme refactor + API shape mapping).
- `components/feature/facility/chatbots/chatbot-empty-state.tsx` — empty state when facility has no bot. Created.
- `components/feature/facility/chatbots/chatbot-form-dialog.tsx` — keep, remove editing mode, only create. Modified.
- `components/facility-sidebar.tsx` — rename nav item to "Chatbot Studio" and remove sub-menu. Modified.
- `lib/api/generated/model/chatbotUiSettingResponseDto.ts` and `updateChatbotUiSettingDto.ts` — read-only reference, do not edit.

---

### Task 1: Update sidebar navigation

**Files:**
- Modify: `components/facility-sidebar.tsx:35-67`

- [ ] **Step 1: Replace the "Cấu hình chatbot" group with a single "Chatbot Studio" item**

```tsx
{
  title: "Chatbot Studio",
  url: `/facility/${facilityId}/chatbots`,
  icon: <BotIcon />,
},
```

- [ ] **Step 2: Remove the nested `items` array entirely**

Old block to delete:

```tsx
      {
        title: "Cấu hình chatbot",
        url: "#",
        icon: <BotIcon />,
        items: [
          {
            title: "Danh sách chatbot",
            url: `/facility/${facilityId}/chatbots`,
          },
        ],
      },
```

- [ ] **Step 3: Verify no compile errors**

Run: `bunx tsc --noEmit -p tsconfig.json`
Expected: no errors in `components/facility-sidebar.tsx`.

- [ ] **Step 4: Commit**

```bash
git add components/facility-sidebar.tsx
git commit -m "feat(facility): rename chatbot nav to Chatbot Studio"
```

---

### Task 2: Create empty-state component for new bot

**Files:**
- Create: `components/feature/facility/chatbots/chatbot-empty-state.tsx`

- [ ] **Step 1: Write the empty-state component**

```tsx
"use client"

import { Bot, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Props {
  onCreate: () => void
}

export function ChatbotEmptyState({ onCreate }: Props) {
  return (
    <Card className="flex flex-1 flex-col items-center justify-center text-center">
      <CardHeader>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Bot className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-lg">Chưa có chatbot</CardTitle>
        <CardDescription>
          Mỗi khoa chỉ có một chatbot. Hãy tạo chatbot đầu tiên để bắt đầu tùy chỉnh giao diện.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo chatbot
        </Button>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Verify with TypeScript**

Run: `bunx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/feature/facility/chatbots/chatbot-empty-state.tsx
git commit -m "feat(chatbot-studio): add empty state component"
```

---

### Task 3: Convert page to Chatbot Studio container

**Files:**
- Modify: `app/facility/[id]/chatbots/page.tsx`
- Use existing: `components/feature/facility/chatbots/chatbot-empty-state.tsx`, `components/feature/facility/chatbots/chatbot-form-dialog.tsx`, `components/feature/facility/chatbots/chat-customizer.tsx`

- [ ] **Step 1: Replace the entire page content**

```tsx
"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ChatbotEmptyState } from "@/components/feature/facility/chatbots/chatbot-empty-state"
import { ChatbotFormDialog, type ChatbotFormValues } from "@/components/feature/facility/chatbots/chatbot-form-dialog"
import { ChatCustomizer } from "@/components/feature/facility/chatbots/chat-customizer"
import { useListChatbots, useCreateChatbot } from "@/lib/api/generated/chatbots/chatbots"
import type { ListChatbotsParams, CreateChatbotDto, ApiErrorResponseDto } from "@/lib/api/generated/model"
import { AxiosError } from "axios"
import { toast } from "sonner"

export default function ChatbotStudioPage() {
  const params = useParams()
  const facilityId = Number(params.id)
  const queryClient = useQueryClient()

  const listParams: ListChatbotsParams = { facility_id: facilityId }
  const { data: chatbotsData, isLoading: isLoadingChatbots } = useListChatbots(listParams)
  const chatbots = chatbotsData?.data?.items ?? []
  const chatbot = chatbots[0]

  const createMutation = useCreateChatbot()
  const [dialogOpen, setDialogOpen] = React.useState(false)

  const openCreate = () => setDialogOpen(true)

  const handleCreate = async (values: ChatbotFormValues) => {
    try {
      await createMutation.mutateAsync({
        data: { ...values, facility_id: facilityId, status: "draft" } as CreateChatbotDto,
      })
      toast.success("Tạo chatbot thành công")
      queryClient.invalidateQueries({ queryKey: ["/api/chatbots"] })
      setDialogOpen(false)
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponseDto>
      const message = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
      toast.error(message)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href={`/facility/${facilityId}/dashboard`}>Khoa</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem><BreadcrumbPage>Chatbot Studio</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
        <div>
          <h1 className="text-lg font-semibold">Chatbot Studio</h1>
          <p className="text-sm text-muted-foreground">Tạo và tùy chỉnh giao diện chatbot duy nhất của khoa</p>
        </div>

        {isLoadingChatbots ? (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">Đang tải...</div>
        ) : chatbot ? (
          <ChatCustomizer chatbotId={chatbot.id} />
        ) : (
          <ChatbotEmptyState onCreate={openCreate} />
        )}

        <ChatbotFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          editingChatbot={null}
          isSubmitting={createMutation.isPending}
          onSubmit={handleCreate}
        />
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript**

Run: `bunx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/facility/\[id\]/chatbots/page.tsx
unset HISTFILE && git commit -m "feat(chatbot-studio): replace list page with studio container"
```

---

### Task 4: Remove edit mode from chatbot create dialog

**Files:**
- Modify: `components/feature/facility/chatbots/chatbot-form-dialog.tsx:26-103`

- [ ] **Step 1: Update Props interface and title/description to create-only**

```tsx
interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  isSubmitting: boolean
  onSubmit: (values: ChatbotFormValues) => Promise<void>
}

export function ChatbotFormDialog({ open, onOpenChange, isSubmitting, onSubmit }: Props) {
  const { register, handleSubmit, reset } = useForm<ChatbotFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", display_name: "", description: "", status: "draft" },
  })

  React.useEffect(() => {
    if (open) reset({ name: "", display_name: "", description: "", status: "draft" })
  }, [open, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo chatbot</DialogTitle>
          <DialogDescription>Tạo chatbot mới trong khoa để bắt đầu tùy chỉnh giao diện.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(async (v) => await onSubmit(v))} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Tên chatbot</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="display_name">Tên hiển thị</Label>
            <Input id="display_name" {...register("display_name")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Mô tả</Label>
            <Input id="description" {...register("description")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Huỷ</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2Icon className="mr-1 h-4 w-4 animate-spin" />}
              Tạo
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

Note: keep `errors` import from `useForm` if still referenced.

- [ ] **Step 2: Verify TypeScript**

Run: `bunx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/feature/facility/chatbots/chatbot-form-dialog.tsx
git commit -m "refactor(chatbot-form): remove edit mode, create-only"
```

---

### Task 5: Refactor ChatCustomizer theme to project tokens

**Files:**
- Modify: `components/feature/facility/chatbots/chat-customizer.tsx:75-109`

- [ ] **Step 1: Replace default style colors with light project tokens**

```ts
const defaultStyle: ChatStyle = {
  backgroundColor: "oklch(1 0 0)",
  textColor: "oklch(0.148 0.004 228.8)",
  borderRadius: 12,
  userBubbleColor: "oklch(0.488 0.243 264.376)",
  botBubbleColor: "oklch(0.967 0.001 286.375)",
  userTextColor: "oklch(0.97 0.014 254.604)",
  botTextColor: "oklch(0.21 0.006 285.885)",
  chatBackground: "oklch(0.987 0.002 197.1)",
  borderColor: "oklch(0.925 0.005 214.3)",
  borderWidth: 1,
  shadowIntensity: 8,
  messageSpacing: 16,
  fontSize: 14,
  fontWeight: "400",
  inputHeight: 48,
  headerHeight: 72,
  animationSpeed: 200,
  enableAnimations: true,
  bubbleOpacity: 100,
  headerBackground: "oklch(1 0 0)",
  inputBackground: "oklch(1 0 0)",
  scrollbarColor: "oklch(0.56 0.021 213.5)",
  glowEffect: false,
  gradientBackground: false,
  blurEffect: 0,
  letterSpacing: 0,
  lineHeight: 1.5,
  paddingX: 16,
  paddingY: 12,
  maxWidth: 400,
  headerShadow: false,
  inputShadow: false,
  bubbleShadow: false,
}
```

- [ ] **Step 2: Update preview gradients/accents from hardcode purple to primary token**

Replace lines (around 564 and 611):

```tsx
<div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
```

and

```tsx
<div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-md">
```

Remove the old `bg-gradient-to-r from-primary to-accent` classes where they introduce non-token colors; keep `text-primary-foreground`.

- [ ] **Step 3: Remove purple glow hardcoding in container box-shadow**

Find:

```ts
boxShadow: `0 ${style.shadowIntensity}px ${style.shadowIntensity * 3}px rgba(0,0,0,0.15)${
  style.glowEffect ? `, 0 0 30px rgba(139, 92, 246, 0.2)` : ""
}`,
```

Replace with:

```ts
boxShadow: style.glowEffect
  ? `0 0 30px oklch(0.488 0.243 264.376 / 0.2)`
  : `0 ${style.shadowIntensity}px ${style.shadowIntensity * 3}px rgba(0,0,0,0.15)`,
```

- [ ] **Step 4: Verify TypeScript**

Run: `bunx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add components/feature/facility/chatbots/chat-customizer.tsx
git commit -m "refactor(chat-customizer): use light project theme tokens"
```

---

### Task 6: Map API UI setting into customizer state

**Files:**
- Modify: `components/feature/facility/chatbots/chat-customizer.tsx:39-146`

- [ ] **Step 1: Add imports for API hooks and types**

```tsx
import {
  useGetChatbotUiSetting,
  useUpdateChatbotUiSetting,
} from "@/lib/api/generated/chatbots/chatbots"
import type {
  ChatbotUiSettingResponseDto,
  UpdateChatbotUiSettingDto,
  ApiErrorResponseDto,
} from "@/lib/api/generated/model"
import { AxiosError } from "axios"
import { toast } from "sonner"
```

- [ ] **Step 2: Define mapper functions inside the component file**

```ts
function apiToStyle(api: ChatbotUiSettingResponseDto): ChatStyle {
  const chatWindow = api.chat_window as { background_color?: string; border_color?: string; border_width?: number; scrollbar_color?: string } | undefined
  const message = api.message as { gap?: number; padding_x?: number; padding_y?: number; bubble_opacity?: number } | undefined
  const typography = api.typography as { font_size?: number; font_weight?: number; letter_spacing?: number; line_height?: number } | undefined
  const input = api.input as { height?: number; background_color?: string } | undefined
  const header = api.header as { height?: number } | undefined
  const animation = api.animation as { enable_animations?: boolean; message_animation_duration?: number } | undefined

  return {
    backgroundColor: api.background_color,
    textColor: api.header_text_color,
    borderRadius: api.border_radius,
    userBubbleColor: api.user_message_background_color,
    botBubbleColor: api.bot_message_background_color,
    userTextColor: api.user_message_text_color,
    botTextColor: api.bot_message_text_color,
    chatBackground: chatWindow?.background_color ?? api.background_color,
    borderColor: chatWindow?.border_color ?? "#e5e7eb",
    borderWidth: chatWindow?.border_width ?? 1,
    shadowIntensity: 8,
    messageSpacing: message?.gap ?? 16,
    fontSize: typography?.font_size ?? 14,
    fontWeight: String(typography?.font_weight ?? 400),
    inputHeight: input?.height ?? 48,
    headerHeight: header?.height ?? 72,
    animationSpeed: animation?.message_animation_duration ?? 200,
    enableAnimations: animation?.enable_animations ?? true,
    bubbleOpacity: message?.bubble_opacity ?? 100,
    headerBackground: api.header_background_color,
    inputBackground: input?.background_color ?? api.background_color,
    scrollbarColor: chatWindow?.scrollbar_color ?? "#9ca3af",
    glowEffect: false,
    gradientBackground: false,
    blurEffect: 0,
    letterSpacing: typography?.letter_spacing ?? 0,
    lineHeight: typography?.line_height ?? 1.5,
    paddingX: message?.padding_x ?? 16,
    paddingY: message?.padding_y ?? 12,
    maxWidth: api.chat_window_width,
    headerShadow: false,
    inputShadow: false,
    bubbleShadow: false,
  }
}

function styleToApiUpdate(style: ChatStyle): UpdateChatbotUiSettingDto {
  return {
    primary_color: style.userBubbleColor,
    background_color: style.backgroundColor,
    header_background_color: style.headerBackground,
    header_text_color: style.textColor,
    bot_message_background_color: style.botBubbleColor,
    bot_message_text_color: style.botTextColor,
    user_message_background_color: style.userBubbleColor,
    user_message_text_color: style.userTextColor,
    chat_window: {
      background_color: style.chatBackground,
      border_color: style.borderColor,
      border_width: style.borderWidth,
      scrollbar_color: style.scrollbarColor,
    } as unknown as UpdateChatbotUiSettingDto["chat_window"],
    message: {
      gap: style.messageSpacing,
      padding_x: style.paddingX,
      padding_y: style.paddingY,
      bubble_opacity: style.bubbleOpacity,
    } as unknown as UpdateChatbotUiSettingDto["message"],
    typography: {
      font_size: style.fontSize,
      font_weight: Number(style.fontWeight),
      letter_spacing: style.letterSpacing,
      line_height: style.lineHeight,
    } as unknown as UpdateChatbotUiSettingDto["typography"],
    input: {
      height: style.inputHeight,
      background_color: style.inputBackground,
    } as unknown as UpdateChatbotUiSettingDto["input"],
    header: {
      height: style.headerHeight,
    } as unknown as UpdateChatbotUiSettingDto["header"],
    animation: {
      enable_animations: style.enableAnimations,
      message_animation_duration: style.animationSpeed,
    } as unknown as UpdateChatbotUiSettingDto["animation"],
  }
}
```

- [ ] **Step 3: Add `chatbotId` prop and integrate hooks**

Change component signature:

```tsx
interface ChatCustomizerProps {
  chatbotId: number
}

export function ChatCustomizer({ chatbotId }: ChatCustomizerProps) {
```

Inside the component, replace `const [style, setStyle] = useState<ChatStyle>(defaultStyle)` with:

```tsx
const { data: uiSettingData, isLoading: isLoadingUiSetting } = useGetChatbotUiSetting(chatbotId, {})
const uiSetting = uiSettingData?.data
const [style, setStyle] = useState<ChatStyle>(defaultStyle)
const [hasLocalChanges, setHasLocalChanges] = useState(false)

const updateMutation = useUpdateChatbotUiSetting()

useEffect(() => {
  if (uiSetting) {
    setStyle(apiToStyle(uiSetting))
    setHasLocalChanges(false)
  }
}, [uiSetting])
```

- [ ] **Step 4: Wrap `updateStyle` to flag local changes**

```tsx
const updateStyle = (key: keyof ChatStyle, value: string | number | boolean) => {
  setStyle((prev) => ({ ...prev, [key]: value }))
  setHasLocalChanges(true)
}
```

- [ ] **Step 5: Add save handler and wire to UI**

```tsx
const handleSave = async () => {
  try {
    await updateMutation.mutateAsync({ id: chatbotId, data: styleToApiUpdate(style) })
    toast.success("Lưu giao diện thành công")
    setHasLocalChanges(false)
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponseDto>
    const message = error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại"
    toast.error(message)
  }
}
```

In the right panel header (around line 705-720), add a "Lưu" button next to existing action buttons:

```tsx
<Button
  size="sm"
  onClick={handleSave}
  disabled={!hasLocalChanges || updateMutation.isPending}
>
  {updateMutation.isPending ? <Loader2Icon className="mr-1 h-4 w-4 animate-spin" /> : null}
  Lưu
</Button>
```

Add `Loader2Icon` to the lucide import list.

- [ ] **Step 6: Verify TypeScript**

Run: `bunx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add components/feature/facility/chatbots/chat-customizer.tsx
git commit -m "feat(chat-customizer): load and save UI settings via API"
```

---

### Task 7: Loading and error polish

**Files:**
- Modify: `components/feature/facility/chatbots/chat-customizer.tsx:406-997`

- [ ] **Step 1: Show loading state before UI setting is ready**

At the top of the returned JSX (after `if (isLoadingUiSetting) return (...)` guard), render a centered spinner:

```tsx
if (isLoadingUiSetting) {
  return (
    <div className="flex flex-1 items-center justify-center text-muted-foreground">
      <Loader2Icon className="h-6 w-6 animate-spin" />
      <span className="ml-2 text-sm">Đang tải cấu hình giao diện...</span>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript and run dev build**

Run:

```bash
bunx tsc --noEmit -p tsconfig.json
bun run build
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add components/feature/facility/chatbots/chat-customizer.tsx
git commit -m "feat(chat-customizer): add UI setting loading state"
```

---

### Task 8: Clean up obsolete chatbot list components (optional)

**Files:**
- Delete: `components/feature/facility/chatbots/chatbot-table.tsx`
- Delete: `components/feature/facility/chatbots/chatbot-table-skeleton.tsx`
- Delete: `components/feature/facility/chatbots/chatbot-toolbar.tsx`
- Delete: `components/feature/facility/chatbots/chatbot-delete-dialog.tsx`

Only delete if no other page imports them. Verify first with `bunx tsc` after deletion.

- [ ] **Step 1: Remove unused imports in page if any still reference them**
- [ ] **Step 2: Delete files**
- [ ] **Step 3: Run TypeScript**
- [ ] **Step 4: Commit**

```bash
git rm components/feature/facility/chatbots/chatbot-table.tsx \
  components/feature/facility/chatbots/chatbot-table-skeleton.tsx \
  components/feature/facility/chatbots/chatbot-toolbar.tsx \
  components/feature/facility/chatbots/chatbot-delete-dialog.tsx
git commit -m "chore(chatbot-studio): remove obsolete list components"
```

---

## Self-Review

- [ ] Spec coverage: sidebar rename, single-bot page, empty state, create-only dialog, light theme, API load/save, loading state, cleanup.
- [ ] Placeholder scan: no TBD/TODO left.
- [ ] Type consistency: `ChatbotFormValues`, `CreateChatbotDto`, `UpdateChatbotUiSettingDto`, `ChatbotUiSettingResponseDto` names match generated exports.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-24-chatbot-studio.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach do you prefer?
