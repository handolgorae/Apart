'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'

// Recharts is client-only, use dynamic import
const RechartsArea = dynamic(() => import('./TradeChart'), { ssr: false, loading: () => <div className="h-48 flex items-center justify-center text-gray-400">차트 로딩중...</div> })

// ── Types ────────────────────────────────────────────────
interface Trade { dealYear: string; dealMonth: string; dealDay: string; aptName: string; area: number; floor: number; dealAmount: string }
interface Subscription { id: string; name: string; location: string; startDate: string; endDate: string; totalCount: number; type: string; status: string }
interface NewsItem { id: string; title: string; summary: string; source: string; date: string; url: string; category: string }
interface MyApt { id: string; name: string; address: string; lawdCd: string; aptName: string; memo: string }

const STATUS_COLOR: Record<string, string> = { '진행중': 'bg-green-100 text-green-800', '예정': 'bg-blue-100 text-blue-800', '완료': 'bg-gray-100 text-gray-600' }
const TYPE_COLOR: Record<string, string> = { '재공고': 'bg-orange-100 text-orange-800', '부적격재공고': 'bg-red-100 text-red-800', '추가청약': 'bg-purple-100 text-purple-800', '일반공급': 'bg-sky-100 text-sky-800' }
const CATEGORIES = ['전체', '금리·대출', '청약·분양', '세금·규제', '시장동향', '재건축·재개발']

