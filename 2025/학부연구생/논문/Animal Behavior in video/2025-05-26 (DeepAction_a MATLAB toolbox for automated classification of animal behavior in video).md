#### [깃허브 참고](https://github.com/carlwharris/DeepAction?tab=readme-ov-file)

### 📄 원문 제목

**DeepAction: a MATLAB toolbox for automated classification of animal behavior in video**

---

### 1. 초록 (Abstract)

> The identification of animal behavior in video is a critical but time-consuming task in many areas of research.  
> **비디오에서 동물의 행동을 식별하는 것은 많은 연구 분야에서 중요하지만 시간 소모적인 작업이다.**

> Here, we introduce DeepAction, a deep learning-based toolbox for automatically annotating animal behavior in video.  
> **본 연구에서는 비디오에서 동물 행동을 자동으로 주석 처리할 수 있는 딥러닝 기반 툴박스인 DeepAction을 소개한다.**

> Our approach uses features extracted from raw video frames by a pretrained convolutional neural network to train a recurrent neural network classifier.  
> **이 방법은 사전 학습된 합성곱 신경망(CNN)으로부터 원시 비디오 프레임에서 추출된 특징을 사용하여 순환 신경망(RNN) 분류기를 학습시킨다.**

> We evaluate the classifier on two benchmark rodent datasets and one octopus dataset.  
> **이 분류기는 두 개의 설치류 벤치마크 데이터셋과 하나의 문어 데이터셋에서 평가되었다.**

> We show that it achieves high accuracy, requires little training data, and surpasses both human agreement and most comparable existing methods.  
> **그 결과 이 모델은 높은 정확도를 달성하며, 적은 학습 데이터로도 인간 간 일치도 및 기존 대부분의 기법보다 뛰어난 성능을 보였다.**

> We also create a confidence score for classifier output, and show that our method provides an accurate estimate of classifier performance and reduces the time required by human annotators to review and correct automatically-produced annotations.  
> **또한 분류기의 출력에 대해 신뢰도 점수를 도입하였으며, 이 방법은 분류기 성능을 정확히 추정할 수 있고, 사람이 자동 주석을 검토하고 수정하는 데 걸리는 시간을 줄여준다.**

> We release our system and accompanying annotation interface as an open-source MATLAB toolbox.  
> **이 시스템과 함께 제공되는 주석 인터페이스는 오픈소스 MATLAB 툴박스로 제공된다.**

---

### 2. 서론 (Introduction)

> The classification and analysis of animal behavior in video is a ubiquitous but often laborious process in life sciences research.  
> **비디오에서 동물의 행동을 분류하고 분석하는 일은 생명과학 연구에서 흔하지만, 대개는 매우 힘든 과정이다.**

> Traditionally, such analyses have been performed manually.  
> **전통적으로 이러한 분석은 수작업으로 수행되어 왔다.**

> This approach, however, suffers from several limitations.  
> **하지만 이러한 방식에는 여러 가지 한계가 존재한다.**

> Most obvious is that it requires researchers to allocate much of their time to the tedious work of behavioral annotation, limiting or slowing the progress of downstream analyses.  
> **가장 명확한 문제는 연구자들이 행동 주석이라는 지루한 작업에 상당한 시간을 투입해야 하며, 이는 이후 분석의 진행을 지연시키거나 방해하게 된다는 것이다.**

> Particularly for labs without research assistants or paid annotators, the opportunity cost of annotating video can be quite high.  
> **특히 연구 보조원이나 유급 주석자가 없는 연구실에서는 영상 주석 작업의 기회비용이 매우 높다.**

> Manual annotation also suffers from relatively poor reproducibility and reliability, largely due to the limited attentional capacity of human annotators.  
> **수작업 주석은 사람의 주의력 한계로 인해 재현성과 신뢰성이 낮다는 문제도 있다.**

> This issue is particularly salient in studies involving rodents.  
> **이 문제는 설치류를 다루는 연구에서 특히 두드러진다.**

> Due to their nocturnal nature, rodents are preferably studied under dimmed or infrared light, which makes the identification of behaviors more difficult due to more limited light and color cues.  
> **설치류는 야행성 동물이기 때문에 어두운 환경이나 적외선 조명 아래에서 관찰되는데, 이로 인해 빛과 색에 대한 정보가 부족해 행동을 식별하기가 더 어려워진다.**

> This, in turn, increases annotators’ fatigue and reduces their capacity to pay attention for extended periods, introducing variation in annotation quality, thereby decreasing the quality of behavioral data.  
> **이로 인해 주석자의 피로도가 높아지고 장시간 집중하는 능력이 떨어지며, 주석 품질에 변동성이 생겨 결국 행동 데이터의 품질도 저하된다.**

> Given the time and accuracy limitations of manual annotation, increasing work has focused on creating methods to automate the annotation process.  
> **이러한 시간적·정확성 한계를 극복하기 위해 최근에는 주석 과정을 자동화하는 방법 개발에 많은 노력이 기울여지고 있다.**

> Many such methods rely on tracking animals’ bodies or body parts, from which higher-level features (e.g., velocity, acceleration, and posture) are extrapolated and used to classify behavior.  
> **이러한 방법 중 다수는 동물의 전체 몸이나 신체 부위를 추적하고, 이로부터 속도, 가속도, 자세 등의 고차원 특징을 추출하여 행동을 분류하는 방식이다.**

