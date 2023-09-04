# **Breadcrumbs**

```bash
├── src/
│   ├── db.ts
│   ├── routes/
│   │   ├── types.ts
│   │   ├── page.ts
│   ├── initializeMockData.ts
│   ├── index.ts
├── .env
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
```

- **`src/`**: 소스 코드 디렉토리
    - **`db.ts`**: 데이터베이스 관련 로직
    - **`routes/`**: 라우터 및 관련 파일
        - **`types.ts`**: 타입 정의
        - **`page.ts`**: 페이지 관련 라우터 및 로직
    - **`initializeMockData.ts`**: 목업 데이터 초기화 스크립트
    - **`index.ts`**: 애플리케이션 진입점
- **`.env`**: 환경 변수 설정 파일
- **`.gitignore`**: Git에서 무시할 파일 및 디렉토리 목록
- **`Dockerfile`**: Docker 이미지 빌드를 위한 설정 파일
- **`docker-compose.yml`**: Docker Compose 설정 파일
- **`package.json`**: 프로젝트 설정 및 의존성 관리 파일
- **`tsconfig.json`**: TypeScript 설정 파일

## **테이블 구조**

### **Page 테이블:**

| Column | Data Type | Description |
| --- | --- | --- |
| id | INT | 페이지의 고유 ID로 자동 증가됩니다. 기본 키입니다. |
| title | TEXT | 페이지의 제목입니다. |
| content | TEXT | 페이지의 내용입니다. |
| parent_page_id | INT | 부모 페이지의 ID입니다. 최상위 페이지인 경우 NULL입니다. |

## **프로젝트 설정 및 환경 구성**

### **프로젝트 초기 설정**

- 프로젝트 디렉토리 생성 및 초기화
- **`npm init`** 또는 **`yarn init`** 을 통한 프로젝트 초기 설정

### **Docker 환경 구성**

- **`Dockerfile`** 및 **`docker-compose.yml`** 파일 작성
- 데이터베이스와 애플리케이션 컨테이너 설정

### **패키지 설치 및 환경 설정**

- Express.js, MySQL2, dotenv 등의 패키지 설치
- 환경 변수 설정을 위한 **`.env`** 파일 작성

### **데이터베이스 연결 설정**

- **`mysql2/promise`** 를 사용한 데이터베이스 연결 설정
- 데이터베이스 연결 풀 생성
- **`queryDB`** 함수를 통한 쿼리 실행

### **데이터베이스 초기화 및 더미 데이터 추가**

- 데이터베이스 초기화를 위한 테이블 생성 SQL 작성
- **`initializeDatabase`** 함수를 통한 데이터베이스 초기화
- 더미 데이터 추가를 위한 **`insertSampleData`** 함수 작성

## **페이지 및 브로드 크럼스 로직 구현**

### **데이터 모델 정의**

- **`Page`** 및 **`PageRow`** 와 같은 데이터 모델 정의
- 데이터 모델을 활용하여 페이지 정보 구성

### **페이지 초기화 함수 구현**

- **`initializeDatabase`** 함수를 통한 데이터베이스 초기화 및 테이블 생성
- 데이터베이스 연결과 초기화를 앱 시작 시점에서 수행

### **페이지 라우팅 설정**

- Express 라우터를 사용하여 페이지 관련 라우팅 설정
- 페이지 정보 조회 및 브로드 크럼스 로직 연동

### **단일 페이지 정보 조회**

- 페이지 ID를 이용한 단일 페이지 정보 조회 로직 구현
- **`getPageById`**, **`getSubPagesById`**, **`getBreadcrumbs`** 함수 정의

### **브로드 크럼스 로직 구현**

- **`getBreadcrumbs`** 함수를 통해 Recursive CTE를 사용한 브로드 크럼스 로직 구현
- 필요한 경우 데이터베이스 인덱스 설정으로 성능 최적화

## **설명**

- **테이블 구조**:
    - 페이지의 각 레벨을 위해 'parent_page_id' 칼럼을 사용했습니다. 이것은 페이지의 계층 구조를 표현하는데 도움을 줍니다.
- **비지니스 로직**:
    - 페이지 정보, 서브 페이지 리스트, 브로드 크럼스 조회에 각각 다른 쿼리를 사용합니다.
    - 브로드 크럼스를 조회하기 위해 Recursive CTE(Common Table Expressions)를 사용했습니다. 이를 통해 주어진 페이지의 모든 상위 페이지를 가져올 수 있습니다.
- **설계의 장점**:
    - 간단하고 명확한 테이블 구조로, 확장성 및 유지 보수에 용이합니다.
    - Recursive CTE를 사용하여 브로드 크럼스 로직을 효율적으로 처리하며, 계층 구조를 유연하게 다룰 수 있습니다.
    - 인덱스는 조회 성능을 향상시키지만, 데이터 삽입, 수정, 삭제의 성능에는 부담을 줄 수 있습니다. 따라서 실제 사용 시나리오와 데이터의 크기, 조회와 삽입/수정/삭제의 빈도 등을 고려하여 인덱스를 적용하는 것이 중요합니다.
