"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { DeviceDiscoveryMenu } from "./menus/device-discovery-menu"
import { DeviceActionsMenu } from "./menus/device-actions-menu"
import { AiToolsMenu } from "./menus/ai-tools-menu"
import { AiAgentMenu } from "./menus/ai-agent-menu"
import { AutoPilotMenu } from "./menus/auto-pilot-menu"
import { DataManagementMenu } from "./menus/data-management-menu"
import { AnalyticsMenu } from "./menus/analytics-menu"
import { SecurityMenu } from "./menus/security-menu"
import { CloudServicesMenu } from "./menus/cloud-services-menu"
import { IntegrationsMenu } from "./menus/integrations-menu"
import { SettingsMenu } from "./menus/settings-menu"
import { HelpSupportMenu } from "./menus/help-support-menu"
import type { Device } from "@/lib/types"
import { Home, Images, Bot, Zap } from "lucide-react"

interface HeaderProps {
  selectedDevice: Device | null
  scannedImage: string
  onScannedImage: (image: string) => void
}

export function Header({ selectedDevice, scannedImage, onScannedImage }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()

  const getStatusGlow = () => {
    if (!selectedDevice) return "idle"
    switch (selectedDevice.status) {
      case "Connected":
      case "ready":
        return "ready"
      case "Busy":
      case "busy":
        return "busy"
      case "Error":
      case "error":
        return "error"
      default:
        return "idle"
    }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!e.altKey) return
      if (e.key === "1") {
        router.push("/")
      } else if (e.key === "2") {
        router.push("/gallery")
      } else if (e.key === "3") {
        router.push("/agent")
      }
    }
    window.addEventListener("keydown", handler)
    return () => {
      window.removeEventListener("keydown", handler)
    }
  }, [router])

  const navItems = [
    { href: "/", label: "داشبورد", icon: Home, key: "1" },
    { href: "/gallery", label: "گالری اسناد", icon: Images, key: "2" },
    { href: "/agent", label: "عامل هوشمند", icon: Bot, key: "3" },
  ]

  return (
    <header className="shrink-0 z-50 bg-sidebar border-b border-border">
      {/* Top Bar - Brand and Device Status */}
      <div className="h-12 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold tracking-tight">CanScan</span>
          </div>

          {/* Separator */}
          <div className="h-5 w-px bg-border" />

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-nav-tab
                data-active={pathname === item.href}
                className={cn(
                  "group relative",
                  pathname === item.href && "text-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                <span data-kbd className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.key}
                </span>
                {pathname === item.href && (
                  <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Device Status */}
        <div className="flex items-center gap-3">
          {selectedDevice ? (
            <div data-glass-card className="flex items-center gap-3 px-3 py-1.5">
              <div data-status-glow={getStatusGlow()} />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-foreground leading-tight">
                  {selectedDevice.name}
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight">
                  {selectedDevice.manufacturer}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div data-status-glow="idle" />
              <span className="text-xs">دستگاهی متصل نیست</span>
            </div>
          )}
        </div>
      </div>

      {/* Menu Bar */}
      <div className="h-9 px-2 flex items-center gap-0.5 border-t border-border/50 bg-background/50 overflow-x-auto">
        <DeviceDiscoveryMenu className="text-xs" />
        <DeviceActionsMenu selectedDevice={selectedDevice} className="text-xs" />
        <AiToolsMenu scannedImage={scannedImage} className="text-xs" />
        <AiAgentMenu className="text-xs" />
        <AutoPilotMenu selectedDevice={selectedDevice} className="text-xs" />
        <DataManagementMenu className="text-xs" />
        <AnalyticsMenu className="text-xs" />
        <SecurityMenu className="text-xs" />
        <CloudServicesMenu className="text-xs" />
        <IntegrationsMenu className="text-xs" />
        <SettingsMenu className="text-xs" />
        <HelpSupportMenu className="text-xs" />
      </div>
    </header>
  )
}
