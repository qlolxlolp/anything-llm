"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { MainContent } from "@/components/main-content"
import { UsbBlockedNotice } from "@/components/usb-blocked-notice"
import type { Device } from "@/lib/types"
import { registerUsbDevice } from "@/lib/usb-driver"

export default function HomePage() {
  const [devices, setDevices] = useState<Device[]>([])
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [scannedImage, setScannedImage] = useState<string>("")
  const [usbStatus, setUsbStatus] = useState<"checking" | "available" | "unavailable" | "blocked">("checking")

  useEffect(() => {
    const discoverDevices = async () => {
      // Check if WebUSB API exists in browser
      if (!navigator.usb) {
        setUsbStatus("unavailable")
        return
      }

      try {
        // Test if WebUSB is accessible (may be blocked by permissions policy in iframes)
        const authorizedDevices = await navigator.usb.getDevices()
        setUsbStatus("available")

        // Process real authorized devices
        const discoveredDevices: Device[] = []
        
        for (const usbDevice of authorizedDevices) {
          try {
            await usbDevice.open()
            const deviceInfo: Device = {
              id: `usb-${usbDevice.serialNumber || crypto.randomUUID()}`,
              name: usbDevice.productName || "دستگاه ناشناس",
              manufacturer: usbDevice.manufacturerName || "سازنده نامشخص",
              type: detectDeviceType(usbDevice),
              status: "ready",
              connectionType: "usb",
              vendorId: usbDevice.vendorId,
              productId: usbDevice.productId,
            }
            registerUsbDevice(deviceInfo.id, usbDevice)
            await usbDevice.close()
            discoveredDevices.push(deviceInfo)
          } catch (err) {
            console.error("Error opening device:", err)
          }
        }

        setDevices(discoveredDevices)
        if (discoveredDevices.length > 0) {
          setSelectedDevice(discoveredDevices[0])
        }
      } catch (error) {
        // WebUSB blocked by permissions policy (common in iframe/preview environments)
        setUsbStatus("blocked")
      }
    }

    discoverDevices()
  }, [])

  // Detect device type based on USB class codes
  const detectDeviceType = (device: USBDevice): Device["type"] => {
    const config = device.configuration
    if (!config) return "Scanner"
    
    for (const iface of config.interfaces) {
      for (const alt of iface.alternates) {
        // Class 7 = Printer, Class 6 = Still Image (Scanner)
        if (alt.interfaceClass === 7) return "Printer"
        if (alt.interfaceClass === 6) return "Scanner"
      }
    }
    return "Scanner"
  }

  const handleRequestDevice = async () => {
    if (!navigator.usb || usbStatus !== "available") {
      return
    }

    try {
      const device = await navigator.usb.requestDevice({
        filters: [
          { classCode: 6 },  // Still Image (Scanner)
          { classCode: 7 },  // Printer
          { classCode: 0xff }, // Vendor-specific
        ],
      })

      await device.open()

      const newDevice: Device = {
        id: `usb-${device.serialNumber || crypto.randomUUID()}`,
        name: device.productName || "دستگاه ناشناس",
        manufacturer: device.manufacturerName || "سازنده نامشخص",
        type: detectDeviceType(device),
        status: "ready",
        connectionType: "usb",
        vendorId: device.vendorId,
        productId: device.productId,
      }

      registerUsbDevice(newDevice.id, device)
      await device.close()

      setDevices((prev) => [...prev, newDevice])
      setSelectedDevice(newDevice)
    } catch (error) {
      // User cancelled or device selection failed - this is expected behavior
    }
  }

  // Show blocked notice if WebUSB is unavailable or blocked
  if (usbStatus === "blocked" || usbStatus === "unavailable") {
    return <UsbBlockedNotice status={usbStatus} />
  }

  // Show loading while checking USB status
  if (usbStatus === "checking") {
    return (
      <div className="flex h-screen w-full bg-background text-foreground items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">در حال بررسی دسترسی سخت‌افزار...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      <Sidebar
        devices={devices}
        selectedDevice={selectedDevice}
        onSelectDevice={setSelectedDevice}
        onRequestDevice={handleRequestDevice}
      />

      <main className="flex-1 flex flex-col h-screen">
        <MainContent 
          selectedDevice={selectedDevice} 
          scannedImage={scannedImage} 
          onScannedImage={setScannedImage}
          onDeviceFound={(device) => {
            setDevices(prev => [...prev, device])
            setSelectedDevice(device)
          }}
        />
      </main>
    </div>
  )
}
