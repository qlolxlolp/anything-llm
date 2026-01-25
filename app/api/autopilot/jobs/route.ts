import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')
    
    const config = await prisma.autoPilotConfig.findFirst({
      orderBy: { createdAt: 'desc' }
    })
    
    const jobs = await prisma.autoPilotJob.findMany({
      where: {
        configId: config?.id || 'default',
        ...(status && { status: status as any })
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
    
    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    const config = await prisma.autoPilotConfig.findFirst({
      orderBy: { createdAt: 'desc' }
    })
    
    const job = await prisma.autoPilotJob.create({
      data: {
        configId: config?.id || 'default',
        type: body.type,
        status: 'PENDING',
        priority: body.priority || 5,
        inputData: body.inputData ? JSON.stringify(body.inputData) : null,
      }
    })
    
    // Create activity
    await prisma.autoPilotActivity.create({
      data: {
        configId: config?.id || 'default',
        jobId: job.id,
        type: 'SYSTEM',
        action: 'JOB_CREATED',
        description: `Job ${body.type} created`,
        status: 'INFO'
      }
    })
    
    return NextResponse.json(job)
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    )
  }
}
