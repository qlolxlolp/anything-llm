import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const config = await prisma.autoPilotConfig.findFirst({
      orderBy: { createdAt: 'desc' }
    })
    
    if (!config) {
      // Return default config
      const defaultConfig = {
        isActive: false,
        autoScan: true,
        autoOCR: true,
        autoOrganize: false,
        autoBackup: true,
        scanInterval: 300,
        ocrTimeout: 30,
        backupInterval: 86400,
        maxConcurrentJobs: 3
      }
      
      return NextResponse.json(defaultConfig)
    }
    
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching autopilot config:', error)
    return NextResponse.json(
      { error: 'Failed to fetch config' },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    
    const config = await prisma.autoPilotConfig.upsert({
      where: { id: body.id || 'default' },
      update: {
        isActive: body.isActive,
        autoScan: body.autoScan,
        autoOCR: body.autoOCR,
        autoOrganize: body.autoOrganize,
        autoBackup: body.autoBackup,
        scanInterval: body.scanInterval,
        ocrTimeout: body.ocrTimeout,
        backupInterval: body.backupInterval,
        maxConcurrentJobs: body.maxConcurrentJobs,
      },
      create: {
        id: 'default',
        isActive: body.isActive,
        autoScan: body.autoScan,
        autoOCR: body.autoOCR,
        autoOrganize: body.autoOrganize,
        autoBackup: body.autoBackup,
        scanInterval: body.scanInterval,
        ocrTimeout: body.ocrTimeout,
        backupInterval: body.backupInterval,
        maxConcurrentJobs: body.maxConcurrentJobs,
      }
    })
    
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error updating autopilot config:', error)
    return NextResponse.json(
      { error: 'Failed to update config' },
      { status: 500 }
    )
  }
}
