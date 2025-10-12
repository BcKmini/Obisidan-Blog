# DGIST Information and Communication Convergence Interview Simulation (30 Questions)

---

## 1. Softmax + Cross-Entropy

**Q (EN):** Why did you choose _Softmax + Cross-Entropy_ as your presentation topic?  
**A (EN):** I chose this topic because it is the fundamental mechanism behind most multi-class classification models. It connects probabilistic reasoning and optimization through Maximum Likelihood Estimation, making it both theoretically elegant and practically efficient.  
**A (KR):** 이 주제를 선택한 이유는 다중 분류 모델의 핵심 메커니즘이기 때문입니다. Softmax와 Cross-Entropy는 확률적 추론과 최적화 과정을 연결하며, 통계적으로 MLE와 동일한 구조를 가지므로 이론적으로 아름답고 실용적으로 효율적입니다.

---

## 2. Intuition of Softmax

**Q (EN):** What is the main intuition behind using Softmax?  
**A (EN):** Softmax transforms raw scores into probabilities that sum to one, allowing the model to interpret outputs as confidence levels across classes rather than independent scores.  
**A (KR):** Softmax는 모든 점수를 0~1 사이 확률로 정규화하여, 각 클래스에 대한 신뢰도를 표현할 수 있게 합니다. 즉, 단순한 점수가 아니라 “얼마나 확신하는가”를 의미합니다.

---

## 3. MLE Connection

**Q (EN):** How is minimizing Cross-Entropy equivalent to Maximum Likelihood Estimation?  
**A (EN):** Cross-Entropy measures the distance between the true label distribution and the predicted distribution. Minimizing it maximizes the likelihood of the observed data, which is the essence of MLE.  
**A (KR):** Cross-Entropy는 실제 분포와 예측 분포 간의 거리입니다. 이를 최소화하는 것은 관측된 데이터의 가능도를 최대화하는 것으로, 즉 최대우도추정(MLE)과 동일한 과정입니다.

---

## 4. MSE Problem

**Q (EN):** What happens if we use Mean Squared Error instead of Cross-Entropy?  
**A (EN):** The gradients become very small when outputs saturate near 0 or 1, causing slow learning. Cross-Entropy avoids this by keeping gradients meaningful even for extreme values.  
**A (KR):** MSE를 사용하면 출력이 0 또는 1 근처에서 기울기가 거의 0이 되어 학습이 느려집니다. Cross-Entropy는 비포화적이므로 이런 문제를 방지합니다.

---

## 5. Gradient Stability

**Q (EN):** Why does Softmax have better gradient stability than Sigmoid?  
**A (EN):** Because Softmax considers all outputs together, maintaining relative differences among classes, while Sigmoid operates independently on each neuron, leading to saturation.  
**A (KR):** Softmax는 모든 출력을 동시에 고려해 클래스 간의 상대적 차이를 유지하지만, Sigmoid는 각 뉴런을 독립적으로 처리해 포화 구간에서 기울기 소실이 발생합니다.

---

## 6. Limitations

**Q (EN):** What are the main limitations of Softmax + Cross-Entropy?  
**A (EN):** It assumes mutually exclusive classes and struggles with imbalanced data or open-set scenarios. It can also produce overconfident predictions.  
**A (KR):** 서로 배타적인 클래스만 가정하고 데이터 불균형이나 미지 클래스(open set)에 취약합니다. 또한 과도한 확신(overconfidence) 문제를 유발할 수 있습니다.

---

## 7. Physical AI Definition

**Q (EN):** What do you mean by “Physical AI”?  
**A (EN):** Physical AI refers to artificial intelligence that perceives, understands, and acts in the real physical world. It integrates sensing, reasoning, and action seamlessly.  
**A (KR):** Physical AI는 실제 물리적 환경에서 감각, 이해, 행동을 통합하는 지능형 시스템을 말합니다. 즉, 인지-판단-행동의 완전한 순환 구조를 갖춘 AI입니다.

---

## 8. Difference from Traditional AI

**Q (EN):** How is Physical AI different from traditional AI systems?  
**A (EN):** Traditional AI focuses on data processing and prediction, while Physical AI interacts with the real world, closing the loop between perception and motion.  
**A (KR):** 기존 AI는 데이터 예측에 머물지만, Physical AI는 환경과 상호작용하며 인지-행동의 피드백 루프를 완성합니다.

