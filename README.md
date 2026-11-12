# TripAI — Official Corporate Website

> 당신의 취향이 여행이 되는 순간. — *Travel Beyond Expectations.*

TripAI 공식 기업 홈페이지입니다. 디자인 콘셉트는 **"Where Emotion Meets Intelligence"** — 사진이 여행의 감성을, 선과 점으로 이어지는 경로 모티프가 AI 기술을 담당합니다. 브랜드 필름(40초)이 About 다음에 배치되어 서비스의 추천 과정을 영상으로 보여주고, Our Approach 섹션이 그 과정을 이어서 설명합니다.

**섹션 순서**: Hero → 01 About → 02 Brand Film → 03 The Problem → 04 Our Approach → 05 Technology → 06 Vision → 07 Contact → Footer

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
  config/media.ts         브랜드 영상 파일 경로 · 포스터
  lib/gsap.ts             GSAP 등록, 미디어 조건(MQ)
  lib/useReveals.ts       data-reveal="lines|fade|clip" 진입 모션
  lib/scroll.ts           앵커 이동(부드러운 스크롤 + 포커스 이동)
  lib/useMediaQuery.ts    미디어 쿼리 구독
  components/
    Header  HeroSection  HeroFilmPreview  AboutSection  BrandFilmSection
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

| 섹션 | 모션 |
| --- | --- |
| Hero | 밝은 베일 → 카메라 줌아웃 → 종이비행기가 비행 경로를 그리며 이동 → 헤드라인 줄 단위 등장 → 슬로건 → 스크롤 유도. 우측 하단 브랜드 필름 미리보기 창. 데스크톱 패럴랙스 |
| Brand Film | 진입 시 아래에서 fade + scale (1회). 재생은 사용자 조작으로만, 스크롤 모션과 독립 |
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
| `tripai-hero-loop.mp4` | Hero 미리보기 루프: 원본 11.0–18.4초, 768×432, 무음, 앞뒤 페이드 | 약 80KB |
| `brand-film-poster.webp` | Brand Film 포스터 (원본 2.6초 장면) | 약 40KB |
| `hero-loop-poster.webp` | Hero 미리보기 포스터·자동 재생 차단 시 대체 | 약 9KB |

- Brand Film: `preload="metadata"`, `playsInline`(모바일 자동 전체 화면 방지), 자동 재생 없음. 플레이어가 화면에 가까워지기 전에는 영상 소스를 붙이지 않아 포스터만 받습니다.
- 플레이어: 재생/일시정지, 탐색, 음소거·볼륨(터치 기기는 음소거 버튼만), 전체 화면(iOS는 동영상 전체 화면), 키보드 Space·K·←→·M·F. 영상 속 화면 문구는 "영상 속 문구 텍스트로 보기"로 제공합니다.
- Hero 미리보기: 데스크톱 + 모션 허용 환경에서만 `muted`·`playsInline`·`loop` 자동 재생, 화면 밖이거나 탭이 숨겨지면 일시정지. 자동 재생이 차단되거나 모바일·모션 축소 환경에서는 포스터 이미지만 표시하며 영상 파일을 받지 않습니다.
- 영상을 교체하려면 같은 파일명으로 덮어쓰거나 `src/config/media.ts` 경로를 수정합니다. 다시 인코딩할 때 사용한 명령:

```bash
ffmpeg -i TripAI_1080p30.mp4 -vf scale=1280:720 -c:v libx264 -preset slow -crf 25 -tune animation -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart tripai-brand-film-720p.mp4
```

```bash
ffmpeg -ss 11.0 -t 7.4 -i TripAI_1080p30.mp4 -an -vf "scale=768:432,fade=t=in:st=0:d=0.5:color=0xF5F7FD,fade=t=out:st=6.8:d=0.6:color=0xF5F7FD,format=yuv420p" -c:v libx264 -preset slow -crf 27 -tune animation -movflags +faststart tripai-hero-loop.mp4
```

## 콘텐츠 원칙

- 투자 유치, 연혁, 이용자 수, 파트너십, 특허, AI 모델 성능, 사업자 정보 등 확인되지 않은 내용은 기재하지 않았습니다.
- Approach 섹션의 예산·일정 값은 서비스 작동 원리를 설명하기 위한 **예시**이며 화면에도 그렇게 표기합니다. 브랜드 필름과 같은 예시 조건(100만 원 · 4박 5일 · 자연과 휴식 · 맛집 탐방)을 사용해 흐름을 잇습니다.

## 이미지 출처

브랜드 영상은 제공된 TripAI 원본 파일입니다. 모든 사진은 [Unsplash](https://unsplash.com) 에서 가져왔으며 [Unsplash License](https://unsplash.com/license) 를 따릅니다. 원본 사진 ID:

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
