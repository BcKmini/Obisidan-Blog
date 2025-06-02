# 야생동물 행동 분류 

## 1. 비디오 내 야생동물 행동 분류 논문 조사
- 논문 제목  
  - “Animal Behavior Classification Using DeepLabCut” (IEEE GCCE 2020)  
- 저자 및 소속  
  - Shiori Fujimori, Takaaki Ishikawa, Hiroshi Watanabe (Waseda University)  
- 목적  
  - 고정식 카메라로 촬영한 영상에서 동물(논문에서는 고양이를 다룬다.)의 행동을 자동 분류  
  - 행동(앉기, 눕기, 식사, 걷기, 점프)의 실시간 모니터링을 통해 에너지 소비 및 건강 관리 지원  
- 기존 연구 한계  
  - 배경 차분(background subtraction)·프레임 차분(frame subtraction) 기반 이동 객체 검출  
    - 실내 조명 변화(햇빛·그림자)에 취약  
    - 정지된 동물은 검출 실패  
- 기여점  
  - DeepLabCut을 활용해 골격(skeletal) 정보 기반으로 동물의 관절 좌표를 정확히 추정  
  - 관절 좌표를 이용해 정적(static) 및 동적(dynamic) 행동을 분류  
  - 기존 방법 대비 높은 분류 정확도 입증  

## 2. 기반 지식 분석
- DeepLabCut (골격 기반 자세 추정)  
  - ResNet 기반 멀티헤드 포즈 추정 모델(DeeperCut)에서 파생  
  - 사전 학습된 ResNet을 전이 학습하여 소량의 라벨링 프레임만으로 각 관절 좌표(score map) 추출  
  - 고정 카메라 영상에서 다중 관절(keypoint)을 안정적으로 검출 가능  
- 정적 클래스 분류: SVM  
  - 정적 행동: 앉기(sitting), 눕기(lying down), 식사(eating)  
  - 특징(feature): 앞다리(front leg), 뒷다리(hind leg)의 관절 각도(joint angle)  
  - Support Vector Machine(SVM)으로 분류  
- 동적 클래스 분류: 이상치 검출(Outlier Detection)  
  - 동적 행동: 걷기(walking), 점프(jumping)  
  - 특징: 연속 프레임 간 수직 좌표(vertical coordinate) 변화율  
  - 이상치 탐지를 위해 OneClassSVM, IsolationForest 사용  
    - OneClassSVM: 정상 데이터를 기반으로 경계(boundary) 학습 후 음수 거리(negative distance)를 이상치로 판단  
    - IsolationForest: 이상치(frames)가 상대적으로 적다는 가정하에 트리 구조 길이(path length)를 기반으로 이상치 식별  
![[tree.png]]
## 3. 성능별 모델 정리 (활용할 수 있는 코드 확인)
### 3.1 정량적 평가 (Quantitative Results)
- 정적 클래스 분류 (Static Classes) 정확도  
  - 데이터셋: 총 1,177 프레임(1920×1080)씩 눕기, 앉기, 식사 행동별 라벨링  
  - 사용 특징:  
    - Both legs(앞·뒷다리 관절 각도 모두)  
    - Front leg(앞다리 관절 각도)  
    - Hind leg(뒷다리 관절 각도)  
  - 결과 (Table 1, p. 3)  

| 분류 상황                            | Both legs 정확도 | Front leg 정확도 | Hind leg 정확도 |
|------------------------------------|------------------|------------------|-----------------|
| 눕기 vs 앉기 (2-class)               | 100%             | 100%             | 75.5%           |
| 눕기 vs 앉기 vs 식사 (3-class)       | 93.7%            | 87.1%            | 51.3%           |

  - 분석  
    - 뒷다리 각도만 사용할 경우 정확도가 급격히 떨어짐(특히 식사 포함 시 51.3%)  
    - 앞다리 관절 각도가 눕기/앉기 구분에 큰 기여(2-class에서 100% 달성)  
    - 식사 행동과 유사 행동(눕기)의 교집합 분포가 존재하여 추가 특징 필요  

- 동적 클래스 분류 (Dynamic Classes) 정확도  
  - 비교 대상  
    1. DeepLabCut → 수직 좌표 변화율 → OneClassSVM  
    2. 배경 차분(background subtraction) → 중심 좌표 → OneClassSVM  
    3. 프레임 차분(frame subtraction) → 중심 좌표 → OneClassSVM  
  - 결과 (Table 2, p. 4)  

