import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      jobs: [],
      total: 0,
    })
  } catch (error) {
    console.error('Jobs error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 },
    )
  }
}
