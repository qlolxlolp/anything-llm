"use client"

import { Database } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function DataManagementMenu() {
  const { toast } = useToast()

  const handleBackup = () => {
    toast({
      title: "پشتیبان‌گیری",
      description: "پشتیبان‌گیری از داده‌ها شروع شد"
    })
  }

  const handleRestore = () => {
    toast({
      title: "بازیابی",
      description: "بازیابی داده‌ها شروع شد"
    })
  }

  const handleViewDatabase = () => {
    toast({
      title: "پایگاه داده",
      description: "نمایش پایگاه داده - به زودی..."
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Database className="h-4 w-4" />
          مدیریت داده
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuItem onClick={handleViewDatabase}>
          مشاهده پایگاه داده
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleBackup}>
          پشتیبان‌گیری
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleRestore}>
          بازیابی داده
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          تنظیمات ذخیره‌سازی
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