export default function Dashboard() {
  const [tab, setTab] = useState<'jamsil' | 'sub' | 'my' | 'news'>('jamsil')
  const [trades, setTrades] = useState<Trade[]>([])
  const [subs, setSubs] = useState<Subscription[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [myApts, setMyApts] = useState<MyApt[]>([])
  const [selectedApt, setSelectedApt] = useState<MyApt | null>(null)
  const [loading, setLoading] = useState(false)
  const [subTab, setSubTab] = useState<'all' | 'active' | 'upcoming' | 'reannounce'>('all')
  const [newsCategory, setNewsCategory] = useState('전체')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editApt, setEditApt] = useState<MyApt | null>(null)
  const [newApt, setNewApt] = useState<Partial<MyApt>>({})

  // Load myApts from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('myApts')
    if (stored) {
      const parsed = JSON.parse(stored)
      setMyApts(parsed)
      if (parsed.length > 0) setSelectedApt(parsed[0])
    } else {
      const def: MyApt = { id: '1', name: '잠실엘스', address: '서울 송파구 잠실동 1-1', lawdCd: '11710', aptName: '잠실엘스', memo: '5,678세대, 2008년 준공' }
      setMyApts([def])
      setSelectedApt(def)
      localStorage.setItem('myApts', JSON.stringify([def]))
    }
  }, [])

  const saveMyApts = (apts: MyApt[]) => {
    setMyApts(apts)
    localStorage.setItem('myApts', JSON.stringify(apts))
  }

  const fetchTrades = useCallback(async (apt: MyApt) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/trades?lawdCd=${apt.lawdCd}&aptName=${apt.aptName}`)
      const data = await res.json()
      setTrades(data)
    } catch { setTrades([]) }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (tab === 'jamsil' && selectedApt) fetchTrades(selectedApt)
    if (tab === 'sub' && subs.length === 0) fetch('/api/subscriptions').then(r => r.json()).then(setSubs).catch(() => {})
    if (tab === 'news' && news.length === 0) fetch('/api/news').then(r => r.json()).then(setNews).catch(() => {})
  }, [tab, selectedApt, fetchTrades, subs.length, news.length])

  // ── Chart data ───────────────────────────────────────────
  const chartData = trades.slice().reverse().slice(-12).map(t => ({
    name: `${t.dealMonth}/${t.dealDay}`,
    금액: parseInt(t.dealAmount.replace(/,/g, '')) || 0,
    면적: t.area,
  }))

  // ── Subscription filters ─────────────────────────────────
  const filteredSubs = subs.filter(s => {
    if (subTab === 'active') return s.status === '진행중'
    if (subTab === 'upcoming') return s.status === '예정'
    if (subTab === 'reannounce') return s.type === '재공고' || s.type === '부적격재공고' || s.type === '추가청약'
    return true
  })

  // ── News filter ──────────────────────────────────────────
  const filteredNews = newsCategory === '전체' ? news : news.filter(n => n.category === newsCategory)

  // ── Handlers ─────────────────────────────────────────────
  const handleAddApt = () => {
    if (!newApt.name || !newApt.lawdCd) return
    const apt: MyApt = { id: Date.now().toString(), name: newApt.name!, address: newApt.address || '', lawdCd: newApt.lawdCd!, aptName: newApt.aptName || newApt.name!, memo: newApt.memo || '' }
    saveMyApts([...myApts, apt])
    setNewApt({})
    setShowAddModal(false)
  }

  const handleDeleteApt = (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return
    const next = myApts.filter(a => a.id !== id)
    saveMyApts(next)
    if (selectedApt?.id === id) setSelectedApt(next[0] || null)
  }

  const handleSaveEdit = () => {
    if (!editApt) return
    const next = myApts.map(a => a.id === editApt.id ? editApt : a)
    saveMyApts(next)
    if (selectedApt?.id === editApt.id) setSelectedApt(editApt)
    setEditApt(null)
  }

  // ── Render ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-700">🏢 부동산 대시보드</h1>
          <nav className="flex gap-1">
            {([['jamsil','잠실엘스'],['sub','청약정보'],['my','관심아파트'],['news','뉴스/정책']] as const).map(([k,v]) => (
              <button key={k} onClick={() => setTab(k)} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${tab===k ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{v}</button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">

        {/* ── 잠실엘스 탭 ─────────────────────────────── */}
        {tab === 'jamsil' && (
          <div>
            {/* 아파트 선택 */}
            {myApts.length > 0 && (
              <div className="flex gap-2 mb-4 flex-wrap">
                {myApts.map(a => (
                  <button key={a.id} onClick={() => { setSelectedApt(a); fetchTrades(a) }}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${selectedApt?.id===a.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'}`}>
                    {a.name}
                  </button>
                ))}
              </div>
            )}
            {selectedApt && (
              <div className="bg-white rounded-xl shadow-sm p-5 mb-5 border">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedApt.name}</h2>
                    <p className="text-gray-500 mt-1">{selectedApt.address}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <p>{selectedApt.memo}</p>
                  </div>
                </div>
              </div>
            )}
            {loading ? (
              <div className="text-center py-12 text-gray-400">데이터 로딩 중...</div>
            ) : (
              <>
                <div className="bg-white rounded-xl shadow-sm p-5 mb-5 border">
                  <h3 className="font-semibold text-gray-700 mb-3">최근 실거래가 추이</h3>
                  <RechartsArea data={chartData} />
                </div>
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                  <div className="px-5 py-4 border-b bg-gray-50">
                    <h3 className="font-semibold text-gray-700">최근 거래 내역</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-500 text-xs">
                        <tr>
                          <th className="px-4 py-3 text-left">거래일</th>
                          <th className="px-4 py-3 text-left">단지명</th>
                          <th className="px-4 py-3 text-right">전용면적(㎡)</th>
                          <th className="px-4 py-3 text-right">층</th>
                          <th className="px-4 py-3 text-right font-bold">거래금액(만원)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {trades.map((t, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-gray-600">{t.dealYear}.{String(t.dealMonth).padStart(2,'0')}.{String(t.dealDay).padStart(2,'0')}</td>
                            <td className="px-4 py-3 font-medium">{t.aptName}</td>
                            <td className="px-4 py-3 text-right text-gray-600">{t.area}</td>
                            <td className="px-4 py-3 text-right text-gray-600">{t.floor}층</td>
                            <td className="px-4 py-3 text-right font-bold text-blue-700">{t.dealAmount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {trades.length === 0 && <div className="text-center py-8 text-gray-400">거래 데이터가 없습니다</div>}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── 청약정보 탭 ─────────────────────────────── */}
        {tab === 'sub' && (
          <div>
            <div className="flex gap-2 mb-5 border-b pb-3">
              {([['all','전체'],['active','진행중'],['upcoming','예정'],['reannounce','재공고/추가']] as const).map(([k,v]) => (
                <button key={k} onClick={() => setSubTab(k)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${subTab===k ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{v}</button>
              ))}
            </div>
            <div className="grid gap-4">
              {filteredSubs.map(s => (
                <div key={s.id} className="bg-white rounded-xl shadow-sm border p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLOR[s.status] || 'bg-gray-100 text-gray-600'}`}>{s.status}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${TYPE_COLOR[s.type] || 'bg-gray-100 text-gray-600'}`}>{s.type}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">{s.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">📍 {s.location}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600 shrink-0">
                      <p className="font-bold text-blue-700 text-base">{s.totalCount}세대</p>
                      <p className="mt-1">{s.startDate}</p>
                      <p>~ {s.endDate}</p>
                    </div>
                  </div>
                  {(s.type === '재공고' || s.type === '부적격재공고') && (
                    <div className="mt-3 p-3 bg-orange-50 rounded-lg text-sm text-orange-700">
                      ⚠️ {s.type === '부적격재공고' ? '부적격자 발생에 따른 재공고' : '미계약 세대 발생에 따른 재공고'}
                    </div>
                  )}
                  {s.type === '추가청약' && (
                    <div className="mt-3 p-3 bg-purple-50 rounded-lg text-sm text-purple-700">
                      📋 계약 취소분 발생에 따른 추가청약
                    </div>
                  )}
                </div>
              ))}
              {filteredSubs.length === 0 && <div className="text-center py-12 text-gray-400">해당 청약 정보가 없습니다</div>}
            </div>
          </div>
        )}

        {/* ── 관심아파트 탭 ───────────────────────────── */}
        {tab === 'my' && (
          <div>
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-900">관심 아파트 목록</h2>
              <button onClick={() => { setNewApt({}); setShowAddModal(true) }} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">+ 아파트 추가</button>
            </div>
            <div className="grid gap-4">
              {myApts.map(a => (
                <div key={a.id} className="bg-white rounded-xl border shadow-sm p-5">
                  {editApt?.id === a.id ? (
                    <div className="space-y-3">
                      <input value={editApt.name} onChange={e => setEditApt({...editApt, name: e.target.value})} placeholder="단지명" className="w-full border rounded-lg px-3 py-2 text-sm" />
                      <input value={editApt.address} onChange={e => setEditApt({...editApt, address: e.target.value})} placeholder="주소" className="w-full border rounded-lg px-3 py-2 text-sm" />
                      <input value={editApt.lawdCd} onChange={e => setEditApt({...editApt, lawdCd: e.target.value})} placeholder="법정동코드(5자리)" className="w-full border rounded-lg px-3 py-2 text-sm" />
                      <input value={editApt.memo} onChange={e => setEditApt({...editApt, memo: e.target.value})} placeholder="메모" className="w-full border rounded-lg px-3 py-2 text-sm" />
                      <div className="flex gap-2">
                        <button onClick={handleSaveEdit} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium">저장</button>
                        <button onClick={() => setEditApt(null)} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm">취소</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{a.name}</h3>
                        <p className="text-gray-500 text-sm mt-1">📍 {a.address}</p>
                        {a.memo && <p className="text-gray-400 text-xs mt-1">{a.memo}</p>}
                        <p className="text-xs text-gray-400 mt-1">법정동코드: {a.lawdCd}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setSelectedApt(a); setTab('jamsil') }} className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100">조회</button>
                        <button onClick={() => setEditApt({...a})} className="text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100">편집</button>
                        <button onClick={() => handleDeleteApt(a.id)} className="text-xs bg-red-50 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-100">삭제</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {myApts.length === 0 && <div className="text-center py-12 text-gray-400">관심 아파트를 추가해보세요</div>}
            </div>
            {/* Add Modal */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                  <h3 className="text-lg font-bold mb-4">아파트 추가</h3>
                  <div className="space-y-3">
                    <input value={newApt.name || ''} onChange={e => setNewApt({...newApt, name: e.target.value})} placeholder="단지명 *" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input value={newApt.address || ''} onChange={e => setNewApt({...newApt, address: e.target.value})} placeholder="주소" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input value={newApt.lawdCd || ''} onChange={e => setNewApt({...newApt, lawdCd: e.target.value})} placeholder="법정동코드 5자리 * (예: 11710)" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input value={newApt.aptName || ''} onChange={e => setNewApt({...newApt, aptName: e.target.value})} placeholder="아파트명(API 검색용, 비워두면 단지명과 동일)" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input value={newApt.memo || ''} onChange={e => setNewApt({...newApt, memo: e.target.value})} placeholder="메모" className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <p className="text-xs text-gray-400">법정동코드: <a href="https://code.go.kr/stdcodesearch" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">code.go.kr</a>에서 조회 가능</p>
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button onClick={handleAddApt} className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-medium hover:bg-blue-700">추가하기</button>
                    <button onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium">취소</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── 뉴스/정책 탭 ───────────────────────────── */}
        {tab === 'news' && (
          <div>
            <div className="flex gap-2 mb-5 flex-wrap">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setNewsCategory(c)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${newsCategory===c ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border hover:border-blue-400'}`}>{c}</button>
              ))}
            </div>
            <div className="grid gap-4">
              {filteredNews.map(n => (
                <div key={n.id} className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">{n.category}</span>
                        <span className="text-xs text-gray-400">{n.source} · {n.date}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-base leading-snug">{n.title}</h3>
                      <p className="text-gray-500 text-sm mt-2 leading-relaxed">{n.summary}</p>
                    </div>
                  </div>
                  {n.url !== '#' && (
                    <a href={n.url} target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs text-blue-600 hover:underline">원문 보기 →</a>
                  )}
                </div>
              ))}
              {filteredNews.length === 0 && <div className="text-center py-12 text-gray-400">뉴스가 없습니다</div>}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
