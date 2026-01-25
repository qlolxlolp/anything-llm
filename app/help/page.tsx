"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { HelpCircle, Book, MessageCircle, Mail } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">راهنما و پشتیبانی</h1>
        <p className="text-muted-foreground">راهنمای استفاده و تماس با پشتیبانی</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Book className="h-6 w-6 text-blue-500" />
              <h3 className="text-lg font-semibold">راهنمای کاربری</h3>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                نحوه اتصال اسکنر
              </Button>
              <Button variant="outline" className="w-full justify-start">
                راهنمای OCR فارسی
              </Button>
              <Button variant="outline" className="w-full justify-start">
                مدیریت اسناد
              </Button>
              <Button variant="outline" className="w-full justify-start">
                تنظیمات پیشرفته
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <HelpCircle className="h-6 w-6 text-green-500" />
              <h3 className="text-lg font-semibold">سوالات متداول</h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">چگونه اسکنر را متصل کنم؟</h4>
                <p className="text-sm text-muted-foreground">
                  از منوی "کشف دستگاه" گزینه "اسکن USB" را انتخاب کنید.
                </p>
              </div>
              <div>
                <h4 className="font-medium">OCR فارسی کار نمی‌کند؟</h4>
                <p className="text-sm text-muted-foreground">
                  از تنظیمات OCR، گزینه "OCR فارسی" را فعال کنید.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <MessageCircle className="h-6 w-6 text-purple-500" />
            <h3 className="text-lg font-semibold">تماس با پشتیبانی</h3>
          </div>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">نام</Label>
              <Input id="name" placeholder="نام خود را وارد کنید" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input id="email" type="email" placeholder="ایمیل خود را وارد کنید" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">موضوع</Label>
              <Input id="subject" placeholder="موضوع پیام" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">پیام</Label>
              <Textarea id="message" placeholder="پیام خود را بنویسید" rows={4} />
            </div>
            <Button className="w-full">
              <Mail className="h-4 w-4 mr-2" />
              ارسال پیام
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
