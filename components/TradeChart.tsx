'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartPoint { name: string; 금액: number; 면적: number }

export default function TradeChart({ data }: { data: ChartPoint[] }) {
  if (data.length === 0) return <div className="h-48 flex items-center justify-center text-gray-400 text-sm">거래 데이터가 없습니다</div>
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <defs>
          <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/10000).toFixed(0)}억`} />
        <Tooltip formatter={(v: number) => [`${v.toLocaleString()}만원`, '거래금액']} />
        <Area type="monotone" dataKey="금액" stroke="#2563eb" strokeWidth={2} fill="url(#colorAmt)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