| 분류 방법                          | Precision | Recall | F-measure |
|----------------------------------|-----------|--------|-----------|
| DeepLabCut 기반                     | 0.714     | 0.588  | 0.645     |
| 배경 차분                            | 0.762     | 0.500  | 0.604     |
| 프레임 차분                          | 0.667     | 0.500  | 0.571     |

  - 분석  
    - DeepLabCut 기반 방법이 기존 전통 방법 대비 F-measure 6.8% 상승(배경 차분 대비), 13.0% 상승(프레임 차분 대비)  
    - 배경/프레임 차분은 그림자나 미세 동작에 취약  

- 이상치 검출 성능 비교 (OneClassSVM vs IsolationForest)  
  - 대상 비디오: Video(1)~Video(4), 각 영상에서 점프 프레임 비율 불확실 → IsolationForest 활용 장점  
  - OneClassSVM: 이상치 비율(outlier percentage)을 설정해야 함  
    - Video별 최적 F-measure (Table 4~7, p. 4)  
      - Video(1): F=0.7344 (이상치 비율 0.07)  
      - Video(2): F=0.8820 (이상치 비율 0.10)  
      - Video(3): F=0.8264 (이상치 비율 0.15)  
      - Video(4): F=0.5682 (이상치 비율 0.16)  
  - IsolationForest:  
    - Video(1): F=0.8544  
    - Video(2): F=0.8757  
    - Video(3): F=0.9404  
    - Video(4): F=0.5837  
  - 비교 (Table 9, p. 4)  

| 비디오 번호 | OneClassSVM F-measure | IsolationForest F-measure |
|-----------|-----------------------|---------------------------|
| Video(1)  | 0.7344                | 0.8544                    |
| Video(2)  | 0.8820                | 0.8757                    |
| Video(3)  | 0.8264                | 0.9404                    |
| Video(4)  | 0.5682                | 0.5837                    |

  - 분석  
    - 이상치 비율을 사전에 알기 어려운 상황에서는 IsolationForest가 더 안정적  
    - OneClassSVM은 비율 설정에 따라 성능 변동이 크므로 데이터 특성 파악 후 적용 필요  

### 3.2 정성적 평가 (Qualitative Model Selection)
- DeepLabCut 기반 접근의 장점  
  - 다양한 실내외 환경(그림자, 조명 변화)에도 관절 좌표를 안정적으로 추출  
  - 배경/프레임 차분 방법보다 장애물이나 조명 변화 영향을 덜 받음 (p. 2 Fig.1) 
  - 저장된 영상 외에도 실시간 추론 가능 (GPU 적용 시)  
- 제안 기법 한계 및 개선점  
  - 신체 일부(몸통, 머리)가 가려질 경우 관절 추적 실패 가능  
  - 정적 클래스 분류 시 식사와 눕기의 관절 각도 분포가 중첩되어 추가 특징 필요 (p. 3 Fig.3)  
	![[Fig3.png]]
  - 동적 클래스 분류에서 점프 전 준비 동작도 이상치로 감지되어 오탐 발생 가능 (p. 4)  
- 코드 활용 가능성  
  - DeepLabCut: 오픈소스 패키지로 GitHub 제공 (Python 기반)  
  - SVM: scikit-learn 등 일반 머신러닝 라이브러리로 구현 가능  
  - OneClassSVM, IsolationForest: scikit-learn 예제 다수 존재  
  - 전체 파이프라인  
    1. DeepLabCut 설정(config.yaml) → 연구 대상 종 Keypoint 설정  
    2. 라벨링 도구로 학습 데이터(frames) 수집  
    3. DeepLabCut 학습 및 추론 스크립트(pose_estimation.py 등) 작성  
    4. 추출된 관절 좌표 → 특징 계산(feature_extraction.py)  
    5. SVM/이상치 검출기 학습(training.py)  
    6. 실험 반복 및 성능 평가(evaluation.py)  

## 4. 모델의 재현 (Reproducibility)
### 4.1 데이터셋 준비
- 고정 카메라로 촬영된 영상 확보  
  - 야생동물 예시: 고양이, 기타 포유류 등 적용 가능  
  - 권장 해상도: 1920×1080 (고정)  
  - 행동별 충분한 프레임 수 확보  
    - 정적 행동: ≥1,000프레임  
    - 동적 행동: ≥30~40프레임 이상  
- 라벨링(Annotation)  
  - DeepLabCut 초기 설정  
    1. dlc_config.yaml 생성 → 연구 대상 종, 프로젝트 이름, 키포인트 수, 학습 파라미터 정의  
    2. 샘플 프레임(100~200장) 선택 후 라벨링 도구로 각 관절 위치(x, y) 지정  
  - 행동 라벨링  
    - 정적 행동(앉기, 눕기, 식사) 프레임에 해당 행동 태그 부착  
    - 동적 행동(걷기, 점프) 프레임에 해당 행동 태그 부착  

