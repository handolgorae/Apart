export const mockTrades = [
  { dealYear:'2025', dealMonth:'04', dealDay:'22', aptName:'잠실엘스', area:84.99, floor:15, dealAmount:'230,000' },
  { dealYear:'2025', dealMonth:'04', dealDay:'10', aptName:'잠실엘스', area:114.97, floor:22, dealAmount:'290,000' },
  { dealYear:'2025', dealMonth:'03', dealDay:'28', aptName:'잠실엘스', area:59.98, floor:8, dealAmount:'160,000' },
  { dealYear:'2025', dealMonth:'03', dealDay:'15', aptName:'잠실엘스', area:84.99, floor:19, dealAmount:'225,000' },
  { dealYear:'2025', dealMonth:'02', dealDay:'20', aptName:'잠실엘스', area:114.97, floor:5, dealAmount:'280,000' },
  { dealYear:'2025', dealMonth:'02', dealDay:'08', aptName:'잠실엘스', area:84.99, floor:12, dealAmount:'222,000' },
  { dealYear:'2025', dealMonth:'01', dealDay:'25', aptName:'잠실엘스', area:59.98, floor:20, dealAmount:'158,000' },
  { dealYear:'2025', dealMonth:'01', dealDay:'12', aptName:'잠실엘스', area:84.99, floor:3, dealAmount:'218,000' },
]

export const mockSubscriptions = [
  { id:'1', name:'서울 강동구 고덕강일 3단지', location:'서울 강동구', startDate:'2025-05-20', endDate:'2025-05-22', totalCount:312, type:'일반공급', status:'예정' },
  { id:'2', name:'서울 동대문구 전농동 주상복합', location:'서울 동대문구', startDate:'2025-05-10', endDate:'2025-05-12', totalCount:84, type:'일반공급', status:'진행중' },
  { id:'3', name:'서울 마포구 공덕 SK뷰', location:'서울 마포구', startDate:'2025-04-28', endDate:'2025-04-30', totalCount:56, type:'재공고', status:'진행중' },
  { id:'4', name:'서울 서초구 반포 래미안 원베일리', location:'서울 서초구', startDate:'2025-05-25', endDate:'2025-05-27', totalCount:120, type:'추가청약', status:'예정' },
  { id:'5', name:'서울 성동구 왕십리 센트라스', location:'서울 성동구', startDate:'2025-06-05', endDate:'2025-06-07', totalCount:200, type:'일반공급', status:'예정' },
  { id:'6', name:'서울 강남구 개포 래미안블레스티지', location:'서울 강남구', startDate:'2025-04-15', endDate:'2025-04-17', totalCount:38, type:'부적격재공고', status:'진행중' },
]

export const mockNews = [
  { id:'1', title:'정부, DSR 규제 완화 검토…1주택자 추가대출 허용 방안 논의', summary:'금융당국이 1주택자의 실거주 목적 추가 대출에 한해 DSR 규제를 일부 완화하는 방안을 검토 중입니다. 은행권과 협의를 거쳐 하반기 중 시행 예정.', source:'한국경제', date:'2025-05-12', url:'#', category:'금리·대출' },
  { id:'2', title:'서울 아파트 거래량 3개월 연속 증가…잠실·마포 중심 회복세', summary:'서울 아파트 매매 거래량이 1월부터 3개월 연속 증가세를 보이고 있습니다. 특히 잠실·마포 등 주요 지역을 중심으로 회복 움직임이 뚜렷합니다.', source:'연합뉴스', date:'2025-05-11', url:'#', category:'시장동향' },
  { id:'3', title:'2025년 공공분양 사전청약 일정 발표…수도권 1만 세대 공급', summary:'국토교통부가 2025년 공공분양 사전청약 일정을 공고했습니다. 수도권에 총 1만 세대, 서울 강동·노원 등 주요 지역 포함.', source:'조선일보', date:'2025-05-10', url:'#', category:'청약·분양' },
  { id:'4', title:'재건축 초과이익환수제 개편안 국회 통과…부담금 상한 20% 조정', summary:'재건축 초과이익 환수제 개편안이 국회 본회의를 통과했습니다. 조합원 부담금 상한이 기존 대비 20% 낮아져 재건축 사업성이 개선될 전망입니다.', source:'매일경제', date:'2025-05-09', url:'#', category:'재건축·재개발' },
  { id:'5', title:'종합부동산세 공정시장가액비율 80%로 동결…세부담 현행 유지', summary:'기획재정부가 2025년 종합부동산세 공정시장가액비율을 80%로 동결한다고 밝혔습니다. 이에 따라 올해 종부세 부담은 지난해와 유사한 수준을 유지할 전망.', source:'연합뉴스', date:'2025-05-08', url:'#', category:'세금·규제' },
  { id:'6', title:'한국은행 기준금리 3.0% 동결…부동산 시장 영향은?', summary:'한국은행이 기준금리를 3.0%로 동결했습니다. 전문가들은 하반기 추가 인하 가능성을 염두에 두고 부동산 시장 관망세가 이어질 것으로 분석합니다.', source:'한국경제', date:'2025-05-07', url:'#', category:'금리·대출' },
]

export const defaultApartment = {
  id: '1',
  name: '잠실엘스',
  address: '서울 송파구 잠실동 1-1',
  lawdCd: '11710',
  aptName: '잠실엘스',
  memo: '5,678세대, 2008년 준공',
}
