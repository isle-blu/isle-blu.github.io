---
tags:
  - Spring
  - BackEnd
  - JAVA
  - Transaction
  - AOP
publish: true
---
----
이번 포스팅에서는 Spring의 스프링이 제공하는 트랜잭션 기술에 대해 알아보고자 한다. 그래서 트랜잭션(Transaction)에 대한 이해가 먼저 필요하다.


>[!faq] 트랜잭션(Transaction)?
>- ==한 번의 수행되어야 할 연산의 모음==으로, 데이터베이스와 애플리케이션의 ==데이터 거래 시 안정성을 보호하기== 위한 방법이다. 
>- 더 자세한 내용은 아래 링크된 포스트에 정리해두었다.
>< [[Database/트랜잭션(Transaction) 1편 - 트랜잭션이란]] >

위에 설명과 같이 데이터의 안정성을 위해 데이터베이스와 통신할 때 트랜잭션을 사용하게 된다. Spring에서는 어떤 트랜잭션 방식을 제공하고 사용할 수 있는지 차근차근 적어보고자 한다.


<br/><br/>

## 스프링이 제공하는 트랜잭션 기술
스프링은 제공하는 트랜잭션 기술은 크게 3가지로 분류할 수 있다.

> 1. 트랜잭션 추상화
> 2. 트랜잭션 동기화
> 3. 선언적 트랜잭션



<br/><br/><br/>

## 트랜잭션 추상화
> 스프링은 트랜잭션 처리를 위한 **공통 인터페이스**를 제공한다. 

- <u>데이터 접근 기술(JDBC, JPA, MyBatis 등)에 관계 없이 일관된</u> 방식으로 트랜잭션을 제어할 수 있게, 트랜잭션 기술들을 하나의 ==공통 인터페이스로 추상화==해 제공하는 것이다.

<br/><br/>

### PlatformTransactionManager
**PlatformTransactionManager**는 위에서 말한 트랜잭션 추상화를 위한 공통 인터페이스에 해당한다. 아래 코드를 확인해 보면 **PlatformTransactionManager**를 이용해 커밋과 롤백을 실행하는 것을 확인할 수 있다.

<br/>

#### 예시

```java
private final PlatformTransactionManager txManager;

public void createUser(User user) {
    TransactionStatus status = txManager.getTransaction(new DefaultTransactionDefinition());
    
    try {
        userRepository.save(user);
        txManager.commit(status);
    } catch (Exception e) {
        txManager.rollback(status);
        throw e;
    }
}
```

<br/>

하지만 비즈니스 로직과 트랜잭션 로직이 같이 섞여있는 것을 알 수 있다. 이렇게 되면 <u>코드의 가독성을 떨어뜨리고</u>, 로직마다 트랜잭션 코드를 삽입하는 등 <u>중복 코드가 발생할 가능성</u>이 있다. 


<br/><br/><br/>

## 트랜잭션 동기화
> 트랜잭션 동기화는 **트랜잭션과 리소스를 하나의 스레드에 묶어서 관리하는 기술**이다.

위 정의만 보면 무슨 말인지 어려울 수 있다. 쉽게 설명하면, 우리가 하나의 트랜잭션 작업을 처리하고자 할때 하나의 세션이 필요하고 그것을 연결해줄 하나의 커넥션이 필요하다.

하지만 개발을 할 때 하나의 트랜잭션에 하나의 쿼리만 담는 경우는 거의 없을 것이다. 보통 하나의 트랜잭션에 여러 개의 쿼리를 을 담을텐데, 하나의 커넥션 객체를, 이곳 저곳에 갖다 쓰기 굉장히 불편하고, 제대로 설계하지 않는 경우 쿼리마다 다른 커넥션 객체에 연결되는 등 트랜잭션의 불일치 상황이 나올 수 있다.

이를 방지하기 위해 **하나의 스레드**에 <u>트랜잭션과 그 안에서 사용할 리소스(JDBC Connection,  JPA EntityManager 등)을 묶어서 관리</u>하는 것이다. 이를 통해 커넥션을 하나의 스레드에서 공유할 수 있게되어 리소스를 효율적으로 관리하고, 필요할 때 커넥션을 가져와 재사용할 수 있다.


<br/><br/><br/>

## 선언적 트랜잭션(Declarative Transaction Management)
>  **AOP(관점 지향 프로그래밍)** 을 이용한 방식으로, ==XML과 같은 설정 파일이나 어노테이션으로 선언만해도 스프링이 알아서 트랜잭션을 처리해주는 방식==이다.

