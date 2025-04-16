![[스크린샷 2025-04-14 15.07.13.png]]

DIspatcher thread -> 일을 하지 않는 Worker Thread에게 전달

운영체제는 프로세스에 스레드를 여러개여도 하나로 인식함

### Race Condition -> 경쟁상태
두 개 이상의 프로세스가 어떤 공유 데이터를 읽거나 쓰려고 할 때, 최종 결과는 누가 언제 수행되느냐에 따라 달라지는 상황(조건)

### context switching  문맥교환


### Mutual Exclision
Race condition을 피하기 위해서는,
둘 이상의 프로세스가 동시에 공유 데이터에 대해 작업해서는 안된다. (상호배제)

### Critical Section or critical region
공유 데이터를 접근하는 프로그램 코드 부분

---
##  Regions   
#### - Race condition을 회피하는 단순한 방법:

어떤 두 프로세스도 동시에 critical region에 있지 않도록 한다.

#### - 보다 좋은 해결책이 되기 위한 4가지 조건:

1.어떤 두 프로세스도 동시에 critical region에 있지 않아야 한다.
2.CPU 개수나 속도에 대해 어떤 가정도 하지 않는다.
3.Critical region 밖에서 실행 중인 어떤 프로세스도 다른 프로세스를 블록(차단)시켜서는 안된다.
4.Critical region에 들어가려는 어떤 프로세스도 무한히 기다려서는 안된다.


