# 부동산 정보 대시보드

잠실엘스 실거래가 및 서울 청약 공고를 한눈에 확인하는 부동산 정보 대시보드입니다.

## 주요 기능

- **잠실엘스 실거래가** — 국토교통부 아파트매매 실거래가 API 연동 (최근 6개월)
- **거래가 추이 차트** — 월별 평균/최고/최저가 Recharts 시각화
- **서울 청약 공고** — 한국부동산원 청약홈 API 연동
- **청약 상태 필터** — 진행중 / 예정 / 마감 구분
- **다크 모드** — 시스템 설정 연동 + 수동 전환
- **반응형** — 모바일/태블릿/데스크톱 대응
- **자동 갱신** — 실거래가 1시간, 청약 정보 30분 주기
- **Mock 데이터 Fallback** — API 키 없이도 UI 확인 가능

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 14 (App Router) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| 차트 | Recharts |
| 배포 | Vercel |

---

## 로컬 실행

### 1. 저장소 클론

```bash
git clone https://github.com/dongdolgorea/Apart.git
cd Apart
```

### 2. 패키지 설치

```bash
npm install
```

### 3. 환경변수 설정

```bash
cp .env.example .env.local
```

`.env.local` 파일을 열어 API 키를 입력합니다:

```
NEXT_PUBLIC_DATA_GO_KR_API_KEY=실제_API_키_입력
```

> **API 키 없이도 동작합니다.** 키가 없으면 mock 데이터가 자동 표시됩니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

---

## API 키 발급 방법

### 공공데이터포털 (data.go.kr)

1. [https://www.data.go.kr](https://www.data.go.kr) 접속 → 회원가입/로그인
2. 상단 검색창에 **"아파트매매 실거래가"** 검색
3. **국토교통부\_아파트매매 실거래 상세 자료** 클릭 → **활용신청**
4. 신청 완료 후 **마이페이지 > API 활용 관리**에서 **일반 인증키(Decoding)** 복사
5. 동일한 키로 **청약 정보 API**도 사용 가능

> 승인까지 수 분~수 시간이 소요될 수 있습니다. 즉시 발급되는 경우도 있습니다.

---

## Vercel 배포

### 1. Vercel 프로젝트 생성

1. [vercel.com](https://vercel.com) 접속 → **Add New Project**
2. **Import Git Repository** → GitHub 연결
3. `dongdolgorea/Apart` 선택 → **Import**

### 2. 환경변수 설정

프로젝트 설정 화면에서:

- **Environment Variables** 섹션에 추가
  - Name: `NEXT_PUBLIC_DATA_GO_KR_API_KEY`
  - Value: `발급받은_API_키`
  - Environment: `Production`, `Preview`, `Development` 모두 선택

### 3. 배포

**Deploy** 버튼 클릭 → 자동 빌드 및 배포

### 4. 자동 배포 (CI/CD)

- `main` 브랜치에 push하면 **자동으로 재배포**됩니다 (기본 설정)
- PR 생성 시 **Preview 배포** URL이 자동 생성됩니다

---

## 환경변수

| 변수명 | 설명 | 필수 |
|--------|------|------|
| `NEXT_PUBLIC_DATA_GO_KR_API_KEY` | 공공데이터포털 API 인증키 | 선택 (없으면 mock 데이터) |

---

## 데이터 출처

- [국토교통부 아파트매매 실거래가 API](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15057511)
- [한국부동산원 청약홈 API](https://www.data.go.kr/tcs/dss/selectApiDataDetailView.do?publicDataPk=15069156)

---

## 라이선스

MIT
