'use client'

import type { TradeData } from '@/lib/types'

interface Props {
  trades: TradeData[]
}

export default function TradeList({ trades }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">🔖 최근 실거래 내역</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500 text-xs uppercase">
              <th className="pb-2 pr-4">거래일</th>
              <th className="pb-2 pr-4">면적(㎡)</th>
              <th className="pb-2 pr-4">층</th>
              <th className="pb-2">거래금액</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((t, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-2 pr-4 text-gray-600">
                  {t.dealYear}.{t.dealMonth.padStart(2, '0')}.{t.dealDay.padStart(2, '0')}
                </td>
                <td className="py-2 pr-4 text-gray-700 font-medium">{t.area}㎡</td>
                <td className="py-2 pr-4 text-gray-600">{t.floor}층</td>
                <td className="py-2 text-blue-700 font-bold">
                  {t.dealAmount}만원
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
