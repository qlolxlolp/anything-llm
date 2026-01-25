"use client"

import { HelpCircle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function HelpSupportMenu() {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          راهنما و پشتیبانی
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuItem onClick={() => router.push('/help')}>
          راهنمای کاربری
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/help')}>
          تماس با پشتیبانی
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open('https://github.com/canscan', '_blank')}>
          درباره نرم‌افزار
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
