'use client'

import { useState } from 'react'
import type { SubscriptionData } from '@/lib/types'

interface Props {
  subscriptions: SubscriptionData[]
}

const TYPE_COLOR: Record<string, string> = {
  일반공급: 'bg-indigo-100 text-indigo-700',
  특별공급: 'bg-purple-100 text-purple-700',
  재공고: 'bg-orange-100 text-orange-700',
  추가청약: 'bg-yellow-100 text-yellow-700',
}

const MONTH_NAMES = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
const DAY_NAMES = ['일','월','화','수','목','금','토']

export default function SubscriptionCalendar({ subscriptions }: Props) {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelectedDay(null)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelectedDay(null)
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startDow = new Date(year, month, 1).getDay()

  const getSubsForDay = (day: number) => {
    const pad = (n: number) => String(n).padStart(2, '0')
    const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`
    return subscriptions.filter(s => s.startDate <= dateStr && s.endDate >= dateStr)
  }

  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const selectedSubs = selectedDay ? getSubsForDay(selectedDay) : []

  return (
    <div className="bg-white rounded-xl shadow p-5">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 text-lg font-bold"
        >
          ‹
        </button>
        <span className="text-base font-bold text-gray-800">
          {year}년 {MONTH_NAMES[month]}
        </span>
        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 text-lg font-bold"
        >
          ›
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_NAMES.map((d, i) => (
          <div
            key={d}
            className={`text-center text-xs font-semibold py-1 ${
              i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`e-${idx}`} className="bg-white min-h-[52px]" />
          }
          const dow = (startDow + day - 1) % 7
          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day
          const isSelected = selectedDay === day
          const subs = getSubsForDay(day)
          const hasActive = subs.some(s => s.status === '진행중')
          const hasPending = subs.some(s => s.status === '예정')

          return (
            <div
              key={day}
              onClick={() => setSelectedDay(isSelected ? null : day)}
              className={`bg-white min-h-[52px] p-1 cursor-pointer transition-colors ${
                isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-center mb-0.5">
                <span
                  className={`text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full ${
                    isToday
                      ? 'bg-blue-600 text-white'
                      : dow === 0
                      ? 'text-red-500'
                      : dow === 6
                      ? 'text-blue-500'
                      : 'text-gray-700'
                  }`}
                >
                  {day}
                </span>
              </div>
              <div className="space-y-0.5 px-0.5">
                {hasActive && (
                  <div className="h-1.5 rounded-full bg-green-400" />
                )}
                {hasPending && (
                  <div className="h-1.5 rounded-full bg-blue-400" />
                )}
                {subs.length > 0 && (
                  <p className="text-center text-gray-500" style={{ fontSize: '9px' }}>
                    {subs.length}건
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 범례 */}
      <div className="flex gap-4 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-green-400 rounded-full" />진행중
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-blue-400 rounded-full" />예정
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-gray-300 rounded-full" />완료
        </span>
      </div>

      {/* 선택 날짜 상세 */}
      {selectedDay !== null && (
        <div className="mt-4 border-t pt-4">
          <h3 className="text-sm font-bold text-gray-700 mb-2">
            {month + 1}월 {selectedDay}일 청약 일정
          </h3>
          {selectedSubs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-3">이 날 청약 일정이 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {selectedSubs.map(sub => (
                <div key={sub.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex flex-wrap gap-1 mb-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        TYPE_COLOR[sub.type] ?? 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {sub.type}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        sub.status === '진행중'
                          ? 'bg-green-100 text-green-700'
                          : sub.status === '예정'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">{sub.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{sub.location}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    📅 {sub.startDate} ~ {sub.endDate} &nbsp;·&nbsp; 🏠 {sub.totalCount.toLocaleString()}세대
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
