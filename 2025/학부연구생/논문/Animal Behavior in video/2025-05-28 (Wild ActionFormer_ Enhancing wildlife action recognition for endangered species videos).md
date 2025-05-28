## Intreduction
- 생물 다양성 하락 (개체수 크게 감소)
- 이유 : 서식지파괴, 기후 변화, 밀렵, 인간활동  등
CBD, CITES -> 생물종을 보호
각 정부는 자연보호구격, 생태 통로, 번식 프로그램 마련 -> 지키는 것이 중요화 됨
동물의 행동을 모니터링하는것이 어려움(카메라 데이터를 물리적으로 회수, 영상을 수동으로 검토 해야했음)

딥러닝으로 동물을 식별
4개의 CNN 기반 행동 인식 네트워크를 테스트
Tripathi 등(2025)은 UAV를 장착한 YOLO를 사용하여 전 세계적으로 멸종 위기에 처한 77종의 늪사슴(Rucervus duvaucelii)을 실시간으로 탐지하고 개체 수를 세었다.

We trained our model on the LoTE-Animal dataset ([Liu et al., 2023a](https://www.sciencedirect.com/science/article/pii/S1574954125001578#b29)), which closely matches the Wolong Reserve’s ecological conditions.
![[Comparison of mainstream methods on the video LoTE-Animal dataset.png]]


## 2.  Preliminary work
### 2.1 Action recognition
CNN은 이미지에서 공간적 특징을 추출하는 데는 탁월하지만 비디오 시퀀스에서 시간적 의존성을 포착하는 데는 어려움을 겪는다.

CNNs excel at extracting spatial features from images but struggle to capture temporal dependencies in video sequences. ViT-based models – such as TimeSFormer ([Bertasius et al., 2021](https://www.sciencedirect.com/science/article/pii/S1574954125001578#b3)) and Video Swin Transformer ([Liu et al., 2022](https://www.sciencedirect.com/science/article/pii/S1574954125001578#b31)) – use self-attention mechanisms to capture long-range dependencies.

CNN은 공간적 특징 추출에 중점을 두는 반면, ViT는 시간적 종속성을 더 효과적으로 처리함
이 두 가지의 장점을 결합하기 위해 Li 등(2023)은 Uniformer를 제안
이 모델은 CNN 스타일의 계층 구조와 트랜스포머 스타일의 모듈을 통합하여 가장 성능이 우수한 백본 네트워크 중 하나이다.
하지만 Uniformer에는 한계가 있다. 사전 학습과 미세 조정을 위해 대규모 데이터 세트가 필요하다. 따라서 데이터가 제한된 작업에는 적용하기 어렵다.

### 2.2 Video self-supervised learning
2.2. 비디오 자기 지도 학습
자기 지도 학습은 레이블이 지정된 예제 없이 데이터로부터 학습
프록시 작업을 사용하여 의미 있는 특징을 추출합니다(Liu et al., 2021b). SimCLR(Chen et al., 2020) 및 MoCo(He et al., 2020)와 같은 방법은 라벨이 없는 데이터에서 학습하여 이미지 분류 및 객체 감지를 개선합니다. 
이들은 다양한 학습 전략을 비교하여 효율적인 특징 표현을 개발합니다. 음성 처리에서는 HuBERT(Hsu et al., 2021) 및 Wav2Vec 2.0(Baevski et al., 2020)과 같은 모델이 마스크된 오디오 클립을 예측합니다. 이는 자동 음성 인식을 향상시킵니다. 하지만 이러한 방법에는 대규모 데이터 세트와 높은 컴퓨팅 성능이 필요하기 때문에 애플리케이션 비용이 많이 듭니다. 자동 인코더는 일반적인 자기 지도 모델입니다. 인코더를 사용하여 데이터를 압축하고 디코더를 사용하여 데이터를 재구성합니다. 이 프로세스는 모델이 스스로 학습하고 이미지를 재구성하는 데 도움이 됩니다(Hinton and Salakhutdinov, 2006). 비디오의 경우, 유사한 기법을 통해 공간적 표현과 시간적 표현을 모두 캡처할 수 있습니다(Video MAE(Tong et al., 2022)). 재구성 정확도를 측정하기 위해 연구자들은 종종 평균제곱오차(MSE)를 사용합니다. 이는 원본 프레임과 재구성된 프레임 간의 평균 제곱 차이를 계산합니다. MSE 손실은 빠르게 수렴하지만 이상값에 민감하여 과적합을 유발할 수 있습니다(Sai et al., 2009). 정규화 기법은 과적합을 방지하는 데 도움이 됩니다. L1 또는 L2 페널티를 추가하면 모델 복잡성이 제한되고 일반화가 개선됩니다(Santos and Papa, 2022, Ng, 2004). 정규화 계수는 중요한 역할을 합니다. 정규화 계수는 재구성 손실과 페널티 조건의 균형을 맞춰 모델 성능을 향상시킵니다.
[프록시란](https://seunghyunson.tistory.com/22)
[MAE](https://white-joy.tistory.com/10)
[인코더/디코더](https://do-gang.tistory.com/entry/%EC%9D%B8%EC%BD%94%EB%8D%94-%EB%94%94%EC%BD%94%EB%8D%94Encoder-Decoder-%EA%B0%9C%EB%85%90)


### 2.3 Long-tail data
롱테일 데이터는 시각적 인식에서 클래스 불균형
두 가지 해결책 **리샘플링**과 **손실 가중치 재조정**
리샘플링은 훈련에서 다양한 클래스가 나타나는 빈도를 조정
이러한 방법들은 클래스 분포의 균형을 맞추기 위해 역가중치를 사용
그러나 희귀 클래스를 반복적으로 샘플링하면 제한된 예시에 과적합하여 모델 견고성이 떨어질 수 있음
손실 재가중은 다른 접근 방식을 취합니다. 손실 함수를 수정하여 희귀한 클래스에 더 높은 가중치를 부여하고 빈번한 클래스에 더 낮은 가중치를 부여합니다(Li et al., 2020, Tan et al., 2021). 표준 교차 엔트로피 손실(Bishop, 1995)은 불균형을 조정하지 못합니다. 클래스 가중치를 추가하면 드물게 발생하는 클래스의 오류에 더 큰 불이익을 줌으로써 이를 바로잡을 수 있다
다음 섹션에서는 이러한 기법을 기반으로 합니다. 특히 데이터가 적은 시나리오와 불균형한 데이터 세트에서 모델 한계를 해결하는 접근 방식을 소개한다.

[언더/오버 샘플링](https://hwi-doc.tistory.com/entry/%EC%96%B8%EB%8D%94-%EC%83%98%ED%94%8C%EB%A7%81Undersampling%EA%B3%BC-%EC%98%A4%EB%B2%84-%EC%83%98%ED%94%8C%EB%A7%81Oversampling)
[Loss Function Explained](https://wikidocs.net/235772)

## 3. Materials and methods
### 3.1. Materials (실험 위치 안내)
Wolong National Nature Reserve (hereafter the reserve) is located between 102°52′ to 103°24′ E and 30° 45′ to 31°25′ N. It covers 2,000 km
and has an elevation range of 1,150 to 6,250 meters (Liu et al., 2001).

### 3.1.1 Dataset construction
![[Dataset construction.png]]

### 3.1.2 Dataset content
