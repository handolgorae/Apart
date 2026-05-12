import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-blue-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight hover:text-blue-200">
          🏠 부동산 대시보드
        </Link>
        <nav className="flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-blue-200">홈</Link>
          <Link href="/news" className="hover:text-blue-200">뉴스/정책</Link>
        </nav>
      </div>
    </header>
  )
}
