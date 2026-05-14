import { NextResponse } from 'next/server'
import { mockTrades } from '@/lib/mockData'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lawdCd = searchParams.get('lawdCd') || '11710'
  const aptName = searchParams.get('aptName') || '잠실엘스'
  const apiKey = process.env.DATA_GO_KR_API_KEY

  if (apiKey && apiKey !== 'test') {
    try {
      const today = new Date()
      const results: any[] = []
      for (let i = 0; i < 6; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
        const dealYmd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`
        const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${encodeURIComponent(apiKey)}&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}&numOfRows=100&pageNo=1`
        const res = await fetch(url, { next: { revalidate: 3600 } })
        const text = await res.text()
        const matches = text.match(/<item>([\s\S]*?)<\/item>/g) || []
        for (const item of matches) {
          const get = (tag: string) => (item.match(new RegExp(`<${tag}>([^<]*)</${tag}>`)) || [])[1]?.trim() || ''
          if (!aptName || get('아파트').includes(aptName)) {
            results.push({ dealYear: get('년'), dealMonth: get('월'), dealDay: get('일'), aptName: get('아파트'), area: parseFloat(get('전용면적')) || 0, floor: parseInt(get('층')) || 0, dealAmount: get('거래금액') })
          }
        }
      }
      if (results.length > 0) return NextResponse.json(results.slice(0, 30))
    } catch { /* fallback */ }
  }
  return NextResponse.json(mockTrades)
}
