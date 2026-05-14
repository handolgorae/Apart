import { NextResponse } from 'next/server'
import { mockNews } from '@/lib/mockData'

export async function GET() {
  return NextResponse.json(mockNews)
}
