"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { configManager, type AutoPilotConfig } from "@/lib/auto-pilot-config"
import { Download, Upload, RotateCcw } from "lucide-react"

interface AutoPilotSettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AutoPilotSettings({ open, onOpenChange }: AutoPilotSettingsProps) {
  const [config, setConfig] = useState<AutoPilotConfig>(configManager.getConfig())

  const handleSave = () => {
    configManager.updateConfig(config)
    onOpenChange(false)
  }

  const handleReset = () => {
    configManager.resetToDefaults()
    setConfig(configManager.getConfig())
  }

  const handleExport = () => {
    const json = configManager.exportConfig()
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "autopilot-config.json"
    a.click()
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      if (configManager.importConfig(content)) {
        setConfig(configManager.getConfig())
      }
    }
    reader.readAsText(file)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تنظیمات خلبان خودکار</DialogTitle>
          <DialogDescription>تنظیمات اسکن، OCR و رفتار خلبان خودکار را سفارشی کنید</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="scan" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scan">اسکن</TabsTrigger>
            <TabsTrigger value="ocr">OCR</TabsTrigger>
            <TabsTrigger value="behavior">رفتار</TabsTrigger>
            <TabsTrigger value="organization">سازماندهی</TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-4">
            <div className="space-y-2">
              <Label>وضوح اسکن (DPI)</Label>
              <Select
                value={config.scanResolution.toString()}
                onValueChange={(value) => setConfig({ ...config, scanResolution: Number.parseInt(value) as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="150">150 DPI - سریع</SelectItem>
                  <SelectItem value="300">300 DPI - استاندارد</SelectItem>
                  <SelectItem value="600">600 DPI - بالا</SelectItem>
                  <SelectItem value="1200">1200 DPI - بسیار بالا</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>حالت رنگ</Label>
              <Select
                value={config.scanColorMode}
                onValueChange={(value: any) => setConfig({ ...config, scanColorMode: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="color">رنگی</SelectItem>
                  <SelectItem value="grayscale">خاکستری</SelectItem>
                  <SelectItem value="blackwhite">سیاه و سفید</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>فرمت خروجی</Label>
              <Select
                value={config.scanFormat}
                onValueChange={(value: any) => setConfig({ ...config, scanFormat: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jpg">JPG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="ocr" className="space-y-4">
            <div className="space-y-2">
              <Label>زبان OCR</Label>
              <Select
                value={config.ocrLanguage}
                onValueChange={(value: any) => setConfig({ ...config, ocrLanguage: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fa">فارسی</SelectItem>
                  <SelectItem value="en">انگلیسی</SelectItem>
                  <SelectItem value="ar">عربی</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>دقت OCR</Label>
              <Select
                value={config.ocrAccuracy}
                onValueChange={(value: any) => setConfig({ ...config, ocrAccuracy: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast">سریع (85%)</SelectItem>
                  <SelectItem value="balanced">متعادل (92%)</SelectItem>
                  <SelectItem value="maximum">حداکثر (98%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label>استخراج جداول</Label>
              <Switch
                checked={config.extractTables}
                onCheckedChange={(checked) => setConfig({ ...config, extractTables: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>استخراج فیلدها</Label>
              <Switch
                checked={config.extractFields}
                onCheckedChange={(checked) => setConfig({ ...config, extractFields: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>شناسایی اعداد</Label>
              <Switch
                checked={config.detectNumbers}
                onCheckedChange={(checked) => setConfig({ ...config, detectNumbers: checked })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>تطبیق الگو</Label>
                <Switch
                  checked={config.templateMatchingEnabled}
                  onCheckedChange={(checked) => setConfig({ ...config, templateMatchingEnabled: checked })}
                />
              </div>
              {config.templateMatchingEnabled && (
                <div className="space-y-2">
                  <Label>آستانه تطبیق: {Math.round(config.matchingThreshold * 100)}%</Label>
                  <Slider
                    value={[config.matchingThreshold * 100]}
                    onValueChange={([value]) => setConfig({ ...config, matchingThreshold: value / 100 })}
                    min={50}
                    max={100}
                    step={5}
                  />
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>شروع خودکار</Label>
              <Switch
                checked={config.autoStart}
                onCheckedChange={(checked) => setConfig({ ...config, autoStart: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label>مکث بین اسناد (ثانیه)</Label>
              <Input
                type="number"
                value={config.autoPauseBetweenDocuments}
                onChange={(e) => setConfig({ ...config, autoPauseBetweenDocuments: Number.parseInt(e.target.value) })}
                min={0}
                max={60}
              />
            </div>

            <div className="space-y-2">
              <Label>حداکثر اسناد در هر جلسه</Label>
              <Input
                type="number"
                value={config.maxDocumentsPerSession}
                onChange={(e) => setConfig({ ...config, maxDocumentsPerSession: Number.parseInt(e.target.value) })}
                min={1}
                max={1000}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>خروجی خودکار اکسل</Label>
              <Switch
                checked={config.autoExportToExcel}
                onCheckedChange={(checked) => setConfig({ ...config, autoExportToExcel: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>پشتیبان‌گیری خودکار</Label>
              <Switch
                checked={config.autoBackup}
                onCheckedChange={(checked) => setConfig({ ...config, autoBackup: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>اعلان در پایان</Label>
              <Switch
                checked={config.notifyOnComplete}
                onCheckedChange={(checked) => setConfig({ ...config, notifyOnComplete: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>اعلان خطا</Label>
              <Switch
                checked={config.notifyOnError}
                onCheckedChange={(checked) => setConfig({ ...config, notifyOnError: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>صدا</Label>
              <Switch
                checked={config.soundEnabled}
                onCheckedChange={(checked) => setConfig({ ...config, soundEnabled: checked })}
              />
            </div>
          </TabsContent>

          <TabsContent value="organization" className="space-y-4">
            <div className="space-y-2">
              <Label>الگوی نام‌گذاری پوشه</Label>
              <Select
                value={config.folderNamingPattern}
                onValueChange={(value: any) => setConfig({ ...config, folderNamingPattern: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subscription">شماره اشتراک</SelectItem>
                  <SelectItem value="date">تاریخ</SelectItem>
                  <SelectItem value="custom">سفارشی</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {config.folderNamingPattern === "custom" && (
              <div className="space-y-2">
                <Label>پیشوند سفارشی</Label>
                <Input
                  value={config.customFolderPrefix}
                  onChange={(e) => setConfig({ ...config, customFolderPrefix: e.target.value })}
                  placeholder="پوشه_"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              خروجی
            </Button>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Upload className="h-4 w-4" />
                ورودی
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 bg-transparent">
              <RotateCcw className="h-4 w-4" />
              بازنشانی
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              انصراف
            </Button>
            <Button onClick={handleSave}>ذخیره تنظیمات</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
