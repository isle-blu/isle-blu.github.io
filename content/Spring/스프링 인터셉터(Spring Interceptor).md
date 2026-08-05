---
tags:
  - Spring
  - Intercepter
  - Filter
  - BackEnd
publish: true
---
----
우리가 개발을 하다보면 비즈니스 로직이 아닌 로깅, 인증, 권한 체크 등 여러 공통 관심사를 처리해야하는 경우가 많다. 

이 공통 관심사를 처리해주는 기술로 Filter, AOP 그리고 오늘 다뤄볼 Spring Interceptor가 있다.
오늘은 이 **Interceptor에 대해서 알아보고 filter, AOP와의 차이점**에 대해서 적어보겠다.

<br/><br/><br/>


## Spring Interceptor?
intercept는 사전적 의미로 구기 종목에서 상대 팀의 패스를 ==가로채는 행위==를 뜻한다.
Spring Interceptor도 마찬가지로 **웹 애플리케이션에서 URI 호출을 가로채는 역할을 수행**한다.
정확한 <u>인터셉터 처리 시점은 Dispatcher Servlet 이후, 컨트롤러 호출 전/후</u>이다. 컨트롤러에 들어갈 요청을 가로채는 것이다.

인터셉터는 <u>Spring MVC가 제공하는 기술</u>로, HTTP 요청 시 공통 관심사(로그인 체크, 로깅, 권한 체크 등) 처리에 주로 사용된다. 

정리하면 아래와 같다.

>[!note] Spring Interceptor
>-  **HTTP 요청과 응답의 전 / 후 처리, 그리고 요청 완료 후 작업을 수행**할 수 있게 해주는 컴포넌트
>- Spring MVC가 제공

 

<br/><br/><br/>

## Interceptor 구현
인터셉터의 구현은 **`HandlerInterceptor`를 이용해 인터페이스로 구현**할 수 있다.  `HandlerInterceptor`의 내부 구조는 아래와 같다.

``` java
public interface HandlerInterceptor {

    boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception;

    void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception;

    void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception;
}
```

각 매서드는 언제 인터셉터를 호출할 시점을 지정한다.

- preHandle : 컨트롤러 ==실행 전==에 호출
- postHandle : 컨트롤러가 정상적으로 ==실행 된 후== 호출
- afterCompletion : ==요청 처리 완료 후== 호출

<br/>

동작 흐름을 그림으로 나타내면 아래와 같다.

![[interceptor.png]]

<br/>

위 인터페이스를 implements 해서 아래와 같이 인터셉터를 만들 수 있다.

```java
public class LoginCheckInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("loginUser") == null) {
            response.sendRedirect("/login");
            return false; // 컨트롤러 진입을 막음
        }
        return true; // 컨트롤러로 요청 진행
    }
}
```

<br/>

위처럼 구현이 끝났다면 인터셉터를 빈으로 등록해주어야 한다. 빈으로 등록하는 것은 `WebMvcConfigurer` 인터페이스를 구현한 설정 클래스가 필요하다.

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginCheckInterceptor())
                .addPathPatterns("/**")      // 인터셉터 적용 경로
                .excludePathPatterns("/login", "/logout", "/css/**"); // 제외 경로
    }
}
```

<br/>

위와 같은 방법으로 인터셉터 경로를 지정하고 빈으로 등록해 스프링 컨테이너가 관리하도록 하는 것이다. 

>[!faq] WebMvcConfigurer?
>- Spring MVC의 설정 정보를 Java코드 기반으로 덮어쓰거나 추가할 수 있도록 제공하는 인터페이스
>- addIntereptors(인터셉터 등록) 외에 addCorsMappings(CORS 설정), configureMessageConverters(HTTP 메시지 컨버터 설정)와 같은 다양한 매서드를 제공한다. 

`addInterceptors` 매서드는 인터셉터 등록을 위해 사용되는데, 아래와 같은 주요 구성 요소들이 있다.
- registry.addInterceptor() :  인터셉터 객체 등록, 여러 개도 등록 가능하다.
- addPathPatterns() : 인터셉터가 적용될 요청 경로 패턴 지정, 여러 패턴을 추가 가능하다.
- excludePathPatterns() :  인터셉터가 제외될 경로 지정


<br/><br/><br/>

## Interceptor vs Filter
먼저 Filter에 대해서 알아보자. 필터는 인터셉터처럼 요청/응답 시에 흐름을 가로채서 공통 로직을 처리하는 기능이다. 하지만 적용 시점, 대상, 사용 목적 등에서 차이가 있다.

우선 필터에 대해서 간략히 설명하면 아래와 같다.

>[!faq] Filter
>- **Dispatcher Servlet에 오는 요청을 가로채, 전/후 처리**를 해주는 컴포넌트
>- 스프링 컨테이너가 아닌 자바 서블릿에서 제공


<br/><br/>

### 적용 시점의 차이
위에서 볼 수 있듯이 첫 번째로 **적용 시점에 차이**가 있다. 인터셉터는 ==Dispatcher Servlet 이후 Controller로 가기 전 요청==을 가로챈다면, 필터는 ==Dispatcher Servlet 이전==, 클라이언트로부터 오는 요청을 가로챈다. 

흐름을 그림으로 나타내면 다음과 같다.

![[interceptor2.png]]

<br/><br/>

### 영역의 차이
두 번째로 속하는 **영역(Context)의 차이**가 있다. 인터셉터는 Dispatcher Servlet Controller로 오는 요청만 대상으로 하고 ==스프링 컨테이너가 관리==한다. 그래서 <u>인터셉터는 스프링이 관리하는 모든 객체에 접근이 가능</u>하다.

필터는 ==스프링 바깥에 웹 애플리케이션의 영역==에 있다. 따라서 정적 리소르를 포함한 모든 요청을 대상으로 한다. 하지만 <u>스프링 영역 바깥에 있기 때문에 스프링 내에 자원에 접근이 어렵다</u>.

이 블로그에서 https://gngsn.tistory.com/153 좀 더 자세한 그림과 함께 설명해주고 있다. 이 블로그의 그림과 함께 본다면 이해가 좀 더 쉬울 것이라고 생각한다.

<br/><br/>

### 용도의 차이
| Filter         | Interceptor |
| :------------- | ----------- |
| 인코딩 처리         | 로그인 인증/인가   |
| 보안 관련 공통 로직 처리 | 권한 검사       |
| 서블릿 로깅 등       | 사용자 정보 로깅 등 |

<br/><br/>

### 참고

>[!tip] VS AOP(Aspect-Oriented Programming)
>- AOP도 필터, 인터셉터와 같이 **공통 관심사 처리를 위해 존재**
>- 하지만 <u>프록시 기반으로 매서드 호출 전/후에 적용되고 트랜잭션 등에 사용된다는 차이</u>가 있음
>- AOP에 대한 자세한 사항은 해당 링크 참조 ( [[AOP란]] )


<br/>

----
## 출처(참고문헌)
- Spring Interceptor, 제대로 이해하기. *ENFJ.dev:티스토리*. (2022년 3월 15일). https://gngsn.tistory.com/153
- [Spring] 필터(Filter) vs 인터셉터(Interceptor) 차이 및 용도 - (1). *MangKyu's Diary:티스토리*. (2021년 7월 14일). https://mangkyu.tistory.com/173


