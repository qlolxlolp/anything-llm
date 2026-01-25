import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const type = searchParams.get('type')
    
    const config = await prisma.autoPilotConfig.findFirst({
      orderBy: { createdAt: 'desc' }
    })
    
    const activities = await prisma.autoPilotActivity.findMany({
      where: {
        configId: config?.id || 'default',
        ...(type && { type: type as any })
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        job: {
          select: {
            id: true,
            type: true,
            status: true
          }
        }
      }
    })
    
    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}
