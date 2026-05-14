import { NextResponse } from 'next/server'
import { mockSubscriptions } from '@/lib/mockData'

export async function GET() {
  return NextResponse.json(mockSubscriptions)
}
