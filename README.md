# TripAI — Official Corporate Website

> 당신의 취향이 여행이 되는 순간. — *Travel Beyond Expectations.*

TripAI 공식 기업 홈페이지입니다. 디자인 콘셉트는 **"Where Emotion Meets Intelligence"** — 사진이 여행의 감성을, 선과 점으로 이어지는 경로 모티프가 AI 기술을 담당합니다.

## 실행

```bash
npm install
npm run dev       # 개발 서버
npm run build     # 타입 검사 + 프로덕션 빌드 (dist/)
npm run preview   # 빌드 결과 미리보기
```

## 기술 스택

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (디자인 토큰은 `src/styles/index.css` 의 `@theme`)
- GSAP + ScrollTrigger (`@gsap/react` 의 `useGSAP`)
- 폰트: Pretendard(한글, dynamic subset 자가 호스팅), Manrope · Inter(영문, `@fontsource-variable`)

## 운영 설정 (`.env`)

`.env.example` 을 `.env` 로 복사해 값을 채웁니다. **값이 비어 있으면 해당 정보는 화면에 노출되지 않습니다.**

| 변수 | 용도 | 비어 있을 때 |
| --- | --- | --- |
| `VITE_SITE_URL` | canonical · Open Graph 절대 URL | 상대 경로로 출력 |
| `VITE_CONTACT_EMAIL` | 문의 이메일 | 이메일 미노출 |
| `VITE_CONTACT_ENDPOINT` | 문의 폼 JSON POST 엔드포인트 | 폼은 "전송 채널 미연결" 안내만 표시 |

문의 폼은 엔드포인트가 2xx 로 응답한 경우에만 전송 완료 메시지를 표시합니다. 전송 본문: `{ kind, name, organization, email, message }`.
Open Graph 이미지는 `public/og-image.jpg`(1200×630)를 교체하면 됩니다.

## 구조

```
src/
  App.tsx                 섹션 조립
  config/site.ts          브랜드 문구 · 내비게이션 · 연락처 설정
  lib/gsap.ts             GSAP 등록, 미디어 조건(MQ)
  lib/useReveals.ts       data-reveal="lines|fade|clip" 진입 모션
  lib/scroll.ts           앵커 이동(부드러운 스크롤 + 포커스 이동)
  components/
    Header  HeroSection  AboutSection  ProblemSection  ApproachSection
    TechnologySection  VisionSection  ContactSection  Footer
    ui/  Logo  Icons  SectionLabel  SplitLines
  styles/index.css        디자인 토큰 + 컴포넌트 스타일 + 반응형
```

## 디자인 시스템 요약

| 토큰 | 값 | 사용 |
| --- | --- | --- |
| Cloud White | `#F8FAFC` | 기본 배경 (약 75%를 밝은 뉴트럴로 구성) |
| Soft Gray | `#E9EEF3` | Problem 섹션, 보조 면 |
| Deep Navy | `#14283F` | Technology 섹션, 주요 버튼 |
| Sky Blue | `#78B9E7` | 인터랙션, 경로·데이터 포인트 |
| Sky Ink | `#2A6F9F` | 흰 배경 위 강조 텍스트 (대비 확보용 파생색) |
| Text Black | `#17212B` | 본문 |

- Radius: 이미지 24 · UI 카드 16 · 내부 요소 10 · 버튼 pill
- 타이포: 영문 디스플레이 Manrope 300 / 한글 헤드라인 Pretendard 500 / 본문 Pretendard 400 / 라벨 Inter 500

## 모션 설계

| 섹션 | 모션 |
| --- | --- |
| Hero | 밝은 베일 → 카메라 줌아웃 → 비행 경로 드로잉 → 헤드라인 줄 단위 등장 → 슬로건 → 스크롤 유도. 데스크톱 패럴랙스 |
| About | 사진 clip-path 리빌 + 프레임 내부 패럴랙스 |
| Problem | 고정 무대에서 정보 과잉 → 개인화 부족 → 준비 복잡성 장면 전환 후 한 줄로 정리 |
| Approach | 취향 카드 → 성향 파악 → 여행지 연결 → 추천 카드 → 맞춤 보고서 (작동 원리를 설명하는 예시 연출) |
| Technology | 네이비 패널 확장(배경 전환), 흩어진 점이 세 갈래 흐름으로 정렬되어 하나의 경로로 연결 |
| Vision | 풍경 줌아웃 + 단어 순차 등장 |

- 모바일(≤767px)과 `prefers-reduced-motion: reduce` 에서는 고정 스크롤 장면을 정적 3단 구성으로 대체하고 패럴랙스를 제거합니다.
- 애니메이션은 transform · opacity · clip-path 중심이며, 이미지는 width/height·aspect-ratio 로 레이아웃 이동을 방지합니다.

## 콘텐츠 원칙

- 투자 유치, 연혁, 이용자 수, 파트너십, 특허, AI 모델 성능, 사업자 정보 등 확인되지 않은 내용은 기재하지 않았습니다.
- Approach 섹션의 예산·일정 값은 서비스 작동 원리를 설명하기 위한 **예시**이며 화면에도 그렇게 표기합니다.

## 이미지 출처

모든 사진은 [Unsplash](https://unsplash.com) 에서 가져왔으며 [Unsplash License](https://unsplash.com/license) 를 따릅니다. 원본 사진 ID:

| 파일 | Unsplash photo |
| --- | --- |
| hero-sky* / og-image.jpg | `photo-1436491865332-7a61a109cc05` |
| vision* | `photo-1506905925346-21bda4d32df4` |
| about-rest | `photo-1507525428034-b723cf961d3e` |
| about-city | `photo-1538485399081-7191377e8241` |
| about-nature | `photo-1476514525535-07fb3b4ae5f1` |
| d-paris | `photo-1499856871958-5b9627545d1a` |
| d-resort | `photo-1520250497591-112f2f40a3f4` |
| d-tokyo | `photo-1540959733332-eab4deabeeaf` |
| d-peaks | `photo-1464822759023-fed622ff2c3b` |
| d-lake | `photo-1494500764479-0c8f2919a3d8` |
| d-turq | `photo-1501785888041-af3ef285b470` |
| d-eiffel | `photo-1502602898657-3e91760cbb34` |