> However, approaches using these “hand-crafted features” are limited in several ways.  
> **하지만 이러한 ‘수작업 설계된 특징(hand-crafted features)’ 기반 접근은 여러 한계를 가진다.**

> First, they require that researchers identify sets of features that both encompass a given animal’s entire behavioral repertoire and can distinguish between visually similar behaviors.  
> **첫 번째로, 연구자는 해당 동물의 전체 행동 레퍼토리를 포괄하며 동시에 시각적으로 유사한 행동을 구분할 수 있는 특징 집합을 수동으로 정의해야 한다.**

> For example, “eating” and “grooming snout” behaviors in rodents do not have a well-defined difference in posture or movement, making crafting features to differentiate them difficult.  
> **예를 들어 설치류의 ‘먹기’와 ‘코 손질(grooming snout)’ 행동은 자세나 움직임 면에서 명확한 차이가 없기 때문에 이들을 구분할 수 있는 특징을 정의하는 것이 어렵다.**

> Second, after features have been selected, detecting and tracking them is difficult and imperfect.  
> **두 번째로, 일단 특징이 정해지고 나면 그것을 비디오에서 정확하게 검출하고 추적하는 것 자체도 어렵고 오류가 생기기 쉽다.**

> Subtle changes in video illumination, animal movement, and environment can result in inaccurate keypoint detection, decreasing the fidelity of extracted features.  
> **영상의 미세한 조명 변화, 동물의 움직임, 환경 조건의 변화 등으로 인해 키포인트 검출 정확도가 떨어지고, 이에 따라 추출된 특징의 정확성도 저하된다.**

> And third, selected feature sets are often experiment-specific.  
> **셋째, 정의된 특징 집합은 종종 특정 실험에 종속적이라는 점이다.**

> Those optimal for a singly housed rodent study, for example, likely differ from those optimal for a social rodent study.  
> **예를 들어, 단일 설치류 행동 분석에 적합한 특징 집합은 사회적 설치류 행동 연구에는 맞지 않을 수 있다.**

> This increases the complexity of the feature-selection task, impeding experimental progress and annotation accuracy.  
> **이로 인해 특징 선택 작업의 복잡성이 높아지고, 결과적으로 실험의 진행과 주석의 정확성을 저해한다.**

---
### 3. 기존 방법의 한계와 DeepAction의 제안

> To address these limitations, Bohnslav et al. proposed an alternative to hand-crafted approaches, instead using hidden two-stream networks and temporal gaussian mixture networks, and achieved high classification accuracy on a diverse collection of animal behavior datasets.  
> **이러한 한계를 해결하기 위해, Bohnslav 외 연구진은 수작업 기반 접근 대신 숨겨진 이중 스트림 네트워크(hidden two-stream networks)와 시간 기반 가우시안 혼합 모델(temporal Gaussian mixture networks)을 사용하여 다양한 동물 행동 데이터셋에서 높은 분류 정확도를 달성한 바 있다.**

> Here, we expand on this work by introducing DeepAction, a MATLAB toolbox for the automated annotation of animal behavior in video.  
> **본 논문에서는 이러한 기존 연구를 확장하여, 비디오에서 동물 행동을 자동으로 주석 처리할 수 있는 MATLAB 기반 툴박스인 DeepAction을 제안한다.**

> Our approach utilizes a two-stream convolutional and recurrent neural network architecture to generate behavioral labels from raw video frames.  
> **DeepAction은 원시 비디오 프레임으로부터 행동 레이블을 생성하기 위해 이중 스트림(two-stream) 방식의 CNN 및 RNN 아키텍처를 활용한다.**

---

## 4. 방법론 개요 (Method Overview)

> We use convolutional neural networks (CNNs) and dense optical flow to extract spatial and temporal features from video, which are then used to train a long short-term memory network classifier to predict behavior.  
> **CNN과 밀집 옵티컬 플로우(Dense Optical Flow)를 사용하여 비디오로부터 공간적(spatial) 및 시간적(temporal) 특징을 추출한 후, 이를 기반으로 LSTM(Long Short-Term Memory) 기반 분류기를 학습시켜 행동을 예측한다.**

> We evaluate our approach on two benchmark datasets of laboratory mouse video and one dataset of octopus video.  
> **이 접근법은 실험실 생쥐 비디오로 구성된 두 개의 벤치마크 데이터셋과 문어 비디오로 구성된 하나의 데이터셋에서 평가되었다.**

> We show that it outperforms existing methods and reaches human-level performance with little training data.  
> **본 모델은 기존 방법들을 능가하며, 적은 양의 학습 데이터만으로도 인간 수준의 정확도에 도달함을 보인다.**

---

> In addition to outputting behavior labels for each video frame, we also introduce a classification confidence system that generates a measure of how “confident” the classifier is about each label.  
> **프레임 단위로 행동 레이블을 출력하는 것 외에도, 각 예측에 대해 분류기의 “확신도(confidence)”를 측정하는 분류 신뢰도 시스템을 도입하였다.**

