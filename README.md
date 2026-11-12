# Anywhere — Official Website

Anywhere의 공식 기업 홈페이지입니다. **Anywhere**는 AI 기술로 더 나은 여행 경험을 만드는 트래블테크 스타트업이고, **TripAI**는 Anywhere의 첫 번째이자 핵심 서비스(AI 기반 맞춤형 여행 추천 플랫폼)입니다.

**페이지 구성** (경량 라우터 `src/lib/router.tsx`, History API · 직접 URL 접근 · 새로고침 · 뒤로/앞으로 가기 · 페이지별 title/description)

| 경로 | 내용 |
| --- | --- |
| `/` | Hero → 구름 통과 → About(Discover Anywhere) → TripAI 필름(Explore TripAI) → Our Team(Meet Our Team) → Our Vision(요약) → Footer |
| `/about` | 회사 소개 · 가치 · Our Story & Journey(시작 배경) · Our Vision 전문 |
| `/tripai` | 서비스 소개 · 소개 영상 · 개발 중인 주요 기능 · 추천 방식 · 경험 기반 정보 · 앞으로의 방향 · 서비스 바로가기 |
| `/team` | 팀 공통 소개 (+ `src/content/team.ts` 에 팀원 정보가 있을 때만 팀원 목록) |

문구: `src/content/pages.ts`, `src/content/story.ts`(임시 브랜드 스토리), `src/content/team.ts`(현재 비어 있음).
배포: 모든 경로가 `index.html`로 돌아가야 합니다 — Vercel은 `vercel.json`, Netlify는 `public/_redirects` 포함.

섹션 노출은 `src/config/site.ts` 의 `sections` 로 관리합니다. 이전 TripAI 서비스 홈페이지용 섹션(about, problem, approach, technology, vision, contact)은 코드에 그대로 보존되어 있고 `false` 로 숨겨져 있습니다. 새 섹션은 `aboutAnywhere`, `visionAnywhere` 키로 같은 방식으로 켜고 끕니다. (보존된 `about`·`vision` 섹션은 `#about`·`#vision` id를 쓰므로 새 섹션과 겹치지 않습니다.) 이전 내비게이션 구성은 `archivedNavItems` 에 남겨 두었습니다.

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
  config/site.ts          회사(site)·서비스(service) 정보, 섹션 노출(sections), 내비게이션, 연락처 설정
  config/media.ts         브랜드 영상 파일 경로 · 포스터
  lib/gsap.ts             GSAP 등록, 미디어 조건(MQ)
  lib/useReveals.ts       data-reveal="lines|fade|clip" 진입 모션
  lib/scroll.ts           앵커 이동(부드러운 스크롤 + 포커스 이동)
  components/
    Header  HeroSection  AnywhereAboutSection  BrandFilmSection  AnywhereVisionSection
    (보존·숨김) AboutSection
    ProblemSection  ApproachSection  TechnologySection  VisionSection
    ContactSection  Footer
    ui/  Logo(종이비행기 심볼)  Icons  SectionLabel  SplitLines  VideoPlayer
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

> 현재 설정: Hero(비행하는 하늘)와 Hero → 구름 → About 전환만 움직이고, 나머지 섹션의 스크롤 등장·패럴랙스·경로 드로잉은 꺼져 있습니다. `src/config/site.ts` 의 `motion.sectionMotion` 을 `true` 로 바꾸면 아래 표의 섹션 모션이 다시 켜집니다.

