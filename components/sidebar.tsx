'use client'

import { useEffect } from "react"

import type { Device } from '@/lib/types'
import { Printer, ScanLine, Usb, Wifi, Bluetooth, Plus, Monitor, HardDrive, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  devices: Device[]
  selectedDevice: Device | null
  onSelectDevice: (device: Device) => void
  onRequestDevice?: () => void
}

export function Sidebar({ devices, selectedDevice, onSelectDevice, onRequestDevice }: SidebarProps) {
  const getStatusGlow = (status: string) => {
    switch (status) {
      case "connected":
      case "ready":
        return "ready"
      case "busy":
        return "busy"
      case "error":
        return "error"
      case "offline":
        return "idle"
      default:
        return "idle"
    }
  }

  const getDeviceIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "scanner":
        return <ScanLine className="w-5 h-5" />
      case "printer":
        return <Printer className="w-5 h-5" />
      default:
        return <Monitor className="w-5 h-5" />
    }
  }

  const getConnectionIcon = (type: string) => {
    switch (type) {
      case "usb":
        return <Usb className="w-3.5 h-3.5" />
      case "network":
        return <Wifi className="w-3.5 h-3.5" />
      case "bluetooth":
        return <Bluetooth className="w-3.5 h-3.5" />
      default:
        return <Usb className="w-3.5 h-3.5" />
    }
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!e.altKey || devices.length === 0) return
      const idx = devices.findIndex((d) => d.id === selectedDevice?.id)
      if (e.key === "ArrowDown") {
        const next = idx >= 0 ? (idx + 1) % devices.length : 0
        onSelectDevice(devices[next])
      } else if (e.key === "ArrowUp") {
        const prev = idx >= 0 ? (idx - 1 + devices.length) % devices.length : devices.length - 1
        onSelectDevice(devices[prev])
      }
    }
    window.addEventListener("keydown", handler)
    return () => {
      window.removeEventListener("keydown", handler)
    }
  }, [devices, selectedDevice, onSelectDevice])

  return (
    <aside className="flex-shrink-0 w-72 bg-sidebar border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">دستگاه‌ها</h2>
          {onRequestDevice && (
            <button
              onClick={onRequestDevice}
              data-premium-button
              className="h-7 px-2 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>افزودن</span>
            </button>
          )}
        </div>


      </div>

      {/* Search Bar */}
      <div className="p-3 border-b border-border/50">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="جستجوی دستگاه..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <span data-kbd>K</span>
        </div>
      </div>

      {/* Device List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div data-sidebar-section>
          <div data-sidebar-section-title className="flex items-center justify-between">
            <span>متصل</span>
            <span className="text-[10px] text-muted-foreground/60">{devices.length}</span>
          </div>

          <div className="space-y-1 mt-1">
            {devices.map((device, index) => (
              <div
                key={device.id}
                onClick={() => onSelectDevice(device)}
                data-device-card
                data-selected={selectedDevice?.id === device.id}
                className="group"
              >
                {/* Device Icon with Connection Type */}
                <div className="relative">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                    selectedDevice?.id === device.id 
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground group-hover:bg-secondary/80"
                  )}>
                    {getDeviceIcon(device.type)}
                  </div>
                  <div className={cn(
                    "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded flex items-center justify-center",
                    "bg-background border border-border"
                  )}>
                    {getConnectionIcon(device.connectionType)}
                  </div>
                </div>

                {/* Device Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-sm font-medium truncate",
                      selectedDevice?.id === device.id ? "text-foreground" : "text-foreground/90"
                    )}>
                      {device.name}
                    </span>
                    <div data-status-glow={getStatusGlow(device.status)} />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground truncate">
                      {device.manufacturer}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60">
                      {device.type}
                    </span>
                  </div>
                </div>

                {/* Keyboard Shortcut */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <span data-kbd>{index + 1}</span>
                </div>
              </div>
            ))}

            {devices.length === 0 && (
              <div className="py-12 px-4 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary/50 flex items-center justify-center">
                  <HardDrive className="w-8 h-8 text-muted-foreground/40" />
                </div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  دستگاهی یافت نشد
                </p>
                <p className="text-xs text-muted-foreground/60 mb-4">
                  یک دستگاه اسکنر یا پرینتر متصل کنید
                </p>
                {onRequestDevice && (
                  <button
                    onClick={onRequestDevice}
                    data-premium-button
                    data-variant="primary"
                    className="w-full justify-center"
                  >
                    <Search className="w-4 h-4" />
                    <span>جستجوی دستگاه USB</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div data-status-bar>
        <div className="flex items-center gap-2 flex-1">
          <div data-status-glow={devices.length > 0 ? "ready" : "idle"} />
          <span className="truncate">
            {devices.length > 0 
              ? `${devices.length} دستگاه متصل`
              : "آماده برای اتصال"
            }
          </span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground/60">
          <span data-kbd className="text-[10px]">Alt</span>
          <span className="text-[10px]">+</span>
          <span data-kbd className="text-[10px]">Arrow</span>
        </div>
      </div>
    </aside>
  )
}
