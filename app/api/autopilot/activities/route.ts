import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      activities: [],
      total: 0,
    })
  } catch (error) {
    console.error('Activities error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 },
    )
  }
}
