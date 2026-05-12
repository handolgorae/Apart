'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { TradeData } from '@/lib/types'

interface Props {
  trades: TradeData[]
}

interface ChartPoint {
  label: string
  price84: number | null
  price59: number | null
  price114: number | null
}

function parseAmount(amt: string): number {
  return parseInt(amt.replace(/,/g, ''), 10)
}

export default function TradeChart({ trades }: Props) {
  const grouped: Record<string, ChartPoint> = {}

  trades.forEach((t) => {
    const key = `${t.dealYear}.${t.dealMonth.padStart(2, '0')}`
    if (!grouped[key]) {
      grouped[key] = { label: key, price84: null, price59: null, price114: null }
    }
    const amt = parseAmount(t.dealAmount)
    if (t.area >= 110) grouped[key].price114 = amt
    else if (t.area >= 80) grouped[key].price84 = amt
    else grouped[key].price59 = amt
  })

  const data = Object.values(grouped).sort((a, b) => a.label.localeCompare(b.label))

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">📈 실거래가 추이 (만원)</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(v: number) => `${(v / 10000).toFixed(1)}억`}
            domain={['auto', 'auto']}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toLocaleString()}만원`, '']}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="price84"
            name="84㎡"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 4 }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="price59"
            name="59㎡"
            stroke="#16a34a"
            strokeWidth={2}
            dot={{ r: 4 }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="price114"
            name="114㎡"
            stroke="#dc2626"
            strokeWidth={2}
            dot={{ r: 4 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
