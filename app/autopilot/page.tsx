"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Zap, Play, Pause, Settings, BarChart3, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function AutoPilotPage() {
  const { toast } = useToast()
  const [isActive, setIsActive] = useState(false)
  const [autoScan, setAutoScan] = useState(true)
  const [autoOCR, setAutoOCR] = useState(true)
  const [autoOrganize, setAutoOrganize] = useState(false)
  const [autoBackup, setAutoBackup] = useState(true)
  const [efficiency, setEfficiency] = useState(87)

  const handleToggleAutoPilot = () => {
    setIsActive(!isActive)
    toast({
      title: isActive ? "خلبان خودکار غیرفعال شد" : "خلبان خودکار فعال شد",
      description: isActive ? "عملیات دستی فعال شد" : "عملیات خودکار شروع شد"
    })
  }

  const automationTasks = [
    { id: 1, name: "اسکن خودکار", description: "اسکن خودکار اسناد جدید", active: autoScan, count: 45 },
    { id: 2, name: "OCR خودکار", description: "استخراج خودکار متن", active: autoOCR, count: 38 },
    { id: 3, name: "سازماندهی خودکار", description: "دسته‌بندی خودکار فایل‌ها", active: autoOrganize, count: 12 },
    { id: 4, name: "پشتیبان‌گیری خودکار", description: "پشتیبان‌گیری روزانه", active: autoBackup, count: 7 }
  ]

  const recentActivities = [
    { id: 1, action: "اسکن خودکار", file: "document_001.pdf", time: "2 دقیقه پیش", status: "success" },
    { id: 2, action: "OCR پردازش", file: "invoice_042.jpg", time: "5 دقیقه پیش", status: "success" },
    { id: 3, action: "سازماندهی", file: "contract_15.pdf", time: "10 دقیقه پیش", status: "warning" },
    { id: 4, action: "پشتیبان‌گیری", file: "backup_daily.zip", time: "1 ساعت پیش", status: "success" }
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">خلبان خودکار</h1>
        <p className="text-muted-foreground">مدیریت عملیات خودکار سیستم</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Control */}
        <Card className="p-6">
          <div className="text-center space-y-4">
            <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${
              isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
            }`}>
              <Zap className="h-10 w-10" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold">خلبان خودکار</h3>
              <Badge variant={isActive ? "default" : "secondary"} className="mt-2">
                {isActive ? "فعال" : "غیرفعال"}
              </Badge>
            </div>
            
            <Button 
              onClick={handleToggleAutoPilot}
              className="w-full"
              variant={isActive ? "destructive" : "default"}
            >
              {isActive ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  توقف
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  شروع
                </>
              )}
            </Button>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>کارایی سیستم</span>
                <span>{efficiency}%</span>
              </div>
              <Progress value={efficiency} className="w-full" />
            </div>
          </div>
        </Card>

        {/* Automation Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="h-5 w-5" />
            <h3 className="text-lg font-semibold">تنظیمات خودکار</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>اسکن خودکار</Label>
                <p className="text-sm text-muted-foreground">اسکن خودکار اسناد جدید</p>
              </div>
              <Switch
                checked={autoScan}
                onCheckedChange={setAutoScan}
                disabled={!isActive}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>OCR خودکار</Label>
                <p className="text-sm text-muted-foreground">استخراج خودکار متن</p>
              </div>
              <Switch
                checked={autoOCR}
                onCheckedChange={setAutoOCR}
                disabled={!isActive}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>سازماندهی خودکار</Label>
                <p className="text-sm text-muted-foreground">دسته‌بندی خودکار فایل‌ها</p>
              </div>
              <Switch
                checked={autoOrganize}
                onCheckedChange={setAutoOrganize}
                disabled={!isActive}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>پشتیبان‌گیری خودکار</Label>
                <p className="text-sm text-muted-foreground">پشتیبان‌گیری روزانه</p>
              </div>
              <Switch
                checked={autoBackup}
                onCheckedChange={setAutoBackup}
                disabled={!isActive}
              />
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5" />
            <h3 className="text-lg font-semibold">آمار عملکرد</h3>
          </div>
          
          <div className="space-y-4">
            {automationTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium text-sm">{task.name}</p>
                  <p className="text-xs text-muted-foreground">{task.description}</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-lg">{task.count}</p>
                  <p className="text-xs text-muted-foreground">امروز</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activities */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5" />
              <h3 className="text-lg font-semibold">فعالیت‌های اخیر</h3>
            </div>
            
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {activity.status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {activity.status === "warning" && <AlertCircle className="h-4 w-4 text-orange-500" />}
                    {activity.status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}
                    
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.file}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge 
                      variant={
                        activity.status === "success" ? "default" :
                        activity.status === "warning" ? "secondary" : "destructive"
                      }
                    >
                      {activity.status === "success" ? "موفق" :
                       activity.status === "warning" ? "هشدار" : "خطا"}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
