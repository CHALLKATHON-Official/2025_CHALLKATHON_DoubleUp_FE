# 🕰️ 25Hrs - 집중 타이머 + Todo 관리 웹앱

**25Hrs**는 Pomodoro 타이머와 날짜별 Todo 관리 기능을 제공하는 자기관리형 웹앱입니다.  
사용자는 집중 시간과 할 일을 기록하고, 누적된 집중 데이터를 차트로 확인할 수 있습니다.

---

## 🔗 배포 주소

👉 [https://hrs-884dd.web.app](https://hrs-884dd.web.app)

---

## 💡 주요 기능

- ✅ **할 일(To-Do) 기록**: 날짜별로 해야 할 일을 작성하고 체크할 수 있습니다.
- ⏱️ **25분 집중 / 5분 휴식 타이머**: 공부 및 휴식 모드를 전환하며 사용할 수 있습니다.
- 🧠 **집중 시간 및 횟수 자동 저장**: 타이머가 종료되면 Firestore에 기록됩니다.
- 🎨 **테마 색상 변경**: 사용자가 원하는 테마 색상으로 UI 분위기를 조절할 수 있습니다.
- 📊 **통계 시각화**: 주간/월간 기준으로 집중 시간과 횟수를 차트로 확인할 수 있습니다.
- 👥 **친구 기능**: 친구 추가 및 삭제, 친구의 상태 실시간 확인이 가능합니다.
- 🔐 **Google 로그인 지원** (Firebase Authentication 사용)
- ☁️ **실시간 데이터 저장** (Cloud Firestore 기반)

---

## 🛠️ 기술 스택

| 기술 | 역할 |
|------|------|
| **React + Vite** | 프론트엔드 UI 구현 |
| **TypeScript** | 타입 안정성과 유지보수성 향상 |
| **Tailwind CSS** | 빠르고 직관적인 스타일링 |
| **Firebase Authentication** | Google 로그인 기능 |
| **Cloud Firestore** | 사용자별 데이터 실시간 저장 |
| **Firebase Hosting** | 정적 웹사이트 배포 |

---
## 파일 구조
```
src
 ┣ assets
 ┃ ┗ react.svg
 ┣ components
 ┃ ┣ AddTodoModal.tsx
 ┃ ┣ CalendarBox.tsx
 ┃ ┣ CopyID.tsx
 ┃ ┣ FriendCard.tsx
 ┃ ┣ MenuButton.tsx
 ┃ ┣ Modal.tsx
 ┃ ┣ ProtectedRoute.tsx
 ┃ ┣ Timer.tsx
 ┃ ┗ WeeklyFocusData.tsx
 ┣ firebase
 ┃ ┗ firebase.ts
 ┣ images
 ┃ ┣ appicon-grey.png
 ┃ ┣ appicon-pink.png
 ┃ ┣ appicon.png
 ┃ ┣ default-bunny.png
 ┃ ┗ studyingRabbit.png
 ┣ pages
 ┃ ┣ Calendar.tsx
 ┃ ┣ Friends.tsx
 ┃ ┣ Home.tsx
 ┃ ┣ LoginHome.tsx
 ┃ ┣ NotFound.tsx
 ┃ ┣ Settings.tsx
 ┃ ┣ Stats.tsx
 ┃ ┣ Theme.tsx
 ┃ ┣ TimerPage.tsx
 ┃ ┗ Welcome.tsx
 ┣ App.css
 ┣ App.tsx
 ┣ index.css
 ┣ main.tsx
 ┗ vite-env.d.ts
```
 ---

## 👥 팀 정보

- 202202191 유윤지 [통번역대학 TESOL영어학전공]: 프론트엔드/서버
- 202102439 이서연 [통번역대학 중국어통번역학과]: 프론트엔드/디자인

---

본 프로젝트는 2025 챌커톤을 위해 제작되었습니다.
