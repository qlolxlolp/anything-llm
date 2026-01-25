import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST() {
  try {
    const config = await prisma.autoPilotConfig.findFirst({
      orderBy: { createdAt: 'desc' }
    })
    
    if (!config) {
      return NextResponse.json(
        { error: 'No autopilot config found' },
        { status: 404 }
      )
    }
    
    // Update config to inactive
    await prisma.autoPilotConfig.update({
      where: { id: config.id },
      data: { isActive: false }
    })
    
    // Cancel all pending jobs
    await prisma.autoPilotJob.updateMany({
      where: {
        configId: config.id,
        status: 'PENDING'
      },
      data: {
        status: 'CANCELLED'
      }
    })
    
    // Create stop activity
    await prisma.autoPilotActivity.create({
      data: {
        configId: config.id,
        type: 'SYSTEM',
        action: 'STOP',
        description: 'Autopilot stopped',
        status: 'INFO'
      }
    })
    
    return NextResponse.json({ message: 'Autopilot stopped successfully' })
  } catch (error) {
    console.error('Error stopping autopilot:', error)
    return NextResponse.json(
      { error: 'Failed to stop autopilot' },
      { status: 500 }
    )
  }
}