| 섹션 | 모션 |
| --- | --- |
| Hero | 중앙에 Anywhere 로고만 고정(애니메이션 없음). 배경은 WebGL로 사진 속 구름을 흐르게 함: 먼 하늘은 거의 정지, 아래 구름층일수록 빠르게(플로맵 교차 페이드로 초기화 순간 없음), 원근이 적용된 구름층이 지나가고 해 주변 빛이 아주 미세하게 변함. 날개는 별도 레이어로 미세한 상하 진동, 카메라는 느린 전진·호흡. WebGL 미지원 시 CSS 안개 레이어, 모션 축소 시 정지 이미지. `src/lib/flightSky.ts` |
| Sky Journey (Hero → About) | 화면을 고정하고 스크롤 진행도에 맞춰 연속 재생(스크럽, 되감기 가능): 카메라가 구름층으로 전진하며 날개가 아래로 빠짐 → WebGL 구름 시트가 원근에 따라 다가와 스쳐 지나감(`src/lib/cloudFly.ts`) → 밝은 안개로 가득 찬 순간 장면 교체 → 안개가 걷히며 구름 위 하늘(`public/images/about/above-clouds.webp`) 위로 회사 소개 등장. 스크롤 구간은 화면 높이의 2배. 모션 축소 시 고정 없이 Hero와 About을 차례로 표시, WebGL 미지원 시 단순 안개 그라데이션 |
| (이전) About Anywhere | 라벨 → 헤드라인(줄 단위 마스크) → 본문(시간차) → 마지막 문장 강조(종이비행기 심볼, TripAI 아래 하늘색 선) 순서로 1회 등장 |
| Brand Film | 진입 시 아래에서 fade + scale (1회). 재생은 사용자 조작으로만, 스크롤 모션과 독립 |
| Our Story & Journey | 왼쪽 고정 대형 헤드라인 + 오른쪽 스토리·여정 3단계. 점선 위로 실선 경로가 스크롤에 맞춰 그려지고(스크럽), 경로가 닿으면 각 단계가 등장(위로 스크롤 시 되돌아감). 배경은 아이보리·블루그레이에서 반투명 안개로 풀리며 Our Vision 상단에 겹쳐 이어짐. 문구는 `src/content/story.ts`(임시 브랜드 스토리) |
| Footer | "THE JOURNEY CONTINUES." Our Vision 하단에 겹치는 안개로 네이비에 내려앉고, 메시지 → 로고(기존 파일)·Core Service TripAI → © 연도(자동)·TripAI·Back to top 순서로 등장 |
| Our Vision | 구름 위 새벽 풍경이 스크롤에 따라 천천히 이동(스크럽), 헤드라인 줄과 본문이 1회 떠오름. 이 구간에서는 헤더가 어두운 톤으로 전환 |
| About | 사진 clip-path 리빌 + 프레임 내부 패럴랙스 |
| Problem | 고정 무대에서 정보 과잉 → 개인화 부족 → 준비 복잡성 장면 전환 후 한 줄로 정리 |
| Approach | 취향 카드 → 성향 파악 → 여행지 연결 → 추천 카드 → 맞춤 보고서 (작동 원리를 설명하는 예시 연출) |
| Technology | 네이비 패널 확장(배경 전환), 흩어진 점이 세 갈래 흐름으로 정렬되어 하나의 경로로 연결 |
| Vision | 풍경 줌아웃 + 단어 순차 등장 |

- 모바일(≤767px)과 `prefers-reduced-motion: reduce` 에서는 고정 스크롤 장면을 정적 3단 구성으로 대체하고 패럴랙스를 제거합니다.
- 애니메이션은 transform · opacity · clip-path 중심이며, 이미지는 width/height·aspect-ratio 로 레이아웃 이동을 방지합니다.

## 브랜드 영상 (`public/videos`)

원본: 1920×1080, 30fps, 40초, H.264/AAC (원본 비율 16:9 유지, 크롭 없음)

| 파일 | 용도 | 크기 |
| --- | --- | --- |
| `tripai-brand-film-1080p.mp4` | Brand Film 데스크톱 재생 (원본 그대로, fast-start) | 약 12.2MB |
| `tripai-brand-film-720p.mp4` | Brand Film 모바일 재생 (`<source media="(max-width: 767px)">`) | 약 2.0MB |
| `brand-film-poster.webp` | Brand Film 포스터 (원본 2.6초 장면) | 약 40KB |

- Brand Film: `preload="metadata"`, `playsInline`(모바일 자동 전체 화면 방지), 자동 재생 없음. 플레이어가 화면에 가까워지기 전에는 영상 소스를 붙이지 않아 포스터만 받습니다.
- 플레이어: 재생/일시정지, 탐색, 음소거·볼륨(터치 기기는 음소거 버튼만), 전체 화면(iOS는 동영상 전체 화면), 키보드 Space·K·←→·M·F.
- 영상을 교체하려면 같은 파일명으로 덮어쓰거나 `src/config/media.ts` 경로를 수정합니다. 다시 인코딩할 때 사용한 명령:

