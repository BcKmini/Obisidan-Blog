<blockquote>
<h2 id="📝목차">📝목차</h2>
</blockquote>
<ul>
<li>Text 처리 특징</li>
<li>단어의 의미</li>
<li>WordNet</li>
<li>TF-IDF</li>
<li>Word2Vec
Skip-gram
Glove
FastText</li>
<li>Word Embedding 응용분야</li>
</ul>
<hr />
<h2 id="span-stylecolorindianred📌text-처리-특징span"><span style="color: indianred;">📌Text 처리 특징</span></h2>
<h2 id="단어words의-특징">단어(words)의 특징</h2>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/46bf100e-37f4-466a-8a3d-efdbc8606262/image.png" /></p>
<ul>
<li>단어는 눈으로 보면…
이산적 기호 (discrete symbol)
분류적 값 (Categorical Value)
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/dadf8df0-1a9d-4867-99af-833aa69f5115/image.png" /></li>
<li>하지만 사람의 머릿속에는…
어휘는 계층적
단어 사이에도 유사성 존재
보라색은 파랑과 검정 중에서 어디에 가까운가?
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/188395e3-d8c8-4aa8-86ce-781e5cec65f0/image.png" /></li>
<li>단어의 표현
One-hot encoding ㅠㅠ</li>
<li><blockquote>
<p>One-hot encoding은 단어 집합의 크기를 벡터의 차원으로 하고, 표현하고 싶은 단어의 인덱스에 1의 값을 부여하고, 다른 인덱스에는 0을 부여하는 단어의 벡터 표현 방식
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/5eca4213-e821-4335-a0b8-4474b0f3a5a1/image.png" /></p>
</blockquote>
</li>
</ul>
<hr />
<h2 id="📌span-stylecolorindianredfeature-벡터span">📌<span style="color: indianred;">Feature 벡터</span></h2>
<ul>
<li><p>Feature
데이터셋을 잘 설명할 수 있는 특징(변수)
Feature를 통해 특정 데이터를 수치화 가능
Feature Vector: Feature를 모아서 하나의 벡터로 만든 것
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/4c7ffa06-a093-48cd-8cbd-4332bc298b0f/image.png" /></p>
</li>
<li><p>단어의 Feature Vector는 무엇인가?
단어의 의미와 연관관계를 학습할 수 있는 무언가 필요하다.</p>
</li>
</ul>
<h3 id="좋은-feature를-생성해야-하는-이유">좋은 Feature를 생성해야 하는 이유</h3>
<ul>
<li>데이터(언어, 영상, 음성 등)는 반드시 숫자로 표현해야 한다!</li>
<li>이왕이면 데이터를 잘 표현할 수 있는 숫자로 만들어야 한다!</li>
</ul>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/709480b8-c18e-4b03-b6dc-063c10135bad/image.png" /></p>
<ul>
<li>특히, 언어의 경우 다양한 난관들이 있기 때문에 특별히 주의를 기울여야 한다!</li>
</ul>
<hr />
<h2 id="📌span-stylecolorindianredword-one-hot-vectorspan">📌<span style="color: indianred;">Word one-hot vector</span></h2>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/08882648-9bc6-4d9f-8c65-e4cb1dc598eb/image.png" /></p>
<ul>
<li><p>단어를 표현하는 가장 단순한 방법
One-hot vector로 표현하면 가장 편리</p>
</li>
<li><p>Word One-hot Vector
크기는 의미 없음
하나의 1과 나머지는 0으로 구성된 n차원 벡터</p>
</li>
<li><p>단점
Very Sparse
유사성(Similarity)을 구할 수 없음</p>
</li>
</ul>
<table>
<thead>
<tr>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/8193b8d3-8de5-4158-9a9c-ab43b1fbaa29/image.png" /></th>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/b834f508-4ca6-4e47-be3a-5c969649a3d9/image.png" /></th>
</tr>
</thead>
<tbody><tr>
<td>반대로 지나간다 -&gt; -1</td>
<td></td>
</tr>
<tr>
<td>만나서 직각이 생긴다 -&gt; 0</td>
<td></td>
</tr>
<tr>
<td>같은방향으로 지나간다 -&gt; 1</td>
<td></td>
</tr>
</tbody></table>
<hr />
<hr />
<h2 id="📌span-stylecolorindianred신경망에서의-학습-원리span">📌<span style="color: indianred;">신경망에서의 학습 원리</span></h2>
<ul>
<li>인공신경망에서의 학습이란?
입력 X와 출력 Y의 관계를 학습
X의 feature 값을 추출하는 방법을 학습
중간 계층(Hidden Layer)에서 출력 Y값을 표현하기 위해 입력 X로부터 중요한 정보만을 반복적으로 추출</li>
<li>Auto Encoder -&gt; 
오토인코더(Auto Encoder)란 입력이 들어왔을 때, 해당 입력 데이터를 최대한 compression 시킨 후, compressed data를 다시 본래의 입력 형태로 복원 시키는 신경망이다.</li>
<li>데이터를 압축하는 부분을 Encoder라고 하고, 복원하는 부분을 Decoder라고 부른다.
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/315506d7-ee40-4a1c-9594-5dabdd8e4c4e/image.png" /></li>
<li>딥러닝: 단어를 연속적으로 표현하여 학습</li>
</ul>
<h3 id="deep-learning에-필요한-단어-특성">Deep Learning에 필요한 단어 특성</h3>
<ul>
<li>단어를 연속적으로 표현하여 학습하고자 함
단어를 연속적인 값들로 채울 수 있다면…
One-hot vector보다 Dense Vector를 얻을 수 있음
단어간 유사도, Feature 특성을 보다 쉽게 학습 가능
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/2be3bb02-50de-4c7b-a8b5-1c6c7d9ee34a/image.png" /></li>
</ul>
<h2 id="📌단어의-의미">📌단어의 의미</h2>
<ul>
<li>외부적으로 다르게 보일지라도,
내부적으로 다양하게 해석 가능
상호 연관성 존재
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/beb87d1d-848b-4531-8aeb-79535ff5b2bf/image.png" /></li>
</ul>
<p>다의어(多義語) , &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 동형어(同型語)</p>
<table>
<thead>
<tr>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/4779a1c1-0e6c-4534-ad33-47527e5def92/image.png" /></th>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/93931aa6-9cfd-4eb4-ac33-7a4c0e2edf74/image.png" /></th>
</tr>
</thead>
<tbody><tr>
<td>- 단어의 의미를 정확히 추출하는 데 어려움, 동형어의 경우 큰 문제….</td>
<td></td>
</tr>
<tr>
<td>해결책</td>
<td></td>
</tr>
<tr>
<td>- 주변 단어를 고려: RNN</td>
<td></td>
</tr>
<tr>
<td>- 동형어: WSD (Word Sense Disambiguation) 기법 적용</td>
<td></td>
</tr>
</tbody></table>
<p>동의어 nbsp;  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 상위어/하위어</p>
<table>
<thead>
<tr>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/28294c5a-f38c-4bf9-99b6-71f3dbbc2b0a/image.png" /></th>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/e5804517-e214-432d-b347-af9a08a72699/image.png" /></th>
</tr>
</thead>
<tbody><tr>
<td>- 단어의 다양한 구조, 관계 등은 One-hot Encoding을 통해 해결하기는 사실상 불가능하다.</td>
<td></td>
</tr>
<tr>
<td>다른 대안이 필요하다.</td>
<td></td>
</tr>
<tr>
<td>전통적 방법: WordNet, TF-IDF</td>
<td></td>
</tr>
<tr>
<td>Deep Learning 관점: Word2Vec</td>
<td></td>
</tr>
<tr>
<td>---</td>
<td></td>
</tr>
<tr>
<td>## 📌<span style="color: indianred;">WordNet이란?</span></td>
<td></td>
</tr>
<tr>
<td>### <a href="https://velog.velcdn.com/images/mi_nini/post/05564ba0-07cd-4102-8ee7-1ee30fc2525e/image.png">WordNet</a></td>
<td></td>
</tr>
<tr>
<td>- 어휘분류사전 (시소러스, Thesaurus)</td>
<td></td>
</tr>
<tr>
<td>- 프린스턴대학 George Artitage Miller 교수 주도하에 1985년부터 만들고 있는 사전</td>
<td></td>
</tr>
<tr>
<td>- 상위어, 하위어, 동의어 집합을 구축: Directed Acyclic Graph (유방향 비순환 그래프)</td>
<td></td>
</tr>
</tbody></table>
<table>
<thead>
<tr>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/8fb27586-1183-4321-96b8-3341231568e3/image.png" /></th>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/687f7c0e-1f83-4a2a-95fc-5fad5c88f69b/image.png" /></th>
</tr>
</thead>
</table>
<h3 id="자연어처리에서-wordnet-활용">자연어처리에서 WordNet 활용</h3>
<table>
<thead>
<tr>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/5d3823cc-11c9-401d-82ad-1013e099df3c/image.png" /></th>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/f5004dea-f3de-460a-9c66-e6aa51836754/image.png" /></th>
</tr>
</thead>
<tbody><tr>
<td>- 단어 사이의 거리(Distance)를 구할 수 있다.</td>
<td></td>
</tr>
<tr>
<td>- 두 단어의 유사도를 구할 수 있다.</td>
<td></td>
</tr>
<tr>
<td>𝑠𝑖𝑚𝑖𝑙𝑎𝑟𝑖𝑡𝑦(𝑤, 𝑤^′ )=−log⁡〖𝑑𝑖𝑠𝑡𝑎𝑛𝑐𝑒(𝑤, 𝑤^′)〗</td>
<td></td>
</tr>
</tbody></table>
<ul>
<li>(Training Set 없이도 유사도를
구할 수 있다는 것은 매력적)</li>
</ul>
<h3 id="wordnet의-장단점">WordNet의 장단점</h3>
<ul>
<li><p>장점
단어간 계층구조 파악 가능
동의어 집합 찾을 수 있음
단어 사이의 유사도 계산 가능</p>
</li>
<li><p>단점
사전 작성자(사람)의 주관적 판단이 개입될 수 있음
일반 도메인(General Domain)에만 적용 가능
특정 도메인(예: 게임, 코딩, 여행)에서 성능이 안 좋을 수 있음.</p>
</li>
<li><p>해결책: 고전적 Word Embedding인 TF-IDF 방식 등장</p>
</li>
</ul>
<hr />
<h2 id="📌span-stylecolorindianredtf-idfspan">📌<span style="color: indianred;">TF-IDF</span></h2>
<ul>
<li><p>TF-IDF
Term Frequency – Inverse Document Frequency의 약어
사전 기반 방식이 특정 도메인에서 작동하지 않는 상황을 극복하기 위한 하나의 방법
어떤 단어(w)가 문서(d)에서 얼마나 중요한지를 나타내는 수치</p>
</li>
<li><p>TF (Term Frequency)
단어 w가 문서 d에 출현한 횟수
자주 등장하면 중요하다고 가정
하지만 the/a/an/is 와 같은 단어는 
중요하지 않아도 많이 등장</p>
</li>
<li><p>IDF (Inverse Document Frequency)
단어 w가 전체 문서에서 등장한 횟수의 역수
값이 클수록 대부분의 문서에서 많이 쓰이는 단어</p>
</li>
</ul>
<p>(수학 연산자의 특성)</p>
<ul>
<li>+와 X의 차이 -&gt; X는 비례성이 있다. 식을 생각해보기.<br /><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/c29616fb-19b1-431c-b06b-626f93914717/image.png" /></li>
</ul>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/cd953e3a-b37b-4060-b72e-6457066e97aa/image.png" /></p>
<h3 id="tf-idf-자연어처리에서-활용">TF-IDF: 자연어처리에서 활용</h3>
<ul>
<li>문서에서 단어 W가 얼마나 중요한지를 수치화</li>
<li>문서간, 혹은 단어간 유사도를 구할 수 있을지도…</li>
<li>각 문서에서의 중요도를 feature vector로 고려</li>
</ul>
<table>
<thead>
<tr>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/72b10889-a5ee-4aef-b051-2ad4189db775/image.png" /></th>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/a357b73d-fd1f-4da9-9845-dc8a60eabe28/image.png" /></th>
</tr>
</thead>
<tbody><tr>
<td>벡터들을 가지고 k-means를 돌릴 수 있다.</td>
<td></td>
</tr>
<tr>
<td>distancd -&gt; 유사도의 역수</td>
<td></td>
</tr>
</tbody></table>
<h3 id="유사한-개념-동시출현빈도">유사한 개념… 동시출현빈도</h3>
<ul>
<li><p>동시출현빈도 (Co-occurrence Frequency)</p>
</li>
<li><p>함께 등장하는 단어를 이용하여 Feature Vector 구성</p>
</li>
<li><p>가정
의미가 비슷하면 쓰임새도 비슷
쓰임새가 비슷하면 비슷한 문장에 등장
그러므로 함께 나타나는 단어들은 유사할 것</p>
</li>
<li><p>일반적으로 Window를 사용함
Context windowing 수행
Window size는 Hyper-parameter
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/c5bdf66b-4ba8-49e6-a8a8-e0292985206e/image.png" />
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/1e8bf980-3f0c-4930-9b97-e0f34b6d592d/image.png" /></p>
<h3 id="아직도-해결되지-않은-문제들">아직도 해결되지 않은 문제들</h3>
</li>
<li><p>사전방식에 비해 도메인이 특화된 것을 잘 표현 가능</p>
</li>
<li><p>Feature로 선택하는 문서, 단어도 어차피 Hyper--parameter</p>
</li>
<li><p>Hyper--parameter -&gt; 학습을 할 때 컴퓨터 스스로 X 사람이 지정해줘야 함 </p>
</li>
<li><p>여전히 Sparse Matrix</p>
</li>
</ul>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/7db10973-81f7-40e4-a7d3-3ee10e2477cd/image.png" /></p>
<ul>
<li>해결책: Deep Learning을 지원할 수 있는 Feature Vector를 만들자!</li>
</ul>
<hr />
<h2 id="📌span-stylecolorindianredword2vecspan">📌<span style="color: indianred;">Word2Vec</span></h2>
<ul>
<li>Insight
Context Window 주변에 나타나는 단어일수록 비슷한 벡터를 가질 것이다.
문장의 문맥에 따라 정해지는 것은 아님  window size에 따라 다른 의미도 가능</li>
<li>Strategy
주변 단어를 예측하는 과정에서 정보 압축
예측 값 𝑦 ̂ 을 위해 필요한 정보만 압축
Dense Vector를 얻을 수 있음
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/4ff6a5e3-8720-4255-8615-506300b67944/image.png" /></li>
</ul>
<h3 id="📌skip-gram">📌Skip-gram</h3>
<ul>
<li>중심 단어로부터 좌,우 거리에 있는 단어를 추출</li>
</ul>
<table>
<thead>
<tr>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/a9cd8107-92b0-410a-bc03-bafd0bc18f07/image.png" /></th>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/eb0dba1e-b532-4577-89ee-ea9dce629065/image.png" /></th>
</tr>
</thead>
</table>
<h4 id="skip-gram-아키텍처">Skip-gram 아키텍처</h4>
<ul>
<li>장점: 직관적이고 이해하기 쉽다.</li>
<li>단점: 출현빈도가 적을 경우 벡터가 정확하지 않을 수 있다.
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/0f6e489c-494a-4ee9-a9a6-5c12d369b07f/image.png" />
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/80ca7aa1-edd4-48f9-9f89-f06528199d29/image.png" /></li>
</ul>
<hr />
<h2 id="📌span-stylecolorindianredglovespan">📌<span style="color: indianred;">GloVe</span></h2>
<ul>
<li>GloVe
Global Vectors for Word representation
skip-gram이 window를 반복적으로 이동하면서 단어를 예측하도록 학습하는 반면
GloVe는 window 내에 있는 단어의 출현빈도를 예측하도록 학습</li>
</ul>
<p>-&gt; 예측하도록 학습시킴</p>
<ul>
<li>장점: 빠르다. 출현빈도 적은 단어도 비교적 잘 처리</li>
</ul>
<table>
<thead>
<tr>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/6e71322e-c94e-4e0c-b498-0c9ae70914db/image.png" /></th>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/4207d001-0bef-402b-809b-6fc191903f01/image.png" /></th>
</tr>
</thead>
<tbody><tr>
<td><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/143f2ba3-107d-46b2-8b58-ab6ca1da563b/image.png" /></td>
<td></td>
</tr>
</tbody></table>
<hr />
<hr />
<h2 id="📌span-stylecolorindianredfasttext">📌<span style="color: indianred;">FastText</h2>
</span>

