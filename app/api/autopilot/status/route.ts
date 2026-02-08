import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' // Assuming prisma is imported from a common location

export async function GET() {
  try {
    // Fetching config from database
    const config = await prisma.autoPilotConfig.findFirst({
      where: {
        id: 'default' // Assuming 'default' is the config ID
      }
    })

    // Fetching job counts from database
    const runningJobs = await prisma.job.count({
      where: {
        status: 'running'
      }
    })
    const completedJobs = await prisma.job.count({
      where: {
        status: 'completed'
      }
    })
    const failedJobs = await prisma.job.count({
      where: {
        status: 'failed'
      }
    })

    // Fetching last activity from database
    const lastActivity = await prisma.autoPilotActivity.findFirst({
      where: {
        configId: config?.id || 'default'
      },
      orderBy: { createdAt: 'desc' }
    })

    const status = {
      isActive: config?.isActive || false,
      runningJobs,
      completedJobs,
      failedJobs,
      lastActivity: lastActivity?.description || 'No activity',
      uptime: config ? Math.floor((Date.now() - config.createdAt.getTime()) / 1000) : 0
    }

    return NextResponse.json(status)
  } catch (error) {
    console.error('Error fetching autopilot status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch status' },
      { status: 500 }
    )
  }
}
