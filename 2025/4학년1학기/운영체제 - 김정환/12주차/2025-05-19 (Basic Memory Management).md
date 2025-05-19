# Scheduling in Real-Time Systems
- 처리시간 / 주기
![[스케줄링.png]]

- 연습문제 과제(11주차-1) -> 손으로 간트차트로 풀기 (시험에 나올 빈도)

---
# Basic Memory Management 
#### Memory
![[Memory.png]]
- DRAM(메인메모리) vs SRAM(캐시메모리)
## 스와핑/페이징 없는 모노프로그래밍 
![[모노프로그래밍.png]]

## 재배치 문제 
![[재배치.png]]
- ADD -> 추가 / MOV -> 이동
- CMP -> Compare 
- 그림 (a) + (b) => 그림(c) 16384번지에 Jump명령어가 (b)와 같이 동작 하나? 
  - 원래대로 동작하기 위해서는 프로그램(JUMP)에 주소값을 수정해야 한다.

## 다중프로그래밍(고정분할) : Absolute Loading
![[Absolute Loading.png]]
- 장점 : 프로그램을 적재하면서 프로그램에 내부값을 변경해줄 필요가 없다.
- 단점 : Fragmentation -> 단편한/조각문제가 발생한다. 

## 다중프로그래밍(고정분할) : Relocatable Loading
![[Relocatable Loading.png]]
- 장점 : 비어있는 공간은 어디든 파티션에 들어갈 수 있음
- 단정 : Fragmentation 발생 / 메모리 재배치 필요 

## 재배치와 보호
- 재배치(Relocation) -> 프로그램을 적재할떄 발생
  - 프로그램 코드와 데이터를 위한 적재 주소를 할당하고, 코드 및 데이터를 할당된 주소에 적합하게 조정
- 정적 재배치
  - 프그램을 적재할 때 참조하는 주소를 직접 수정
  - IBM 360 
-  동적 재배치 및 보호(protection) 매커니즘
  - base와 limit 레지스터 사용
  - 동적 재배치 : 실제 주소는 base 레지스터 값을 더한 주소 _  address = base register + offset_
  - 보호 매커니즘 : limit 레지스터 값을 벗어나면 예외처리 _ if address >= limit register, then fault
  - CDC6600, 인텔8088

#### Base and Limit Registers  
![[Base and Limit Registers.png]]

---
## Address Binding
Address Binding 
- 논리적 주소와 물리적 주소 간의 매핑
![[Address Binding.png]]
![[Address Binding1.png]]

--- 
# Swapping
>너무 많은 프로세스가 있을 경우 
- 메모리 충분히 않게 됨 -> Thrashing (CPU 이용률이 극도로 저하됨)
- 프로세스의 일부 또는 전체 이미지를 디스크로 옮겨 메모리 공간을 확보할 필요성
> Swapping
- 한 프로세스의 전체 이미지가 메모리에 적대되어 실행. 더이상 실행되지 않거나 수면에 빠지는 경우 전체 이미지를 디스크로 스와핑.
> Virtual memory
- 한 프로세스의 전체 이미지가 아닌 일부만 메모리에 있어도 프로세스의 실행이 가능

![[Swapping.png]]
- 조각모음 => 메모리를 할당할때 빈공간을 찾는 것 
- Memory Compaction -> 조각 모음을 할때 시간이 오래 걸릴 수 있다. 
- Coalescing -> 조각 모음을 할때 시간이 적게 걸린다. 

![[Swapping1.png]]
