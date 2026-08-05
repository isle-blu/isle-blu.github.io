---
tags:
  - Spring
  - JAVA
  - BackEnd
publish: true
---
----
Spring으로 개발하면서 DAO, DTO, VO가 무슨 차이가 있는지 궁금했다. 이름도 뭔가 비슷해 보이는 이 용어들이 어떤 차이가 있고 왜 사용하는지 알아보고자 한다. 

<br/><br/>

## DAO(Data Access Object)
> DAO는 ==데이터베이스에 접근하는 객체==를 말한다.

DAO는 프로젝트 Service 모델과 실제 데이터베이스를 연결하고 CRUD 기능을 수행하는데, JPA에서는 데이터베이스에 접근하는 ==Repository== 객체가 DAO 역할을 맡고 있다고 할 수 있다. 

<br/>

### DAO를 사용하는 이유
#### 1. 효율적인 커넥션 관리
DB와 애플리케이션이 통신할 때 매번 Connection 객체를 생성하는 데 연결이 너무 많아질 경우 과부하가 올 수 있다. 이를 방지하기 위해 나온 것이 ==Connection Pool==이다. Connection Pool은 Connection 객체를 미리 만들어 놓고 가져다 쓰면서 재사용을 통해 과부하를 줄이는 방식이다. (자세한 내용은 여기로 Connection pool)

위처럼 ==Connection 객체를 하나만 가져오고 그 Connection을 가져온 객체가 모든 DB와 연결하는 것이 바로 DAO 객체==이다. DAO를 통해 DB 연결 과부하를 줄일 수 있다.

<br/>

#### 2. 데이터베이스 변경의 용이성
개발을 하다 보면 데이터베이스를 변경해야 할 일이 생길 수 있다. 예를 들어 MySQL에서  MongoDB로 변경한다거나, 같은 RDBMS인 PostgreSQL로 변경할 수도 있다. 이처럼 DB를 변경하는 것은 DB마다 요구하는 접근 방식이 있기 때문에 이에 대한 코드 수정이 요구된다. 

만약 DAO 패턴이 적용된 경우, 비즈니스 로직과 분리된 DAO클래스에 대한 부분만 수정하면 되기 때문에 다른 부분은 건들 필요가 없다.

<br/><br/><br/>

## DTO(Data Transfer Object)
> DTO는 데이터를 ==Transfer(이동)하기 위한 객체==를 말한다.

DTO는  Client, Controller, Service, Repository와 같이 각 계층 사이를 오갈 때 DTO의 형식으로 이동한다. DTO는 로직을 갖지 않는 순수한 객체이고, getter/setter 메서드만 가지고 있다. 

<br/>

### DTO를 사용하는 이유
Entity 객체를 사용하지 않고 DTO의 형태로 변형해서 사용하는 이유는 무엇일까?

<br/>

#### 1. Entity 객체의 변형 방지
==Entity==는 테이블과 1:1로 대응되어 설계되기 때문에 ==변형이 가능한 최소화== 되어야 한다. 따라서 Client가 요구하는 대로 전달해야 하는 View처럼 ==데이터 구조가 빈번하게 바뀔 수 있는 경우==에는 오직 데이터 전달의 역할을 수행하는 DTO가 더 적합하다.

<br/>

#### 2. View Layer와 DB Layer의 역할 분리
위에서 설명한 것처럼 View Layer에서는 DTO가 적합하고, DB Layer에서는 테이블과 1:1로 대응되어 설계된 Entity가 더 적합하다. 이를 통해 두 Layer의 역할을 쉽게 분리할 수 있다.


<br/><br/><br/>

## VO(Value Object)
> VO는 ==값 자체를 표현하는 객체==를 말한다.

DTO와 유사해 헷갈리는 경우가 많지만 VO는 DTO와 다르게 ==불변 객체==이다. 그리고 DTO와 달리 비즈니스 로직을 포함할 수 있다. 하지만 setter 메서드는 갖고 있지 않아 Read-Only로 오로지 읽기 기능만 사용한다.

VO의 핵심은 ==내부의 속성(필드)값이 같으면 같은 객체로 식별==한다는 점이다. 이는 객체 주소 값이 다르더라도 적용된다. 따라서 equals & hashCode를 재정의해야 한다. 그리고 해당 값들은 ==모두 primitive 타입==이다.

<br/>

### VO를 사용하는 이유
VO가 필요한 이유는 ==primitive 타입이 도메인 객체를 모델링하기에 문제가 있기 때문==이다.

==primitive obsession==은 도메인의 객체를 나타내기 위해 primitive 타입을 쓰는 나쁜 관습을 말한다. 


예를 들어 건물이라는 객체에 =='높이'== 는 대부분 int 타입으로 설계할 것이다. 하지만 int는 사칙연산, 음수가 되는 것이 가능하지만 건물의 높이는 불변한 값이다. 따라서 int 타입의 ==모든 기능이 필요하지 않다==.

다른 예로 직사각형이라는 객체도 =='높이'== 를 가질 수 있다. 이러한 상황에서 유효성 검사 코드를 각 객체에 중복되게 넣어야 하고. 해당 속성이 불변이라는 것을 파악하려면 각 클래스로 들어가 final이 붙었는지 확인해야 한다.

<br/>

따라서 VO를 사용하는 이유를 정리하면 다음과 같다.
> 1. primitive 타입의 기능들을  '값'이 다 사용하지 않는다.
> 2. '값'이 여러 곳에 사용된 경우 여러 곳에 나뉘어 유효성 검사나, 
> 	불변 체크를 하는 것을 방지하기 위해 사용된다.

위 예시는 https://ksh-coding.tistory.com/83 이 블로그를 참고했다. 정말 좋은 예시로 코드와 함께 설명해 주기에 참고하면 좋을 것이라고 생각한다.

<br/><br/><br/>

## 마치며
DAO, DTO, VO 항상 헷갈리면서도 중요한 개념이라고 생각한다. 이번에 한 번에 정리할 수 있어서 좋은 기회였다고 생각한다.


<br/>

----
## 출처(참고문헌)
- [JAVA] - DAO, DTO, VO, Entity 간단하고 쉽게 이해하기. *[꼼꼼한 개발자] 꼼코더:티스토리*. (2022년 12월 20일). https://ccomccomhan.tistory.com/35
- DAO,DTO,VO 란? + DTO와 VO의 차이점, 다루는 이유. *YD:티스토리*. (2023년 3월 13일). https://woo0doo.tistory.com/20
- [Spring] DAO, DTO, VO의 개념과 차이점. *dam2.log:Velog*. (2023년 7월 22일). https://velog.io/@do_dam/DAO-DTO-VO의-개념과-차이점
- JPA에서 DAO, DTO를 사용해야하는 이유. *kimunche.log:Velog*. (2024년 3월 18일). https://velog.io/@kimunche/JPA에서-DAO-DTO를-사용해야하는-이유
- VO(Value Object)는 무엇일까? 왜 사용할까?. *성장하는 성하 Blog:티스토리*. (2023년 3월 12일). https://ksh-coding.tistory.com/83

