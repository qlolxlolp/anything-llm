"use client"

import { Puzzle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function IntegrationsMenu() {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Puzzle className="h-4 w-4" />
          یکپارچه‌سازی
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuItem onClick={() => router.push('/integrations')}>
          اتصال به نرم‌افزارها
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/integrations')}>
          API و وب‌سرویس
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/integrations')}>
          افزونه‌ها
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
