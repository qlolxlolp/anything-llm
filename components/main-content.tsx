"use client"

import { useState } from "react"
import type { Device } from "@/lib/types"
import { FileImage, Bot, ScanLine, Cpu, AlertTriangle, ArrowRight, Sparkles } from "lucide-react"
import { DocumentProcessor } from "./document-processor"
import { AIAgentDashboard } from "./ai-agent-dashboard"
import { cn } from "@/lib/utils"

interface MainContentProps {
  selectedDevice: Device | null
  scannedImage: string
  onScannedImage: (image: string) => void
  onDeviceFound?: (device: Device) => void
}

export function MainContent({ selectedDevice, scannedImage, onScannedImage, onDeviceFound }: MainContentProps) {
  const [activeTab, setActiveTab] = useState("scanner")

  const tabs = [
    { id: "scanner", label: "اسکنر و پردازش", icon: ScanLine, shortcut: "S" },
    { id: "agent", label: "عامل هوش مصنوعی", icon: Bot, shortcut: "A" },
  ]

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 px-4 pt-3 pb-0 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "group relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            <span 
              data-kbd 
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {tab.shortcut}
            </span>
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "scanner" && (
          <div className="animate-fade-in">
            {selectedDevice ? (
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div data-glass-card className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground">دستگاه متصل</span>
                      <div data-status-glow="ready" />
                    </div>
                    <p className="text-lg font-semibold text-foreground">{selectedDevice.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{selectedDevice.manufacturer}</p>
                  </div>

                  <div data-glass-card className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground">وضعیت اسکنر</span>
                      <Cpu className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-lg font-semibold text-foreground">آماده</p>
                    <p className="text-xs text-muted-foreground mt-1">در انتظار فرمان اسکن</p>
                  </div>

                  <div data-glass-card className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-muted-foreground">پردازش هوشمند</span>
                      <Sparkles className="w-4 h-4 text-accent" />
                    </div>
                    <p className="text-lg font-semibold text-foreground">فعال</p>
                    <p className="text-xs text-muted-foreground mt-1">OCR و تشخیص متن</p>
                  </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Scan Preview */}
                  <div data-glass-card className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-foreground">پیش‌نمایش اسکن</h3>
                      {scannedImage && (
                        <button data-premium-button className="h-7 text-xs">
                          <span>ذخیره</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="aspect-[4/3] rounded-lg bg-muted/30 border border-border/50 flex items-center justify-center overflow-hidden">
                      {scannedImage ? (
                        <img
                          src={scannedImage || "/placeholder.svg"}
                          alt="Scanned document"
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="text-center p-8">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary/50 flex items-center justify-center">
                            <FileImage className="w-8 h-8 text-muted-foreground/40" />
                          </div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            هیچ اسکنی موجود نیست
                          </p>
                          <p className="text-xs text-muted-foreground/60">
                            از منوی بالا گزینه اسکن را انتخاب کنید
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Document Processor */}
                  <div className="lg:row-span-2">
                    <DocumentProcessor scannedImage={scannedImage} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                <div data-glass-card className="max-w-md w-full p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-warning/10 border border-warning/20 flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-warning" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    دستگاهی انتخاب نشده است
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    برای شروع اسکن، لطفاً از نوار کناری یک دستگاه را انتخاب کنید
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <span>میانبر:</span>
                    <span data-kbd>Alt</span>
                    <span>+</span>
                    <span data-kbd>Arrow</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "agent" && (
          <div className="flex-1 overflow-auto animate-fade-in">
            <AIAgentDashboard />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div data-status-bar className="shrink-0">
        <div className="flex items-center gap-3 flex-1">
          <div data-status-glow={selectedDevice ? "ready" : "idle"} />
          <span className="text-xs truncate">
            {selectedDevice ? `متصل به ${selectedDevice.name}` : "آماده برای اتصال..."}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{activeTab === "scanner" ? "حالت اسکنر" : "عامل هوشمند"}</span>
          <span className="font-mono">
            {new Date().toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </div>
  )
}
