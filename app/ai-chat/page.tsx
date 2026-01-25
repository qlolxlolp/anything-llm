"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Send, Bot, User } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "سلام! من دستیار هوشمند CanScan هستم. چطور می‌تونم کمکتون کنم؟",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "برای اسکن سند، ابتدا دستگاه اسکنر را از منوی 'کشف دستگاه' متصل کنید.",
        "می‌توانید از قابلیت OCR فارسی برای استخراج متن از تصاویر استفاده کنید.",
        "برای بهبود کیفیت تصاویر، از منوی 'ابزارهای هوش مصنوعی' > 'بهبود تصویر' استفاده کنید.",
        "آیا سوال خاصی درباره عملکرد سیستم دارید؟",
        "می‌توانم در تنظیمات OCR، تحلیل اسناد، یا مدیریت فایل‌ها کمکتان کنم."
      ]
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: randomResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">دستیار گفتگوی هوشمند</h1>
        <p className="text-muted-foreground">با دستیار هوشمند CanScan گفتگو کنید</p>
      </div>

      <Card className="h-[600px] flex flex-col">
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div className={`p-2 rounded-full ${
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                }`}>
                  {message.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div className={`max-w-[80%] ${
                  message.role === "user" ? "text-right" : ""
                }`}>
                  <div className={`p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString("fa-IR")}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-muted">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="پیام خود را بنویسید..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">سوالات متداول</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "چگونه اسکنر را متصل کنم؟",
            "OCR فارسی چطور کار می‌کند؟",
            "چگونه کیفیت تصاویر را بهبود دهم؟",
            "فایل‌ها کجا ذخیره می‌شوند؟"
          ].map((question, index) => (
            <Button
              key={index}
              variant="outline"
              className="justify-start h-auto p-3 text-right"
              onClick={() => setInputMessage(question)}
            >
              <MessageSquare className="h-4 w-4 ml-2 flex-shrink-0" />
              <span className="text-sm">{question}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
