## Mapping
가상주소는 다음과 같이 구성
- 페어지 넘버
- 오프셋(페이지 내에서 상대적 위치)
![[스크린샷 2025-05-26 15.08.31.png]]

## 예제 
![[Pasted image 20250526151014.png]]
![[Pasted image 20250526151018.png]]

---
## 직접 사상(Direct Mapping)
![[스크린샷 2025-05-26 15.11.23.png]]

- p' -> 1일때만 해당함
![[스크린샷 2025-05-26 15.28.22.png]]

---
## 페이징
- 페이징 기법의 두 가지 이슈:
  - 페이지 테이블이 매우 거대해질 수 있다.
  - 매핑 과정이 빠르게 처리되어야 한다.

누가 가상 주소를 물리 주소로 변환?
- Hardware orsoftware(OS)
"페이지 테이블"은 누가 관리
- Hardware software(OS) 
"페이지 테이블"은 어디에 위치?
- CPU? main memory? disk?


![[Pasted image 20250526154014.png]]
![[Pasted image 20250526154018.png]]
- 전체 가상주소를 사용하는것이 아닌 프로그램은 일부분만 가상주소를 사용

---
## 페이지 테이블 엔트리 구조
![[페이지 테이블 엔트리 구조.png]]
읽기/쓰기를 한다 -> Protection 1
수정될일이 있다 -> Modified 1 
참조될일이 있다 -> Referenced 1
캐쉬를 허락 -> Caching disabled 1
(이 페이지에 캐쉬가 CPU에 올리지 못하게 막음) 

## 페이지 부재
![[페이지 부재.png]]
![[페이지 부재1.png]]
- Page Fault는 시간이 많이 소요되는 작업이다. 그렇기에 발생하지 않도록 시스템을 컨트롤 해야한다. (교체전략 - 가상메모리를 실제 메모리에 적재할때 비어있지 않은 메모리 공간을 내보내야 하는데 내보내는 순서에 따라서 Page Falut에 빈도수가 크게 달라질 수 있다.)

---

## 연관사상(Associative Mapping)
![[연관사상.png]]

## TLBs - Translation Lookaside Buffers
![[TLBs.png]]
- TLB는 -> CPU_MMU장치에 우치
 
![[Mapping with TLB.png]]
- TBL miss -> 직접사상으로 감 / miss 난 정보를 반영해줌

Where is TLB? 

who uses TLB ?
ref -> Hardware 한다.
Updata TLB entries -> OS가한다.