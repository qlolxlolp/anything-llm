import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const config = await prisma.autoPilotConfig.findFirst({
      orderBy: { createdAt: 'desc' }
    })
    
    const jobs = await prisma.autoPilotJob.findMany({
      where: {
        configId: config?.id || 'default'
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    })
    
    const runningJobs = jobs.filter(job => job.status === 'RUNNING').length
    const completedJobs = jobs.filter(job => job.status === 'COMPLETED').length
    const failedJobs = jobs.filter(job => job.status === 'FAILED').length
    
    const lastActivity = await prisma.autoPilotActivity.findFirst({
      where: {
        configId: config?.id || 'default'
      },
      orderBy: { createdAt: 'desc' }
    })
    
    const status = {
      isActive: config?.isActive || false,
      currentJobs: runningJobs,
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
