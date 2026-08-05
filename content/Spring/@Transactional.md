---
tags:
  - Spring
  - BackEnd
  - Transaction
  - AOP
  - JAVA
publish: true
---
----
지난 포스팅에서 스프링이 트랜잭션 기술에 대해 알아보았다. 이번 포스팅에서는 그 중 현재 가장 대중적으로 사용하고 있는 **@Transactional**에 대해 좀 더 자세히 알아보고자 한다

지난 포스팅은 아래 링크에서 볼 수 있다.
< [[스프링이 제공하는 트랜잭션(Transaction) 기술]] >

<br/><br/><br/>


## @Transactional?
`@Transactional`은 스프링이 제공하는 선언적 트랜잭션으로, 이 어노테이션이 클래스나 매서드에 적용되면, 스프링이 해당 클래스, 매서드의 트랜잭션을 자동으로 관리해준다.


``` java
@Service
@Transactional
public class UserService {
    @Transactional
    public void createUser(User user) {
        userRepository.save(user);
        // 예외 발생 시 롤백됨
    }
}
```

클래스와 매서드 위에 각각 `@Transactional`이 적용된 걸 확인할 수 있다.

위 예시처럼 클래스와 내부 매서드에 트랜잭션이 적용된 경우, <u>내부 매서드의 트랜잭션 규칙이 우선 적용</u>된다.

<br/><br/><br/>

## @Transactional 동작과정
`@Transactional`이 명시되면 내부에서 어떤 동작이 이뤄지는지 알아볼 것이다. `@Transactional`은 단순한 어노테이션이 아닌, **AOP 프록시(proxy)**를 적용해 트랜잭션을 구현한 것이다.

일단 `@Transactional`의 동작 과정을 도식화하면 다음과 같다.


![[@transactional1.png]]



위 이미지에서 Spring AOP 중 **CGLIB**을 통해 Target 클래스를 상속한 Proxy 객체가 클라이언트의 요청을 받는 것을 볼 수 있다.

`@Transactional`이 명시된 Target(클래스나 매서드)이 있다면, AOP를 통해 Target이 상속하고 있는 인터페이스 또는 Target을 상속한 ==Proxy 객체가 생성==된다.

AOP를 통해 Proxy 객체가 생성됐다면, 스프링 컨테이너에 ==Proxy 객체가 등록된다(Target 객체는 등록되지 않는다).== 

클라이언트가 요청을 보내면, Controller가 해당 비즈니스 로직을 가진 Service를 호출하게 될 것이다. 만약 Service가 `@Transactional`을 가지고 있다면 생성된 **Proxy 객체를 참조**하게 된다. 그 뒤에 Target 매서드 실행 전 후에 트랜잭션이 처리를 수행한다.

순서를 정리하면 아래와 같다.

>[!example] Sequence  
>1. `@Transactional`을 가진 클래스나 매서드에 대한 **Proxy 객체 생성**
>2. Proxy 객체가 스프링 컨테이너에 **빈으로 등록**
>3. 클라이언트 요청 시 **Target 객체가 아닌 Proxy 객체 참조**
>4. 요청 로직(핵심 비즈니스 로직) 실행 **전 후로 트랜잭션 처리** 

<br/><br/><br/>

## @Transactional 옵션
`@Transactional`은 적용할 수 있는 다양한 옵션들이 있다.

