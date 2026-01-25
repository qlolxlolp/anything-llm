"use client"

import { Search, Plus, Wifi, Usb, Bluetooth, Network, Radar } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface DeviceDiscoveryMenuProps {
  onDeviceFound?: (device: any) => void
}

export function DeviceDiscoveryMenu({ onDeviceFound }: DeviceDiscoveryMenuProps) {
  const { toast } = useToast()

  const handleUsbScan = async () => {
    // Check if running in development or localhost
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const isHTTPS = window.location.protocol === 'https:'
    
    if (!navigator.usb) {
      if (!isLocalhost && !isHTTPS) {
        toast({
          title: "نیاز به HTTPS",
          description: "Web USB API فقط در محیط HTTPS یا localhost کار می‌کند",
          variant: "destructive"
        })
      } else {
        toast({
          title: "عدم پشتیبانی",
          description: "Web USB API در این مرورگر پشتیبانی نمی‌شود. از Chrome یا Edge استفاده کنید",
          variant: "destructive"
        })
      }
      
      // Simulate device discovery for demo
      const mockDevice = {
        id: `mock-${Math.random().toString(36).substr(2, 9)}`,
        name: "اسکنر شبیه‌سازی شده",
        manufacturer: "Demo",
        type: "Scanner" as const,
        status: "ready" as const,
        connectionType: "usb" as const,
        vendorId: 0x1234,
        productId: 0x5678,
      }
      
      if (onDeviceFound) {
        onDeviceFound(mockDevice)
      }
      
      toast({
        title: "دستگاه شبیه‌سازی شده",
        description: "برای تست، یک اسکنر شبیه‌سازی شده اضافه شد"
      })
      return
    }

    try {
      toast({
        title: "در حال جستجو...",
        description: "جستجوی دستگاه‌های USB در حال انجام"
      })

      const device = await navigator.usb.requestDevice({
        filters: [
          { classCode: 7 }, // Printer
          { classCode: 0xff }, // Vendor-specific
          { vendorId: 0x04b8 }, // Epson
          { vendorId: 0x03f0 }, // HP
          { vendorId: 0x04a9 }, // Canon
        ]
      })

      await device.open()
      
      const deviceInfo = {
        id: `usb-${device.serialNumber || Math.random().toString(36).substr(2, 9)}`,
        name: device.productName || "Unknown Scanner",
        manufacturer: device.manufacturerName || "Unknown",
        type: "Scanner" as const,
        status: "ready" as const,
        connectionType: "usb" as const,
        vendorId: device.vendorId,
        productId: device.productId,
      }

      await device.close()
      
      if (onDeviceFound) {
        onDeviceFound(deviceInfo)
      }

      toast({
        title: "دستگاه یافت شد",
        description: `${deviceInfo.name} با موفقیت متصل شد`
      })
    } catch (error: any) {
      if (error.name === 'NotFoundError') {
        toast({
          title: "دستگاهی یافت نشد",
          description: "هیچ دستگاه سازگاری انتخاب نشد"
        })
      } else {
        toast({
          title: "خطا در اتصال",
          description: error.message || "خطای نامشخص",
          variant: "destructive"
        })
      }
    }
  }

  const handleNetworkScan = async (type: string) => {
    toast({
      title: "در حال جستجو...",
      description: `جستجوی ${type} در حال انجام`
    })
    
    // Simulate network scan
    setTimeout(() => {
      toast({
        title: "جستجو تکمیل شد",
        description: "هیچ دستگاه شبکه‌ای یافت نشد"
      })
    }, 2000)
  }

  const handleBluetoothScan = async () => {
    // Type assertion for Web Bluetooth API
    const nav = navigator as any
    
    if (!nav.bluetooth) {
      toast({
        title: "خطا",
        description: "Web Bluetooth API در این مرورگر پشتیبانی نمی‌شود",
        variant: "destructive"
      })
      return
    }

    try {
      toast({
        title: "در حال جستجو...",
        description: "جستجوی دستگاه‌های بلوتوث در حال انجام"
      })

      const device = await nav.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['generic_access']
      })

      toast({
        title: "دستگاه بلوتوث یافت شد",
        description: `${device.name || 'Unknown Device'} شناسایی شد`
      })
    } catch (error: any) {
      toast({
        title: "خطا در جستجوی بلوتوث",
        description: error.message || "خطای نامشخص",
        variant: "destructive"
      })
    }
  }

  const handleAddCustomIP = () => {
    // Open a dialog or navigate to device discovery page
    window.open('/device-discovery', '_blank')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Search className="h-4 w-4" />
          کشف دستگاه
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuItem onClick={handleUsbScan}>
          <Usb className="h-4 w-4 mr-2" />
          اسکن USB
        </DropdownMenuItem>
        
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Network className="h-4 w-4 mr-2" />
            اسکن شبکه
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-64">
            <DropdownMenuItem onClick={() => handleNetworkScan("شبکه محلی")}>
              <Radar className="h-4 w-4 mr-2" />
              اسکن سریع شبکه محلی
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNetworkScan("زیرشبکه")}>
              <Network className="h-4 w-4 mr-2" />
              اسکن پیشرفته زیرشبکه
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNetworkScan("دستگاه‌های بی‌سیم")}>
              <Wifi className="h-4 w-4 mr-2" />
              جستجوی دستگاه‌های بی‌سیم
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAddCustomIP}>
              <Plus className="h-4 w-4 mr-2" />
              افزودن محدوده IP سفارشی
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem onClick={handleBluetoothScan}>
          <Bluetooth className="h-4 w-4 mr-2" />
          جستجوی بلوتوث
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => window.open('/device-discovery', '_blank')}>
          <Plus className="h-4 w-4 mr-2" />
          افزودن دستی با IP
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
