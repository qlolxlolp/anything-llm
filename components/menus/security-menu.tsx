"use client"

import { Shield } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function SecurityMenu() {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Shield className="h-4 w-4" />
          امنیت
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuItem onClick={() => router.push('/security')}>
          تنظیمات امنیتی
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/security')}>
          مدیریت دسترسی
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/security')}>
          گزارش امنیت
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