> This allows researchers to estimate the quality of automatically-produced annotations without having to review them, and reduces the time required to review annotations by allowing users to selectively correct ambiguous ones, while omitting those that the classifier produced with high confidence.  
> **이 시스템을 통해 연구자들은 자동 생성된 주석의 품질을 직접 검토하지 않고도 예측의 신뢰도를 추정할 수 있으며, 신뢰도가 낮은 주석만 선택적으로 수정하고, 신뢰도가 높은 주석은 생략함으로써 전체 검토 시간도 줄일 수 있다.**

> We show that this confidence score accurately differentiates low quality annotations from high quality ones and improves the efficiency of reviewing and correcting video.  
> **이 신뢰도 점수는 낮은 품질의 주석과 높은 품질의 주석을 정확히 구분할 수 있으며, 비디오 주석 검토 및 교정의 효율성을 향상시키는 데 기여한다.**

> Finally, we release the code and annotation GUI as an open-source MATLAB project.  
> **마지막으로, 본 코드 및 주석 인터페이스 GUI는 오픈소스 MATLAB 프로젝트로 공개된다.**

---

## 5. DeepAction 전체 워크플로우 요약 (p.3)

논문 그림 1A~1E를 기반으로 한 설명은 다음과 같습니다:

- **[A] 프로젝트 흐름**:
    
    1. 프로젝트 생성
        
    2. 비디오 프레임 추출 (공간 + 시간 프레임)
        
    3. CNN 기반 특징 추출
        
    4. 훈련 클립 선택
        
    5. 클립 수동 주석
        
    6. 분류기 훈련
        
    7. 평가
        
    8. 전체 자동 주석
        
    9. 신뢰도 기반 검토
        
    10. 최종 주석 결과 내보내기
        
- **[B] 클립 분할 과정**:  
    전체 영상을 일정 길이의 클립으로 분할하고 일부는 주석을 위해 무작위로 선택  
    → 수동 주석 → 해당 주석과 CNN 특징을 연결하여 분류기 학습
    
- **[C] 학습 데이터 구성**:  
    수동 주석된 데이터는 훈련/검증 세트로 나뉘며 훈련은 순환 신경망으로 수행
    
- **[D] 벤치마크 실험 설계**:  
    전체 데이터셋을 무작위로 일정 비율만 주석 처리하고 나머지는 테스트로 사용해 모델 성능 평가
    
- **[E] 특징 추출 구조**:
    
    - Raw video → Optical flow로 시간 프레임 생성
        
    - ResNet18을 활용해 공간적/시간적 특징 추출
        
    - 특징 결합 후 차원 축소 (1024 → 512)

### 6. 실험 데이터셋 (Datasets)

> In our primary analyses, we evaluate our approach on two publicly available “benchmark” datasets of mice in a laboratory setting.  
> **본 논문의 주요 실험에서는 공개된 설치류 행동 데이터셋 두 가지를 사용하였다.**

> The first dataset, referred to as the “home-cage dataset,” was collected by Jhuang et al., and features 12 videos (10.5 h total) of singly housed mice in their home cages performing eight stereotypical, mutually-exclusive behaviors recorded from the side of the cage.  
> **첫 번째 데이터셋은 “home-cage 데이터셋”으로 Jhuang 외 연구진이 수집한 자료이며, 단독 사육된 생쥐가 케이지 안에서 수행한 8가지 상호 배타적 행동을 측면 카메라로 촬영한 12개 영상(총 10.5시간)으로 구성된다.**

> The second dataset, called “CRIM13,” consists of 237 pairs of videos, recorded with synchronized side and top views, of pairs of mice engaging in social behavior, categorized into 13 distinct, mutually-exclusive actions.  
> **두 번째 데이터셋은 “CRIM13”으로, 생쥐 2마리의 사회적 행동을 동기화된 측면 및 상단 카메라로 촬영한 237쌍의 비디오로 구성되어 있으며, 총 13개의 상호 배타적 행동 범주로 주석되어 있다.**

> In addition to these benchmark datasets, we challenge the classifier by evaluating it on an “exploratory” unpublished dataset of octopus bimaculoides behavior during a habituation task.  
> **이 외에도, 문어(bimaculoides)의 습관화 행동(habituation task)을 기록한 미공개 탐색 데이터셋을 활용하여 본 모델의 일반화 성능을 추가로 평가하였다.**

---

### 7. 훈련 데이터 비율과 정확도 (Performance vs. Training Size)

> We first evaluate the performance of the classifier (i.e., accuracy and F1) with varying amounts of training data, and show that it requires remarkably little manual annotation to achieve high accuracy.  
> **분류기의 정확도와 F1 점수를 학습 데이터 비율에 따라 측정한 결과, 적은 양의 수동 주석만으로도 높은 정확도를 달성할 수 있음이 나타났다.**

- Home-cage 데이터셋의 경우:
    
    - **단 10~20% 정도의 주석 데이터**만 사용해도 **정확도 75~79%** 도달
        
    - 인간 주석자 간 일치도는 약 71.6% 수준
        

> For a given proportion labeled, a corresponding proportion of project clips are randomly selected from all the clips in the dataset and used to train the classifier.  
> **전체 데이터셋에서 주어진 비율만큼의 클립을 무작위로 선택해 주석하고, 이를 이용해 분류기를 훈련시켰다.**

