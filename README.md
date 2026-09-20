# THE RED BUTTON

매주 하나의 딜레마를 던지는 사회 실험형 웹 게임. Next.js + TypeScript +
Tailwind CSS로 만들었습니다.

## 실행 방법

```bash
npm install
npm run dev
```

<http://localhost:3000> 에서 확인할 수 있습니다.

## 페이지 구조

- `/` — 소개 및 시작
- `/experiment` — 스토리(타자기 연출) → 60초 카운트다운 + 버튼
- `/result` — 이름/코드 확인 → 결과 잠금 또는 공개
- `/about`, `/archive` — 소개 및 지난 실험 목록(placeholder)

## 지금은 mock 단계

- 참가자 통계는 `src/lib/mock-data.ts`의 고정값입니다.
- 참여 기록/이름·코드 확인은 `localStorage` + 쿠키로 처리합니다
  (`src/lib/participation.ts`). 실제 서버(Supabase) 연동 전 임시 구현입니다.
- 카카오톡/인스타그램/링크 공유 버튼은 아직 자리만 잡아둔 상태입니다.
