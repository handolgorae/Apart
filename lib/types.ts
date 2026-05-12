export interface TradeData {
  dealYear: string
  dealMonth: string
  dealDay: string
  aptName: string
  area: number
  floor: number
  dealAmount: string
}

export interface SubscriptionData {
  id: string
  name: string
  location: string
  startDate: string
  endDate: string
  totalCount: number
  type: string
  status: string
}

export interface NewsItem {
  id: string
  title: string
  summary: string
  source: string
  date: string
  url: string
  category: string
}

export interface MyApartment {
  id: string
  name: string
  address: string
  lawdCd: string
  aptName: string
  memo: string
}
