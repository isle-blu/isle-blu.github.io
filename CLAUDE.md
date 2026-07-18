# 프로젝트: isle-blu.github.io (디지털 가든 겸 포트폴리오)

## 개요
Quartz v5 기반 디지털 가든. 로컬 전용 블로그 vault(`/Users/dingding/Documents/blog`)를 content로 심볼릭 링크 연결해서 사용.

## 콘텐츠 워크플로우
- 글은 원본 옵시디언 vault(iCloud)에서 작성, `publish: true` 프론트매터로 표시
- `~/scripts/sync-publish.py`가 publish:true 파일만 로컬 블로그 vault로 복사
- Quartz `content`는 이 로컬 블로그 vault만 바라봄 — 원본 vault(개인 정보 포함)는 Quartz가 절대 직접 접근하지 않음
- `ExplicitPublish` 필터 사용 중 (github:quartz-community/explicit-publish)

## 배포
- GitHub repo: isle-blu/isle-blu.github.io
- GitHub Pages (Source: GitHub Actions), `.github/workflows/deploy.yml`로 자동 배포
- sync는 항상 `npx quartz sync --no-pull` 사용 (pull 단계에서 브랜치 불일치 에러 발생 이력 있음)
- 기본 브랜치명은 `npx quartz create`가 만들어준 그대로 사용, 임의로 변경하지 말 것

## 디자인
- 방향: tech 블로그 느낌, 다크모드 지원
- 컬러 팔레트: Midnight Navy 확정
  - darkMode: light #10131a / lightgray #232838 / gray #4b5468 / darkgray #c7cdda / dark #eef1f7 / secondary #5b7fd9 / tertiary #8aa0c9 / secondaryLight #2f4c8f
  - lightMode: 같은 톤 대비 반전
- 코드 폰트: IBM Plex Mono 유지

## graph 플러그인 버그
- 이슈: quartz-community/graph #2 (URL 인코딩된 슬러그에서 로컬 그래프 깨짐)
- 업스트림 PR #5 (enihsyou)가 이미 같은 원인 fix, 머지 대기 중 — 머지 확인 후 별도 벤더링 불필요할 수 있음
- 머지 전까지 필요하면 vendor/quartz-plugins/graph에 패치 버전 로컬 경로로 재벤더링

## Claude Code 역할 범위
1. **오류 탐색** — 빌드 에러, 설정 오류, 플러그인 충돌 디버깅
2. **디자인** — 색상, 폰트, 레이아웃 등 theme 관련 작업

콘텐츠 구조 변경, 발행 로직 수정, 폴더 구조 재편은 별도 지시 없이 하지 않음.
작업 후 `git diff --stat`으로 변경 파일 범위 확인 습관화.