### 4.2 DeepLabCut 모델 학습 및 관절 좌표 추출
- 학습  
  1. deeplabcut.create_training_dataset(config_path) → 사전 처리(augment, crop 등)  
  2. deeplabcut.train_network(config_path) → ResNet50 또는 ResNet101 선택  
     - 학습 epochs, batch size 등 하이퍼파라미터 조정  
- 추론(Inference)  
  - deeplabcut.analyze_videos(config_path, video_list) → 각 프레임별 x, y 좌표 출력 (CSV)  
  - deeplabcut.filterpredictions(config_path, video_list) → 좌표 보정(필터링)  

### 4.3 특징(feature) 계산
- 정적 특징 (Static Features)  
  - 앞다리 관절 각도 계산  
    1. 어깨, 팔꿈치, 손목/발목 좌표를 이용해 삼각함수로 각도 산출  
```python
import numpy as np

def compute_angle(p1, p2, p3):
v1 = np.array(p1) - np.array(p2)
v2 = np.array(p3) - np.array(p2)
cos_angle = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))
angle = np.degrees(np.arccos(cos_angle))
return angle
       ```
  - 뒷다리 관절 각도 동일 계산  
  - 필요 시 머리 고개 기울임(head pitch) 각도 추가  
- 동적 특징 (Dynamic Features)  
  - 프레임 i와 i+1에서의 앞다리 발끝(y) 좌표 차이 → 수직 변화율  
```python
def compute_vertical_change(y_i, y_i1, fps):
return (y_i1 - y_i) * fps
```
  - 변화율 배열(sequence) → 시계열 데이터  

### 4.4 분류기(Classifier) 학습
1. Static 행동 분류 (SVM)  
   - 데이터셋: 정적 행동 라벨링된 프레임 → 특징 행렬(X), 행동 라벨(y)  
   - 데이터 분할: train/test = 8:2 또는 교차 검증(CV)  
   - 모델 학습  
```python
from sklearn.svm import SVC

clf = SVC(kernel='rbf', C=1.0, gamma='scale')
clf.fit(X_train, y_train)
```
   - 성능 평가: 정확도(accuracy), 혼동 행렬(confusion matrix) 계산  

2. Dynamic 행동 분류 (이상치 검출)  
   - OneClassSVM  
```python
from sklearn.svm import OneClassSVM

oc_svm = OneClassSVM(nu=0.1, kernel='rbf', gamma='scale')
oc_svm.fit(normal_feature_array)  # 정상(frames) 데이터만 사용
preds = oc_svm.predict(test_feature_array)  # -1: 이상치(jumping), 1: 정상(walking)
```
     - nu 파라미터: 예상 이상치 비율  
   - IsolationForest  
```python
from sklearn.ensemble import IsolationForest

iso_forest = IsolationForest(n_estimators=100, contamination='auto')
iso_forest.fit(feature_array)
preds = iso_forest.predict(test_feature_array)  # -1: 이상치, 1: 정상
```
     - contamination: 이상치 비율(자동 또는 수동 지정)  
   - 성능 평가: Precision, Recall, F-measure 계산  

### 4.5 종합 실험 및 결과 재현
- 실험 환경  
  - 하드웨어: GPU(CUDA) 권장, CPU만으로도 가능하나 속도 느려짐  
  - 소프트웨어: Python 3.7+, DeepLabCut v2.x 이상, scikit-learn 0.24+  
- 실험 절차  
  1. 라벨링된 데이터로 DeepLabCut 학습 완료  
  2. 테스트 비디오 → 관절 좌표 추출  
  3. 특징 계산 스크립트 실행 → 특징 행렬 확보  
  4. Static 행동 분류기(SVM) 학습 및 평가 → 정확도 확인  
  5. Dynamic 행동 이상치 검출기 학습(OneClassSVM/IsolationForest) 및 평가 → F-measure 확인  
  6. 결과 비교: Table 1, Table 2 재현 여부 확인  
- 결과 비교 포인트  
  - 정적 행동 분류 정확도(2-class, 3-class)  
  - 동적 행동 F-measure (제안 방법 vs 기존 방법)  
  - OneClassSVM vs IsolationForest 비교  
- 추가 고려사항  
  - 고정 카메라가 아닌 이동 카메라(야생 환경)일 경우: 영상 안정화(stabilization) 또는 트래킹(tracking) 추가 필요  
  - 야생동물 다양성(크기, 체형, 털 색 등) 고려한 학습 데이터 확보 중요  
  - 조명 변화, 가림(occlusion) 상황 대비 추가 키포인트(머리, 등뼈 등) 라벨링  
  - 시간적 정보(sequence) 모델(LSTM, TCN 등) 적용 시 시계열 관계 학습 가능  

