"use client"

import { Card } from "@/components/ui/card"
import { BarChart3, TrendingUp, FileText, Clock } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">تحلیل و گزارش</h1>
        <p className="text-muted-foreground">آمار و گزارش‌های عملکرد سیستم</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <FileText className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">اسناد پردازش شده</p>
              <p className="text-2xl font-bold">1,234</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">دقت OCR</p>
              <p className="text-2xl font-bold">95.2%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Clock className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">زمان پردازش متوسط</p>
              <p className="text-2xl font-bold">2.3s</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <BarChart3 className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">استفاده امروز</p>
              <p className="text-2xl font-bold">87</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">گزارش عملکرد هفتگی</h3>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            نمودار عملکرد هفتگی
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">آمار استفاده</h3>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            نمودار آمار استفاده
          </div>
        </Card>
      </div>
    </div>
  )
}
