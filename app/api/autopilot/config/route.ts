import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      isActive: false,
      autoScan: true,
      autoOCR: true,
      autoOrganize: false,
      autoBackup: true,
      scanInterval: 300,
      ocrTimeout: 30,
    })
  } catch (error) {
    console.error('Config error:', error)
    return NextResponse.json(
      { error: 'Failed to get autopilot config' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const config = await request.json()
    // TODO: Implement config update
    return NextResponse.json({ success: true, config })
  } catch (error) {
    console.error('Config error:', error)
    return NextResponse.json(
      { error: 'Failed to update config' },
      { status: 500 },
    )
  }
}
