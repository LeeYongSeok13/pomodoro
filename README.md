# 뽀모타임(Pomotime)
**뽀모타임(Pomotime)** 은 뽀모도로 공부법을 기반으로 한 타이머와 일정 관리 기능을 제공하여 사용자가 효율적으로 공부 시간을 관리할 수 있도록 돕는 웹 애플리케이션입니다.

<img width="1307" alt="스크린샷 2025-02-13 오후 6 11 58" src="https://github.com/user-attachments/assets/6ffbfff6-bf99-481c-b18d-1cd2f501941e" />



## 🛠️ 사용한 기술 스택

### 프론트엔드
<img src="https://img.shields.io/badge/ejs-B4CA65?style=for-the-badge&logo=ejs&logoColor=black"> <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/css3-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
### 백엔드
<img src="https://img.shields.io/badge/nodedotjs-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white"> <img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white"> <img src="https://img.shields.io/badge/amazons3-569A31?style=for-the-badge&logo=amazons3&logoColor=white">
### 배포
<img src="https://img.shields.io/badge/filezilla-BF0000?style=for-the-badge&logo=filezilla&logoColor=white">

### 디자인
<img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white">

---

## 📅 프로젝트 개요
- 기간: 2024년 10월 30일 ~ 11월 14일 (2주)
- 팀 프로젝트 (프론트엔드 2명 + 백엔드 2명)
- **나의 역할**:  
    - **프로젝트 팀원**: 백엔드 설계 및 로그인 페이지 기능 전담 
    - **프론트엔드 개발**: 로그인 페이지 전체 프론트엔드 설계 및 구현
    - **백엔드 설계**: 프로젝트 전체 DB설계 및 로그인 DB 구현 & 활용 
    - **디자인 설계**: Figma를 활용한 UI/UX 기획 및 프로토타입 제작(수정 위주)
      
---

## 🔍 프로젝트를 시작하게 된 계기
프로젝트를 시작할 당시 **"어떤 페이지를 만들 것인가?"** 에 대해 고민했습니다.
우리가 직접 사용하고 도움이 될 만한 페이지를 만들면 더욱 의욕적으로 작업할 수 있다는 결론에 도달했습니다.
결과적으로, **공부에 도움을 주는 일정 관리 및 타이머 기능** 개발에 초점을 맞추게 되었습니다.

---

## 💡 뽀모도로 공부법
**뽀모도로 타이머** 란 25분 동안 집중하여 공부하고, 이후 5분간 휴식하는 과정을 하나의 사이클로 잡아 반복하는 공부법입니다.

- 장점:
    - 최대 집중 시간을 활용하여 생산성 향상
    - 피로도를 최소화
- 아이디어:
    - 타이머 기능과 일정 관리 기능을 결합하여 생산성을 극대화할 수 있도록 설계
---

## 🎯 주요 타겟층 및 기대효과
### 타겟층
공부 시간 관리를 원하는 모든 연령층
- 직관적이고 친숙한 UI 디자인으로 누구나 쉽게 사용 가능
### 기대효과
- 설치가 필요 없는 웹 기반 앱으로 사용자 경험 향상
- 꾸준한 학습 관리로 집중력 및 학습 효율 증가

---

## 🙋 담당한 역할
### 🏆 프로젝트 팀원  
- 로그인 페이지 담당 프론트 및 백엔드 개발 
- 프로젝트 구조 설계 및 페이지 워크플로우 정의  

### 🎨 UI/UX 디자인  
- Figma를 활용해 전체적인 디자인 설계 및 레이아웃 구성  

### 💻 프론트엔드 개발  
- **로그인 기능**: 회원가입 및 로그인 기능 구현  
- **마이페이지 기능**: 일정 상태 확인 및 피드 정리 기능 구현  

### 🔧 백엔드 개발  
- **일정 관리 API 설계**
- **MySQL DB 설계** 및 API 엔드포인트 설계  
- **세션 인증**을 활용한 로그인/회원가입 구현  

