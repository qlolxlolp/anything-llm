import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // Assuming prisma is imported from a common location
import { config } from '@/lib/config' // Assuming config is imported from a common location

export async function POST() {
  try {
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
