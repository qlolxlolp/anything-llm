"use client"

import { Cloud } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function CloudServicesMenu() {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Cloud className="h-4 w-4" />
          خدمات ابری
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuItem onClick={() => router.push('/cloud-services')}>
          همگام‌سازی ابری
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/cloud-services')}>
          پشتیبان‌گیری ابری
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/cloud-services')}>
          تنظیمات ابر
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
