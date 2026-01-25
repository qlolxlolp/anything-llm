"use client"

import { Zap, Power, PowerOff, ScanLine, Printer, Settings, Wrench, RotateCw, Trash2 } from "lucide-react"
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
import type { Device } from "@/lib/types"
import { prepareDeviceById, startGenericScan } from "@/lib/usb-driver"

interface DeviceActionsMenuProps {
  selectedDevice: Device | null
}

export function DeviceActionsMenu({ selectedDevice }: DeviceActionsMenuProps) {
  const handleConnect = async () => {
    if (selectedDevice) {
      await prepareDeviceById(selectedDevice.id)
    }
  }

  const handleScan = async (dpi: number = 300, colorMode: string = "color") => {
    if (selectedDevice) {
      await prepareDeviceById(selectedDevice.id)
      await startGenericScan(selectedDevice.id)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" disabled={!selectedDevice}>
          <Zap className="h-4 w-4" />
          عملیات دستگاه
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Power className="h-4 w-4 mr-2 text-green-500" />
            اتصال
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-56">
            <DropdownMenuItem onClick={handleConnect}>
              <Power className="h-4 w-4 mr-2" />
              اتصال
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PowerOff className="h-4 w-4 mr-2" />
              قطع اتصال
            </DropdownMenuItem>
            <DropdownMenuItem>
              <RotateCw className="h-4 w-4 mr-2" />
              راه‌اندازی مجدد
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ScanLine className="h-4 w-4 mr-2 text-blue-500" />
            گزینه‌های اسکن
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-64">
            <DropdownMenuItem onClick={() => handleScan(300, "color")}>
              اسکن ساده (300 DPI)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleScan(600, "color")}>
              اسکن با کیفیت بالا (600 DPI)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleScan(1200, "color")}>
              اسکن پروفشنال (1200 DPI)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleScan(300, "color")}>
              اسکن رنگی
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleScan(300, "grayscale")}>
              اسکن خاکستری
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleScan(300, "bw")}>
              اسکن سیاه و سفید
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleScan(300, "duplex")}>
              اسکن دو طرفه خودکار
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Printer className="h-4 w-4 mr-2 text-purple-500" />
            گزینه‌های چاپ
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-56">
            <DropdownMenuItem>چاپ صفحه تست</DropdownMenuItem>
            <DropdownMenuItem>چاپ گزارش وضعیت</DropdownMenuItem>
            <DropdownMenuItem>چاپ پیکربندی شبکه</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Settings className="h-4 w-4 mr-2 text-slate-500" />
          تنظیمات دستگاه
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Wrench className="h-4 w-4 mr-2 text-amber-500" />
          عیب‌یابی
        </DropdownMenuItem>

        <DropdownMenuItem className="text-red-600">
          <Trash2 className="h-4 w-4 mr-2" />
          حذف دستگاه
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