---

## 📋 주요 기능
### 1. 로그인 및 회원 관리 (**개인 담당**)  
- 회원가입 및 로그인 기능 구현  
- 세션을 활용한 **인증 및 권한 관리**  
- 이메일 찾기, 비밀번호 재설정 기능 추가  

### 2. 피드 페이지 (**개인 담당**) 
- 사용자 간 정보 공유 기능  
- 무한 스크롤 구현으로 성능 최적화  
- Amazon S3를 활용한 이미지 관리  

### 3. 일정 관리 페이지 (**개인 담당**)  
- 달력 기반 일정 관리 기능  
- 일정 추가/삭제/편집 기능 구현  
- 일정 데이터 구조 설계 (사용자 ID, 일정 내용, 생성 날짜)  

### 4. 타이머 페이지 
- **뽀모도로 타이머**: 25분 공부 + 5분 휴식 반복  
- **일반 타이머**: 지속적인 집중 시간을 측정  

### 5. 마이페이지 (**개인 담당**)  
- 일정 상태 확인 (미완료, 진행 중, 완료)  
- 좋아요를 누른 피드 모아보기  


---

## 💻 구현 기능
### 1. 서버 사이드 렌더링 구현
- 성능 측정 결과 평균 0.3~0.7초의 접속 속도를 유지할 수 있었습니다.
### 2. MVC 패턴의 도입
- 파일 역할을 분리하고, 코드 혼선을 줄여 효율성을 높였습니다.
### 3. AWS를 활용한 배포
- AWS, EC2, S3, IAM를 통해 정밀한 서버 유지보수와 안정적인 데이터 관리가 가능해졌습니다.
### 4. 모바일 우선 설계 방식 도입
- UI의 일관성이 향상되었으며 개발시간을 3일 이상 단축시킬 수 있었습니다.
---

## 📊 프로젝트 구조
**MVC 패턴**을 기반으로 프로젝트를 설계
```
src/
├── controllers/
├── models/
├── routes/
├── views/
└── public/
```

---

## 🧩 해결한 과제 및 성과

### 🚀 1. 로그인 페이지 보안 강화 
- **문제**: URL 변경을 통한 비인가 사용자 접근 가능  
- **해결**: 세션을 활용한 접근 제어 및 보안 강화  
- **성과**: 비인가 접근 시도 차단률 **100% 달성**  

### 🎨 2. 피드 렌더링 최적화  
- **문제**: 피드 과다 로드로 성능 저하  
- **해결**: 초기 로드 시 3개의 데이터만 불러오고, 무한 스크롤 구현  
- **성과**: 페이지 로딩 속도 향상, API 요청 감소

### 🛠️ 3. 일정 관리 페이지 성능 개선 
- **문제**: 일정 데이터가 많아지면서 렌더링 속도 저하  
- **해결**: 일정 데이터를 **비동기 로드** 방식으로 변경하여 성능 최적화  
- **성과**: 일정 조회 속도 향상

---

## 💭 작업 후기 및 피드백
이번 프로젝트를 통해 기획, 디자인, 프론트엔드, 백엔드, DB 연결까지의 전 과정을 경험할 수 있었습니다.
특히 **Git 협업**과 제한된 시간 내 효율적인 작업 진행이 중요함을 느꼈습니다.


### 🔥 개인적으로 성장한 부분  
- **백엔드 설계** 경험을 쌓으며 API 구조 및 MySQL 활용 능력 향상  
- **팀장 역할 수행**을 통해 협업과 일정 조율 능력 강화  
- **일정 관리 기능 개발**을 통해 비동기 요청과 상태 관리에 대한 이해 심화

### 아쉬운 점
- 공부 시간 기록 및 리워드 시스템
- 주간 공부 통계 시각화
- 목표 의식을 강화할 수 있는 추가 기능

---
