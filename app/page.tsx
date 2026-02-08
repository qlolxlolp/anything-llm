'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { MainContent } from '@/components/main-content'
import type { Device } from '@/lib/types'

export default function HomePage() {
  const [devices] = useState<Device[]>([])
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [scannedImage, setScannedImage] = useState<string>('')

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar
        devices={devices}
        selectedDevice={selectedDevice}
        onSelectDevice={setSelectedDevice}
      />
      <MainContent
        selectedDevice={selectedDevice}
        scannedImage={scannedImage}
        onScannedImage={setScannedImage}
      />
    </div>
  )
}