---

## 9. Diffusion Model Choice

**Q (EN):** Why did you choose Diffusion models for your research?  
**A (EN):** Diffusion models offer stability and superior generative quality compared to GANs. Their iterative denoising process suits motion or trajectory-based data generation.  
**A (KR):** Diffusion 모델은 GAN보다 안정적이며, 점진적 노이즈 제거 구조가 궤적 기반 데이터 생성에 적합하기 때문입니다.

---

## 10. Video Generation

**Q (EN):** Can you explain “Video Generation via Trajectory Control”?  
**A (EN):** It means generating video frames by controlling object trajectories over time. For example, generating a bird’s flight video by modeling its motion path.  
**A (KR):** 시간에 따라 객체의 이동 궤적을 제어하여 영상을 생성하는 기술입니다. 예를 들어 새의 비행 궤적을 모델링하면 비행 영상을 생성할 수 있습니다.

---

## 11. Challenges in Diffusion Planning

**Q (EN):** What are the challenges in Diffusion-based motion planning?  
**A (EN):** High computational cost, difficulty in enforcing physical constraints, and ensuring temporal consistency are major challenges.  
**A (KR):** 계산량이 많고 물리적 제약을 반영하기 어렵다는 점, 시간적 일관성을 유지해야 한다는 점이 주요 도전 과제입니다.

---

## 12. VLA Interaction

**Q (EN):** How do Vision, Language, and Action interact in your model?  
**A (EN):** Vision interprets the environment, Language provides semantic understanding, and Action executes corresponding behaviors. They are fused through shared embeddings.  
**A (KR):** Vision은 시각 인식, Language는 의미 해석, Action은 실행으로 이어지며, 이들은 공유 임베딩 공간에서 통합됩니다.

---

## 13. LangChain Role

**Q (EN):** What role does LangChain play in your project?  
**A (EN):** LangChain orchestrates multiple LLMs and APIs in a unified workflow, enabling reasoning, retrieval, and interaction with structured data.  
**A (KR):** LangChain은 여러 LLM과 API를 하나의 체인으로 연결해 추론, 검색, 데이터 연동을 자동화하는 역할을 합니다.

---

## 14. DGIST Motivation

**Q (EN):** Why did you apply to DGIST?  
**A (EN):** DGIST offers a unique interdisciplinary environment where AI, robotics, and communication systems converge, aligning perfectly with my research vision.  
**A (KR):** DGIST는 AI, 로봇, 통신이 융합된 연구 환경을 제공하며, 제가 목표로 하는 Vision-Language-Action 기반 연구와 잘 맞습니다.

---

## 15. Research Goal

**Q (EN):** What are your long-term research goals?  
**A (EN):** To develop a non-invasive deep learning framework that allows physical systems to understand and adapt to their environment intelligently.  
**A (KR):** 물리 시스템이 환경을 스스로 이해하고 적응할 수 있는 비침습적 딥러닝 프레임워크를 구축하는 것이 목표입니다.

---

## 16. YOLO Application

**Q (EN):** How did you apply YOLO in your research?  
**A (EN):** I used YOLO to detect and track bird movement from aerial videos, forming the foundation for my energy estimation model.  
**A (KR):** YOLO를 활용해 항공 영상에서 새의 움직임을 탐지·추적하여 비행 에너지 추정 모델의 기반 데이터를 확보했습니다.

---

## 17. Model Improvement

**Q (EN):** What did you do to improve your model’s performance?  
**A (EN):** I tuned hyperparameters, balanced the dataset, and used image augmentation techniques to reduce overfitting.  
**A (KR):** 하이퍼파라미터 조정, 데이터셋 균형화, 이미지 증강을 통해 과적합을 완화하고 성능을 개선했습니다.

---

## 18. Problem Solving

**Q (EN):** Tell me about a time you faced a technical challenge in your project.  
**A (EN):** While handling noisy data, I implemented a filtering algorithm to stabilize the detection results and ensure consistent tracking.  
**A (KR):** 탐지 결과가 불안정했을 때, 노이즈 필터링 알고리즘을 적용하여 안정적인 트래킹 결과를 얻었습니다.

---

## 19. Collaboration

