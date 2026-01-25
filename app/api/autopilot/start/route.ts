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
    
    // Update config to active
    await prisma.autoPilotConfig.update({
      where: { id: config.id },
      data: { isActive: true }
    })
    
    // Create start activity
    await prisma.autoPilotActivity.create({
      data: {
        configId: config.id,
        type: 'SYSTEM',
        action: 'START',
        description: 'Autopilot started',
        status: 'SUCCESS'
      }
    })
    
    return NextResponse.json({ message: 'Autopilot started successfully' })
  } catch (error) {
    console.error('Error starting autopilot:', error)
    return NextResponse.json(
      { error: 'Failed to start autopilot' },
      { status: 500 }
    )
  }
}