<br/>

>[!faq] AOP?
>- 공통 로직과 핵심 로직(비즈니스 로직)을 분리하여 모듈화 하는 프로그래밍 패러다임
> - 트랜잭션도 일종의 공통 로직에 해당하여 <u>AOP를 적용해 트랜잭션을 비즈니스 로직 밖에서 처리할 수 있다.</u>
> - AOP에 대한 자세한 내용은 아래 링크를 참고하자.
> - < [[AOP란]] >


<br/><br/>

### XML 기반 설정
>트랜잭션을 JAVA 코드가 아닌 **XML 설정 파일에서 선언해서 처리**하는 방식이다. 

트랜잭션이 필요한 매서드를 XML 설정 파일에 명시하고, AOP를 통해 스프링이 자동으로 트랜잭션을 진행해준다.

<br/>

#### 예시
 

```xml
<!-- 트랜잭션 매니저 등록 -->
<bean id="transactionManager"
      class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="dataSource" />
</bean>

<!-- 트랜잭션 advice 정의 -->
<tx:advice id="txAdvice" transaction-manager="transactionManager">
    <tx:attributes>
        <tx:method name="get*" read-only="true" />
        <tx:method name="*" rollback-for="java.lang.Exception" />
    </tx:attributes>
</tx:advice>

<!-- AOP로 트랜잭션 advice를 특정 패키지에 적용 -->
<aop:config>
    <aop:pointcut id="serviceMethods"
        expression="execution(* com.example.service.*.*(..))" />
    <aop:advisor advice-ref="txAdvice" pointcut-ref="serviceMethods" />
</aop:config>
```


<br/>

#### 특징
- 장점 : 
	- 코드에 트랜잭션 관련 내용이 없어 <u>완전한 관심사 분리</u>가 이뤄질 수 있다.
	- XML로 일괄 적용이 가능하다.
- 단점 : 
	- 매서드 명이 바뀌면 <u>설정도 수정 필요</u>하다.
	- 설정이 복잡하고 어렵다.


<br/><br/>

### @Tranactional
>트랜잭션이 요구되는 **매서드나 클래스 위에 @Transactional을 작성**하여, 해당 매서드의 트랜잭션을 스프링이 자동으로 관리하게 해주는 방식이다.

XML 기반 설정을 대체하며 등장했으며, <u>현재 가장 대중적으로 사용되는 방식</u>이다. XML 기반 트랜잭션에 비해 가독성과 유지보수 측면에서 훨씬 간편하기 때문에 거의 대체되었다.

매서드와 클래스에 적용할 수 있는데, 만약 둘 다 적용되어 있을 경우 매서드에 있는 **@Transactional** 규칙이 더 우선된다.

<br/>

#### 예시

```java
@Service
public class UserService {
    @Transactional
    public void createUser(User user) {
        userRepository.save(user);
        // 예외 발생 시 롤백됨
    }
}
```


<br/>


#### 특징
1. commit, roll back과 같은 코드를 작성할 필요가 없고, 개발자는 트랜잭션 선언만 해주면 별도의 관리가 필요하지 않다.
2. AOP 모듈화 : 비즈니스 로직과 트랜잭션 처리 로직이 완전히 분리된다.

<br/>


> @Transactional에 대한 더 구체적인 내용은 너무 길어질 거 같아 따로 작성하려고 한다.


<br/><br/><br/>

## 마치며
스프링이 마냥 어렵다고 생각했었는데, 이 글을 작성하면서 스프링이 없었다면 훨씬 더 고생했겠다는 생각을 했다.~~(생각보다 스프링은 혁신이었어!)~~ 다음 글에서는 @Transactional에 대해 좀 더 자세히 다룰 것이다.

다음 포스팅
< [[@Transactional]] >

<br/>

----
## 출처(참고문헌)
- [Spring] 트랜잭션에 대한 이해와 Spring이 제공하는 Transaction(트랜잭션) 핵심 기술 - (1/3). *MangKyu's Diary:티스토리* . (2021년 5월 18일) . https://mangkyu.tistory.com/154
- Transaction_2(트랜잭션 추상화 및 동기화, 트랜잭션 AOP, 예외와 커밋 또는 롤백). *뇌 채우기 운동:티스토리*. (2023년 2월 28일). https://maeng0830-note.tistory.com/13
- [Spring] 📚 @Transactional 이해하기. *Better.log:Velog*. (2022년 8월 7일). https://velog.io/@betterfuture4/Spring-Transactional-총정리