> On the home-cage dataset, in addition to showing higher accuracy than the agreement between human annotators, our classifier outperforms existing commercial options and methods using hand-crafted features or 3D convolutional networks.  
> **home-cage 데이터셋에서는, 본 분류기는 인간 주석자 간 일치도를 넘었을 뿐 아니라, 상용 소프트웨어 및 수작업 피처 기반 또는 3D CNN 기반 기존 방법보다도 더 높은 정확도를 보였다.**

> On the CRIM13 dataset, it also surpasses prior methods and even performs better than human agreement.  
> **CRIM13 데이터셋에서도 기존 방법들을 능가하였고, 인간 주석자 간 일치도(69.7%)보다 더 높은 정확도(73.9%)를 기록하였다.**

### 8. 기존 방법과의 성능 비교

논문 Table 1에 정리된 정확도 비교표 (요약):

| 모델                | 정확도 (%)  |
| ----------------- | -------- |
| Human (home-cage) | 71.6     |
| CleverSys 상용 시스템  | 61.0     |
| Jhuang et al.     | 78.3     |
| DeepAction (ours) | **79.5** |
| Jiang HMM (최고)    | 81.5     |
| CRIM13 Human      | 69.7     |
| Burgos-Artizzu    | 62.6     |
| DeepAction (ours) | **73.9** |

### 9. 클립 길이 및 입력 방식이 성능에 미치는 영향

> We hypothesized that our classifier shows superior performance when it is trained using relatively short clips rather than longer ones, given equal annotation time.  
> **같은 시간 동안 주석이 이루어졌을 때, 짧은 클립 단위로 학습한 분류기가 더 높은 성능을 보일 것이라 가정하였다.**

> This is indeed the case.  
> **실제로 실험 결과도 이를 뒷받침하였다.**

- **짧은 클립(1~2분)** 단위로 학습할수록 더 빠르게 정확도가 상승
    
- 긴 클립은 일반화 성능이 낮고, 변화 감지에 취약
    

> The CRIM13 dataset is recorded using synchronized top and side cameras.  
> **CRIM13은 상단/측면 두 개의 동기화된 카메라로 촬영되었다.**

> The classifier trained using features from both views demonstrates superior performance.  
> **두 시점에서 추출된 특징을 결합하여 학습한 분류기가 단일 시점보다 성능이 뛰어났다.**

---

### 10. 행동 클래스별 정확도 차이 (Behavior-wise Performance)

> In the home-cage dataset, except for the “drink” behavior (0.26% of labels), the classifier shows consistently high performance.  
> **home-cage 데이터셋에서는 ‘마시기(drink)’ 행동을 제외하면 모든 행동에서 일관되게 높은 성능을 보였다.**

- ‘rest(휴식)’: 매우 높은 정확도 (정밀도 0.98, 재현율 0.95)
    
- ‘drink’: 매우 낮은 샘플 수로 인해 불안정
    

> In the CRIM13 dataset, “other” class dominates the dataset and causes imbalance.  
> **CRIM13에서는 'other'(비사회적 행동) 클래스가 과도하게 많아 클래스 불균형이 존재한다.**
> This causes the classifier to overpredict “other” and mislabel some social behaviors.  
> **이로 인해 분류기가 'other'로 과다 예측하여 일부 사회적 행동을 잘못 분류하는 경우가 발생했다.**

---

### 11. 문어 데이터셋에 대한 성능 평가 (Exploratory Octopus Dataset)

> On the exploratory dataset, we evaluated the classifier on a six-behavior dataset of seven octopus bimaculoides behavior videos collected in-house.  
> **탐색적 실험에서는, 실험실에서 수집한 7개의 문어(bimaculoides) 행동 비디오(총 6가지 행동 범주)를 사용하여 분류기의 성능을 평가하였다.**

> Overall, the classifier performs relatively well, with an accuracy of 73.1 percent.  
> **전체적으로 분류기는 약 73.1%의 정확도를 기록하며 양호한 성능을 보였다.**

> This is much lower than human-level performance, however, given that manual annotators reached an agreement of 88.7 percent on the same, independently annotated video.  
> **하지만 이 성능은 인간 주석자 간 일치도(88.7%)보다는 낮은 수치이며, 동일한 영상을 두 독립 주석자가 수작업으로 주석한 결과와 비교한 것이다.**

> In terms of behavior-level performance, the classifier performs well on crawling, none (indicating behavior of interest) and fixed pattern, but poorly on relaxation, jetting, and expanding.  
> **행동 범주별로 보면, ‘기어가기(crawling)’, ‘none(관심 행동 없음)’, ‘fixed pattern(고정 패턴 이동)’에서는 양호한 성능을 보였으나, ‘relaxation(이완)’, ‘jetting(급가속 회피)’, ‘expanding(팔다리 벌리기)’에서는 낮은 성능을 보였다.**

> The poor performance on these behaviors is likely due to their infrequency, particularly in the case of jetting and expanding.  
> **이러한 낮은 성능은 해당 행동이 전체 데이터셋에서 매우 드물게 나타났기 때문으로 보이며, 특히 ‘jetting’과 ‘expanding’은 매우 낮은 빈도로 등장하였다.**