<h4 id="skip-gram의-업그레이드-버전">Skip-gram의 업그레이드 버전</h4>
<ul>
<li>기존 skip-gram은 OoV (Out of Vocabulary) 대응이 어려움</li>
<li>단어를 subword로 분할</li>
<li>Skip-gram을 이용하여 embedding을 수행하고 sub-word에 대한 embedding vector에 주변 단어의 context vector를 곱한 이후 더한다.</li>
<li>이 값이 최대화 되도록 학습</li>
<li>최종적으로 각 subword에 대한 embedding vecto의 합이 word embedding vector
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/52ee5f22-1cd3-41b8-9d20-be20e499d6cd/image.png" /></li>
</ul>
<hr />
<h2 id="📌span-stylecolorindianredword-embedding-응용분야-span">📌<span style="color: indianred;">Word Embedding 응용분야 </span></h2>
<h4 id="응용분야-1-자연어-처리-natural-language-processing">응용분야 1. 자연어 처리 (Natural Language Processing)</h4>
<ul>
<li>쳇봇, 번역, 요약…</li>
<li>Word Embedding은 DNN에 입력하기 위한 중간단계</li>
<li>Word Embedding을 최종 목표 모델로 사용하기에는 부족</li>
<li>자연어 처리에서는 최초 입력 Linear Layer에 포함되는 경우도 많음</li>
<li><ul>
<li>Word Embedding을 수행하지 않고 One-hot Vector로 입력하는 것도 가능</li>
</ul>
</li>
<li><ul>
<li>첫번째 Linear Layer에 Word Embedding Layer를 포함하는 방법도 가능</li>
</ul>
</li>
<li>Dataset이 적을 경우 대규모로 훈련된(Pre-trained) 모델을 Tunning 하기 위해 적용 가능</li>
</ul>
<h4 id="응용분야-2-추천시스템">응용분야 2. 추천시스템</h4>
<ul>
<li>다양한 상품의 Event(클릭, 조회 등)Sequence를 파악할 수 있는 경우,</li>
<li><ul>
<li>Event Sequence를 단어로 가정하고 Embedding 가능</li>
</ul>
</li>
<li>예) 클릭 순서 (Click event history)에 따른 Embedding</li>
</ul>
<table>
<thead>
<tr>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/e9445b28-4787-4e4b-ba71-8db6bd2e4bcd/image.png" /></th>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/3b927383-5960-4db1-aa36-c4da0f44c4bf/image.png" /></th>
</tr>
</thead>
</table>
<hr />
<blockquote>
<h3 id="코드참고-">코드참고 :</h3>
</blockquote>
<h3 id="github---6주차729"><a href="https://github.com/BcKmini/Ai_Python">Github</a> - 6주차/7.29~</h3>