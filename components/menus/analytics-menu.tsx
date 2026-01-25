"use client"

import { BarChart3 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function AnalyticsMenu() {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BarChart3 className="h-4 w-4" />
          تحلیل و گزارش
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuItem onClick={() => router.push('/analytics')}>
          گزارش عملکرد
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/analytics')}>
          آمار استفاده
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/analytics')}>
          تحلیل اسناد
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
