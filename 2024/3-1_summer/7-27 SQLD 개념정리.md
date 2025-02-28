<h3 id="시험범위-변경">시험범위 변경</h3>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/d600787c-0921-46a8-b07f-9bcc68cd2083/image.png" /></p>
<p><img alt="" src="https://velog.velcdn.com/images/mi_nini/post/43e052fa-2b1c-49fd-b6b5-7399aba12e3a/image.png" /></p>
<h2 id="📝1과목">📝1과목</h2>
<h2 id="📌span-stylecolorslateblue데이터-모델링의-이해span">📌<span style="color: slateblue;">데이터 모델링의 이해</span></h2>
<h2 id="데이터-모델링이란">데이터 모델링이란?</h2>
<p>: 데이터  모델링은 ‘현실  세계ʼ를  단순화하여  표현하는  기법 데이터 모델링 특징 및 목적
특징</p>
<h2 id="span-stylecolorindianred추상화span"><span style="color: indianred;">추상화</span></h2>
<p>: 현실세계, 개념을  일정한 형식으로 ‘간략하게ʼ 표현</p>
<h2 id="span-stylecolorindianred단순화span"><span style="color: indianred;">단순화</span></h2>
<p>: 현실세계를 ‘정해진 표기법ʼ으로  단순하고 쉽게 표현, 핵심에  집중 + 불필요 제거</p>
<h2 id="span-stylecolorindianred명확화span"><span style="color: indianred;">명확화</span></h2>
<p>: 불분명함(애매모호함) 을  제거하고, ‘정확하게ʼ 현상을 기술 </p>
<h2 id="목적">목적</h2>
<p>단순히 DB, 시스템  만을  구축하기  위한  것이  아닌  업무 설명, 분석, 형상화 목적도 있음 분석된  모델로 실제 DB 생성하며  개발 및 데이터 관리에도 사용</p>
<h2 id="📌span-stylecolorslateblue데이터-모델링-유의점-및-3가지-관점-및-중요-3요소-span">📌<span style="color: slateblue;">데이터 모델링 유의점 및 3가지 관점 및 중요 3요소 </span></h2>
<h2 id="span-stylecolorslateblue유의점span"><span style="color: slateblue;">유의점</span></h2>
<h2 id="span-stylecolorindianred중복duplicationspan"><span style="color: indianred;">중복(Duplication)</span></h2>
<p>: 같은  데이터가  엔티티에  중복  저장되면  안된다. </p>
<h2 id="span-stylecolorindianred비유연성inflexibilityspan"><span style="color: indianred;">비유연성(Inflexibility)</span></h2>
<p>: 애플리케이션의 ‘사소한 변경ʼ에도  데이터  모델이  수시로  변경되면  안된다.
→ 데이터 모델과 프로세스 분리해서  유연성  높여야한다. </p>
<h2 id="span-stylecolorindianred비일관성inconsistencyspan"><span style="color: indianred;">비일관성(Inconsistency)</span></h2>
<p>: 중복이  없는  경우에도  비일관성  발생  가능성  있음
→ 데이터  간의  연관 관계에 대해 명확하게  정의 </p>
<h2 id="span-stylecolorslateblue관점span"><span style="color: slateblue;">관점</span></h2>
<h2 id="span-stylecolorindianred데이터-관점-what-dataspan"><span style="color: indianred;">데이터 관점 (What, Data)</span></h2>
<p>: 어떤  데이터들이  업무와  얽혀있는지</p>
<h2 id="span-stylecolorindianred프로세스-관점-how-processspan"><span style="color: indianred;">프로세스 관점 (How, Process)</span></h2>
<p>: 업무가  실제로  처리하고  있는  일이  무엇인지</p>
<h2 id="span-stylecolorindianred데이터와-프로세스의-상관-관점-data-vs-process-intercation-span"><span style="color: indianred;">데이터와 프로세스의 상관 관점 (Data vs Process, Intercation) </span></h2>
<p>: 프로세스  흐름에  따라  데이터가  어떤  영향을  받는지</p>
<h2 id="📌중요-요소">📌중요 요소</h2>
<p>Things : 대상(Entity) 
Attribute : 속성 
Relationships : 관계</p>
<h2 id="📌모델링의-3가지-단계">📌모델링의 3가지 단계</h2>
<h2 id="span-stylecolorindianred1-개념적-데이터-모델링span"><span style="color: indianred;">1. 개념적 데이터 모델링</span></h2>
<p>: ‘전사적ʼ으로 수행, 업무  중심적이고  포괄적인  수준의  모델링(추상화 레벨 가장 높음)</p>
<h2 id="span-stylecolorindianred2-논리적-데이터-모델링span"><span style="color: indianred;">2. 논리적 데이터 모델링</span></h2>
<p>:Key, 속성, 관계들을 표현하는 단계 -&gt; 정규화 활동이 이루어 지는 단계 
:논리적모델을 대상으로 정규화 하는 것</p>
<h2 id="span-stylecolorindianred3-물리적-데이터-모델링span"><span style="color: indianred;">3. 물리적 데이터 모델링</span></h2>
<p>:실제DB를 구현할 수 있도록 성능, 가용성등 물리적 요소 고려하는 단계 </p>
<h2 id="📌데이터-스키마-단계에-따른-독립성">📌데이터 스키마 단계에 따른 독립성</h2>
<h2 id="span-stylecolorslateblue스키마란span"><span style="color: slateblue;">스키마란?</span></h2>
<p>: 테이블이  어떠한  구성으로  되어있는지, 어떤  정보를  가지고  있는지에  대한  기본적인  테이블의  구조를  정의한  것</p>
<h2 id="span-stylecolorslateblue데이터-스키마의-구조span"><span style="color: slateblue;">데이터 스키마의 구조</span></h2>
<p>| USER</p>
<h3 id="span-stylecolorindianred외부스키마span--각여러-사용자가--보는--스키마--정의--및--표현"><span style="color: indianred;">외부스키마</span> : 각(여러) 사용자가  보는  스키마  정의  및  표현</h3>
<h3 id="span-stylecolorindianred개념스키마span--모든여러x-사용자가--보는--데이터--정의--및--표현--관계를--정의하는--단계"><span style="color: indianred;">개념스키마</span> : 모든(여러X) 사용자가  보는  데이터  정의  및  표현 &amp; 관계를  정의하는  단계</h3>
<h3 id="span-stylecolorindianred내부스키마span--물리적인--저장--구조를--나타내는--단계→-저장-구조-칼럼-인덱스-정의"><span style="color: indianred;">내부스키마</span> : 물리적인  저장  구조를  나타내는  단계→ 저장 구조, 칼럼, 인덱스 정의</h3>
<h3 id="span-stylecolorindianred논리적-독립성span-개념--스키마가--변경--되어도--외부--스키마는--영향-x-외부---개념"><span style="color: indianred;">논리적 독립성</span>: 개념  스키마가  변경  되어도  외부  스키마는  영향 X 외부 - 개념</h3>
<h3 id="span-stylecolorindianred물리적-독립성span--내부--스키마가--변경--되어도--개념외부--스키마는--영향-x-외부개념"><span style="color: indianred;">물리적 독립성</span> : 내부  스키마가  변경  되어도  개념/외부  스키마는  영향 X 외부,개념</h3>
<ul>
<li>내부<h2 id="📌span-stylecolorslateblueerd-작성-순서span">📌<span style="color: slateblue;">ERD 작성 순서</span></h2>
</li>
</ul>
<ol>
<li>엔티티 도출</li>
<li>엔티티 배치</li>
<li>엔티티 관게설정</li>
<li>관계명 기입 </li>
<li>관게 참여도 기입</li>
<li>관게 필수/선택 여부 기입 </li>
</ol>
<h2 id="📌span-stylecolorslateblue엔티티란-엔티티의-특징span">📌<span style="color: slateblue;">엔티티란? 엔티티의 특징</span></h2>
<blockquote>
<p>: 업무에서  쓰이는  데이터들을  용도별로  분류한  데이터의  그룹 = 엔티티 
엔티티의 특징
업무에서 쓰이는 정보여야  함 
식별자가  있어야함
2개 이상의 인스턴스  가져야함
반드시 속성  가져야함 → 이  때  하나의 인스턴스는 2개 이상의 속성을  가짐 
→ 즉 하나의 엔티티는 2개 이상의 속성을  가짐
다른  엔티티와 1개 이상의 관계</p>
</blockquote>
<h2 id="📌span-stylecolorslateblue엔티티-분류-방법과-그에-따른-종류-span">📌<span style="color: slateblue;">엔티티 분류 방법과 그에 따른 종류 </span></h2>
<h2 id="유형-무형에-따른-분류-→-개사유-계셔유">유형, 무형에 따른 분류 → 개사유~ 계셔유~</h2>
<blockquote>
<p>유형 엔티티 : 모델링  대상이  물리적인 형태가 존재 ex) 상품, 회원 
개념 엔티티 : 모델링  대상이  형태 없음 ex) 부서, 학과
사건 엔티티 : 모델링  대상이  행위로 인해 발생하는  것 ex) 주문, 이벤트  응모 </p>
</blockquote>
<h2 id="발생-시점에-따른-분류-→-행기중-">발생 시점에 따른 분류 → 행기중 !</h2>
<blockquote>
<p>기본 엔티티
: 모델링  대상이  업무에  대해  원래 존재하는 요소 → 독립적, 자식  엔티티  가질  수 
있음
ex) 상품, 회원, 부서 
중심 엔티티
: 모델링  대상의  업무 과정 중 하나, 기본 엔티티로부터 파생, 행위 엔티티 생성 
ex) 주문, 매출, 계약
행위 엔티티
: 2개 이상의 엔티티로부터 파생 
ex) 주문  내역, 이벤트  응모  이력  등</p>
</blockquote>