# 📌 던파 증폭 시뮬레이터

## 📖 프로젝트 개요

던전앤파이터(DNF)의 장비 증폭 시스템을 웹 기반으로 시뮬레이션할 수 있는 도구입니다.  
일반 증폭과 안전 증폭을 모두 지원하며, 장비 파괴 여부, 보호권 사용, 결정체 소비 등을 고려한 실제와 유사한 증폭 결과를 제공합니다.

---

## 🗂️ 폴더 구조

```
📁 DNF/
├── 📁 backend/
│   ├── 📜 main.py             # FastAPI 진입점
│   ├── 📜 logic.py            # 증폭 로직 구현
│   ├── 📜 schemas.py          # 요청/응답 스키마 정의
│   ├── 📜 requirements.txt    # 백엔드 의존성 목록
│   ├── 📜 cors.py             # CORS 설정
│   ├── 📜 .env.example        # 환경 변수 샘플 파일
│   └── 📁 __pycache__/        # 파이썬 캐시 폴더 (Git 무시 대상)

├── 📁 frontend/
│   ├── 📜 package.json        # 프론트엔드 의존성 정의
│   ├── 📜 package-lock.json   # 의존성 버전 고정
│   ├── 📜 index.html          # HTML 진입점
│   ├── 📜 AmplifyMachine.js   # 증폭기 UI 메인 컴포넌트
│   ├── 📜 AmplifyMachine.css  # 증폭기 전용 스타일시트
│   └── 📁 assets/             # 아이콘 및 효과 이미지 (무기, 방어구, 프레임, 이펙트)

└── 📜 .gitignore              # Git 버전 관리 제외 항목
```

### 구성

|초기화면 #1|장비 선택 #2|증폭 성공 #3|
|:---:|:---:|:---:|
|![1 초기화면](https://github.com/user-attachments/assets/e5d625e4-163c-4e5d-b1b1-9094ec542851)|![2 장비 선택](https://github.com/user-attachments/assets/2740f39e-d995-4d99-8cbd-562d998510b5)|![3 증폭 성공](https://github.com/user-attachments/assets/2e6afc4f-d1f8-4b88-b377-a2b60d11b85b)|

|증폭 실패 #4|장비 파괴 #5|
|:---:|:---:|
|![4 증폭실패](https://github.com/user-attachments/assets/209aeb55-5a3a-4458-a029-915693a6d561)|![5 장비파괴](https://github.com/user-attachments/assets/3833646b-4ac7-4bfe-9330-16320b4ccffc)|

---

## ✅ 주요 기능

### ⚙️ 증폭 시뮬레이션

- 일반 증폭 / 안전 증폭 선택
- 장비 종류(무기, 방어구/악세) 구분
- 증폭 보호권 사용 여부 설정
- 모순의 결정체, 조화의 결정체, 증폭보호권 개별 가격 설정
- 누적 골드, 소모 재료, 최종 수치 시각화

### 🎲 확률 기반 로직

- 실제 게임 데이터를 반영한 증폭 성공 확률
- +7~+10 구간 실패 시 단계 하락, +10 이상 실패 시 파괴
- 안전 증폭 시 확률 보정 적용 (`보정 누적 → 100% 도달 시 확정 성공`)
- 실패 시 보호권 사용 여부에 따라 파괴 여부 결정

### 🖼️ UI 및 시각적 효과

- 중앙 증폭기 프레임 이미지 렌더링
- 무기/방어구 아이콘 삽입 및 정렬
- 성공/실패/파괴 시 텍스트 이미지 애니메이션 효과 (3초 유지 후 사라짐)
- 파괴 시 장비 아이콘 사라짐 처리

---

## ⚙️ 기술 스택

### Backend  
- FastAPI  
- SQLAlchemy  
- MySQL  
- Uvicorn  
- Pydantic  

### Frontend  
- React  
- React Router  
- Bootstrap 5  
- Axios  
- Context API
---

## ⚙️ 실행 방법

### 🔧 백엔드 실행

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # 윈도우 기준
pip install -r requirements.txt
uvicorn main:app --reload
```

---

### 🌐 프론트엔드 실행

```bash
cd frontend
npm install
npm start
```

---

## 📌 기타 사항

- `.env` 파일은 Git에서 제외되며, `.env.example`을 제공합니다.
- 프론트엔드 `assets/` 폴더에는 아이템 아이콘, 증폭 프레임, 효과 이미지가 포함됩니다.
- 백엔드 로직은 실제 게임과 유사한 단계별 성공 확률 및 보호권 조건을 반영합니다.

---
