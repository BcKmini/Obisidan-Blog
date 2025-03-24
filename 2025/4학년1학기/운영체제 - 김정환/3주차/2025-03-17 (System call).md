## Mulltiprogramming 기법
![[스크린샷 2025-03-24 09.57.24.png]]

---
## Simultaneous Multithreaing (SMT)
![[스크린샷 2025-03-24 09.55.57.png]]
- Hardware Multithreading 
 - –Ex. Intel Hyperthreading   
 - –1개의 CPU core에서 여러 개의  thread를 실행할 수 있음
 -  어떤 thread의 메모리 지연시간을  다른 thread의 CPU 실행으로  감추는 효과 
>  multiprogramming의 효과와  비교  
  >2개의 thread를 지원하는 CPU   core는 OS 입장에서 2개의 CPU로  보임
![[스크린샷 2025-03-24 09.57.03.png]]
> 코어가 2개이고, 각 코어가 2개의 스레드를  지원하면  OS는 4 CPU가 존재하는 것으로 인식

---
## 메모리 계층(Hierarchy)
![[스크린샷 2025-03-24 09.55.09.png]]
## Disk
![[스크린샷 2025-03-24 09.55.22.png]]
## 📌 Polling and Interrupt 
- Polling은 외부 장치의 상태 또는 이용 가능 여부를 확인하는 과정 
- 예 : 프린터가 전송된 문자를 읽었는지 확인, 도서관 자리 없어서 찾고 있는 나의 모습
- Interrupt - 
- 예 : 도서관에 자리가 비어있으면 나에게 알림을 전달하는 방법

	3번 interrupt signal 
	4번 interrupt vector '
	![[스크린샷 2025-03-24 09.53.18.png]]![[스크린샷 2025-03-24 09.53.29.png]]
	
## Interrput Vecor Table 
![[스크린샷 2025-03-24 09.53.55.png]]


## 🔥 더 알아보기
캐쉬 미스 - L1 - L2 - Memory --- 

Main Memory - Magenetc disk 사이에서 이용하는 메모리가 VM - 가상메모리

디코딩 간계에서(cache) 작기때문에 빠를 수 있다.

disk
- seek time _ rotation delay + transfer time -> 시간 비교

Controller -> 간단한 입출력 장치를 제어 