import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '부동산 대시보드 - 잠실엘스 & 청약정보',
  description: '잠실엘스 실거래가, 서울 청약 공고, 관심 아파트 관리',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 text-gray-900 min-h-screen">{children}</body>
    </html>
  )
}
