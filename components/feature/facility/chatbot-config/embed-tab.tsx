"use client"

import * as React from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface EmbedTabProps {
  chatbotId?: number
  facilityId: number
}

export function EmbedTab({ chatbotId, facilityId }: EmbedTabProps) {
  const [copied, setCopied] = React.useState<string | null>(null)
  const [widgetUrl, setWidgetUrl] = React.useState("")

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setWidgetUrl(window.location.origin)
    }
  }, [])

  const scriptCode = chatbotId
    ? `<script src="${widgetUrl}/widget.js" data-facility="${facilityId}" data-chatbot="${chatbotId}" async></script>`
    : `<script src="${widgetUrl}/widget.js" data-facility="${facilityId}" async></script>`

  const fullHtmlCode = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Trang web của bạn</title>
</head>
<body>
  <h1>Chào mừng đến với trang web</h1>

  <!-- UChat Widget -->
  <div id="uchat-widget"></div>
  ${scriptCode}
</body>
</html>`

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch {
      console.error("Failed to copy")
    }
  }

  return (
    <div className="space-y-4">
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

      {/* Full HTML */}
      <div className="rounded-none border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">HTML Ví dụ</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Ví dụ cách nhúng widget vào trang web
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-none"
            onClick={() => copyToClipboard(fullHtmlCode, "html")}
          >
            {copied === "html" ? (
              <Check className="mr-2 h-4 w-4 text-green-500" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            {copied === "html" ? "Đã copy" : "Copy"}
          </Button>
        </div>
        <pre className="overflow-x-auto rounded-none border bg-muted p-4 text-sm">
          <code>{fullHtmlCode}</code>
        </pre>
      </div>

      {/* Instructions */}
      <div className="rounded-none border bg-muted/50 p-4">
        <h4 className="mb-2 text-sm font-semibold">Hướng dẫn tích hợp</h4>
        <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
          <li>Copy Script Tag ở trên</li>
          <li>Paste vào HTML trước thẻ &lt;/body&gt;</li>
          <li>Widget sẽ tự động hiển thị ở góc dưới bên phải</li>
          <li>Tùy chỉnh giao diện tại Chatbot Studio</li>
        </ol>
      </div>
    </div>
  )
}
