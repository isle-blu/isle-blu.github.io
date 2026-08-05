---
tags:
  - Spring
  - JAVA
  - Spring-Boot
publish: true
---
----
우리가 기존에 사용하던 스프링 부트 2.x 버전은 모두 지원 종료되어 앞으로 3.x 버전으로 프로젝트를 만들거나, 기존 프로젝트들은 업그레이드가 필요한 상황이 되었다(작성 일자 기준 3.0.x 버전은 지원 종료됐다..). 그래서 이번에는 스프링 부트 3.x 버전에 대해 알아보고자 한다. 

## 주요 변경사항
### 자바 호환성 관련
스프링 부트 3.x부터는 **최소 JDK 17이 필수**이다. 

==스프링 부트 3.x는 스프링 프레임워크 6.x 버전을 사용==한다. 스프링 프레임워크 6.x 버전이 Java 17+를 기반으로 작성되었기 때문에 최소 JDK 17이 필요한 것이다.

최소 17이 권장되는 또 다른 이유는 장기적인 지원을 보장하는 LTS 버전이기 때문이다. 따라서 <u>더 상위 LTS버전인 JDK 21을 사용하는 것이 더 유리할 수 있다</u>.

<br/><br/>

### Jakarta EE 종속성 업데이트
Jakarta EE는 Java EE의 새로운 이름이다. 스프링 부트 3는 이제 Jakarta EE를 지원하며, `javax.*`에서 `jakarta.*` 패키지로 완전 변경됐다.

따라서 모든 관련 라이브러리(ex: JPA, Servlet API, Bean Validation 등)도 `jakarta.*`  기반 버전으로 업그레이드가 필요하다. 

<br/><br/>

### 서드파티 라이브러리 및 API 대거 업데이트
스프링 부트는 수많은 오픈소스 라이브러리를 자동관리하는데, 이번 버전 업그레이드에서 핵심 라이브러리 버전도 함께 큰 폭으로 올라갔다.

#### 주요 라이브러리 변화

| 라이브러리     | Spring Boot 2.x | Spring Boot 3.x |
| --------- | --------------- | --------------- |
| Hibernate | 5.x             | 6.x             |
| Jackson   | 2.12~13         | 2.14+           |
| Tomcat    | 9.x             | 10.x            |

이로 인해 자동 구성 라이브러가 아닌 직접 설정한 라이브러리는 별도로 호환성 확인이 필요해졌다.
추가로 테스트 시 `NoSuchMethodError`, `ClassNotFoundException` 등이 자주 발생할 수 있다.

<br/><br/>

### AOT(Ahead-Of-Time) 컴파일 지원
스프링 부트 3부터는 스프링 프레임워크 6 기반의 AOT 엔진을 탑재했다.

>[!faq] AOT(Ahead-Of-Time)?
>AOT 컴파일은 **애플리케이션 실행 전에, 코드를 미리 정적으로 분석하고 컴파일해서 성능을 최적화하는 기술**이다.


기존 자바는 JIT(Just-In-Time) 컴파일을 사용했다. JIT는 프로그램 실행 중에 필요한 부분을 그 시점에 해당 플랫폼에 맞게 컴파일해서 실행하는 방식으로, 실행 단계에서 컴파일 하는데 시간과 메모리를 소모한다. 따라서 실행 속도면에서 손해를 본다. 

반면 AOT는 빌드 시에 컴파일 되기 때문에 JIT에 비해 실행 속도가 빠르다. 그리고 런타임 컴파일이 없기 때문에 런타임 컴파일 시 발생할 수 있는 이슈들이 발생하지 않는다. 

<br/><br/>

### GraalVM Native Image 지원
GraalVM은 자바, 코틀린, 자바스크립트, 파이썬 등 여러 언어를 실행할 수 있다. 가장 핵심적인 사항은 ==자바 애플리케이션을 Native 실행 파일로 변환할 수 있는 기능(Native Image)==이다. 

기존 자바 앱은 `.jar`파일로 빌드하면 JVM이 필요했다. JVM이 앱을 로딩하고 JIT 컴파일을 수행하기 때문에 느린 실행 속도가 문제였다.

반면 GraalVM을 사용하면서 `.jar`을 바로 실행가능한 이진파일(`.exe`, `.bin`)으로 변환하게 되었다. 이를 통해 JVM 없이 바로 실행이 가능하고, 상대적으로 빠른 기동 속도와 낮은 메모리 사용량으로 JVM을 대체할 수 있게 되었다. 

<br/><br/><br/>

## 마이그레이션 절차
https://www.youtube.com/watch?v=HrRQExD3xow

Spring boot 2.x에서 3.x로 마이그레이션 하는 절차는 위 영상을 참고했다.


<br/><br/>

### 1. JDK 업그레이드
스프링 부트 3.x는 최소 JDK 17이 필요하다. 따라서 **17 이상의 버전으로 업그레이드** 해야한다.

>[!warning] 주의
>Java 8 -> 17로 점프 시 final 변수, Switch Expression, Records 등 ==문법 변화를 고려==해야한다. 


<br/><br/>

### 2. Spring Boot 버전 업
JDK 버전 업그레이드가 이뤄진 후 스프링 부트 버전을 올려야 한다. 

여기서 주의해야할 점은 순차적으로 버전을 올려야 한다는 것이다. 2.5.x와 같은 낮은 버전에서 한번에 3.x로 업그레이드 하는 것보다 ==2.6 -> 2.7 -> 3.0과 같이 순차적으로 버전을 올리는 것이 훨씬 안정적==이다. 

<br/><br/>

### 3. 라이브러리 의존성 최신화
사용하고 있는 라이브러리의 버전을 확인하고 최신 버전으로 업그레이드 해야한다. 
그리고 변경을 통해 발생하는 오류를 찾아 작업한다.
#### 주요 의존성 체크포인트
- Hibernate 5 → **Hibernate 6**
- Jackson 2.12 → **2.14+**
- Tomcat 9 → **10**
- Micrometer → 최신
- JPA 구현체 (Hibernate, EclipseLink 등)
- Flyway, Liquibase 버전 업
- MapStruct, QueryDSL 등 빌드 플러그인 호환성 확인

<br/><br/> 

### 4. Jakarta 네임스페이스 변경
**`javax.`를 `jakarta.`로 리팩토링**해야한다. 

IDE에서 검색하면서 일괄적으로 리팩토링하고 컴파일 오류를 수정한다. 그리고 JPA Entity 등 Annotation Import를 수정한다. 

```java
import javax.persistence.Entity;  // Before
import jakarta.persistence.Entity; // After
```

이외에도 오류가 발생하는 부분을 찾아 작업한다.


<br/><br/> 

### 5. application.properties 또는 application.yaml 점검
스프링 부트 3.x로 가면서 일부 속성이 변경되거나 사라졌다. **`application.properties`또는  `application.yaml` 파일에서 속성들을 점검하고 변경**해야한다.

변경 후 Deprecated 코드를 확인하고 제거해야한다.

<br/> 

----
## 출처(참고문헌)
- JIT vs AOT 컴파일 방식. *포시코딩:티스토리*. (2022년 11월 21일). https://4sii.tistory.com/89
- Phillip, Webb. "Mind the Gap: Jumping from Spring Boot 2.x to 3.x". 2023년 9월 7일. https://www.youtube.com/watch?v=HrRQExD3xow
- [Java] Spring Boot - 스프링 부트 3 버전. *seek:네이버블로그*. (2024년 1월 24일). https://m.blog.naver.com/seek316/223332785143



