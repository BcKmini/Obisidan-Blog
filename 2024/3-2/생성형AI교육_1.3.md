<h1 id="📌-ai-이미지-생성ai-image-generaion이란">📌 AI 이미지 생성(AI Image Generaion)이란?</h1>
<p>인공지능의 한 분야로, 컴퓨터 알고리즘이 이미지를 자동으로 생성 또는 수정하는 기술. 주로 생성적 적대 신경망(GAN), 확산 모델(Diffusion Model), 변환기(Transformer) 등의 딥러닝 모델이 사용됨</p>
<h2 id="핵심-딥러닝-모델">핵심 딥러닝 모델</h2>
<ul>
<li>GAN : 생성자(Generator)와 판별자(Discriminator)라는 두 신경망이 서로 경쟁하며 학습하는 모델</li>
<li>Diffusion Model : 이미지를 점차적으로 노이즈화하고, 다시 노이즈를 제거해가며 깨끗한 이미지를 복원하는 모델</li>
<li>Transformer : 주의(attention) 메커니즘을 통해 텍스트 설명을 바탕으로 인관성 있는 이미지를 생성하는 모델</li>
</ul>
<h2 id="기본-딥러닝-모델">기본 딥러닝 모델</h2>
<ul>
<li>Autoencoder : 입력 데이터를 압축하고 복원하면서 주요 특징을 학습하는 모델</li>
<li>VAE(variational Autoencoder) : 데이터의 분포를 학습하여 무작위 샘플로 다양한 이미지를 생성하는 모델</li>
</ul>
<hr />
<h2 id="📌-diffusion-모델의-원리1">📌 Diffusion 모델의 원리(1)</h2>
<ul>
<li>Forward diffusion(순방향 확산)
물리학에서의 ‘확’과 유사한 방식으로 AI 모델을 학습시키는 방식,<blockquote>
<p>해당 프로세스에서는 학습용 이미지에 점차적으로 잡음(NOISE)을 추가하여, 점점 아무런 특징이 없는 노이즈로 바꿔 버림.
마치 물컵에 잉크를 한방울 떨어뜨리는 것과 유사하며, 잉크가 컵에 든 물속에서 확산되어 얼마 후면 잉크가 처음에 어디에 떨어졌는지 전혀 알 수 없게 되는 것과 비슷함사전혀 알 수 없게 되는 것과 비슷함전혀 알 수 없게 되는 것과 비슷함사전혀 알 수 없게 되는 것과 비슷함.</p>
</blockquote>
</li>
</ul>
<table>
<thead>
<tr>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/92387364-cf63-4426-812d-9c6ce1e0d9c8/image.png" /></th>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/c7c43df9-5d38-418a-b2fc-802c7535a43d/image.png" /></th>
</tr>
</thead>
</table>
<h2 id="📌-diffusion-모델의-원리2">📌 Diffusion 모델의 원리(2)</h2>
<ul>
<li>Reverse diffusion(역방향 확산)</li>
</ul>
<blockquote>
<p>이러한 확산 과정을 거꾸로 돌리는 방식으로, 실제 물컵에 떨어진 잉크를 다시 되돌릴 수 는 없지만, 컴퓨터 상에서는 가능함.
Ex) 비디오 역재생</p>
</blockquote>
<blockquote>
<p>해당 프로세스는 ‘노이즈’, 즉 잡음 상태에서 시작해서
이미지를 복구하는 방식임 하지만, 이미지 공간은 매우 고차원이기 때문에 해당 방식을 이미지 공간 내에서 진행하는 것은 굉장히 느리거나, 작동이 어려움.
Ex) 3개의 색채널이 있는 512x512 픽셀 이미지의
경우 512<em>512</em>3 = 786,432 차원 수를 가짐.</p>
</blockquote>
<table>
<thead>
<tr>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/ada6e2ac-afc2-4206-b142-393b62f784d3/image.png" /></th>
<th><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/e8cdb50d-fd5d-48de-832e-377357cc99b9/image.png" /></th>
</tr>
</thead>
</table>
<hr />
<h2 id="📌--latent-diffusion-모델ldms">📌  Latent Diffusion 모델(LDMs)</h2>
<ul>
<li><p>이러한 문제를 해결g기 위해 LDMs 가 등장했으며, 더 이상 이미지 공간에서 직접 작업을 수행g는 것이 아니라 잠재적인 공간(Latent Space)에서 이미지를 압축한 뒤 연산을 시행한는 방식</p>
</li>
<li><blockquote>
<p>잠재 공간은 이미지 공간에 비해 48배나 작아</p>
</blockquote>
</li>
<li><p>연산 속도가 훨씬 빠르고 경제적임.
LDMs에 해당g는 대표적인 인공지능 소프트웨어에는미드저니와 스테이블 디퓨전 등이 있으며, 두가지 모두 텍스트를 입력받아 이미지를 생성해주는(Text-to-Image) 모델임. (두 모델 이외에도 여러 소프트웨어가 있음.)</p>
</li>
</ul>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/7c80badb-459d-48cc-a3d1-c064dbd72522/image.png" /></p>
<h2 id="📌-ai-파운데이션-모델">📌 AI 파운데이션 모델</h2>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/0808a20e-11c8-43e8-a4a3-4cdab912034e/image.png" /></p>
<h1 id="📌-ai-이미지-생성-기술-발전-연표">📌 AI 이미지 생성 기술 발전 연표</h1>
<table>
<thead>
<tr>
<th>연도</th>
<th>주요 사건 및 발전</th>
</tr>
</thead>
<tbody><tr>
<td><strong>2014년</strong></td>
<td>- <strong>GAN (Generative Adversarial Network)</strong> 등장 (Ian Goodfellow)<br /> - 얼굴 합성, 예술적 스타일 변환 등에서 큰 주목을 받음</td>
</tr>
<tr>
<td><strong>2017~2018년</strong></td>
<td>- <strong>Transformer 모델</strong> 등장 (Vaswani et al., 2017)<br /> - NLP 분야에서 큰 성과를 보이며 텍스트-이미지 생성 모델의 기반 제공<br /> - <strong>BigGAN</strong>과 <strong>StyleGAN</strong>의 등장으로 고해상도 이미지와 스타일 조절 가능성 향상</td>
</tr>
<tr>
<td><strong>2020년</strong></td>
<td>- <strong>Diffusion Model</strong> 등장<br /> - 점진적으로 노이즈를 제거하여 자연스럽고 고해상도의 이미지를 생성<br /> - Imagen, Stable Diffusion 등 최신 모델들이 이 구조를 기반으로 발전</td>
</tr>
<tr>
<td><strong>2021년</strong></td>
<td>- <strong>LDM (Latent Diffusion Model)</strong> 등장<br /> - 연산 비용을 줄이기 위해 잠재 공간에서 노이즈 제거 방식 채택<br /> - OpenAI의 <strong>DALL-E</strong> 공개, GPT-3 기반 이미지 생성 모델로 대중적 주목</td>
</tr>
<tr>
<td><strong>2022~2023년</strong></td>
<td>- AI 이미지 생성 기술의 대중화 및 상용화<br /> - <strong>Stable Diffusion</strong>의 오픈소스 제공으로 누구나 AI 이미지 생성 가능<br /> - MidJourney, DALL-E 2, Stable Diffusion 등의 경쟁으로 산업 전반에 활용</td>
</tr>
<tr>
<td><strong>2024년</strong></td>
<td>- 주요 AI 이미지 생성 툴: <strong>IDEOGRAM</strong>, <strong>MidJourney 6.1</strong>, <strong>Stable Diffusion 3.5</strong>, <strong>Flux</strong>, <strong>imagefx</strong> 등<br /> - 사실적이고 고품질의 이미지 생성, 실제 사진과의 구별 어려움<br /> - 개인화된 콘텐츠 제작, 디지털 아트, 광고, 패션, AI 가상 피팅, 버추얼 휴먼 등 다양한 산업으로의 확대</td>
</tr>
</tbody></table>
<blockquote>
<h2 id="🎯-artificialanalysisai">🎯 artificialanalysis.ai</h2>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/a063baf6-162a-48a6-b7cd-76092015ac14/image.png" /></p>
</blockquote>
<ul>
<li>ELO SCORE (체스 레이팅 방식)기반으로 ai 모델 간 상대적 평가 진행</li>
<li>24.11 기준, 상위 AI 모델은 FLUX(pro), Midjourney(6.1v), adeogram(v2) 등이 차지하고 있음</li>
<li>사용자. 부터 직접 상대적 비교평가 방식으로. 평가 됨</li>
<li><blockquote>
<p>eloscore를 보고 품질, 생성 시간, 제작 비용(클로즈 소스인 경우) 등을 고려하여 결정</p>
</blockquote>
</li>
</ul>
<hr />
<h1 id="📌-스테이블디퓨전sd">📌 스테이블디퓨전(SD)</h1>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/1e82c7bb-b5b5-405d-8d66-e02aca2856af/image.png" /></p>
<p>: 스테이블 디퓨전의 특징</p>
<ol>
<li>내 PC만 있으면 무료로 이미지 생성이 가능함. (오픈소스)<ol start="2">
<li>WEBUI, COMFYUI 등의 작업환경을 제공함.</li>
</ol>
</li>
<li>자유도가 굉장히 높지만, 설정할 수 있는 변수(파라미터)가 굉장히 다양하고, 호환성이 높음.</li>
<li>PC의 성능에 따라 이미지 생성 속도가 결정됨.</li>
<li>다양한 버전 및 확장 프로그램, API를 지원함.</li>
<li>스테이블 디퓨전 프롬프트작성을 위한 문법이 존재함.</li>
</ol>
<h2 id="기본-패키지-다운">기본 패키지 다운</h2>
<p>  <img alt="" src="https://velog.velcdn.com/images/mi_nini/post/9196b5e4-3e74-4ec4-b121-4b25d320561e/image.png" /></p>
<hr />
<h1 id="📌-stable-diffusion-필수-용어">📌 Stable Diffusion 필수 용어</h1>
<table>
<thead>
<tr>
<th><strong>용어</strong></th>
<th><strong>설명</strong></th>
<th><strong>예시 및 권장사항</strong></th>
</tr>
</thead>
<tbody><tr>
<td><strong>Checkpoint</strong></td>
<td>이미지의 전체적인 형태를 결정하는 베이스 모델. 종류에 따라 실사, 3D, 2D 등으로 특화됨.</td>
<td>Ex) majicmix-realistic, DreamShaper. <br /> <em>적용 경로</em>: Stability Matrix &gt; Model Browser</td>
</tr>
<tr>
<td><strong>VAE</strong></td>
<td>Variational Autoencoder의 약자로, 이미지를 보정하는 기능 제공.</td>
<td>Ex) 실사: <code>vae-ft-mse-840000-ema-pruned.ckpt</code> <br /> 3D/2D: <code>kl-f8-anime2.ckpt</code></td>
</tr>
<tr>
<td><strong>LoRA</strong></td>
<td>Low-Rank Adaptation의 약어. LDM 모델을 파인튜닝하여 품질 향상.</td>
<td>Ex) AI 버추얼 모델 외형 유지를 위한 LoRA 파일 생성 및 적용</td>
</tr>
<tr>
<td><strong>Sampling Method</strong></td>
<td>이미지 생성 과정에서 알고리즘 선택. 이미지의 질과 다양성 조정.</td>
<td>Sampling Steps: 샘플링 횟수로 권장 수치는 상황에 따라 다름.</td>
</tr>
<tr>
<td><strong>Hires. Fix</strong></td>
<td>생성된 이미지를 고해상도로 보정하는 기능.</td>
<td>권장: 고해상도로 이미지 후보정 작업 필요 시 활성화.</td>
</tr>
<tr>
<td><strong>Upscaler</strong></td>
<td>이미지를 업스케일링하는 알고리즘 선택.</td>
<td>Ex) 실사 특화: R-ESRGAN 4x+ 사용. <br /> <em>적용 경로</em>: Stability Matrix &gt; models &gt; Upscaler</td>
</tr>
<tr>
<td><strong>Denoising Strength</strong></td>
<td>생성된 이미지에서 원본 이미지 변형 정도를 조절.</td>
<td>권장 수치: 0.3~0.5 (text-to-image).</td>
</tr>
<tr>
<td><strong>Batch Count</strong></td>
<td>프롬프트와 파라미터로 이미지를 몇 번 생성할지 설정.</td>
<td>권장: 필요한 횟수에 맞춰 설정.</td>
</tr>
<tr>
<td><strong>Batch Size</strong></td>
<td>한 번의 작업에서 생성할 이미지 개수.</td>
<td>권장: 일반적으로 Batch Count 조절 권장.</td>
</tr>
<tr>
<td><strong>CFG Scale</strong></td>
<td>입력 프롬프트를 얼마나 따를지 결정하는 수치.</td>
<td>권장 수치: 7~11 (높을수록 프롬프트 충실).</td>
</tr>
<tr>
<td><strong>Seed</strong></td>
<td>이미지 생성의 랜덤성을 제어하는 값. 같은 Seed를 사용하면 동일한 이미지 생성 가능.</td>
<td>권장: 재현성을 위해 고정값 설정.</td>
</tr>
</tbody></table>
<hr />
<h1 id="📌-ui-설정-업스케일러-설정-필수-확장-프로그램-정리">📌 UI 설정, 업스케일러 설정, 필수 확장 프로그램 정리</h1>
<hr />
<h3 id="1-ui-설정">(1) <strong>UI 설정</strong></h3>
<table>
<thead>
<tr>
<th><strong>설정 단계</strong></th>
<th><strong>설명</strong></th>
</tr>
</thead>
<tbody><tr>
<td><strong>Quicksettings list 수정</strong></td>
<td>- 상단 탭 우측 <strong>Settings &gt; User Interface</strong> 선택.<br />- <strong>Quicksettings list</strong>에 <code>sd_model_checkpoint</code>, <code>sd_vae</code>, <code>CLIP_stop_at_last_layers</code> 추가.</td>
</tr>
<tr>
<td><strong>설정 적용</strong></td>
<td>- <strong>Apply settings</strong> 버튼 클릭.<br />- <strong>Reload UI</strong> 버튼 클릭.</td>
</tr>
<tr>
<td><strong>효과</strong></td>
<td>Checkpoint, VAE, Clip skip 설정을 메인 화면에서 쉽게 조정 가능.</td>
</tr>
</tbody></table>
<hr />
<h3 id="2-업스케일러-설정">(2) <strong>업스케일러 설정</strong></h3>
<table>
<thead>
<tr>
<th><strong>업스케일러 이름</strong></th>
<th><strong>설명</strong></th>
<th><strong>권장 사용 사례</strong></th>
</tr>
</thead>
<tbody><tr>
<td><strong>R-ESRGAN 4x</strong></td>
<td>AI 기술이 적용된 업스케일러로, 실사 이미지 업스케일링에 특화.</td>
<td>실사형 인플루언서 이미지 제작.</td>
</tr>
<tr>
<td><strong>R-ESRGAN 4x+ Anime6B</strong></td>
<td>AI 기술이 적용된 업스케일러로, 애니메이션 이미지 업스케일링에 특화.</td>
<td>애니메이션 이미지 제작.</td>
</tr>
</tbody></table>
<hr />
<h3 id="3-필수-확장-프로그램">(3) <strong>필수 확장 프로그램</strong></h3>
<table>
<thead>
<tr>
<th><strong>확장 프로그램 이름</strong></th>
<th><strong>설명</strong></th>
<th><strong>설치 방법</strong></th>
</tr>
</thead>
<tbody><tr>
<td><strong>ControlNet</strong></td>
<td>자세 설정, 원근감, 빛 표현 등 수십 가지 커스터마이징 작업을 가능하게 하는 핵심 기능.</td>
<td><strong>Extensions &gt; Install from URL</strong>에서<br />URL: <code>https://github.com/Mikubill/sd-webui-controlnet</code> 입력 후 설치.</td>
</tr>
<tr>
<td><strong>open pose editor</strong></td>
<td>피사체의 자세를 탐지하거나 직접 지정하여 원하는 자세를 쉽게 생성 가능.</td>
<td>동일한 방식으로 설치.<br />URL: 별도 URL 필요 시 제공.</td>
</tr>
<tr>
<td><strong>Adetailer</strong></td>
<td>After+detailer로 특정 부위(손, 얼굴 등)를 후보정하여 완성도 향상.</td>
<td><strong>Extensions &gt; Install from URL</strong>에서<br />URL: <code>https://github.com/Bing-su/adetailer</code> 입력 후 설치.</td>
</tr>
</tbody></table>
<hr />
<h3 id="추가-팁-확장-프로그램-관리">추가 팁: 확장 프로그램 관리</h3>
<ol>
<li><p><strong>다양한 확장 프로그램 확인</strong>:  </p>
<ul>
<li><strong>Extensions &gt; Available &gt; Load from</strong> 클릭 시 설치 가능한 확장 프로그램 목록 확인 가능.</li>
<li>인기 확장 프로그램 무료 설치 가능.</li>
</ul>
</li>
<li><p><strong>확장 프로그램 업데이트</strong>:  </p>
<ul>
<li><strong>Installed 탭</strong> 이동 &gt; <strong>check for updates</strong> 클릭.  </li>
<li><strong>Apply and restart UI</strong> 버튼 클릭 시 WebUI 재시작과 함께 업데이트 적용.</li>
</ul>
</li>
</ol>
<hr />
<h1 id="📌-미드저니midjourney">📌 미드저니(Midjourney)</h1>
<ul>
<li><p>미드저니의 특징</p>
<ol>
<li><p>복잡한 설치 과정 없고, 사용방법이 어렵지 않다.</p>
</li>
<li><p>다양한 스타일의 고퀄리티 이미지를 쉽게 생성할 수 있음.</p>
<ol start="3">
<li>월 구독료를 지불해야하는 유료 S/W.</li>
</ol>
</li>
<li><p>디스코{ OR 웹에서 즉시 빠른 이미지 생성이 가능함. </p>
</li>
<li><p>커뮤니티 활성도가 높고, 업데이트가 지속적임.</p>
</li>
<li><p>프롬프트 작성 시 지켜야할 미{저니 문법이 존재하며, 프롬프트 당 4장의 기본 이미지가 생성됨.</p>
</li>
</ol>
</li>
</ul>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/66ccdd23-c1e4-4c90-861d-b93a0c89d4d8/image.png" /> </p>
<hr />
<h2 id="📌-미드저니-시작하기-3-스타일-프롬프트-기본-문법-사용하기">📌 미드저니 시작하기 (3) 스타일 프롬프트, 기본 문법 사용하기</h2>
<p>미드저니 기본 문법을 통해 생성할 이미지의 비율, 형태, 스타일 등을 조정할 수 있으며, 스타일, 구도, 카메라, 조명 등을 표현하는 프롬프트가 추가된다면 더 쉽고 빠르게 원하는 이미지 생성이 가능함.</p>
<ul>
<li>Ex)  3D Animation(스타일), wide angle(구도),      <pre><code> Canon EOS-1D X MARK II (카메라), 
 Cinematic Lighting(조명)  </code></pre></li>
<li>niji는 미드저니의 애니메이션 만화 그림체 특화모델</li>
</ul>
<blockquote>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/103331d7-18c1-46cc-ae2c-1508fa015b94/image.png" /></p>
</blockquote>
<blockquote>
<p>Chat-gpt 활용하기
미드저니 프롬프트 자동화 생성을 위한 GPTs를 자체 제작도 가능하지만, GPTs를 제작하기 위해서는 유료 구독이 필요하기 때문에, 기존 생성되어있는 미드저니 GPTs를 활용하는 것을 추천.
GPT메인 &gt; GPT탐색 &gt; midjourney 검색
최상단 GPTs  및 채팅 시작</p>
</blockquote>
<ul>
<li>Ex) 9:16비율로 3d 스타일의 흰색 고양이를 만들기 위한 프롬프트를 작성해줘 → 프롬프트 5개 작성 복잡하고 창의적인 프롬프트 작성 과정을 GPT를 통해 효율적으로 단축시키고 해당 프롬프트를 기반 으로 수정하여 더 고품질의 결과물을 얻는 것이 가능</li>
</ul>
<h1 id="📌-lora">📌 LoRA</h1>
<ul>
<li>(Low-Rank Adaptation): AI 모델을 나만의 스타일로 커스터마이징하기</li>
</ul>
<h3 id="lora의-개념">LoRA의 개념</h3>
<ul>
<li><ol>
<li>LoRA는 대형 AI 모델을 더 작은 데이터셋으로 빠르게 적응시킬 수 있는 효율적인 파인튜닝 기법. </li>
</ol>
</li>
<li><ol start="2">
<li>일반적인 파인튜닝은 모델의 모든 파라미터를 변경하는데 비해, LoRA는 적은 수의 파라미터만을 조정하여 모델의 성능을 효율적으로 개선할 수 있음</li>
</ol>
</li>
<li><ol start="3">
<li>AI 파운데이션 모델 별로 LoRA를 지원하는 방식과 형태가 다르고, 지원을 하지 않는 경우도 있음</li>
</ol>
</li>
</ul>
<h3 id="kohya_ss">kohya_ss</h3>
<ul>
<li><ol>
<li>주요 기능: Stable Diffusion 등의 모델 파인튜닝적은 리소스로도 맞춤형 모델을 생성이 가능함</li>
</ol>
</li>
<li><ol start="2">
<li>적용 분야: 특정 아트 스타일, 캐릭터, 인물, 배경, 제품 등</li>
</ol>
</li>
<li><ol start="3">
<li>특징: 로컬 또는 가상 환경에서 구동(GPU 성능에 영향)</li>
</ol>
</li>
</ul>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/b7e92e28-2df1-4bd6-8681-b46d88f51635/image.png" /> <img alt="" src="https://velog.velcdn.com/images/mi_nini/post/f2fbe630-1def-4d06-9805-8b1440a15976/image.png" /></p>
<h3 id="replicate">Replicate</h3>
<ul>
<li><ol>
<li>주요 기능: Flux-dev (상업적 이용이 제한된 오픈소스)기반의 파인튜닝 기능을 제공</li>
</ol>
</li>
<li><ol start="2">
<li>적용 분야: 특정 아트 스타일, 캐릭터, 인물, 배경, 제품 등</li>
</ol>
</li>
<li><ol start="3">
<li>특징: 클라우드 GPU를 사용하는 방식으로, 가장 최신 모델인 Flux 모델의 LoRA를 적은 비용으로도 제작 가능</li>
</ol>
</li>
</ul>
<blockquote>
<h2 id="🚀-추가---lora-모델-사용해보기">🚀 추가 - LoRA 모델 사용해보기</h2>
</blockquote>
<ol>
<li>Web UI(Forge) / 난이도 上<pre><code>    - 무료 제작이 가{함.
   - 버전 관리 및 기{ 통합 용이
    - PC 성{에 영향을 많이 받음</code></pre><ol start="2">
<li>Replicate(api / 유료) / 난이도 下<pre><code> - 저비용 고품질 결과물 제작 가능
 - 버전 관리 및 기{ 통합이 어려움
 - PC 성{에 영향을 받지 않음</code></pre></li>
</ol>
</li>
</ol>