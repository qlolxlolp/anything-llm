"use client"

import { Zap } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import type { Device } from "@/lib/types"

interface AutoPilotMenuProps {
  selectedDevice: Device | null
}

export function AutoPilotMenu({ selectedDevice }: AutoPilotMenuProps) {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Zap className="h-4 w-4" />
          خلبان خودکار
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuItem onClick={() => router.push('/autopilot')}>
          فعال‌سازی خلبان خودکار
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/autopilot')}>
          تنظیمات خودکار
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/autopilot')}>
          گزارش عملکرد
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