---

### 12. 분류기 행동별 성능 (Behavior-wise Metrics – Home-Cage 기준)

> To examine classifier performance as a function of the amount of data used to train it, we calculate the precision, recall, and F1 score for each behavior with varying labeled data proportions.  
> **학습에 사용된 데이터 양에 따른 분류기 성능을 분석하기 위해, 다양한 라벨링 비율에 대해 각 행동별 정밀도(Precision), 재현율(Recall), F1 점수를 계산하였다.**

- **정밀도(Precision)**: 예측한 행동 중 실제로 맞은 비율
    
- **재현율(Recall)**: 실제 행동 중 예측이 맞은 비율
    
- **F1 점수**: 두 값의 조화 평균
    

> In the home-cage dataset, for non-drinking behaviors, we observe a similar pattern in behavior-level improvement as we do to overall accuracy—a rapid increase at low training data proportions, followed by a more gradual one.  
> **home-cage 데이터에서는 ‘drink’를 제외한 행동들에 대해, 전체 정확도와 유사한 패턴이 나타났으며, 초기 학습 데이터 비율이 증가할수록 성능이 급격히 향상되다가 이후 완만해지는 경향을 보였다.**

> For drinking behavior, however, due to its exceptionally low incidence, we observe a more inconsistent, non-gradual improvement in performance across training set proportions.  
> **반면 ‘drinking’ 행동은 매우 낮은 출현율로 인해, 학습 비율이 증가함에 따라 성능 향상이 일정하지 않고 불규칙하게 나타났다.**

---

### 13. CRIM13에서도 유사한 경향 존재

> This pattern generally applies in the CRIM13 dataset as well.  
> **이러한 패턴은 CRIM13 데이터셋에서도 전반적으로 유사하게 나타났다.**

> For most behaviors we observe a rapid increase in recall, precision, and F1, followed by a relative slowdown in improvement as a function of training proportion.  
> **대부분의 행동에서 학습 비율이 낮을 때는 정밀도, 재현율, F1 점수가 급격히 상승했으며, 이후 점진적으로 완화되는 양상을 보였다.**

> We observe that “eat,” “circle,” and “drink” show sporadic improvements in recall, precision, and F1.  
> **그러나 ‘eat’, ‘circle’, ‘drink’ 같은 행동은 불규칙한 성능 향상을 보였는데, 이는 이들 행동이 매우 드물기 때문으로 분석된다.**

---

### 14. 신뢰도 점수와 분류 정확도 간의 관계 (Confidence Scores Predict Accuracy)

> We generate a confidence score for each clip that represents the classifier’s prediction of the accuracy of its predicted labels.  
> **분류기가 각 클립에 대해 생성한 행동 예측의 정확도를 예측하는 값을 ‘신뢰도 점수(confidence score)’로 정의하였다.**

> We demonstrate that there is a strong correlation between confidence score and actual accuracy.  
> **신뢰도 점수와 실제 정확도 간에는 강한 상관관계가 있음을 확인하였다.**

- 상관도 R2≈0.45R^2 \approx 0.45R2≈0.45 수준 → 비교적 일관된 예측 가능성
    

> Confidence scores based on temperature scaling perform better than those using softmax probability.  
> **Softmax 확률 기반 신뢰도 점수보다, Temperature Scaling 기법으로 계산된 신뢰도 점수가 더 우수한 성능을 보였다.**

> While the softmax score consistently overestimates accuracy by 6–8%, temperature scaling is overconfident by only 1–2%.  
> **Softmax 방식은 예측 정확도를 6~~8% 과대 추정하는 반면, Temperature Scaling은 1~~2% 정도만 과대 추정하였다.**

---

### 15. 신뢰도 점수의 절대오차(MAE) 및 평균편차(MSD)

> The MAE expresses the amount by which a randomly selected clip’s confidence score differs from its actual accuracy.  
> **MAE(평균 절대 오차)는 임의로 선택된 클립의 신뢰도 점수가 실제 정확도와 얼마나 차이가 나는지를 나타낸다.**

> The MSD expresses systematic over- or under-confidence.  
> **MSD(평균 부호 있는 차이)는 시스템적으로 과신(과대 예측) 또는 과소 예측이 있는지를 보여준다.**

- 결과:
    
    - Temperature Scaling은 **낮은 MAE**, **낮은 MSD** → 가장 안정적

### 16. 신뢰도 기반 리뷰는 검토 시간을 줄인다 (Uncertainty‑based review reduces correction time)

> Having established the high correspondence between clip confidence score and clip accuracy, we investigate how well our confidence-based review system leverages those confidence scores to reduce the time it takes to review and correct classifier-produced labels.  
> **클립의 신뢰도 점수와 실제 정확도 간의 높은 상관관계를 확인한 후, 우리는 이 신뢰도 점수를 활용하여 자동 생성된 주석을 검토하고 교정하는 데 걸리는 시간을 얼마나 줄일 수 있는지를 평가하였다.**

