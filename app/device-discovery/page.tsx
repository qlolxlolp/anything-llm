"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, Usb, Network, Bluetooth, Plus, Wifi, Radar } from "lucide-react"

export default function DeviceDiscoveryPage() {
  const { toast } = useToast()
  const [discoveredDevices, setDiscoveredDevices] = useState<any[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [ipRange, setIpRange] = useState("192.168.1.1-254")

  const handleUsbScan = async () => {
    setIsScanning(true)
    toast({ title: "جستجوی USB", description: "در حال جستجوی دستگاه‌های USB..." })
    
    // Simulate USB scan
    setTimeout(() => {
      const mockDevices = [
        { id: "usb-1", name: "HP LaserJet Pro", type: "Printer", connection: "USB", status: "آماده" },
        { id: "usb-2", name: "Canon PIXMA", type: "Scanner", connection: "USB", status: "آماده" }
      ]
      setDiscoveredDevices(prev => [...prev, ...mockDevices])
      setIsScanning(false)
      toast({ title: "جستجو تکمیل شد", description: `${mockDevices.length} دستگاه USB یافت شد` })
    }, 2000)
  }

  const handleNetworkScan = async (type: string) => {
    setIsScanning(true)
    toast({ title: `جستجوی ${type}`, description: "در حال جستجوی دستگاه‌های شبکه..." })
    
    setTimeout(() => {
      const mockDevices = [
        { id: "net-1", name: "Brother MFC-L2750DW", type: "Printer", connection: "Network", status: "آنلاین", ip: "192.168.1.100" },
        { id: "net-2", name: "Epson WorkForce", type: "Scanner", connection: "Network", status: "آنلاین", ip: "192.168.1.101" }
      ]
      setDiscoveredDevices(prev => [...prev, ...mockDevices])
      setIsScanning(false)
      toast({ title: "جستجو تکمیل شد", description: `${mockDevices.length} دستگاه شبکه یافت شد` })
    }, 3000)
  }

  const handleBluetoothScan = async () => {
    setIsScanning(true)
    toast({ title: "جستجوی بلوتوث", description: "در حال جستجوی دستگاه‌های بلوتوث..." })
    
    setTimeout(() => {
      const mockDevices = [
        { id: "bt-1", name: "Mobile Scanner Pro", type: "Scanner", connection: "Bluetooth", status: "قابل اتصال" }
      ]
      setDiscoveredDevices(prev => [...prev, ...mockDevices])
      setIsScanning(false)
      toast({ title: "جستجو تکمیل شد", description: `${mockDevices.length} دستگاه بلوتوث یافت شد` })
    }, 2500)
  }

  const handleCustomIPScan = () => {
    setIsScanning(true)
    toast({ title: "جستجوی IP سفارشی", description: `جستجو در محدوده ${ipRange}...` })
    
    setTimeout(() => {
      const mockDevices = [
        { id: "custom-1", name: "Custom Network Device", type: "Printer", connection: "Network", status: "آنلاین", ip: "192.168.1.150" }
      ]
      setDiscoveredDevices(prev => [...prev, ...mockDevices])
      setIsScanning(false)
      toast({ title: "جستجو تکمیل شد", description: "جستجوی محدوده IP سفارشی تکمیل شد" })
    }, 2000)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">کشف دستگاه</h1>
        <p className="text-muted-foreground">جستجو و شناسایی دستگاه‌های متصل</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scan Options */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">گزینه‌های جستجو</h3>
            <div className="space-y-3">
              <Button onClick={handleUsbScan} disabled={isScanning} className="w-full justify-start">
                <Usb className="h-4 w-4 mr-2" />
                اسکن USB
              </Button>
              
              <Button onClick={() => handleNetworkScan("شبکه محلی")} disabled={isScanning} className="w-full justify-start">
                <Radar className="h-4 w-4 mr-2" />
                اسکن سریع شبکه محلی
              </Button>
              
              <Button onClick={() => handleNetworkScan("زیرشبکه")} disabled={isScanning} className="w-full justify-start">
                <Network className="h-4 w-4 mr-2" />
                اسکن پیشرفته زیرشبکه
              </Button>
              
              <Button onClick={() => handleNetworkScan("بی‌سیم")} disabled={isScanning} className="w-full justify-start">
                <Wifi className="h-4 w-4 mr-2" />
                جستجوی دستگاه‌های بی‌سیم
              </Button>
              
              <Button onClick={handleBluetoothScan} disabled={isScanning} className="w-full justify-start">
                <Bluetooth className="h-4 w-4 mr-2" />
                جستجوی بلوتوث
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">افزودن محدوده IP سفارشی</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="ip-range">محدوده IP</Label>
                <Input 
                  id="ip-range" 
                  value={ipRange} 
                  onChange={(e) => setIpRange(e.target.value)}
                  placeholder="192.168.1.1-254" 
                />
              </div>
              <Button onClick={handleCustomIPScan} disabled={isScanning} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                جستجوی محدوده سفارشی
              </Button>
            </div>
          </Card>
        </div>

        {/* Discovered Devices */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">دستگاه‌های یافت شده</h3>
              <Badge variant="outline">{discoveredDevices.length} دستگاه</Badge>
            </div>
            
            {isScanning && (
              <div className="text-center py-8">
                <Search className="h-8 w-8 mx-auto mb-2 animate-spin" />
                <p className="text-muted-foreground">در حال جستجو...</p>
              </div>
            )}

            <div className="space-y-3">
              {discoveredDevices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{device.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {device.type} • {device.connection}
                      {device.ip && ` • ${device.ip}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={device.status === "آماده" || device.status === "آنلاین" ? "default" : "secondary"}>
                      {device.status}
                    </Badge>
                    <Button size="sm">اتصال</Button>
                  </div>
                </div>
              ))}
            </div>

            {!isScanning && discoveredDevices.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>هیچ دستگاهی یافت نشد. از گزینه‌های جستجو استفاده کنید.</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
