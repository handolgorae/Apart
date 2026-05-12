import { Metadata } from 'next'
import Header from '@/components/Header'
import NewsCard from '@/components/NewsCard'
import { mockNews } from '@/lib/mockData'
import type { NewsItem } from '@/lib/types'

export const metadata: Metadata = {
  title: '뉴스/정책 | 부동산 대시보드',
}

async function getNews(): Promise<NewsItem[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : 'http://localhost:3000'

    const res = await fetch(`${baseUrl}/api/news`, {
      next: { revalidate: 1800 },
    })
    if (!res.ok) return mockNews
    const json = await res.json() as { data: NewsItem[] }
    return json.data ?? mockNews
  } catch {
    return mockNews
  }
}

export default async function NewsPage() {
  const news = await getNews()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">📰 부동산 뉴스 & 정책</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      </main>
    </div>
  )
}
