<blockquote>
<h2 id="📝목차">📝목차</h2>
<p>T- he Meaning of Tensors in RNN</p>
</blockquote>
<ul>
<li>Attention Mechanisms</li>
<li>Sequence to Sequence</li>
<li>Transformer<ul>
<li>Attention is all you need!</li>
</ul>
</li>
</ul>
<hr />
<h2 id="📌span-stylecolorindianred보너스---embedding-layerspan">📌<span style="color: indianred;">보너스 - Embedding layer</span></h2>
<h3 id="embedding-in-nn">Embedding in NN</h3>
<ul>
<li>NLP 첫 레이어로 활용
Lookup Table로 구성
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/ad081114-e926-446e-b6c5-764f03bbe669/image.png" />
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/b6241ff4-8972-42f3-a459-453c03937c37/image.png" /></li>
</ul>
<blockquote>
<h2 id="공식-문서-참고">공식 문서 참고</h2>
<p>Official Docs
PyTorch: <a href="https://pytorch.org/docs/stable/generated/torch.nn.Embedding.html">https://pytorch.org/docs/stable/generated/torch.nn.Embedding.html</a> 
TensorFlow: <a href="https://www.tensorflow.org/api_docs/python/tf/keras/layers/Embedding">https://www.tensorflow.org/api_docs/python/tf/keras/layers/Embedding</a> </p>
</blockquote>
<hr />
<h2 id="📌span-stylecolorindianredrnn-tensors-의미span">📌<span style="color: indianred;">RNN Tensors 의미</span></h2>
<h2 id="텐서-tensor-의미">텐서 (Tensor) 의미</h2>
<p>사전적 의미 (온라인 위키, <a href="https://ko.wikipedia.org/wiki/%ED%85%90%EC%84%9C">https://ko.wikipedia.org/wiki/텐서</a>)
19세기에 카를 프리드리히 가우스가 곡면에 대한 미분 기하학을 만들면서 도입하였다. 기본적인 예는 내적과 선형 변환이 있으며 미분 기하학에서 자주 등장한다. 텐서는 기저를 선택하여 다차원 배열로 나타낼 수 있으며, 기저를 바꾸는 변환 법칙이 존재한다. </p>
<ul>
<li>쉽게, 3차원 벡터를 텐서로 생각하면 편리하다.
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/7c92c6f4-f315-4b4d-b021-329a4424b3e7/image.png" /><blockquote>
<p>참고 
블로그: <a href="https://rekt77.tistory.com/102">https://rekt77.tistory.com/102</a> 
유튜브: <a href="https://www.youtube.com/watch?v=m0qwxNA7IzI">https://www.youtube.com/watch?v=m0qwxNA7IzI</a> </p>
</blockquote>
</li>
</ul>
<ul>
<li>이미지(Image)에서의 텐서
흑백 이미지 -&gt; 3차원 텐서
컬러 이미지 -&gt; 4차원 텐서</li>
</ul>
<table>
<thead>
<tr>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/0b930594-5474-4a15-a4d1-5765ed0151e7/image.png" /></th>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/9ae02824-6951-49e3-b546-d9ae1709348c/image.png" /></th>
</tr>
</thead>
</table>
<ul>
<li>동영상(Video)에서의 텐서
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/f4ff36a4-6be0-4b73-86a4-5f9ed5dffb63/image.png" /></li>
</ul>
<hr />
<h2 id="tensor-in-nlp">Tensor in NLP</h2>
<p>입출력 텐서 in Fully Connected Layer</p>
<table>
<thead>
<tr>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/6ac0a352-3f7b-44f5-ab3c-41125132e4d6/image.png" /></th>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/cedbef95-4f2c-46f0-90e0-6010d478325e/image.png" /></th>
</tr>
</thead>
</table>
<hr />
<h2 id="tensor-in-nlp-1">Tensor in NLP</h2>
<ul>
<li>앞쪽 Padding 하는 경우</li>
</ul>
<table>
<thead>
<tr>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/119bf942-57f3-49aa-8f4e-c728739715ac/image.png" /></th>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/f833cd79-1801-4a9e-b600-781804b9ce42/image.png" /></th>
</tr>
</thead>
</table>
<ul>
<li>뒤쪽 Padding 하는 경우</li>
</ul>
<table>
<thead>
<tr>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/502e09b9-da62-4267-b33c-7442039b73b1/image.png" /></th>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/085b0635-d068-4a37-bac5-09f492fc62f6/image.png" /></th>
</tr>
</thead>
</table>
<hr />
<h2 id="📌span-stylecolorindianredattention-mechanismspan">📌<span style="color: indianred;">Attention Mechanism</span></h2>
<h2 id="tokenizer-및-embedding-개념">Tokenizer 및 Embedding 개념</h2>
<table>
<thead>
<tr>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/b596f2d8-41c7-4413-b5af-22938d71e4db/image.png" /></th>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/ac48a2f0-5f72-4a06-9ce8-f9d7f27e4a84/image.png" /></th>
</tr>
</thead>
<tbody><tr>
<td>한글의 경우 형태소분석 과정 추가</td>
<td></td>
</tr>
<tr>
<td>Okt.morphs(phrase, norm=False, stem=False)</td>
<td></td>
</tr>
<tr>
<td>Parse phrase to morphemes.</td>
<td></td>
</tr>
</tbody></table>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/2efc1386-92fc-4f01-b72c-b8c6debce204/image.png" /></p>
<h2 id="💻파이썬-사전dictionary-구조">💻파이썬 사전(Dictionary) 구조</h2>
<pre><code class="language-py">&gt;&gt;&gt; score = {}
&gt;&gt;&gt; score['sonic'] = 80
&gt;&gt;&gt; score['dante'] = 70
&gt;&gt;&gt; score['kim'] = 99
&gt;&gt;&gt; print(score['kim'])
99</code></pre>
<p>Query: 질의, 찾고자 하는 대상 (내가 찾고자 하는 것을 포함하는 질문)
Key: 찾을 값을 참조하는 값
Value: 저장된 데이터 (Query를 통해 찾을 값)
Dictionary: Python 자료구조 (key: value 쌍으로 이루어진 집합)</p>
<hr />
<h2 id="attention-mechanismattention-score">Attention MechanismAttention Score</h2>
<p>Softmax를 통해 Attention Distribution 계산</p>
<p>각 인코더의 Feature와 Attention 가중치를 가중합(weighted sum)하여 Attention Value 계산
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/ac8842e7-3ab6-46f7-bacf-b3a4151c0d48/image.png" /></p>
<ul>
<li>Query에 대하여 어떤 Key가 유사한지를 찾는다</li>
<li>Query와 Key의 유사도 값을 반영하여 Value 값들을 합성한다.
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/d683188c-4d0b-4e72-97e6-7cac92089904/image.png" /></li>
</ul>
<p>사전에서 질의(Query)에 대한 값을 찾는 과정</p>
<table>
<thead>
<tr>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/8751a844-11e8-4204-9175-5bf15a4de088/image.png" /></th>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/ed5e2faa-08fd-4bc7-a631-72a251ccb493/image.png" /></th>
</tr>
</thead>
</table>
<h2 id="attention-mechanism">Attention Mechanism</h2>
<ul>
<li>Attention Score 구하기
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/a96f1e2d-84a4-4172-980b-925677f1c52f/image.png" /></li>
</ul>
<h2 id="attention-mechanism-1">Attention Mechanism</h2>
<ul>
<li>Attention Score</li>
<li>Softmax를 통해 Attention Distribution 계산
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/5db93c4d-8b7f-4985-b328-51a99d65badc/image.png" /></li>
</ul>
<h2 id="attention-score">Attention Score</h2>
<ul>
<li><p>Softmax를 통해 Attention Distribution 계산</p>
</li>
<li><p>각 인코더의 Feature와 Attention 가중치를 가중합(weighted sum)하여 Attention Value 계산
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/8c20aea1-ce2c-4018-83d9-1998945ba1ba/image.png" /></p>
</li>
</ul>
<h2 id="attention-score-1">Attention Score</h2>
<ul>
<li><p>Softmax를 통해 Attention Distribution 계산</p>
</li>
<li><p>각 인코더의 Feature와 Attention 가중치를 가중합(weighted sum)하여 Attention Value 계산</p>
</li>
<li><p>Attention Value를 현재시점(t)에 연결(concatenate)
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/413f469f-dee3-43d3-8f48-c8daa40bbfb0/image.png" /></p>
</li>
</ul>
<h2 id="attention-score-2">Attention Score</h2>
<ul>
<li><p>Softmax를 통해 Attention Distribution 계산</p>
</li>
<li><p>각 인코더의 Feature와 Attention 가중치를 가중합(weighted sum)하여 Attention Value 계산</p>
</li>
<li><p>Attention Value를 현재시점(t)에 연결(concatenate)</p>
</li>
</ul>
<p><strong>- 출력층 연산의 입력이 되는 값 계산</strong>
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/50dd9131-51e9-4b2e-abd2-2529de0647c2/image.png" /></p>
<hr />
<h2 id="📌span-stylecolorindianredsequence-to-sequenceseq2seqspan">📌<span style="color: indianred;">Sequence to Sequence(seq2seq)</span></h2>
<p>Sequence to Sequence (Seq2Sec)
인공지능을 활용한 번역 모델에서 많이 사용</p>
<table>
<thead>
<tr>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/5590e43e-15b0-4f5f-87bb-069313e4cb5f/image.png" /></th>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/3341440a-0136-4a24-9789-3e605bbfbd1e/image.png" /></th>
</tr>
</thead>
<tbody><tr>
<td>- 대부분의 Attention Network: Key, Value를 동일하게 사용</td>
<td></td>
</tr>
<tr>
<td>- Seq2Sec: Encoder의 Hidden Layer들을 key, value로 사용</td>
<td></td>
</tr>
</tbody></table>
<h2 id="seq2sec-key-value-생성">Seq2Sec: Key-Value 생성</h2>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/67991d55-e15f-4549-8dda-c67f51f416aa/image.png" /></p>
<h2 id="seq2sec-query">Seq2Sec: Query</h2>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/17aaccb3-e449-4895-8c93-77f3c75850e1/image.png" /></p>
<h2 id="attention-value-계산">Attention Value 계산</h2>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/80bf8bcc-c5d8-44d8-92a1-a6739b74aa19/image.png" /></p>
<blockquote>
<h2 id="attention-신경망_seq2seq-실습">Attention 신경망_seq2seq 실습</h2>
<p><a href="https://github.com/bentrevett/pytorch-seq2seq">https://github.com/bentrevett/pytorch-seq2seq</a> </p>
</blockquote>
<hr />
<h2 id="📌span-stylecolorindianredtransformerspan">📌<span style="color: indianred;">Transformer</span></h2>
<h2 id="2016년-구글은-gnmt-google-neural-machine-translation-시스템-발표">2016년 구글은 GNMT (Google Neural Machine Translation) 시스템 발표</h2>
<table>
<thead>
<tr>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/e3c98ed6-259b-4eeb-9740-4445c9263306/image.png" /></th>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/5c88806c-6b0d-42b8-b1ac-24b3a5b23652/image.png" /></th>
</tr>
</thead>
<tbody><tr>
<td>Seq2Seq + Attention + 강화학습(Reinforce Learning)</td>
<td></td>
</tr>
<tr>
<td>&gt; 논문 링크: <a href="https://arxiv.org/pdf/1609.08144.pdf">https://arxiv.org/pdf/1609.08144.pdf</a></td>
<td></td>
</tr>
</tbody></table>
<h2 id="기계번역-성능평가metric--ppl">기계번역 성능평가(metric) – PPL</h2>
<p>PPL (Perplexity): 
확률의 역수, 헷갈리는 정도 
예측 확률이 높으면 좋음 따라서  PPL 낮을수록 좋은 모델
각 time-step별 실제 정답에 얼마나 가까운지 만 채점
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/60a4d791-63ab-4781-8f9c-0674af46da38/image.png" /></p>
<p>번역1이 잘된 번역이지만, 오히려 맞춘 개수가 많아 확률이 Hit 확률이 높은 번역2가 PPL이 낮다.
번역 품질 평가 metric으로 사용하기에는 한계점</p>
<h2 id="기계번역-성능평가metric--bleu">기계번역 성능평가(metric) – BLEU</h2>
<p>BLEU (Bi-Lingual Evaluation Understudy)
정답과 예측 문장 사이에서 일치하는 n-gram 별 precision의 가중(기하) 평균  높을수록 좋음
n-gram별 정밀도의 평균을 백분률로 나타낸 것
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/2e4becf8-b0c5-4418-bcd9-7486bb11fc4e/image.png" /></p>
<hr />
<h2 id="2017년-페이스북-fully-convolutional-seq2seq-발표">2017년 페이스북, Fully Convolutional Seq2Seq 발표</h2>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/2629d898-0f3d-49fa-b9fc-411dd6863598/image.png" /></p>
<blockquote>
<p>논문 링크: <a href="https://arxiv.org/pdf/1705.03122.pdf">https://arxiv.org/pdf/1705.03122.pdf</a> </p>
</blockquote>
<h2 id="seq2seq와-비슷한-구조-attention-기술만-적용">Seq2Seq와 비슷한 구조, Attention 기술만 적용</h2>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/5b00adeb-ce59-4e7d-ad4a-d5731bd6956f/image.png" /></p>
<blockquote>
<p>논문 링크: <a href="https://arxiv.org/pdf/1706.03762.pdf">https://arxiv.org/pdf/1706.03762.pdf</a> </p>
</blockquote>
<hr />
<h2 id="multi-head-attenttion">Multi-head Attenttion</h2>
<p>Multi-head Attenttion
좋은 검색 결과를 얻기 위한 것 --&gt; 최적의 질의 (Query)를 만드는 것
좋은 Query 만드는 방법을 학습하는 것 --&gt; Attention 학습
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/fb750ab9-bdae-4b6e-a767-9106c2325aef/image.png" /></p>
<p>만약 다양하게 할 수 있다면 좀 더 좋은 결과를 얻을 수 있을 것
Attention을 동시에 여러개 생성하여 종합 --&gt; Multi-Head Attention</p>
<h3 id="transformer">Transformer</h3>
<ul>
<li>Attention is all you need! -&gt; 논문제목 </li>
<li>CNN, RNN 사용을 배제하고, 오직 Attention Mechanism만을 사용하여 최고의 성능</li>
<li>현재 SOTA 기술에 속함 (State – of – the - Art)<blockquote>
<p>논문 링크: <a href="https://papers.nips.cc/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf">https://papers.nips.cc/paper/2017/file/3f5ee243547dee91fbd053c1c4a845aa-Paper.pdf</a> </p>
</blockquote>
</li>
</ul>
<p>모델 특징</p>
<ul>
<li>Scaled Dot-product Attention</li>
<li>Multi-head Attention이 핵심 알고리즘</li>
<li>RNN의 BPTT 없음  병렬계산 가능</li>
<li>Positional Encoding (입력 단어 위치 표시): 병렬연산 지원
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/19d1fba1-a1fa-44b9-b29c-4b4f7eb1b4bf/image.png" /></li>
</ul>
<hr />
<h2 id="📌전체적-구조_transformer">📌전체적 구조_Transformer</h2>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/8747c825-2d3c-454a-81a2-f3f7a8aac04d/image.png" /></p>
<blockquote>
<p>빨강색: 인코더 (입력, Input)
파랑색: 디코더 (출력, Output)
주황색: 인코더에서 Self-Attention이 일어나는 부분
하늘색: 디코더에서 Self-Attention이 일어나는 부분
노란색: 인코더와 디코더의 Attention이 일어나는 부분</p>
</blockquote>
<h2 id="입출력-구조">입출력 구조</h2>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/6421e10c-235b-48f1-bb64-c7d1e75c0901/image.png" /></p>
<h2 id="word-embedding">Word Embedding</h2>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/af5c44c6-6fb8-47fa-88d9-86a79c2726ed/image.png" /></p>
<h2 id="positional-encoding">Positional Encoding</h2>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/643bb2c9-bd65-46a5-b71c-2506e821ff3c/image.png" /></p>
<p>예) “I love you but not love him.”</p>
<p>앞의 love와 뒤의 love은 일반적인 임베딩만을 거쳤을 때 동일한 값을 가짐</p>
<p>Positional Encoding 이라는 주기함수에 의한 위치에 따른 다른 임베딩을 거치면 같은 단어여도 문장에서 쓰인 위치에 따라 다른 임베딩 값을 됨.</p>
<h2 id="scaled-dot-product-attention">Scaled Dot-product Attention</h2>
<table>
<thead>
<tr>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/77502ebb-5c35-44a6-af46-7a6919660fcc/image.png" /></th>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/cd1d37cf-366d-40a3-b769-72458990eaa5/image.png" /></th>
</tr>
</thead>
</table>
<h2 id="multi-head-attention">Multi-head Attention</h2>
<table>
<thead>
<tr>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/de598c13-8201-4f13-972f-3cf35cc85b87/image.png" /></th>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/50351dcc-66ae-4336-9185-9835a7b63fb1/image.png" /></th>
</tr>
</thead>
<tbody><tr>
<td>- Linear 연산(Matrix Mult) 이용해 Q, K, V 차원 감소</td>
<td></td>
</tr>
<tr>
<td>- h개의 Attention Layer를 병렬 계산</td>
<td></td>
</tr>
<tr>
<td>- 계산된 h개를 Concatenate</td>
<td></td>
</tr>
<tr>
<td>- 필요에 따라 Linear 연산을 통해 차원을 변경</td>
<td></td>
</tr>
<tr>
<td>- 병렬처리에 매우 유리한 구조</td>
<td></td>
</tr>
</tbody></table>
<p>Attention 신경망_Transformer 실습</p>
<blockquote>
<p>Github Transformer 구현
    - 독일어-영어 번역: <a href="https://github.com/hyunwoongko/transformer">https://github.com/hyunwoongko/transformer</a><br />    - 영어-한국어 번역: <a href="https://github.com/nawnoes/pytorch-transformer">https://github.com/nawnoes/pytorch-transformer</a> 
Transformer 참고 블로그<a href="https://rubikscode.net/2019/08/05/transformer-with-python-and-tensorflow-2-0-attention-layers/">https://rubikscode.net/2019/08/05/transformer-with-python-and-tensorflow-2-0-attention-layers/</a> </p>
</blockquote>