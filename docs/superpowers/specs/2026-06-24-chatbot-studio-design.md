# Chatbot Studio Design Spec

## Goal

Replace the facility chatbot list page (`/facility/[id]/chatbots`) with a single **Chatbot Studio** page. Each facility may own exactly one chatbot. From this page, staff can create the first bot if missing, and customize its UI settings.

## Scope

### In scope

1. Sidebar navigation: rename group "Cấu hình chatbot" → "Chatbot Studio"; remove sub-item "Danh sách chatbot"; link the group directly to `/facility/[id]/chatbots`.
2. Delete the current list page UI (`ChatbotTable`, `ChatbotToolbar`, `ChatbotTableSkeleton`, dialogs) usage from `app/facility/[id]/chatbots/page.tsx`. Reuse the create dialog for the empty state.
3. Build a studio container page that:
   - lists bots for the facility (existing `useListChatbots` with `facility_id`),
   - shows an empty-state CTA when zero bots exist,
   - creates the bot via `ChatbotFormDialog`,
   - renders the single bot’s details and opens the UI customizer,
   - enforces one-bot-per-facility by hiding the create CTA once a bot exists.
4. Refactor `chat-customizer.tsx`:
   - switch from hard-coded dark theme to project design tokens (light mode: `background`, `card`, `primary`, `muted`, `border`, `foreground`, etc.),
   - receive `chatbotId` and use `useGetChatbotUiSetting` / `useUpdateChatbotUiSetting` to load/save,
   - map the flat API UI setting fields (`primary_color`, `background_color`, `header_background_color`, `header_text_color`, `bot_message_background_color`, `bot_message_text_color`, `user_message_background_color`, `user_message_text_color`, `border_radius`, `message_bubble_radius`, `chat_window_width`, `chat_window_height`, `welcome_message`, `placeholder_text`, `show_avatar`) to the visual state,
   - add a visible Save button with loading state and success/error toast feedback,
   - remove export/copy CSS features if they conflict with API-driven state (keep reset-to-default).
5. Keep existing chatbot create/update API hooks unchanged. Reuse `ChatbotFormDialog` for creating the first bot.

### Out of scope

- Launcher config, animation config, footer config, typography nested config (not exposed in the simple flat customizer).
- Validation on backend one-bot limit beyond UI-level hide of create CTA.
- Deleting bot from studio (users can still delete from admin if needed; not requested).

## Architecture

```
/facility/[id]/chatbots/page.tsx         (studio container)
  ├─ ChatbotFormDialog                   (create first bot)
  └─ ChatbotStudioContent
       ├─ EmptyChatbotState
       └─ ChatCustomizer chatbotId={bot.id}

chat-customizer.tsx                      (pure UI editing component)
  ├─ useGetChatbotUiSetting
  └─ useUpdateChatbotUiSetting
```

The container owns data fetching and the create dialog. The customizer owns local visual state and API mutation for UI settings.

## Data flow

1. Container loads chatbots for the facility.
2. If `items.length === 0`, show `EmptyChatbotState` with a "Tạo chatbot" button that opens `ChatbotFormDialog`.
3. After successful create, invalidate `/api/chatbots` list query; the page rerenders and shows the single bot.
4. `ChatCustomizer` receives the bot id, calls `useGetChatbotUiSetting(id)` to populate defaults.
5. User edits flat visual controls; on Save, call `useUpdateChatbotUiSetting({ id, data })`.
6. On success, toast success; on error, toast error with API message.

## Mapping API → UI controls (initial)

| Control | API field | Default fallback |
|---|---|---|
| Primary color | `primary_color` | project primary `#3b82f6` approx |
| Background | `background_color` | `--background` |
| Header background | `header_background_color` | `--card` |
| Header text | `header_text_color` | `--foreground` |
| Bot bubble background | `bot_message_background_color` | `--muted` |
| Bot bubble text | `bot_message_text_color` | `--foreground` |
| User bubble background | `user_message_background_color` | `--primary` |
| User bubble text | `user_message_text_color` | `--primary-foreground` |
| Border radius | `border_radius` | 12 |
| Bubble radius | `message_bubble_radius` | 12 |
| Window width | `chat_window_width` | 400 |
| Window height | `chat_window_height` | 520 |
| Welcome message | `welcome_message` | "Xin chào! Tôi có thể giúp gì cho bạn?" |
| Input placeholder | `placeholder_text` | "Nhập tin nhắn..." |
| Show avatar | `show_avatar` | true |

Preview still uses internal sample messages; welcome message is shown as first bot message in preview.

## Visual design

- The studio page uses the project light theme only. No dark customizer chrome.
- Left panel: layers replaced with a cleaner "Sections" accordion (Appearance, Header, Messages, Input, Window).
- Center: device preview on a subtle `bg-muted/40` canvas.
- Right panel: property controls aligned with shadcn forms.
- Save bar fixed at bottom right of the customizer or in the page header.

## Error handling

- Create mutation failure → toast with `error.response.data.message`.
- UI setting load failure → show inline retry button.
- UI setting update failure → toast and keep local edits so user can retry.

## Testing plan

1. Open `/facility/[id]/chatbots` for a facility with no bot → see empty state.
2. Create bot → dialog closes, studio shows customizer with loaded defaults.
3. Change primary color and save → reload page, color persists.
4. Switch sidebar link text reads "Chatbot Studio" and navigates correctly.
5. Try to create second bot → no create CTA visible (only one bot allowed at UI level).

## Open questions

None at this point; proceeding to implementation plan.