> A viable confidence measure would allow clips with a lower confidence score to be preferentially reviewed over those with a higher confidence score, decreasing the manual review time required to obtain acceptably high-quality annotations.  
> **유효한 신뢰도 지표는 신뢰도가 낮은 클립을 우선적으로 검토하게 해 줌으로써, 일정 수준 이상의 품질을 확보하기 위한 수작업 검토 시간을 효과적으로 줄일 수 있게 한다.**

> Rather than reviewing all the classifier-produced labels, the user could instead review only a portion with the lowest accuracy.  
> **사용자는 전체 주석을 검토하는 대신, 정확도가 가장 낮을 것으로 예상되는 일부 클립만 검토함으로써 효율을 높일 수 있다.**

> We provide an example of this process in practice in Fig. 6G, which simulates the relationship between the proportion of test video reviewed and the overall accuracy of the labels in the test set.  
> **Fig. 6G에서는 테스트 비디오 중 리뷰된 비율과 전체 주석 정확도 간의 관계를 시뮬레이션하여 보여준다.**

- 신뢰도 정렬을 이용해 낮은 점수부터 검토하면, **적은 검토량으로도 높은 정확도 확보 가능**
    
- 무작위 검토 대비 효율성 우수
    

---

### 17. 리뷰 효율성 정량화 (Review Efficiency Metric)

> To compare the performance of the confidence-based review across labeled data proportions, we calculate a metric called “review efficiency.”  
> **학습 데이터 비율별로 신뢰도 기반 리뷰의 성능을 비교하기 위해 '리뷰 효율성(review efficiency)'이라는 지표를 정의하였다.**

- **정의**:
    $$
    리뷰 효율성= \frac{신뢰도 기반 리뷰 개선}{이론적으로 가능한 최대 개선량}
$$
> As shown in Fig. 6H, as the proportion of data labeled increases, both confidence scores become closer to optimal in sorting videos for review.  
> **Fig. 6H, 6I에 따르면, 학습된 데이터 비율이 높아질수록 신뢰도 기반 정렬이 이상적인 정렬(실제 정확도 기준)과 가까워진다.**

> The softmax- and temperature scaling-based scores perform approximately the same.  
> **Softmax 방식과 Temperature Scaling 방식 모두 리뷰 효율성에서 비슷한 성능을 보였다.**

---

### 18. MATLAB GUI를 통한 리뷰 및 주석 시스템 (Annotation GUI improves annotation and review)

> While we evaluate our method here using fully annotated datasets, the central purpose of this work is to improve the annotation of behavior in experimental settings.  
> **본 연구는 완전히 주석된 데이터셋으로 평가되었지만, 궁극적인 목적은 실제 실험 환경에서의 행동 주석 과정을 개선하는 데 있다.**

> For this reason, we release the entire system as a MATLAB toolbox as a GitHub repository that includes example projects and GUI interfaces.  
> **이를 위해 전체 시스템을 MATLAB 기반 툴박스로 구현하여 GitHub에 공개하였고, 예제 프로젝트 및 GUI도 함께 제공한다.**

> We integrate clip-wise annotation by pre-dividing project videos into clips and presenting clips, rather than videos, for users to annotate.  
> **전체 비디오가 아닌, 클립 단위로 분할하여 사용자에게 주석하도록 구성하였다.**

> In addition, we incorporate the confidence-based review process into the GUI: incomplete (i.e., unreviewed annotations) are shown in a table, with low-confidence clips appearing at the top.  
> **GUI 상에서 신뢰도 기반 리뷰가 가능하도록 설계되었으며, 검토되지 않은 클립은 표로 정리되어 나타나며, 신뢰도 낮은 순으로 정렬되어 상단에 표시된다.**

> Users can easily load videos, annotate them using the keyboard, add or remove behaviors, and export the results entirely within the GUI.  
> **사용자는 GUI에서 비디오를 불러오고, 키보드로 행동 주석을 추가·삭제하며, 전체 결과를 GUI 내에서 직접 내보낼 수 있다.**

---

## ✅ 논문 결론 및 토론 (Discussion)

### 19. 요약 및 성과 정리

> Here we present a method for the automatic annotation of laboratory animal behavior from video.  
> **본 논문에서는 실험실 동물의 비디오 행동을 자동으로 주석하는 방법을 제안하였다.**

> Our classifier produces high accuracy annotations, rivaling or surpassing human-level agreement, while requiring relatively little human annotation time.  
> **본 분류기는 비교적 적은 수의 수작업 주석만으로도 인간 수준 이상의 정확도를 달성할 수 있다.**

> Our confidence scores accurately predict accuracy and are useful in reducing the time required for human annotators.  
> **도입된 신뢰도 점수는 실제 정확도를 잘 예측하며, 사람의 리뷰 시간도 줄이는 데 효과적이다.**

---

### 20. 장점 요약

- 행동 키포인트나 수작업 특징 없이도 원시 영상 프레임만으로 분류 가능
    
- 설치류 외 문어와 같은 비설치류 모델에서도 일반화 가능
    
- GUI 기반 환경 제공: 실제 실험 환경에 쉽게 적용 가능
    
- 수작업 시간 **75~82% 절감** 가능 (Home-cage: 264시간 → 47시간, CRIM13: 350시간 → 88시간)
    

---

### 21. 향후 개선 방향

