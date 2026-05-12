'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import ApartmentInfo from '@/components/ApartmentInfo'
import TradeChart from '@/components/TradeChart'
import TradeList from '@/components/TradeList'
import SubscriptionList from '@/components/SubscriptionList'
import MyApartments from '@/components/MyApartments'
import NewsCard from '@/components/NewsCard'
import type { TradeData, SubscriptionData, NewsItem } from '@/lib/types'
import { mockTrades, mockSubscriptions, mockNews } from '@/lib/mockData'

type Tab = '잠실엘스' | '청약정보' | '관심아파트' | '뉴스/정책'
const TABS: Tab[] = ['잠실엘스', '청약정보', '관심아파트', '뉴스/정책']

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('잠실엘스')
  const [trades, setTrades] = useState<TradeData[]>(mockTrades)
  const [subscriptions, setSubscriptions] = useState<SubscriptionData[]>(mockSubscriptions)
  const [news, setNews] = useState<NewsItem[]>(mockNews)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch('/api/trades').then((r) => r.json()).catch(() => ({ data: mockTrades })),
      fetch('/api/subscriptions').then((r) => r.json()).catch(() => ({ data: mockSubscriptions })),
      fetch('/api/news').then((r) => r.json()).catch(() => ({ data: mockNews })),
    ]).then(([t, s, n]) => {
      if (t?.data) setTrades(t.data as TradeData[])
      if (s?.data) setSubscriptions(s.data as SubscriptionData[])
      if (n?.data) setNews(n.data as NewsItem[])
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* 탭 네비게이션 */}
        <div className="flex gap-1 bg-white rounded-xl shadow p-1.5 mb-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-max px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-4 text-sm text-gray-400">데이터 불러오는 중...</div>
        )}

        {/* 잠실엘스 탭 */}
        {activeTab === '잠실엘스' && (
          <div className="space-y-6">
            <ApartmentInfo />
            <TradeChart trades={trades} />
            <TradeList trades={trades} />
          </div>
        )}

        {/* 청약정보 탭 */}
        {activeTab === '청약정보' && (
          <SubscriptionList subscriptions={subscriptions} />
        )}

        {/* 관심아파트 탭 */}
        {activeTab === '관심아파트' && (
          <MyApartments />
        )}

        {/* 뉴스/정책 탭 */}
        {activeTab === '뉴스/정책' && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">📰 부동산 뉴스 & 정책</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {news.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
