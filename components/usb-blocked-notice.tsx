"use client"

import { ShieldAlert, Monitor, Usb, ExternalLink, RefreshCw, Info } from "lucide-react"

interface UsbBlockedNoticeProps {
  status: "unavailable" | "blocked"
}

export function UsbBlockedNotice({ status }: UsbBlockedNoticeProps) {
  const isBlocked = status === "blocked"
  
  return (
    <div className="flex h-screen w-full bg-background text-foreground items-center justify-center p-6">
      <div className="max-w-xl w-full rounded-full">
        {/* Main Card */}
        <div data-glass-card className="p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
            <ShieldAlert className="w-10 h-10 text-destructive" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-foreground mb-3 bg-background">
            {isBlocked ? "دسترسی به سخت‌افزار مسدود شده" : "WebUSB پشتیبانی نمی‌شود"}
          </h1>

          {/* Description */}
          <p className="text-muted-foreground mb-6 leading-relaxed">
            {isBlocked 
              ? "این برنامه در یک محیط محدود (iframe) اجرا می‌شود که دسترسی به WebUSB را مسدود کرده است. برای استفاده از قابلیت‌های واقعی اسکنر و پرینتر، لطفاً برنامه را در یک پنجره مستقل باز کنید."
              : "مرورگر شما از WebUSB API پشتیبانی نمی‌کند. لطفاً از Chrome، Edge یا مرورگری مبتنی بر Chromium استفاده کنید."
            }
          </p>

          {/* Technical Info */}
          <div className="bg-muted/30 rounded-lg p-4 mb-6 text-right">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">اطلاعات فنی:</p>
                {isBlocked ? (
                  <ul className="space-y-1 list-disc list-inside">
                    <li>خطا: Permissions Policy مانع دسترسی به WebUSB شده</li>
                    <li>علت: اجرا در iframe بدون مجوز usb</li>
                    <li>راه‌حل: باز کردن در پنجره جدید یا Deploy به Vercel</li>
                  </ul>
                ) : (
                  <ul className="space-y-1 list-disc list-inside">
                    <li>خطا: navigator.usb موجود نیست</li>
                    <li>علت: مرورگر از WebUSB پشتیبانی نمی‌کند</li>
                    <li>راه‌حل: استفاده از Chrome 61+ یا Edge</li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {isBlocked && (
              <a
                href={typeof window !== "undefined" ? window.location.href : "/"}
                target="_blank"
                rel="noopener noreferrer"
                data-premium-button
                data-variant="primary"
                className="justify-center text-card"
              >
                <ExternalLink className="w-4 h-4" />
                <span>باز کردن در پنجره جدید</span>
              </a>
            )}
            
            <button
              onClick={() => window.location.reload()}
              data-premium-button
              className="justify-center"
            >
              <RefreshCw className="w-4 h-4" />
              <span>تلاش مجدد</span>
            </button>
          </div>
        </div>

        {/* Requirements */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div data-glass-card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Monitor className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">مرورگر سازگار</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Chrome 61+, Edge 79+, Opera 48+
            </p>
          </div>

          <div data-glass-card className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Usb className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">اتصال مستقیم</span>
            </div>
            <p className="text-xs text-muted-foreground">
              دستگاه USB باید مستقیماً متصل باشد
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          این یک نسخه تجاری است و تمام عملیات‌ها با سخت‌افزار واقعی انجام می‌شوند.
        </p>
      </div>
    </div>
  )
}