> While our clip selection process demonstrates superior performance to whole-video annotation, we currently select clips randomly.  
> **현재는 클립을 무작위로 선택하지만, 더 나은 전략(예: 클러스터링, 대표성 기반 선택 등)이 있을 수 있다.**

> It is possible that alternate architectures would demonstrate superior performance.  
> **BiLSTM 외에도 다른 RNN 구조나 attention 기반 아키텍처를 도입하면 성능을 높일 수 있을 것으로 보인다.**

> The classifier described here assumes behaviors are mutually exclusive, but could be extended for co-occurring behaviors.  
> **현재는 상호 배타적 행동만 처리 가능하지만, 복수 행동 동시 발생을 다루도록 확장할 수 있다.**

> Future versions might use density-based metrics or Bayesian dropout for better uncertainty estimation.  
> **앞으로는 밀도 기반 지표나 Bayesian dropout을 통한 더 정확한 불확실성 추정이 가능할 것이다.**

---
## 22. 데이터셋 (Datasets)

> Given that rodents are widely used in behavioral research, and mice are the most studied rodents, we chose two publicly-available datasets featuring mice engaging in a range of behaviors in our main analysis.  
> **행동 연구에서 설치류가 널리 사용되며, 특히 생쥐가 가장 많이 연구되는 설치류이기 때문에, 본 연구에서는 생쥐가 다양한 행동을 수행하는 두 가지 공개 데이터셋을 사용하였다.**

- **Home-cage dataset**:
    
    - Jhuang et al. 수집
        
    - 단일 생쥐, 측면 시점에서 촬영
        
    - 12개 비디오 (10.5시간, 113만 프레임)
        
    - 8가지 행동으로 주석됨
        
- **CRIM13 dataset**:
    
    - Burgos-Artizzu et al. 수집
        
    - 237쌍 비디오 (상단/측면 동기화)
        
    - 13개 행동 (12개 사회 행동 + 기타)
        
- **Octopus dataset**:
    
    - 연구팀이 자체 수집
        
    - 7개 비디오 (총 6.75시간, 6.15시간 주석 완료)
        
    - 6개 행동 (crawling, fixed pattern, jetting 등)
        

---

## 23. 인간 주석자 간 일치도 (Inter-observer Reliability)

> Both datasets include a set of annotations performed by two groups of annotators.  
> **두 데이터셋 모두 두 명의 독립된 주석자 그룹이 수행한 주석 정보를 포함하고 있다.**

> The agreement between these two sets is used as a reference to benchmark classifier performance.  
> **이들 간의 일치도는 분류기의 성능을 평가하는 기준선으로 사용되었다.**

- **Home-cage**: 1.6시간 분량에서 인간 간 일치도 78.3%
    
- **CRIM13**: 12개 비디오에 대해 69.7%
    

---

## 24. 라벨링 시뮬레이션 (Simulating Labeled Data)

> We simulate our approach’s performance with varying amounts of training data.  
> **학습 데이터 양이 달라질 때 성능을 시뮬레이션하기 위해 다음과 같이 실험을 설계하였다.**

- 학습 데이터 비율:
    
    proplabeled=[0.02:0.02:0.2,0.2:0.05:0.9]\text{proplabeled} = [0.02 : 0.02 : 0.2, 0.2 : 0.05 : 0.9]proplabeled=[0.02:0.02:0.2,0.2:0.05:0.9]
- 예: 2% ~ 90%까지 점진적으로 늘려가며 10회 반복 평가 수행
    

---

## 25. 기존 방법과의 비교 방식 (Comparison with Existing Methods)

> For home-cage dataset, existing methods use “leave-one-out” cross-validation.  
> **home-cage 데이터셋에서는 기존 연구들이 한 비디오를 테스트용으로 두고 나머지를 학습에 쓰는 leave-one-out 방식 사용**

- DeepAction에서는 클립 단위로 12-fold 교차검증 수행
    
- CRIM13에서는 기존 연구에서 44% 학습, 56% 테스트 → DeepAction도 2-fold 교차검증으로 맞춤
    

---

## 26. 프레임 추출 (Frame Extraction)

> To generate spatial frames, we extract raw video frames from each video file.  
> **공간 프레임 생성을 위해 비디오의 원시 프레임을 추출한다.**

> For temporal frames, we compute dense optical flow between adjacent frames using the TV-L1 algorithm.  
> **시간 프레임은 TV-L1 알고리즘을 이용하여 인접 프레임 간 밀집 옵티컬 플로우를 계산해 생성한다.**

- Optical flow는 색으로 방향/속도 정보 표현
    
- TV-L1은 성능이 우수한 고전 알고리즘
    

---

## 27. 특징 추출 (Feature Extraction)

> We utilize the pretrained ResNet18 CNN to extract high-level features from spatial and temporal video frames.  
> **공간/시간 프레임에서 고차원 시각적 특징을 추출하기 위해 사전 학습된 ResNet18 CNN을 사용하였다.**

- Spatial frame → [224, 224, 3] → CNN 추론
    
- Temporal frame → 주변 11개 프레임 스택 → [224, 224, 33] 입력
    
- CNN의 마지막 global average pooling 층에서 512차원 벡터 추출
    

