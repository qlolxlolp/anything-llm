"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, User, System, Database } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">تنظیمات</h1>
        <p className="text-muted-foreground">مدیریت تنظیمات سیستم و کاربری</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            عمومی
          </TabsTrigger>
          <TabsTrigger value="user" className="gap-2">
            <User className="h-4 w-4" />
            کاربری
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <System className="h-4 w-4" />
            سیستم
          </TabsTrigger>
          <TabsTrigger value="database" className="gap-2">
            <Database className="h-4 w-4" />
            پایگاه داده
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">تنظیمات عمومی</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-save">ذخیره خودکار</Label>
                <Switch id="auto-save" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">اعلان‌ها</Label>
                <Switch id="notifications" defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">زبان</Label>
                <Input id="language" value="فارسی" readOnly />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="user">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">تنظیمات کاربری</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">نام کاربری</Label>
                <Input id="username" placeholder="نام کاربری خود را وارد کنید" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">ایمیل</Label>
                <Input id="email" type="email" placeholder="ایمیل خود را وارد کنید" />
              </div>
              <Button>ذخیره تغییرات</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">تنظیمات سیستم</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="debug-mode">حالت دیباگ</Label>
                <Switch id="debug-mode" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-update">به‌روزرسانی خودکار</Label>
                <Switch id="auto-update" defaultChecked />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="database">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">تنظیمات پایگاه داده</h3>
            <div className="space-y-4">
              <Button variant="outline">پشتیبان‌گیری</Button>
              <Button variant="outline">بازیابی</Button>
              <Button variant="destructive">پاک کردن داده‌ها</Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
