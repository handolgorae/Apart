import type { NewsItem } from '@/lib/types'

interface Props {
  news: NewsItem
}

const CATEGORY_COLOR: Record<string, string> = {
  '금리·대출': 'bg-red-100 text-red-700',
  '청약·분양': 'bg-green-100 text-green-700',
  '세금·규제': 'bg-orange-100 text-orange-700',
  시장동향: 'bg-blue-100 text-blue-700',
  '재건축·재개발': 'bg-purple-100 text-purple-700',
}

export default function NewsCard({ news }: Props) {
  return (
    <div className="bg-white rounded-xl shadow p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
            CATEGORY_COLOR[news.category] ?? 'bg-gray-100 text-gray-600'
          }`}
        >
          {news.category}
        </span>
        <span className="text-xs text-gray-400">{news.source}</span>
      </div>
      <h3 className="font-semibold text-gray-800 text-sm leading-snug mb-2 line-clamp-2">
        {news.title}
      </h3>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{news.summary}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-gray-400">{news.date}</span>
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-600 hover:underline"
        >
          자세히 보기 →
        </a>
      </div>
    </div>
  )
}
