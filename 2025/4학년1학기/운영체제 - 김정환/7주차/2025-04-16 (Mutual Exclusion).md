## 시험일정 
4/21 월요일에 오면 분반으로 시험 예정

#### race-thread 실습
```c
#define ITER (50000000)
#include <pthread.h>
#include <stdio.h>
int gvar = 0;

  
void * X(void *i);
int main(void)
{
pthread_t t1;
pthread_attr_t attr;
void *status;
int j;

pthread_create(&t1, &attr, X, NULL);
// Main thread
/////////////////////////
for (j = 0; j < ITER; j++) {
gvar = gvar + 1;
}

/////////////////////////
pthread_join(t1, &status);
printf("%d\n", gvar);

}

void * X(void *i)
{
int j;
// Child thread
/////////////////////////
for (j = 0; j < ITER; j++) {
gvar = gvar + 1;
}
/////////////////////////
pthread_exit(NULL);
}
```

1. 초기값 ITER 은 (50000000)으로 정의했다.
2. pthead를 선언한다.
3. pthread_create(&t1, &attr, X, NULL); -> 자식 스레드를 만들어 같은 주소를 가지는 자식 스레드를 생성
4. 모든 스레드가 증가시킨 총 합은 약 3,000,000
5. 프로그램이 마지막으로 출력한 gvar 값과 일치하지 않는다.
6. race condition이 발생하기에 둘이 공유하는 gvar값에 관해 + 1 더함으로 인해 일치하지 않게된다.


---
- 상호 배제(Mutual Exclusion)
    
    - 여러 프로세스가 공유 자원을 동시에 사용하지 못하도록, 한 번에 하나의 프로세스만 임계영역(Critical Region)에 진입하게 만드는 기법
        
    - 동기화(synchronization)의 핵심 개념
        
- 부적절한 구현 예시
    
    - 인터럽트 금지 방식
        
        - 커널 수준에서는 어느 정도 유용하지만, 사용자 프로세스에서 인터럽트를 전역으로 금지하는 것은 비현실적
            
        - 멀티코어 시스템에서는 각 CPU마다 동작하므로, 커널에서조차 인터럽트 금지로는 동기화 보장이 어려움
		- 간단한 lock 변수 사용
```c
- while (lock != 0) ;  // unlock 될 때까지 대기
lock = 1;           // lock 설정
// 임계영역 진입
lock = 0;           // unlock
```
- - - 매우 단순한 구조이지만, 여러 프로세스가 동시에 lock을 확인할 경우 문제가 발생할 수 있음
            
### Mutual Exclusion 구현 방식
    
    1. 소프트웨어만을 이용한 구현
        
        - Dekker's solution
            
        - Peterson's solution
            
    2. 하드웨어 지원을 통한 구현
        
        - CPU에서 제공하는 Test-and-Set 같은 특수 명령어 사용
            
        - 하드웨어적으로 한 번에 lock을 설정하고 검사 가능
            
### 대기(Waiting) 방식
    
    1. Busy waiting (spin locking)
        
        - 임계영역에 진입 가능 여부를 반복해서 검사
            
        - CPU가 계속 루프를 돌며 확인하므로, 자원을 소모함
            
    2. Non-busy waiting (sleep & wakeup)
        
        - 진입 불가능하면 프로세스를 블록(blocked) 상태로 전환
            
        - CPU 사용을 양도하므로 상대적으로 효율적
            
### 순수 소프트웨어 접근 예: 엄격한 교대(Solution 1)
    
    - 두 프로세스가 번갈아 가며 임계영역에 진입하도록 하는 방식
        
    - Busy waiting 방식이며, 단순 루프 반복으로 CPU 시간을 소모
        
    - 문제점
        
        - 두 프로세스가 교대로만 진입하므로 유연성이 떨어짐
            
        - 어떤 프로세스는 임계영역에 진입할 필요가 없어도, 순서를 기다려야 하는 비효율 발생
    
![[스크린샷 2025-04-16 19.55.50.png]]

![[스크린샷 2025-04-16 19.53.36.png]]
![[스크린샷 2025-04-16 17.20.42.png]]
먼저 사용한 turn이 critical section에 먼저 진입한다.
