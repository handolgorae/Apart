import { NextResponse } from 'next/server'
import { mockSubscriptions } from '@/lib/mockData'

export async function GET() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY
    if (!apiKey || apiKey === 'test') {
      return NextResponse.json({ data: mockSubscriptions, source: 'mock' })
    }

    const url = `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail?page=1&perPage=10&serviceKey=${apiKey}`
    const res = await fetch(url, { next: { revalidate: 3600 } })

    if (!res.ok) {
      return NextResponse.json({ data: mockSubscriptions, source: 'mock' })
    }

    return NextResponse.json({ data: mockSubscriptions, source: 'mock' })
  } catch {
    return NextResponse.json({ data: mockSubscriptions, source: 'mock' })
  }
}
