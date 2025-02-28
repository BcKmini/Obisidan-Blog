<p>하하.. 공모전준비르 하며 여러가지의 자료들과 검색을 해본거같다. 내가 생각한 제일 큰 문제는 내가 찾고 있는 많은 데이터들을 가져오는것이였다. 많은 데이터와 그에 맞는 레벨링을 해야하기에 여러가지의 자료들을 찾아봤고 딱 알맞는 자료를 찾았다. 그것은 ..바로바로 <a href="https://roboflow.com/">roboflow</a>이다. roboflow는 사람들이 컴퓨터 비전에서 여러가지 모델을 돌릴때 사용 할 수 있는 이미지데이터가 수없이 많았다. 나는 그중에서 -&gt; <a href="https://universe.roboflow.com/keio-dba-team/crowdhuman-nur7g/dataset/3">Data</a> 이것을 사용해서 YOLOv8 모델로 학습을 진행하려고 한다. </p>
<hr />
<p>모델훈련에 제일 중요한것은 시간이 넉넉치 않기에 내 로컬PC환경에서 모델훈련을 해야할까, 다른 브라우저 내에서 돌려야 할가에 대한 많은 고민을 했다. 
우선 내 컴퓨터 환경은 </p>
<ul>
<li>CPU - AMD Ryzen 5 3500x 6-core</li>
<li>RAM - 16gb</li>
<li>GPU - GTX 1660 SUPER</li>
</ul>
<p>사양이다. 항상 작업을 내 로컬에서 vscode로 작업을 했던터라 로컬이 편할거같아 내 GPU를 사용해서 돌리기 위해 인터넷에 검색을 해봤다... 그중에 제일 자주 사용하는거는 cuda를 설치해 여러가지 내 컴퓨터환경 버전에 맞게 설치해 진행하는것이였다. 
Cuda 사용법 
<a href="https://velog.io/@mactto3487/%EB%94%A5%EB%9F%AC%EB%8B%9D-GPU-%ED%99%98%EA%B2%BD-%EA%B5%AC%EC%84%B1%ED%95%98%EA%B8%B0">참고자료 1</a>
<a href="https://comgenie.tistory.com/35">참고자료 2</a>
<a href="https://80000coding.oopy.io/d8131e92-bde9-4526-a604-217ef31d5a86">참고자료 3</a>
난... 12시간이상 시간을 쏟앗지만...실패했다. 다시 실행해보고 설치해봐도 오류가 나는것을 잡을 수가 없어.. 포기했다. 난.. 그래서 찾은 방법이 저번 Dataset을 준비했을때 데이터를 나는 로컬에 받아서 그 zip파일을 갖고 모델 데이터셋을 나눴었다. (8:1:1)
하지만 내 로컬에서 돌리지도 않을거고... 내 ssd, HDD만 잡아 먹는거같아서 API를 사용해서 다운받아서 그대로 훈련시키는 방법으로 바꿧다. </p>
<hr />
<p><a href="https://colab.research.google.com/">Colab</a>
우선 나는 Colab을 적극적으로 사용했다.
구글 드라이브를 적극적으로 사용하고 있었고 (100GB용량으로) 코렙으로 실습을 했던 대학교 수업 경험도 있어 Python으로 작업할때 쉽게 작성하기 쉬워 Colab을 선택했다. 또, Colab 자체 내부에서는 T4 Gpu를 빌려주어 그걸 적극활용한다면 내가 예상했던 훈련시간에 반의 반 이상 시간이 줄것이라고 예상했다. 아까 위에서 말한 roboflow에 내가원한 API를 가져와 실행해서 약 17번의 훈련을 마쳤다.. 이제 함수를 사용해서 캠에 연결해 내 모델링에 결과를 봐볼 차례다.. </p>
<hr />
<h3 id="코드참고--">코드참고 -&gt;</h3>
<p><a href="https://github.com/BcKmini/OPENSWCompetition">https://github.com/BcKmini/OPENSWCompetition</a></p>