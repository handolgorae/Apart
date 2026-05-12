import { NextResponse } from 'next/server'
import { mockTrades } from '@/lib/mockData'
import type { TradeData } from '@/lib/types'

export async function GET() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY
    if (!apiKey || apiKey === 'test') {
      return NextResponse.json({ data: mockTrades, source: 'mock' })
    }

    const year = new Date().getFullYear()
    const month = String(new Date().getMonth() + 1).padStart(2, '0')
    const dealYmd = `${year}${month}`
    const lawdCd = '11710'

    const url = `http://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev?serviceKey=${apiKey}&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}&numOfRows=20&pageNo=1`
    const res = await fetch(url, { next: { revalidate: 3600 } })

    if (!res.ok) {
      return NextResponse.json({ data: mockTrades, source: 'mock' })
    }

    const text = await res.text()
    if (!text.includes('<item>')) {
      return NextResponse.json({ data: mockTrades, source: 'mock' })
    }

    return NextResponse.json({ data: mockTrades, source: 'mock' })
  } catch {
    return NextResponse.json({ data: mockTrades, source: 'mock' })
  }
}

export type { TradeData }
