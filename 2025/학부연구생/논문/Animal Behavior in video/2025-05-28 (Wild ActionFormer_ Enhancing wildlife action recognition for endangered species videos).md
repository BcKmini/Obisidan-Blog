# Intreduction
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


# 2.  Preliminary work
## 2.1 Action recognition
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

---
# 3. Materials and methods
## 3.1. Materials (실험 위치 안내)
Wolong National Nature Reserve (hereafter the reserve) is located between 102°52′ to 103°24′ E and 30° 45′ to 31°25′ N. It covers 2,000 km
and has an elevation range of 1,150 to 6,250 meters (Liu et al., 2001).

### 3.1.1 Dataset construction
![[Dataset construction.png]]

### 3.1.2 Dataset content
- LoTE-Animal dataset use 
동물들의 활동 패턴은 계절/날씨/시각에 따라 달라진다.
이 데이터 세트는 세 가지 차원으로 동물 종을 분류
- 장면 차원 - 시간대(아침, 정오, 밤)
- 계절 변화(봄, 여름-가을, 겨울)
- 기상 조건(안개, 눈, 맑음, 비, 흐림, 흐림)이 포함
![[Dataset content.png]]

---
## 3.2 Methods
The network architecture in [Fig. 4](https://www.sciencedirect.com/science/article/pii/S1574954125001578#fig4) integrates a self-supervised learning adapter to improve wild animal action recognition (Section [3.2.1](https://www.sciencedirect.com/science/article/pii/S1574954125001578#sec3.2.1)). A loss function combines differential divergence regularization with MSE to enhance feature alignment and robustness (Section [3.2.2](https://www.sciencedirect.com/science/article/pii/S1574954125001578#sec3.2.2)). A loss re-weighting function reduces bias from the long-tailed data distribution (Section [3.2.3](https://www.sciencedirect.com/science/article/pii/S1574954125001578#sec3.2.3)).

The model has four main components: input, feature adapter, backbone, and output. The input consists of infrared trap camera videos. The output provides predicted animal actions. The Feature Adapter is designed for self-supervised spatio-temporal learning. It follows an encoder–decoder structure. During pre-training, the model learns behavior features from unlabeled video data by performing future frame prediction and occlusion recovery. Inception modules with multi-scale convolutions (1 × 1, 3 × 3, 5 × 5) refine features and capture temporal dependencies. The decoder uses deconvolution (unConv2d) to reconstruct occluded features and reduce information loss caused by occlusions and noise. The backbone UniFormerV2 combines CNNs and Transformers to model short- and long-term dependencies. The Local UniBlock captures short-term patterns, while Global Cross MHRA aggregates cross-frame information for long-range dependencies. A multi-stage fusion mechanism integrates local and global features. Detailed explanations of key components are provided in Supplementary Material, Appendix C.

![[Methods.png]]

### 3.2.1 시퀀스 특징 학습 (Sequence Feature Learning)
- **Self-supervised Feature Adapter**
    
    - 입력된 프레임 시퀀스에서 백본(Backbone)으로 전달할 특징 맵(feature map)을 적응(adapt)
    - 1×1 컨볼루션을 통해 채널 차원 축소 후 그룹 컨볼루션(group convolution)과 잔차 연결(residual connection)으로 공간·채널 정보를 보존·강화
    - 
- **Temporal Feature Learner**

- Inception 모듈(1×1, 3×3, 5×5 커널) 병렬 구성으로 시공간적 패턴을 멀티스케일로 포착
- 각 모듈:
    1. 채널 축소용 1×1 Conv →
    2. 멀티스케일 합산(Conv1×1 + Conv3×3 + Conv5×5) →
    3. 그룹 정규화(group normalization) →
    4. 출력 업데이트
- 단기·장기 의존성을 모두 학습하여 행동 전개를 효과적으로 모델링

### 3.2.2 미분 발산 정규화 (Differential Divergence Regularization)
- **목적**  
    예측된 시퀀스 특징과 실제(ground-truth) 특징 간 분포 차이를 최소화
- **핵심 과정**
    
    1. 연속 프레임 간 특징 차이 계산:  $$
	        Δt=F_{t+1}−F_t
	        $$
    2. Δt를 소프트맥스(softmax)로 확률 분포로 변환
    3. Kullback–Leibler 발산(KL divergence)으로 두 분포 간 거리를 측정
- **정규화 손실**$$
    L{div}=\sum _t D_{KL}(P_{true}(Δt) ∥ P_{pred}(Δt))
    $$순차적 특징 예측에 제약을 부여하는 규제항으로 작용

### 3.2.3 저가시성 샘플 학습 (Low-Visibility Sample Learning)
조명, 원거리, 부분 가림 등으로 가시성이 낮은 영상에서 모델 성능 저하
- **해결 전략**
    1. **클래스 불균형 완화**:$$
        w_c= \frac {1}{\log(\rho + N_c)}
        $$
    2. **포컬(focal) 요소 결합**: 애매(hard) 예시 학습 비중 증가
    3. **재조정된 교차 엔트로피**:$$
        L_{low} = -\sum_c w_c \,y_c\log\hat y $$
    가시성이 낮은 샘플에 학습 가중치를 부여해 전체 성능을 견인


![[Loss re-weighting.png]]

---
# 4. Results and discussion
## Results

| 항목                  | 세부 설정                                                              |
| ------------------- | ------------------------------------------------------------------ |
| **하드웨어**            | - 4× NVIDIA 2080Ti GPU (총 48 GB)                                   |
| **라이브러리**           | - MMAction2 기본 파라미터 사용 (MMLAB, 2020)                               |
| **배치 크기**           | - 훈련/검증/테스트 모두: 2                                                  |
| **옵티마이저**           | - AdamW • 초기 학습률: 명시 안 됨 • 베타: (0.9, 0.999) • 가중치 감쇠: 0.05         |
| **학습 에포크**          | - 최대 75 에포크                                                        |
| **학습률 스케줄**         | - 워밍업(1–5 에포크): 선형 성장 (0.1× → 1.0×)- 이후 에포크: 코사인 어닐링 (1.0× → 0.1×) |
| **손실 함수**           | - MSE 손실- 차등 발산 정규화 손실                                             |
| **그라데이션 클리핑**       | - 적용 (값 별도 명시 없음)                                                  |
| **Weight Decay 제외** | - 바이어스 파라미터- 정규화 레이어 파라미터                                          |
| **입력 형식**           | - (N, C, T, H, W)                                                  |
| **전처리(훈련)**         | - Decode 단계- 랜덤 크기 조정 크롭- 뒤집기(확률 50%)- 크롭 크기: 224×224- 평균·표준편차 정규화 |
| **전처리(평가)**         | - 3-크롭 + 중앙 크롭- 크롭 크기: 224×224- 평균·표준편차 정규화                        |
| **데이터 증강 기법**       | - 균일 표본 샘플링- 랜덤 증강(색·채도 등)- 랜덤 재조정 크롭- 좌우 뒤집기(확률 50%)              |

[학습률](https://forensics.tistory.com/28)
[데이터증강](https://velog.io/@sp1rit/Data-Augmentation)

---
## 4.1 Comparison with previous work
|모델|연도|백본|Frame sample|Top-1(%)|Top-5(%)|GELOPs|Params|
|---|---|---|---|---|---|---|---|
|SlowOnly|ICCV2019|ResNet50|4 × 16 × 1|90.13|99.36|41.92|31.68 M|
|SlowFast|ICCV2019|ResNet50|4 × 16 × 1|92.96|99.40|6.96|33.61 M|
|TPN|CVPR2020|ResNet50|8 × 8 × 1|90.33|99.26|50.46|90.72 M|
|TANet|ICCV2021|ResNet50|1 × 1 × 8|91.32|99.36|32.95|24.81 M|
|TimeSFormer|ICML2021|spaceOnly|8 × 32 × 1|74.06|98.46|141|85.82 M|
|jointST|–|–|8 × 32 × 1|78.37|98.56|18|85.82 M|
|divST|–|–|8 × 32 × 1|80.06|98.71|196|122 M|
|Video Swin Transformer|CVPR2022|swin-tiny|8 × 32 × 1|84.18|99.55|19.77|28.16 M|
|Video Swin Transformer|CVPR2022|swin-small|8 × 32 × 1|88.34|99.90|37.88|49.82 M|
|Video Swin Transformer|CVPR2022|swin-large|8 × 32 × 1|92.81|99.95|144|197 M|
|Uniformerv2|ICCV2023|Uniformerv2|8 × 8 × 1|91.17|99.85|143|128 M|
|Froster|ICML2024|Transformer|8 × 8 × 1|90.80|99.78|140|86 M|
|Wild ActionFormer|Our 2025|Uniformerv2|8 × 8 × 1|95.09|99.90|189|128 M|

---
## 4.2 Ablation studies
모델의 개선 사항을 평가 -> 
- 자기 지도 특징 어댑터
- 차등 발산 정규화 손실
- 손실 재가중 
제거 실험을 실시 , 실험을 통해 각 구성 요소가 야생 동물 행동 인식 정확도에 어떻게 기여하는지 평가

##### >Self-supervised adapter란
>- **개념**
    - 백본(backbone)과 이후 모듈 사이에 삽입되는 경량화된 신경망 블록
    - 레이블 없는 데이터(비디오 시퀀스)로부터 자체 감독(self-supervised) 방식으로 특징을 보정·강
>- **역할**
    - 공간·채널 차원의 표현을 백본 출력에 맞춰 적응(adapt)
    - 시퀀스 간 일관성 및 멀티스케일 정보를 효과적으로 보존·전달
>- **학습 방식**
    - 자기 자신 간 시퀀스 특징 간 차이를 예측하도록 MSE 또는 KL 발산 기반 손실 사용
    - 라벨이 없는 비디오 프레임 간 변화량(Δₜ)을 정규화 분포로 변환 후, 예측분포와 비교

### 4.2.1 Self-supervised adapter 
- 어댑터 유무 모델 비교 

|Self-supervised adapter|Training memory|Top-1(%)|Top-5(%)|
|---|---|---|---|
||7 817 M|91.17|99.85|
|✓|6 758 M|92.81 (+1.64)|99.75 (−0.10)|
어댑터를 사용하면 주요 클래스를 식별하는 모델 성능은 올라갔지만 상위 5개에는 영향을 미치지 못했음
어댑터를 사용하면 훈련 중 메모리 사용량이 감소했다고 말함. ( 특징 표현을 학습하도록 도와 리소스 요구량을 낮출 수도 있기 때문)

### 4.2.2 Self-supervised adapter loss
실행 진행 -> 
- 손실 기능이 없는 그룹
- MSE 손실 기능만 사용
- 자기지도형 어댑터 손실 사용 그룹

| Self-supervised adapter loss | Top-1(%)      | Top-5(%)      |
| ---------------------------- | ------------- | ------------- |
| –                            | 92.81         | 99.75         |
| MSE loss                     | 93.01 (+0.20) | 99.90 (+0.15) |
| Adapter loss                 | 94.89 (+2.08) | 99.80 (−0.05) |
추가로 정규화 파라미터 효과를 실험 -> 효과는 크게 나타나지 않았음

| λ Parameter | Top-1(%) | Top-5(%) |
| ----------- | -------- | -------- |
| 0.5         | 94.15    | 99.90    |
| 1           | 94.89    | 99.80    |
| 4           | 94.69    | 99.85    |
| 8           | 94.30    | 99.90    |

### 4.2.3 Loss re-weighting
가중치 손실 함수 비교 
- CE 손실
- 균형 CE 손실
- 라벨 평활하 손실
- 초점 손실

| Loss function        | Top-1(%) | Top-5(%) | Head(%) | Tail(%) |
| -------------------- | -------- | -------- | ------- | ------- |
| CE loss              | 94.89    | 99.80    | 94.88   | 76.31   |
| α-Balanced CE loss   | 94.44    | 99.90    | 94.47   | 77.88   |
| Label smoothing loss | 95.04    | 99.90    | 95.01   | 80.81   |
| Focal loss           | 95.09    | 99.90    | 94.56   | 82.71   |

---
## 4.3 Qualitative analysis
### 4.3.1 Confusion matrix analysis
- 모델 성능평가 -> 혼돈 행렬 분석

![[Confusion matrix analysis.png]]


### 4.3.2 Heatmap visualization
- 모델 성능을 추가로 평가하기 위해 히트맵 시각화를 사용
- 여러 모델이 비디오 시퀀스에서 동물의 행동을 인식하는 방식을 분석
- CNN 기반 모델(슬로우온리, 슬로우패스트, TPN)은 좁은 주의 영역을 보여줌. 이러한 모델은 종종 특정 로컬 영역에 초점을 맞추기 때문에 복잡한 동작을 인식하는 데 한계
- ViT 기반 모델(타임스포머, 스윈 트랜스포머, 프로스터)은 더 넓은 주의 범위를 보여줌. 그러나 관련 없는 배경 영역에 주목하는 경우가 많기 때문에 정확도가 떨어질 수 있다. 
- CNN과 ViT 구조를 결합한 UniformerV2는 관심도 확산을 개선합니다. 와일드 액션포머는 정확하고 의미 있는 관심을 보여준다. 
- 행동을 정의하는 주요 신체 부위에 일관되게 초점을 맞춘다. 예를 들어 탐색 행동에서는 머리와 앞다리를 강조 표시합니다. 먹이를 먹는 행동에서는 입과 음식을 대상으로 합니다. 소변을 보는 동안에는 배경의 방해 요소를 무시하면서 뒷다리와 상호작용 영역을 정확하게 식별한다. 이러한 결과는 와일드 액션포머가 시공간적 특징을 더 잘 활용한다는 것을 보여준다. 주의 지도는 행동 의미론과 잘 일치하여 인식 정확도와 해석 가능성을 향상시킵니다.
![[Heatmap.png]]
### 4.3.3 Failure cases
- 모델이 잘못된 예측을 한 경우를 조사
- 먹이 찾기와 먹이먹기, 휴식 같은 유사한 행동 사이에서 오류가 발생
- 배변이나 탐색 이동과 같은 일시적인 행동에서도 발생
- 야간 적외선 이미지에서는 가시성 저하로 인해 성능이 떨어졌으며
- 모델이 잘못된 예측에 높은 신뢰도를 부여하기도 했음

![[Fail case.png]]

---
## 4.4 Successful cases
![[Successful cases.png]]
- Wild ActionFormer는 걷기, 탐색, 탑승과 같은 동작을 높은 신뢰도로 정확하게 인식함.
- 잘못된 클래스로 분류할 확률도 낮게 유지

---
## 4.5. Analysis of seasonal ecological changes and action patterns
- **연구 목적 및 배경**
    - 와일드 액션포머로 예측한 동물 행동을 계절별(봄, 여름-가을, 겨울)로 분석
    - 행동 패턴 변화를 통해 적응 전략과 생존 메커니즘 탐구
        
- **분석 방법**
    - 월별 행동 빈도 및 계절별 분포 조사
    - 풍선 차트(크기: 빈도, 색상: 계절)로 시각화 (1~~12월, 0~~10 정규화)
        
- **주요 결과**
    - **집단 행동**: 겨울·여름-가을 최고치 → 보온 및 번식기 집결
    - **먹이 채집**: 6월(봄) 최다 → 자원 풍부 시기
    - **트로팅**: 여름-가을 빈번 → 먹이 획득·체온 조절
    - **그루밍**: 봄~여름 증가 → 사회적 유대·털 관리
    - **탐험**: 봄~여름 증가 → 환경 조건·자원 가용성
    - **등산**: 8·10·11월 정점 → 이동 지원 조건
    - **걷기·휴식**: 여름-가을 빈번 → 활동량 균형 유지
    - **음주**: 겨울 증가 → 물 부족 보완
    - **서커만샘 표식**: 겨울·봄 빈번 → 영역 활동 증가
    - **점프**: 여름-가을 빈번 → 에너지·사회적 놀이
    - **놀이**: 번식기(봄~가을) 최고 → 어린 개체 활동
    - **배뇨·배변**: 6·7월 증가 → 식이·대사량 증가
    - **냄새·소변 표시**: 연중 일정 → 지속적 사회·생리 욕구
        
- **의의 및 적용 방안**
    - 행동 변화로 핵심 시기·행동 파악 → 서식지 보존 전략 수립
    - 이동 경로·번식지 보호, 물 공급 등 관리 조치 제안
    - 극심 기후·식생 변화 대응 모니터링 및 보전 정책 지원

| ![[Seasonal variation in animal action in Wolong Nature Reserve1.png]] | ![[Seasonal variation in animal action in Wolong Nature Reserve..png]] |
| :--------------------------------------------------------------------: | :--------------------------------------------------------------------: |
