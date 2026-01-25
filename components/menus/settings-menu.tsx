"use client"

import { Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function SettingsMenu() {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          تنظیمات
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          تنظیمات عمومی
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          تنظیمات کاربری
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          تنظیمات سیستم
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
