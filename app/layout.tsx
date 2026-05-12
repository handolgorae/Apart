import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '부동산 대시보드',
  description: '잠실엘스 실거래가 및 서울 청약 정보',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}
