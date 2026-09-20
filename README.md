# THE RED BUTTON

매주 하나의 딜레마를 던지는 사회 실험형 웹 게임. Next.js + TypeScript +
Tailwind CSS로 만들었습니다.

## 실행 방법

먼저 `.env.example`을 참고해 `.env.local`을 만들고 Supabase 프로젝트의 URL과
anon(publishable) 키를 채워주세요.

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

## 백엔드 (Supabase)

- 참여 기록·중복 참여 방지·결과 조회는 모두 Supabase에서 처리합니다.
  클라이언트는 서버(Next.js Route Handler)를 거쳐서만 데이터에 접근하고,
  Supabase 테이블에는 RLS로 직접 접근을 막아두었습니다(`src/lib/supabase.ts`,
  `src/app/api/*/route.ts`).
- 기기별 중복 참여 방지는 httpOnly 쿠키(`trb_pid`)로 식별되는 참가자 ID로
  처리합니다(`src/lib/participant-cookie.ts`).
- 카카오톡/인스타그램/링크 공유 버튼은 아직 자리만 잡아둔 상태입니다.
