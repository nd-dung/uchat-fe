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
