[gitflow](https://tech.mfort.co.kr/blog/2022-08-05-trunk-based-development/)


`0000 0000 0100`₂
`0110 0000 0000 0100`


**문제 및 이미지에 표시된 답 (제 판단 기준 포함):**
```
F. F  F. F
T. F. F. F
F. F. F. F
T. T. T. T

F. T. F. F -1
F. F. F. T
T. F. F. F
T. T. F. F -1

T. F. T. T -1
T. T. T. T

5   3
```



https://ghchart.rshah.org/219138/BcKmini

---

사전처리 vs 사후처리

특징 추출_1 -> 신체 부위의 미리 정의된 키포인트 그룹으로 동물 자세 추정
특징 추출_2 -> 원시 이미지를 직접 변환,


CNN 채택, 비지도 방식

최첨단 자기 지도 딥러닝 방법은 동일한 이미지의 다른 증강 및/또는 다른 이미지를 비교하여 다운스트림 작업에 대한 대표적인 특징을 추출하는 것을 목표로 합니다. 이전 기술과 비교하여 이러한 방법은 세 가지 주요 이점을 가집니다. 첫째, 자기 지도 또는 비지도 방법은 인간의 편향을 완전히 피할 수 있습니다. 둘째, 양성 샘플을 생성하는 데 사용되는 증강은 객체 크기, 공간 방향 및 주변 조명에 대한 신경망의 불변성을 보장하므로 등록 또는 기타 전처리가 필요하지 않습니다. 마지막으로, 네트워크는 양성 샘플에 대해 유사한 결과를 내보내고 음성 샘플을 분리하도록 최적화되어 추출된 특징이 본질적으로 차별적입니다.


주석, 



---


<https://github.com/carlwharris/DeepAction주요> 목표: 비디오 내 동물 행동을 자동으로 주석 처리하는 딥러닝 기반 MATLAB 툴박스인 DeepAction을 소개.

핵심 방법론:

투 스트림 모델: 공간 정보(raw video frames)와 시간 정보(dense optical flow를 사용한 픽셀 움직임)를 각각 추출.

특징 추출: ResNet18 사전 훈련된 CNN을 사용하여 공간 및 시간 프레임에서 주요 시각적 특징을 추출.

차원 축소: 추출된 공간 및 시간 특징을 연결한 후 재구성 독립 성분 분석(ICA)을 통해 차원을 512로 줄임.

RNN 분류기 (LSTM with BiLSTM layers): Long Short-Term Memory (LSTM) 네트워크에 양방향(Bidirectional) LSTM 레이어를 사용하여 행동을 예측.

클립 기반 주석: 전체 비디오 대신 짧은 "클립" 단위로 주석을 지정하여 분류기의 일반화 능력을 향상.

신뢰도 점수 시스템: 분류기 예측에 대한 신뢰도 점수를 제공하여, 사용자가 낮은 신뢰도 주석을 우선적으로 검토하고 수정할 수 있도록 함.

활용 분야: 마우스(home-cage, CRIM13 데이터셋) 및 문어 행동 분류.

장점:

높은 정확도를 달성하며, 인간의 동의 수준을 능가하거나 유사한 성능을 보임.

적은 양의 훈련 데이터만으로도 높은 정확도를 달성.

수동 주석 시간을 획기적으로 줄일 수 있음 (home-cage 데이터셋에서 82%, CRIM13 데이터셋에서 75% 시간 절약).

다중 카메라 정보(예: 측면 및 상단 뷰)를 효과적으로 통합.

MATLAB 툴박스 및 GUI(Graphical User Interface)를 통해 사용 편의성을 제공.

한계:

매우 드물게 발생하는 행동에 대해서는 성능이 떨어짐.

현재 분류 모델은 행동이 상호 배타적이라고 가정.

문어 데이터셋에서의 성능은 설치류 데이터셋보다 낮았음.

데이터셋 활용: Home-cage 데이터셋 (Jhuang et al.), CRIM13 데이터셋 (Burgos-Artizzu et al.), 미공개 문어 행동 데이터셋을 사용.

코드 : 
오픈 소스 MATLAB 툴박스 및 GitHub 저장소에서 코드와 주석 GUI를 제공.



https://github.com/carlwharris/DeepAction
https://github.com/jbohnslav/deepethogram

https://github.com/DeepLabCut/DeepLabCut



### Chat Completions API 요청 소개

Chat Completions API는 ChatGPT UI와 유사하게 '입력 텍스트를 제공해 응답 텍스트를 얻는 방식'으로 사용됩니다.
