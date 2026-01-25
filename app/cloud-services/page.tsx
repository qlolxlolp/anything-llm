"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Cloud, Upload, Download, Sync, Settings, CheckCircle, AlertCircle } from "lucide-react"

export default function CloudServicesPage() {
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [autoSync, setAutoSync] = useState(true)
  const [cloudStorage, setCloudStorage] = useState("Google Drive")

  const handleConnect = () => {
    toast({ title: "اتصال به ابر", description: "در حال اتصال به سرویس ابری..." })
    setTimeout(() => {
      setIsConnected(true)
      toast({ title: "اتصال موفق", description: "با موفقیت به سرویس ابری متصل شدید" })
    }, 2000)
  }

  const handleSync = () => {
    setSyncProgress(0)
    toast({ title: "همگام‌سازی", description: "همگام‌سازی فایل‌ها شروع شد" })
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          toast({ title: "همگام‌سازی تکمیل شد", description: "تمام فایل‌ها همگام‌سازی شدند" })
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const handleBackup = () => {
    toast({ title: "پشتیبان‌گیری ابری", description: "پشتیبان‌گیری در ابر شروع شد" })
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">خدمات ابری</h1>
        <p className="text-muted-foreground">مدیریت همگام‌سازی و پشتیبان‌گیری ابری</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Status */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">وضعیت اتصال</h3>
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? "متصل" : "قطع"}
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Cloud className={`h-8 w-8 ${isConnected ? "text-green-500" : "text-gray-400"}`} />
              <div>
                <p className="font-medium">{cloudStorage}</p>
                <p className="text-sm text-muted-foreground">
                  {isConnected ? "متصل و آماده" : "قطع شده"}
                </p>
              </div>
            </div>
            
            {!isConnected ? (
              <Button onClick={handleConnect} className="w-full">
                اتصال به ابر
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>فضای استفاده شده</span>
                  <span>2.3 GB / 15 GB</span>
                </div>
                <Progress value={15} className="w-full" />
              </div>
            )}
          </div>
        </Card>

        {/* Sync Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">تنظیمات همگام‌سازی</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-sync">همگام‌سازی خودکار</Label>
              <Switch 
                id="auto-sync" 
                checked={autoSync}
                onCheckedChange={setAutoSync}
              />
            </div>
            
            <div className="space-y-2">
              <Label>سرویس ابری</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={cloudStorage}
                onChange={(e) => setCloudStorage(e.target.value)}
              >
                <option value="Google Drive">Google Drive</option>
                <option value="Dropbox">Dropbox</option>
                <option value="OneDrive">OneDrive</option>
                <option value="iCloud">iCloud</option>
              </select>
            </div>
            
            {syncProgress > 0 && syncProgress < 100 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>در حال همگام‌سازی...</span>
                  <span>{syncProgress}%</span>
                </div>
                <Progress value={syncProgress} className="w-full" />
              </div>
            )}
            
            <Button 
              onClick={handleSync} 
              disabled={!isConnected || (syncProgress > 0 && syncProgress < 100)}
              className="w-full"
            >
              <Sync className="h-4 w-4 mr-2" />
              همگام‌سازی دستی
            </Button>
          </div>
        </Card>

        {/* Cloud Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">عملیات ابری</h3>
          
          <div className="space-y-3">
            <Button 
              onClick={handleBackup} 
              disabled={!isConnected}
              className="w-full justify-start"
            >
              <Upload className="h-4 w-4 mr-2" />
              پشتیبان‌گیری ابری
            </Button>
            
            <Button 
              disabled={!isConnected}
              className="w-full justify-start"
            >
              <Download className="h-4 w-4 mr-2" />
              بازیابی از ابر
            </Button>
            
            <Button 
              variant="outline"
              disabled={!isConnected}
              className="w-full justify-start"
            >
              <Settings className="h-4 w-4 mr-2" />
              تنظیمات پیشرفته
            </Button>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">فعالیت‌های اخیر</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">همگام‌سازی موفق</p>
                <p className="text-xs text-muted-foreground">5 دقیقه پیش</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Upload className="h-4 w-4 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">آپلود فایل جدید</p>
                <p className="text-xs text-muted-foreground">15 دقیقه پیش</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">هشدار فضای کم</p>
                <p className="text-xs text-muted-foreground">1 ساعت پیش</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