> For multiple cameras, we concatenate features across cameras as well.  
> **다중 카메라(예: CRIM13)에서는 카메라별 특징을 병합하여 하나의 입력으로 사용함**

---

## 28. 차원 축소 (Dimensionality Reduction)

> We use reconstruction independent component analysis (ICA) to reduce the initial 1024/2048 features to 512.  
> **초기 spatiotemporal 특징 벡터(1024 또는 2048차원)를 재구성 가능한 독립 성분 분석(ICA)으로 512차원으로 축소하였다.**

- 성능 향상 및 학습 효율 개선 목적
    

---

## 29. 분류기 구조 (Classifier Architecture)

> We use a long short-term memory (LSTM) network with bidirectional layers (BiLSTM).  
> **Bidirectional LSTM을 활용한 순환 신경망 구조를 사용하였다.**

- 입력: [n, 512] 시퀀스 (프레임 수 n, 피처 512)
    
- 구조:
    
    - BiLSTM → Dropout → BiLSTM → Dropout
        
    - Fully connected → Softmax → Sequence classification
        

> To reduce overfitting, we apply dropout (rate: 50%) after each BiLSTM layer.  
> **과적합 방지를 위해 각 BiLSTM 층 뒤에 50% 드롭아웃 적용**


## 30. 분류기 학습 (Classifier Training)

> Validation set is 20% of labeled clips.  
> **라벨링된 클립의 20%는 검증(validation) 세트로 사용**

> Training stops if validation loss does not improve for two epochs.  
> **검증 손실이 두 epoch 이상 개선되지 않으면 학습 조기 종료**

| 하이퍼파라미터   | 값             |
| --------- | ------------- |
| 최대 에폭     | 16            |
| 초기 학습률    | 0.001         |
| 배치 크기     | 8             |
| 학습률 감소 주기 | 4 에폭마다 10배 감소 |
---
## 31. 분류기 평가 방식 (Classifier Evaluation)

> We evaluate the classifier on the test set by comparing its predicted labels to the ground-truth labels for each frame.  
> **테스트 세트에서 각 프레임에 대한 예측 레이블을 실제 정답과 비교하여 분류기를 평가하였다.**

- **정확도(Accuracy)** = 정확히 예측한 프레임 수 / 전체 프레임 수
    
- **정밀도(Precision)** = TP / (TP + FP)
    
- **재현율(Recall)** = TP / (TP + FN)
    
- **F1 점수** = 2 * (정밀도 * 재현율) / (정밀도 + 재현율)
    

> We calculate the average F1 score across all behavior classes.  
> **모든 행동 클래스에 대해 F1 점수를 산출하고, 이들의 평균값을 사용한다.**

---

## 32. 신뢰도 점수 정의 (Confidence Score Definition)

> For each frame, we estimate the probability that the predicted label is correct.  
> **각 프레임에 대해 예측 레이블이 정답일 확률을 산정한다.**

- 프레임별 확률:
$$
p_j=P(\hat y_j = y_j)
$$    
- 클립 신뢰도 점수(confidence)는 해당 클립의 프레임별 평균 확률:
    $$
    conf(clipi)=\frac1N \sum_j^N= N p_j​
$$
---

## 33. 신뢰도 점수 계산 방식 (Confidence Score Calculation)

> We test two methods to calculate frame-level confidence: softmax-based and temperature scaling.  
> **프레임 수준의 신뢰도를 계산하기 위해 softmax 기반 방법과 temperature scaling 방법 두 가지를 테스트하였다.**

- **Softmax 기반**:
    $$
    p_j^{SM} = \max_k \sigma(z_j)_kpj
    $$​
    - 가장 높은 소프트맥스 확률을 그대로 사용
        
    - 일반적으로 **과신(overconfident)** 경향이 있음
        
- **Temperature scaling**:
    $$
  p_j^{TS} = \max k * \sigma\left(\frac{z_j}{T}\right)_k
    $$​
    - T는 검증 세트에서 최적화됨
        
    - 과신도 감소 효과
        

---

## 34. 신뢰도 기반 리뷰 (Confidence-Based Review)

> The system reviews clips with the lowest confidence scores first.  
> **시스템은 신뢰도가 가장 낮은 클립부터 우선적으로 검토하게 구성되어 있다.**

- 전체 신뢰도 기반 정확도:
    $$
    conf(Dunlabeled​)=∑j​∣clipj​∣∑i​conf(clipi​)⋅∣clipi​∣​
    $$
    - 이 값이 전체 미라벨링 데이터의 평균 정확도 추정치가 된다.
        

---

## 35. 리뷰 효율성 평가 (Evaluating Review Efficiency)

> We simulate a scenario where a user only reviews a portion of the test set clips.  
> **사용자가 테스트 클립 중 일부만 검토할 때의 상황을 시뮬레이션한다.**

- **정의**:
    
    - 리뷰 후 정확도:
        $$
        acc(D_k) = \frac{|\text{reviewed}| + acc(\text{unreviewed}) \cdot |\text{unreviewed}|}{|D|}
        $$
    - **Review Efficiency**:
        $$
       {Efficiency} = \frac{\text{Improvement (신뢰도 기반)}}{\text{Improvement (이론적 최대)}}
        $$​
