'use client'

import { useState, useEffect } from 'react'
import type { MyApartment } from '@/lib/types'
import { mockMyApartments } from '@/lib/mockData'

const STORAGE_KEY = 'my_apartments'

const QUICK_ADD = [
  { name: '잠실엘스', address: '서울 송파구 잠실동' },
  { name: '잠실리센츠', address: '서울 송파구 잠실동' },
  { name: '래미안퍼스티지', address: '서울 서초구 반포동' },
  { name: '아크로리버파크', address: '서울 서초구 반포동' },
  { name: '헬리오시티', address: '서울 송파구 가락동' },
  { name: '마포래미안푸르지오', address: '서울 마포구 도화동' },
]

function load(): MyApartment[] {
  if (typeof window === 'undefined') return mockMyApartments
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    return s ? (JSON.parse(s) as MyApartment[]) : mockMyApartments
  } catch {
    return mockMyApartments
  }
}

function save(list: MyApartment[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export default function MyApartments() {
  const [list, setList] = useState<MyApartment[]>([])
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [memo, setMemo] = useState('')

  useEffect(() => { setList(load()) }, [])

  const handleAdd = (aptName?: string, aptAddress?: string) => {
    const n = aptName ?? name.trim()
    if (!n) return
    const newItem: MyApartment = {
      id: `my-${Date.now()}`,
      name: n,
      address: aptAddress ?? address.trim(),
      lawdCd: '',
      aptName: n,
      memo: aptName ? '' : memo.trim(),
    }
    const updated = [...list, newItem]
    setList(updated)
    save(updated)
    setName('')
    setAddress('')
    setMemo('')
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    const updated = list.filter(a => a.id !== id)
    setList(updated)
    save(updated)
  }

  const alreadyAdded = (aptName: string) => list.some(a => a.name === aptName)

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">⭐ 관심 아파트</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? '취소' : '+ 직접 추가'}
        </button>
      </div>

      {/* 직접 입력 폼 */}
      {showForm && (
        <div className="mb-5 p-4 border border-blue-100 rounded-xl bg-blue-50 space-y-2">
          <input
            type="text"
            placeholder="단지명 (예: 잠실엘스) *"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
          />
          <input
            type="text"
            placeholder="지역/주소 (선택)"
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white"
          />
          <textarea
            placeholder="메모 (선택)"
            value={memo}
            onChange={e => setMemo(e.target.value)}
            rows={2}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400 bg-white resize-none"
          />
          <button
            onClick={() => handleAdd()}
            disabled={!name.trim()}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 transition-colors"
          >
            저장
          </button>
        </div>
      )}

      {/* 빠른 추가 */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">⚡ 빠른 추가</p>
        <div className="grid grid-cols-2 gap-2">
          {QUICK_ADD.map(apt => (
            <button
              key={apt.name}
              onClick={() => handleAdd(apt.name, apt.address)}
              disabled={alreadyAdded(apt.name)}
              className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
                alreadyAdded(apt.name)
                  ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700'
              }`}
            >
              <p className="font-medium truncate">{apt.name}</p>
              <p className="text-xs text-gray-400 truncate">{apt.address}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 등록된 목록 */}
      {list.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-4">관심 아파트를 추가해보세요.</p>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            내 관심 아파트 ({list.length})
          </p>
          {list.map(apt => (
            <div
              key={apt.id}
              className="flex items-start justify-between gap-3 border border-gray-100 rounded-lg p-3 hover:border-yellow-300 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">{apt.name}</p>
                {apt.address && (
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{apt.address}</p>
                )}
                {apt.memo && (
                  <p className="text-xs text-blue-500 mt-0.5">{apt.memo}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(apt.id)}
                className="text-gray-300 hover:text-red-400 transition-colors text-xl leading-none shrink-0 mt-0.5"
                aria-label="삭제"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