**Q (EN):** How do you handle conflicts in team projects?  
**A (EN):** I focus on transparency—sharing data and rationale openly. We used Notion and GitHub for clear communication and version control.  
**A (KR):** 데이터와 근거를 투명하게 공유하며, Notion과 GitHub을 활용해 명확히 기록하고 협업했습니다.

---

## 20. Research Contribution

**Q (EN):** What contribution can you make to DGIST’s research community?  
**A (EN):** I can bridge computer vision and control systems, integrating perception with real-world physical actions.  
**A (KR):** 시각 인식과 제어 시스템을 융합하여 인지 기반 행동형 AI 연구에 기여할 수 있습니다.

---

## 21. Ethics in AI

**Q (EN):** What ethical concerns do you see in AI research?  
**A (EN):** The main issue is bias in training data and uncontrolled decision-making. Researchers must design transparent and explainable systems.  
**A (KR):** AI 학습 데이터의 편향과 비해석성 문제가 가장 큽니다. 연구자는 투명하고 설명 가능한 시스템을 설계해야 합니다.

---

## 22. DGIST Strength

**Q (EN):** What do you think is the strength of DGIST’s ICT program?  
**A (EN):** Its interdisciplinary curriculum that blends AI, robotics, and data science, supported by strong research infrastructure.  
**A (KR):** AI, 로봇, 데이터 과학이 융합된 교육과 우수한 연구 인프라가 DGIST의 가장 큰 장점입니다.

---

## 23. Research Impact

**Q (EN):** How do you expect your research to impact real-world applications?  
**A (EN):** It could enable adaptive control in autonomous systems and energy-efficient motion in robotics.  
**A (KR):** 자율 시스템의 적응 제어, 로봇의 에너지 효율적 동작에 기여할 수 있습니다.

---

## 24. Future Publication

**Q (EN):** Which conferences are you targeting for publication?  
**A (EN):** Primarily CVPR and ICLR, since they focus on computer vision and generative modeling—both essential for my work.  
**A (KR):** 컴퓨터 비전과 생성 모델링을 다루는 CVPR, ICLR을 목표로 하고 있습니다.

---

## 25. Leadership

**Q (EN):** Have you ever led a project or research team?  
**A (EN):** Yes, I organized a small research group focusing on AI-based bird tracking and handled both algorithm design and result analysis.  
**A (KR):** AI 기반 새 추적 연구팀을 이끌며 알고리즘 설계와 결과 분석을 담당했습니다.

---

## 26. Weakness

**Q (EN):** What is your biggest weakness as a researcher?  
**A (EN):** I tend to focus too much on implementation details, but I’m improving by allocating more time to theoretical understanding.  
**A (KR):** 세부 구현에 집중하는 경향이 있지만, 최근에는 이론적 배경을 더 깊이 공부하며 균형을 잡고 있습니다.

---

## 27. Strength

**Q (EN):** What is your greatest strength?  
**A (EN):** I combine creativity with practicality—I enjoy designing algorithms that can actually be implemented in real systems.  
**A (KR):** 창의성과 실용성을 함께 고려합니다. 실제 적용 가능한 알고리즘을 설계하는 것을 즐깁니다.

---

## 28. Stress Management

**Q (EN):** How do you handle stress during research?  
**A (EN):** I schedule regular coding and writing blocks and take short breaks. Structured time management helps me maintain focus.  
**A (KR):** 코딩과 글쓰기 시간을 일정하게 관리하고, 짧은 휴식으로 리듬을 유지합니다. 체계적 시간 관리가 집중 유지에 도움이 됩니다.

---

## 29. Advisor Collaboration

**Q (EN):** How do you plan to work with your future advisor?  
**A (EN):** I value proactive communication—regular updates, open discussion, and quick feedback loops to maintain research momentum.  
**A (KR):** 정기적인 보고와 열린 대화, 빠른 피드백 루프를 통해 지도교수님과 능동적으로 협력할 계획입니다.

---

## 30. Closing Question

**Q (EN):** Why do you believe you are a good fit for DGIST?  
**A (EN):** Because my interdisciplinary mindset and hands-on experience align with DGIST’s mission to connect AI, robotics, and communication technologies for real-world innovation.  
**A (KR):** AI·로봇·통신을 융합해 현실 문제를 해결하는 DGIST의 목표와 제 융합적 사고·실습 중심 경험이 잘 맞습니다.