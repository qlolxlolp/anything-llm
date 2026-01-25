"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Shield, Lock, Key, Eye, AlertTriangle, CheckCircle, Users, FileText } from "lucide-react"

export default function SecurityPage() {
  const { toast } = useToast()
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [encryptionEnabled, setEncryptionEnabled] = useState(true)
  const [auditLogEnabled, setAuditLogEnabled] = useState(true)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدها را پر کنید",
        variant: "destructive"
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "خطا",
        description: "رمز عبور جدید و تکرار آن مطابقت ندارند",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "رمز عبور تغییر یافت",
      description: "رمز عبور شما با موفقیت تغییر یافت"
    })
    
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleEnable2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled)
    toast({
      title: twoFactorEnabled ? "احراز هویت دو مرحله‌ای غیرفعال شد" : "احراز هویت دو مرحله‌ای فعال شد",
      description: twoFactorEnabled ? "امنیت کاهش یافت" : "امنیت افزایش یافت"
    })
  }

  const securityEvents = [
    { id: 1, type: "login", message: "ورود موفق", time: "5 دقیقه پیش", severity: "info" },
    { id: 2, type: "password", message: "تغییر رمز عبور", time: "2 ساعت پیش", severity: "warning" },
    { id: 3, type: "access", message: "دسترسی به فایل محرمانه", time: "1 روز پیش", severity: "info" },
    { id: 4, type: "failed", message: "تلاش ناموفق ورود", time: "2 روز پیش", severity: "error" }
  ]

  const permissions = [
    { id: 1, user: "مدیر سیستم", role: "Admin", permissions: ["خواندن", "نوشتن", "حذف", "مدیریت"] },
    { id: 2, user: "کاربر عادی", role: "User", permissions: ["خواندن", "نوشتن"] },
    { id: 3, user: "مهمان", role: "Guest", permissions: ["خواندن"] }
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">امنیت</h1>
        <p className="text-muted-foreground">مدیریت امنیت و دسترسی‌ها</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5" />
            <h3 className="text-lg font-semibold">تنظیمات امنیتی</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>احراز هویت دو مرحله‌ای</Label>
                <p className="text-sm text-muted-foreground">افزایش امنیت با کد تأیید</p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={handleEnable2FA}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>رمزگذاری فایل‌ها</Label>
                <p className="text-sm text-muted-foreground">رمزگذاری خودکار اسناد</p>
              </div>
              <Switch
                checked={encryptionEnabled}
                onCheckedChange={setEncryptionEnabled}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>ثبت فعالیت‌ها</Label>
                <p className="text-sm text-muted-foreground">ثبت تمام عملیات کاربران</p>
              </div>
              <Switch
                checked={auditLogEnabled}
                onCheckedChange={setAuditLogEnabled}
              />
            </div>
          </div>
        </Card>

        {/* Password Change */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Key className="h-5 w-5" />
            <h3 className="text-lg font-semibold">تغییر رمز عبور</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-password">رمز عبور فعلی</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="new-password">رمز عبور جدید</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="confirm-password">تکرار رمز عبور جدید</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            
            <Button onClick={handleChangePassword} className="w-full">
              تغییر رمز عبور
            </Button>
          </div>
        </Card>

        {/* Access Management */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5" />
            <h3 className="text-lg font-semibold">مدیریت دسترسی</h3>
          </div>
          
          <div className="space-y-3">
            {permissions.map((perm) => (
              <div key={perm.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{perm.user}</p>
                  <p className="text-sm text-muted-foreground">{perm.role}</p>
                </div>
                <div className="flex gap-1">
                  {perm.permissions.map((permission, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full mt-4">
            <Users className="h-4 w-4 mr-2" />
            مدیریت کاربران
          </Button>
        </Card>

        {/* Security Events */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5" />
            <h3 className="text-lg font-semibold">گزارش امنیت</h3>
          </div>
          
          <div className="space-y-3">
            {securityEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-3 p-3 border rounded-lg">
                {event.severity === "error" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                {event.severity === "warning" && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                {event.severity === "info" && <CheckCircle className="h-4 w-4 text-green-500" />}
                
                <div className="flex-1">
                  <p className="text-sm font-medium">{event.message}</p>
                  <p className="text-xs text-muted-foreground">{event.time}</p>
                </div>
                
                <Badge 
                  variant={
                    event.severity === "error" ? "destructive" : 
                    event.severity === "warning" ? "secondary" : "default"
                  }
                >
                  {event.type}
                </Badge>
              </div>
            ))}
          </div>
          
          <Button variant="outline" className="w-full mt-4">
            <FileText className="h-4 w-4 mr-2" />
            مشاهده گزارش کامل
          </Button>
        </Card>
      </div>
    </div>
  )
}
