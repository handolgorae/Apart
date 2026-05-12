'use client'

import { useState } from 'react'
import type { SubscriptionData } from '@/lib/types'
import SubscriptionCalendar from './SubscriptionCalendar'

interface Props {
  subscriptions: SubscriptionData[]
}

const STATUS_COLOR: Record<string, string> = {
  진행중: 'bg-green-100 text-green-700',
  예정: 'bg-blue-100 text-blue-700',
  완료: 'bg-gray-100 text-gray-500',
}

const TYPE_COLOR: Record<string, string> = {
  일반공급: 'bg-indigo-100 text-indigo-700',
  특별공급: 'bg-purple-100 text-purple-700',
  재공고: 'bg-orange-100 text-orange-700',
  추가청약: 'bg-yellow-100 text-yellow-700',
}

const STATUS_TABS = ['전체', '진행중', '예정', '완료']

export default function SubscriptionList({ subscriptions }: Props) {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [activeTab, setActiveTab] = useState('전체')

  const filtered =
    activeTab === '전체'
      ? subscriptions
      : subscriptions.filter(s => s.status === activeTab)

  return (
    <div>
      {/* 뷰 모드 토글 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">📋 서울 청약 정보</h2>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 목록
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'calendar'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            📅 달력
          </button>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <SubscriptionCalendar subscriptions={subscriptions} />
      ) : (
        <div className="bg-white rounded-xl shadow p-6">
          {/* 상태 탭 */}
          <div className="flex gap-2 mb-4">
            {STATUS_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab}
                {tab !== '전체' && (
                  <span className="ml-1 text-xs opacity-70">
                    {subscriptions.filter(s => s.status === tab).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.length === 0 && (
              <p className="text-gray-400 text-sm py-4 text-center">해당 항목이 없습니다.</p>
            )}
            {filtered.map(sub => (
              <div
                key={sub.id}
                className="border border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{sub.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{sub.location}</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0 flex-wrap justify-end">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        TYPE_COLOR[sub.type] ?? 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {sub.type}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        STATUS_COLOR[sub.status] ?? 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>📅 {sub.startDate} ~ {sub.endDate}</span>
                  <span>🏠 {sub.totalCount.toLocaleString()}세대</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