### 격리 수준(Isolation Level)
트랜잭션 **격리 수준**을 결정해주는 옵션이다. 트랜잭션 격리 수준이 뭔지 알아야하기 때문에 만약 모른다면 아래 링크를 참고하며 보는 걸 권장한다.
< [[Database/트랜잭션(Transaction) 2편 - LOCK과 격리 수준#트랜잭션 격리 수준]] >

`isolation` 을 통해 설정할 수 있으며 아래 코드는 그 예시이다.

```java
@Transactional(isolation = Isolation.REPEATABLE_READ)
public void processOrder() {
    ...
}
```

격리 수준 옵션은 총 5가지 제공하고 있다.

>1. `DEFAULT` : DB 기본 값 사용
>2. `READ_UNCOMMITED` : 가장 낮은 수준, 커밋 여부와 상관 없이 변경된 데이터 조회 가능 
>3. `READ_COMMITED` : 커밋된 데이터만 조회 가능
>4. `REPEATABLE_READ` : 트랜잭션 내에서 같은 데이터 조회 시 항상 같은 결과 보장
>5. `SERIALIZABLE` : 가장 강력한 수준, 트랜잭션의 순차적 진행으로 여러 트랜잭션이 동시에 같은 DB에 접근 불가


<br/><br/>

### 전파 속성(Propagation)
트랜잭션에 대한 **중복된 호출**이 있을 때, <u>기존 트랜잭션과 추가 트랜잭션을 어떻게 할 지 등을 결정</u>하는 옵션이다.

`propagation` 을 통해 설정할 수 있으며 예시는 아래와 같다.

```java
@Service
public class InnerService {
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void inner() {
        ...
    }
}
```

전파 속성은 아래와 같이 제공되고 있다.

> 1. `REQUIRED`
> 2. `REQUIRES_NEW`
> 3. `SUPPORTS`
> 4. `NOT_SUPPORTED`
> 5. `MANDATORY`
> 6. `NEVER`
> 7. `NESTED`
>

<br/>

#### REQUIRED
`propagation` 의 기본 값이고 가장 많이 사용되는 속성이다. 

**트랜잭션이 이미 있는 경우, 해당 트랜잭션에 참여하고 트랜잭션이 없다면 새로 생성**한다.
대부분의 일반적인 로직에 사용된다.

<br/>

#### REQUIRES_NEW
**무조건 새 트랜잭션을 시작**한다. 트랜잭션이 시작할 때 <u>기존 트랜잭션은 일시 중단</u> 시킨다.

<br/>

#### SUPPORTS
**트랜잭션이 있으면 참여하고, 없으면 트랜잭션 없이 실행**한다.
트랜잭션이 없어도 해당 스레드의 Connection과 Session 등은 공유할 수 있다.

<br/>

#### NOT_SUPPORTED
**트랜잭션이 있으면 중단시키고, 트랜잭션 없이 실행**한다. 

<br/>

#### MANDATORY
**반드시 트랜잭션이 있어야하고** 있다면 해당 트랜잭션에 참여한다. <u>없다면 IllegalTransactionStateExceptioin 예외</u>가 발생한다.


<br/>

#### NEVER
**트랜잭션을 허용하지 않는다**(기존 트랜잭션 포함). <u>트랜잭션이 있다면 IllegalTransactionStateExceptioin 예외가 발생</u>한다.

<br/>

#### NESTED
이미 진행 중인 트랜잭션이 있다면, **기존 트랜잭션 내에 중첩(자식) 트랜잭션을 생성**한다.

트랜잭션 내부에 트랜잭션을 만드는 것으로, <u>자식 트랜잭션은 부모 트랜잭션의 커밋/롤백의 영향을 받지만 자식 트랜잭션의 커밋/롤백은 부모 트랜잭션에 영향을 주지 않는다</u>.

JDBC나 DataSourceTransactionManager를 이용할 경우 등에만 적용이 가능하다. 즉, 모든 트랜잭션 매니저에서 지원하는 것이 아니므로, 확인 후 사용이 필요하다.

<br/><br/>

### 읽기 전용(readOnly)
트랜잭션 내부에서 ==데이터 변경(INSERT, UPDATE, DELETE)을 하지 않을 것을 명시==하는 속성이다.

```java
@Transactional(readOnly = true)
```

일반적으로는 데이터 변경 작업이 진행되면 예외 처리를 하지만, **실제 DB에서 완전이 write를 막는 것은 아니다**(JPA/Hibernate가 쓰기를 수행하면 에러 없이 실행될 수 있다).

따라서 실제 쓰기 예외처리보다, 개발자의 실수 방지를 위한 힌트 수준으로 이해해야한다.


+ 추가 : mysql 힌트로 적용이 돼서 DB 내부에서 최적화가 적용될 수 있다.

<br/><br/>

### 타임아웃(Timeout)
트랜잭션 ==작동 시간을 제한==하고, 지정한 시간을 넘기면 예외를 발생시켜 롤백 시킨다.

```java
@Transactional(timeout = 5) // 초 단위
```

별도로 값을 지정하지 않는다면, 트랜잭션 시스템의 제한시간을 따른다. 만약 이 기능을 지원하지 않는 트랜잭션 매니저를 사용할 경우 예외가 발생할 수 있다.

<br/><br/>

### 커밋/롤백(Commit/Rollback) 제어
Spring은 기본적으로 RuntimeException 또는 Error가 발생하면 롤백, Checked Exception이 발생하면 커밋시킨다. 

>[!faq] Checked Exception?
>**Checked Exception은 RuntimeException을 상속하지 않는 예외 클래스**로, 명시적인 예외 처리를 강제한다.
><u>예외 처리를 위해선 반드시 try~catch나 throw가 필요</u>하다.
>대표적으로 IOException, SQLException 등이 있다.

커밋/롤백 제어는 지정한 예외가 발생했을 때 커밋/롤백을 할 지 지정해주는 기능이다. 
`rollbackFor`로 지정한 예외는 롤백 처리되고, `noRollbackFor`로 지정된 예외는 커밋 처리된다.

```java
@Transactional(rollbackFor = IOException.class)
public void doSomething() throws IOException {
    // 이제 IOException(Checked Exception) 발생 시에도 롤백됨
}

@Transactional(noRollbackFor = CustomRuntimeException.class)
public void handleGracefully() {
    // 이 예외는 RuntimeException을 상속 받지만, 발생 시에도 커밋됨
}
```


<br/><br/><br/>

## 사용 시 주의사항
### inner 매서드 호출은 적용 안됨
아래 코드에서 확인할 수 있듯이 ==inner 매서드는 트랜잭션 적용이 안된다==. inner 매서드를 다른 클래스로 분리하거나 ApplicationContext를 통한 주입이 필요하다.

```java
@Service
public class OrderService {

    // 트랜잭션이 없는 상위 매서드
    public void outerMethod() {
        innerMethod(); // ❌ 트랜잭션 적용 안 됨
    }

    @Transactional
    public void innerMethod() {
        // ...
    }
}
```

<br/>

만약 아래 코드와 같이 상위 매서드에 트랜잭션이 적용되어 있는 경우, 하위 매서드의 트랜잭션이 별도로 생성되지 않는다. 대신 상위 매서드 트랜잭션에 포함되어 들어간다.

```java
@Service
public class OrderService {

    @Transactional
    public void outerMethod() {
        innerMethod(); // ❌ 트랜잭션 적용 안 됨, 상위 매서드 트랜잭션에 포함
    }

    @Transactional
    public void innerMethod() {
        // ...
    }
}
```


<br/><br/>

### 프록시 기반이기 때문에 public 매서드에만 적용
Spring AOP 프록시 기반이라 ==private과 같이 인터페이스를 가저오거나 상속할 수 없는 매서드==의 경우 트랜잭션을 적용할 수 없다. 

따라서 트랜잭션을 적용할 매서드는 **반드시 public으로 설정**해두어야 한다.

<br/><br/>

### 예외가 발생해도 롤백되지 않은 경우가 있음
@Transactional 옵션에 커밋/롤백 제어에서 Spring이 ==Checked Exception이 발생하면 롤백 처리를 하지 않는다==는 것을 확인했다. 따라서 이 같은 경우를 방지하기 위해 별도 커밋/롤백 제어 설정이 필요하다.



----
## 출처(참고문헌)
- [Spring] Spring 트랜잭션의 세부 설정(전파 속성, 격리수준, 읽기전용, 롤백/커밋 예외 등) - (2/3). *MangKyu's Diary:티스토리*. (2021년 7월 9일). https://mangkyu.tistory.com/169
- Transaction_2(트랜잭션 추상화 및 동기화, 트랜잭션 AOP, 예외와 커밋 또는 롤백). *뇌 채우기 운동:티스토리*. (2023년 2월 28일). https://maeng0830-note.tistory.com/13
- [Spring] 📚 @Transactional 이해하기. *Better.log:Velog*. (2022년 8월 7일). https://velog.io/@betterfuture4/Spring-Transactional-총정리