```bash
ffmpeg -i TripAI_1080p30.mp4 -vf scale=1280:720 -c:v libx264 -preset slow -crf 25 -tune animation -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart tripai-brand-film-720p.mp4
```


## Hero 배경 구현 메모

실제 비행 영상(1순위)은 사용하지 않았습니다. 이 작업 환경에서는 스톡 영상 사이트에 접근할 수 없었고, 기존 구도(오른쪽 날개·윙렛·노을)와 일치하고 라이선스를 확인할 수 있는 영상을 찾지 못했습니다. 적합한 영상이 생기면 `.sky-move` 레이어를 `<video autoplay muted loop playsinline>`로 교체하면 됩니다(날개 레이어는 영상에 날개가 있으면 제거).

## 브랜드 로고 (`public/images/brand`)

- `anywhere-logo-800.webp`, `anywhere-logo-1600.webp`: Anywhere 공식 로고(흰색 워드마크 + 하늘색 종이비행기, 투명 배경). 제공된 원본에서 배경의 미세한 알파 노이즈만 제거하고 여백을 잘라냈습니다(비율 1745:431).
- Hero의 브랜드 시퀀스에서 사용하며, 로고는 왼쪽에서 오른쪽(비행 궤적 방향)으로 드러납니다.

## Hero 레이어 (`public/images/hero`)

원본 사진 1장(Unsplash)을 분리해 만든 레이어입니다. 모든 레이어는 같은 크기(2400×1594, 1280 버전 포함)라 정확히 겹칩니다.

| 파일 | 내용 |
| --- | --- |
| `sky-*.webp` | 하늘 레이어. 날개 영역을 주변 하늘로 복원(inpaint)해, 하늘이 움직여도 날개 뒤에서 빈 공간이 드러나지 않음 |
| `wing-*.webp` | 날개 레이어(투명 배경, 가장자리 1px 페더) |
| `flow-mask.png` | 흐름 마스크(600×398). 날개와 그 주변은 0이라 구름이 흐르지 않아, 날개 뒤 복원 영역이 끌려 나오지 않음 |
| `haze-far.webp`, `haze-near.webp` | 가로로 이음새 없이 반복되는 구름 안개 텍스처(노이즈로 생성), `mix-blend-mode: screen` |

- 무대(`.hero-stage`)는 사진 비율을 유지한 채 Hero를 덮도록 컨테이너 쿼리 단위로 크기를 정하고 2% 여유를 둡니다. 세로 화면에서는 `--focus-x`로 날개 쪽을 보여줍니다.
- 반복 모션은 모두 transform만 사용하며, sine 이징 yoyo 또는 한 타일 단위 연속 루프라 초기화되는 순간이 없습니다. Hero가 화면 밖이면 일시정지합니다.
- `prefers-reduced-motion: reduce` 에서는 모든 모션 없이 정지된 합성 이미지와 워드마크만 표시합니다.

## 콘텐츠 원칙

- 투자 유치, 연혁, 이용자 수, 파트너십, 특허, AI 모델 성능, 사업자 정보 등 확인되지 않은 내용은 기재하지 않았습니다.
- Approach 섹션의 예산·일정 값은 서비스 작동 원리를 설명하기 위한 **예시**이며 화면에도 그렇게 표기합니다. 브랜드 필름과 같은 예시 조건(100만 원 · 4박 5일 · 자연과 휴식 · 맛집 탐방)을 사용해 흐름을 잇습니다.

## 이미지 출처

브랜드 영상은 제공된 TripAI 원본 파일입니다. 모든 사진은 [Unsplash](https://unsplash.com) 에서 가져왔으며 [Unsplash License](https://unsplash.com/license) 를 따릅니다. 원본 사진 ID:

| 파일 | Unsplash photo |
| --- | --- |
| hero/sky-*, hero/wing-* / og-image.jpg | `photo-1436491865332-7a61a109cc05` |
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
