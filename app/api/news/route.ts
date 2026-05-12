import { NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'
import { mockNews } from '@/lib/mockData'
import type { NewsItem } from '@/lib/types'

interface RssItem {
  title?: string
  description?: string
  link?: string
  pubDate?: string
}

interface RssChannel {
  item?: RssItem | RssItem[]
}

interface RssFeed {
  rss?: {
    channel?: RssChannel
  }
}

export async function GET() {
  try {
    const rssUrl = 'https://www.hankyung.com/feed/realestate'
    const res = await fetch(rssUrl, {
      next: { revalidate: 1800 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)' },
    })

    if (!res.ok) {
      return NextResponse.json({ data: mockNews, source: 'mock' })
    }

    const xml = await res.text()
    const parser = new XMLParser({ ignoreAttributes: false })
    const feed: RssFeed = parser.parse(xml)
    const channel = feed?.rss?.channel
    if (!channel) {
      return NextResponse.json({ data: mockNews, source: 'mock' })
    }

    const rawItems = channel.item
    const items: RssItem[] = Array.isArray(rawItems)
      ? rawItems
      : rawItems
      ? [rawItems]
      : []

    const newsItems: NewsItem[] = items.slice(0, 6).map((item, idx) => ({
      id: `rss-${idx}`,
      title: String(item.title ?? ''),
      summary: String(item.description ?? '').replace(/<[^>]+>/g, '').slice(0, 120),
      source: '한국경제',
      date: item.pubDate
        ? new Date(String(item.pubDate)).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
      url: String(item.link ?? '#'),
      category: '시장동향',
    }))

    return NextResponse.json({ data: newsItems, source: 'rss' })
  } catch {
    return NextResponse.json({ data: mockNews, source: 'mock' })
  }
}
