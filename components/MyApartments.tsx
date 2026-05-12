'use client'

import { useState, useEffect } from 'react'
import type { MyApartment } from '@/lib/types'
import { mockMyApartments } from '@/lib/mockData'

const STORAGE_KEY = 'my_apartments'

function loadApartments(): MyApartment[] {
  if (typeof window === 'undefined') return mockMyApartments
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? (JSON.parse(stored) as MyApartment[]) : mockMyApartments
  } catch {
    return mockMyApartments
  }
}

function saveApartments(list: MyApartment[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export default function MyApartments() {
  const [list, setList] = useState<MyApartment[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Omit<MyApartment, 'id'>>({
    name: '',
    address: '',
    lawdCd: '',
    aptName: '',
    memo: '',
  })

  useEffect(() => {
    setList(loadApartments())
  }, [])

  const handleAdd = () => {
    if (!form.name.trim()) return
    const newItem: MyApartment = { ...form, id: `my-${Date.now()}` }
    const updated = [...list, newItem]
    setList(updated)
    saveApartments(updated)
    setForm({ name: '', address: '', lawdCd: '', aptName: '', memo: '' })
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    const updated = list.filter((a) => a.id !== id)
    setList(updated)
    saveApartments(updated)
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">⭐ 관심 아파트</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? '취소' : '+ 추가'}
        </button>
      </div>

      {showForm && (
        <div className="mb-4 p-4 border border-blue-100 rounded-lg bg-blue-50 space-y-2">
          <input
            type="text"
            placeholder="단지명 *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          />
          <input
            type="text"
            placeholder="주소"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          />
          <input
            type="text"
            placeholder="법정동코드 (예: 11710)"
            value={form.lawdCd}
            onChange={(e) => setForm({ ...form, lawdCd: e.target.value })}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          />
          <input
            type="text"
            placeholder="아파트명 (API 검색용)"
            value={form.aptName}
            onChange={(e) => setForm({ ...form, aptName: e.target.value })}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
          />
          <textarea
            placeholder="메모"
            value={form.memo}
            onChange={(e) => setForm({ ...form, memo: e.target.value })}
            rows={2}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-400 resize-none"
          />
          <button
            onClick={handleAdd}
            className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            저장
          </button>
        </div>
      )}

      {list.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-6">관심 아파트를 추가해보세요.</p>
      )}

      <div className="space-y-3">
        {list.map((apt) => (
          <div
            key={apt.id}
            className="border border-gray-100 rounded-lg p-4 flex items-start justify-between gap-3 hover:border-yellow-200 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800">{apt.name}</p>
              {apt.address && (
                <p className="text-xs text-gray-500 mt-0.5 truncate">{apt.address}</p>
              )}
              {apt.memo && (
                <p className="text-xs text-blue-600 mt-1">{apt.memo}</p>
              )}
            </div>
            <button
              onClick={() => handleDelete(apt.id)}
              className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none shrink-0"
              aria-label="삭제"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
