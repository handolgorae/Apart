export default function ApartmentInfo() {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">🏢 잠실엘스 기본 정보</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        <InfoItem label="단지명" value="잠실엘스" />
        <InfoItem label="위치" value="서울시 송파구 잠실동" />
        <InfoItem label="준공연도" value="2008년" />
        <InfoItem label="총 세대수" value="5,678세대" />
        <InfoItem label="동수" value="36개동" />
        <InfoItem label="주차" value="세대당 1.3대" />
        <InfoItem label="건폐율" value="17%" />
        <InfoItem label="용적률" value="249%" />
        <InfoItem label="시공사" value="삼성물산" />
      </div>
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700 font-medium">
          📍 지하철: 2호선 잠실역 도보 5분 | 잠실새내역 도보 8분
        </p>
        <p className="text-xs text-blue-600 mt-1">
          🏫 학교: 잠신초, 잠신중, 잠실고 인접 | 롯데월드몰·석촌호수 인근
        </p>
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-400 text-xs">{label}</span>
      <span className="text-gray-800 font-semibold">{value}</span>
    </div>
  )
}
