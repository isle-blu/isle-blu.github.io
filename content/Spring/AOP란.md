---
tags:
  - Spring
  - BackEnd
  - JAVA
  - AOP
publish: true
---
----
## AOP(Aspect Oriented Programming)
> AOP(관점 지향 프로그래밍)은 ==핵심적인 비즈니스 로직과 부가적인 기능을 분리==하여 모듈화 하는 프로그래밍 패러다임이다.

AOP는 OOP(객체 지향 프로그래밍)과 대조된 것이 아닌, 한계를 보완하는 기술입니다.  AOP의 가장 큰 특징은 기능의 분리에 있다. 기능은 아래 두가지로 분리된다.
- 비즈니스 로직과 같은 ==핵심 기능==
- 핵심 기능을 보조하거나 인프라 로직과 같은 ==부가 기능(공통 관심 사항)==

우리가 코드를 짤 때 핵심 비즈니스 로직 이외에, 각 기능 수행마다 성능검사, 로깅, 권한 체크 등 공통적으로 사용하는 기능들이 있다. 이 기능을 이를 그림으로 봤을 때 횡단으로 공통된 게 있다고 해서 ==횡단 관심사(Cross-cutting concerns)== 라고 한다.

이 횡단 관심사가 부가 기능에 해당하며 AOP에서는 이 기능들을 ==Aspect==라고 정의한다. AOP는 Aspect를 따로 분리하고 한 곳에서 관리함으로써 유지 관리 측면에서 이점을 가져다 준다.


<br/><br/><br/>

## AOP 주요 용어
### Aspect
여러 객체에 공통으로 적용되는 공통 관심 사항을 말한다.

<br/>

### Target 
부가 기능을 부여할 대상을 말한다.

<br/>

### Advice 
부가 기능을 담은 구현체로 point cut에 정의된 지정된 join point에서 실행되는 작업을 말한다.

<br/>

### Join Point 
advice가 적용될 수 있는 위치 / 메서드, 필드, 객체, 생성자 등을 말한다.
==스프링은 메서드만== join point를 제공한다.

<br/>

### PointCut 
실제 advice가 적용될 지점을 말하며, advice를 적용할 join point를 선별한다.

<br/>

### Weaving 
지정된 객체에 advice를 삽입하는 과정을 말한다. 핵심 로직에 영향을 주지 않으면서 advice를 추가할 수 있도록 하는 핵심적인 과정이며, ==Spring AOP는 런타임 시에 프록시 객체를 생성==한다.


<br/><br/><br/>

## Weaving의 종류
Weaving(AOP가 적용되는 과정)은 수행되는 시점에 따라 구분된다.

<br/>

### Compile-time weaving(CTW)
특수한 컴파일러를 사용하여 Target 객체의 ==컴파일 시점==에 위빙된다. AspectJ는 Aspect Weaving Compiler라는 컴파일러를 사용한다.

<br/>

### Load-time Weaving(LTW)
Target 객체가 ==JVM에 로드할 때== 위빙된다. 

<br/>

### Post-compile Weaving(PCW)
binary weaving이라고도 하며 이미 컴파일된 class 파일을 바이트 코드 조작을 통해 위빙하는 방식이다.

<br/>

### Runtime Weaving(RTW)
애플리케이션 실행 중 위빙하는 방식으로, 프록시 패턴을 활용한다. Spring AOP는 Target 객체의 호출 시점에 IoC 컨테이너가 동적으로 AOP를 할 수 있는 프록시 Bean을 생성한다. 



<br/><br/><br/>

## AOP 구현
스프링에서 AOP를 구현할 때 대부분 AspectJ와 Spring AOP 이 두가지 도구를 사용한다.

<br/>

### AspectJ
AspectJ는 자바에서 제공하는 AOP 기술이다. AspectJ는 코드기반 스타일과 어노테이션 기반으로 AOP 구현이 가능하다.

- 컴파일 시점이나 JVM 클래스 로드시점에 조작한다.
- ==런타임 시점에는 영향을 끼치지 않는다.== 즉, 컴파일이 완료된 후에는 어플리케이션 성능에 영향이 없다.

<br/>

### Spring AOP
- JDK Dynamic Proxy 또는 CGLIB 등을 활용하여 동적으로 프록시를 생성한다.
- ==런타임 시점에 프록시를 생성== 하기 때문에 성능에 영향을 준다.

<br/>

### AspectJ와 Spring AOP의 차이점
|        AspectJ        |              SpringAOP              |
| :-------------------: | :---------------------------------: |
| 자바코드에서 동작하는 모든 객체에 적용 | Spring Container가 관리하는 Bean 객체에만 적용 |
|     CTW, LTW, PCW     |                 RTW                 |


<br/>

----
## 출처(참고문헌)
- 자바 AOP의 모든 것(Spring AOP & AspectJ). *JiwonDev:티스토리*. (2022년 3월 9일). https://jiwondev.tistory.com/152
- [Spring] 스프링 AOP (Spring AOP) 총정리 : 개념, 프록시 기반 AOP, @AOP. *새로비:티스토리*. (2022년 1월 9일) . https://engkimbs.tistory.com/entry/스프링AOP
- [Spring] AOP(Aspect Oriented Programming)란?. *슬기로운 개발생활:티스토리*. (2021년 7월 14일). https://dev-coco.tistory.com/81
- AOP의 기본 개념과 Spring에서의 적용 방법. *차근차근:Velog*. (2023년 7월 2일). https://velog.io/@youjung/Spring-AOP


