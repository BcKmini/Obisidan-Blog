# Chapter01 완전 정리: 코드+개념+시험 대비 풀가이드

본 문서는 Chapter01 내 여섯 프로젝트(Activity1.01, Exercise1.01–1.05)를 기반으로, 시험 대비를 위해 필요한 모든 개념과 코드 스니펫, 보안/UX 모범사례, 자주 나오는 질문과 실수까지 총망라합니다. 실제 소스(코틀린/레이아웃/리소스/매니페스트/Gradle)를 근거로 작성되었습니다.

---

## 0. 빠른 개요(무엇을 다루나)

- 프로젝트 구조/Gradle/SDK 의미 정리
- 매니페스트: 런처/권한/테마, Android 12 `exported`/백업 규칙
- 리소스 체계: 문자열/색상/스타일/야간 테마/백업 규칙 XML
- 레이아웃: ConstraintLayout/Material TextInput/버튼/스타일 적용
- 코틀린 액티비티: 이벤트/검증/피드백/문자열 템플릿/색상 파싱
- 예제별 핵심: RGB 생성기, WebView(+권한), 환영 메시지
- 보안/UX 모범사례, 테스트 의존성, 실수/함정, 예상문제

---

## 1. 프로젝트 구조와 Gradle 핵심

- 소스 구성
  - `app/src/main/java/.../MainActivity.kt`: 화면 로직(코틀린)
  - `app/src/main/res/layout/activity_main.xml`: 레이아웃 정의
  - `app/src/main/res/values/*.xml`: 문자열/색상/테마/스타일
  - `app/src/main/res/xml/backup_rules.xml`, `data_extraction_rules.xml`: 백업/이전 규칙
  - `app/src/main/AndroidManifest.xml`: 권한/테마/액티비티/런처
  - `app/build.gradle`, `build.gradle`, `settings.gradle`: 빌드/의존성/저장소

- Gradle(app) 핵심 설정
  - `namespace`: 패키지 네임스페이스(리소스 R 클래스 소속). Activity1.01은 `com.example.colors`, 나머지는 `com.example.myapplication`.
  - `compileSdk/targetSdk/minSdk`: 컴파일/타깃/최소 지원 API 레벨(모두 32/32/21)
  - `kotlinOptions.jvmTarget = '1.8'`, `compileOptions` 1.8: 언어/바이트코드 타깃
  - 의존성 공통: `core-ktx`, `appcompat`, `material`, `constraintlayout`
  - 테스트: `junit`, `androidx.test.ext:junit`, `espresso-core`(버전은 예제별 약간 상이)

스니펫(app/build.gradle 요지)
```groovy
android {
  namespace 'com.example.myapplication'
  compileSdk 32
  defaultConfig {
    minSdk 21; targetSdk 32
  }
  kotlinOptions { jvmTarget = '1.8' }
}
dependencies {
  implementation 'com.google.android.material:material:1.7.0'
  implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
}
```

포인트
- Material/ConstraintLayout 컴포넌트를 쓰면 해당 라이브러리 의존성이 필요.
- 릴리즈 빌드에서 `minifyEnabled false` + `proguardFiles ...` 구성(기본 템플릿). 난독화/최적화는 필요 시 켜기.

---

## 2. 매니페스트: 런처/권한/테마/백업

- 런처 액티비티
  - `intent-filter`에 `MAIN` + `LAUNCHER`가 있으면 홈 화면에서 실행 가능.
- Android 12(권장 타깃 31+)의 `android:exported`
  - 외부에서 인텐트를 받을 수 있는 컴포넌트는 `exported`를 명시해야 함(예제들은 `true`).
- 권한(Exercise1.03)
  - `WebView`로 외부 URL 로드 시 `INTERNET` 권한 필요.
- 테마
  - `application` 또는 `activity`에 `android:theme`로 지정.
  - Activity1.01은 `@style/Theme.Colors`, 나머지는 `@style/Theme.MyApplication`.
- 백업/데이터 이전 규칙(Activity1.01 등)
  - `android:dataExtractionRules="@xml/data_extraction_rules"`
  - `android:fullBackupContent="@xml/backup_rules"`
  - 파일 내용은 템플릿 형태(주석 포함). API 31+에서의 동작 설명 주석 포함.

스니펫(INTERNET 권한/런처)
```xml
<uses-permission android:name="android.permission.INTERNET" />
<application android:theme="@style/Theme.MyApplication">
  <activity android:name=".MainActivity" android:exported="true">
    <intent-filter>
      <action android:name="android.intent.action.MAIN" />
      <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
  </activity>
</application>
```

참고: 일부 프로젝트의 `activity`에 다음 메타데이터가 존재
```xml
<meta-data android:name="android.app.lib_name" android:value="" />
```
실제 동작 영향 없음(네이티브 연계 시 사용되는 키; 여기서는 빈 값).

---

## 3. 리소스 체계: 문자열/색상/스타일/야간 테마/백업 XML

- 문자열(strings.xml)
  - 하드코딩 대신 리소스로 관리 → i18n/테스트/유지보수 유리.
  - 특수문자 이스케이프 주의(예: `#`/따옴표). Activity1.01의 설명 문자열 참고.
- 색상(colors.xml)
  - `purple_*`, `teal_*`, `black`, `white` 기본 구성.
- 테마/스타일(themes.xml, values-night/themes.xml)
  - 베이스: `Theme.MaterialComponents.DayNight.DarkActionBar`
  - Activity1.01: `Theme.Colors`로 별도 테마/커스텀 스타일 다수 정의
  - Exercise1.04: primary/secondary 색상 조합을 바꿔 테마 톤 변경
  - Exercise1.05: 입력/버튼/표시용 커스텀 스타일(여백/정렬/높이) 추가
- 야간 테마(values-night)
  - 다크모드 시 덮어쓸 값 정의(예: 색상/OnPrimary 등)
- 백업/데이터 이전 XML
  - `res/xml/backup_rules.xml`: 전체 백업 포함/제외 규칙 템플릿
  - `res/xml/data_extraction_rules.xml`: 클라우드 백업/디바이스 이전 규칙 템플릿

스니펫(Activity1.01의 일부 스타일)
```xml
<style name="color_input" parent="Widget.MaterialComponents.TextInputLayout.OutlinedBox">
  <item name="android:layout_margin">8dp</item>
</style>
<style name="screen_layout_margin">
  <item name="android:layout_margin">12dp</item>
</style>
```

---

## 4. 레이아웃: ConstraintLayout + Material 컴포넌트

- 컨테이너: `androidx.constraintlayout.widget.ConstraintLayout`
- 입력: `TextInputLayout` + `TextInputEditText`
- 버튼: `MaterialButton`
- 배치: `app:layout_constraintTop_toBottomOf` 등 제약으로 상하 배치
- 툴링: `tools:context=".MainActivity"`는 에디터 미리보기용(런타임 영향 X)

입력 제약(Activity1.01 예)
```xml
<com.google.android.material.textfield.TextInputEditText
  android:id="@+id/red_channel"
  android:inputType="textCapCharacters"
  android:digits="ABCDEFabcdef0123456789"
  android:maxLength="2"/>
```

포인트
- XML에서 가능한 한 입력 제약을 선적용(유효성의 1차 방어선).
- `TextInputLayout`는 힌트/에러/헬퍼 텍스트 등 UX 요소 제공.
- Constraint 누락/충돌 시 의도치 않은 배치 발생 → 각 뷰의 Top/Bottom/Start/End 제약 확인.

---

## 5. 코틀린 액티비티: 이벤트/검증/피드백/문자열/색상

공통 패턴
- 레이아웃 지정: `setContentView(R.layout.activity_main)`
- 뷰 참조: `findViewById<ViewType>(R.id.view_id)`
- 클릭 핸들러: `button.setOnClickListener { ... }`
- 문자열 결합: `getString(R.string.id)` + 템플릿 `${...}`
- 피드백: `Toast.makeText(...).show()` 혹은 스낵바/필드 에러

스니펫(Exercise1.05: 이름 입력 검증)
```kotlin
val first = findViewById<TextInputEditText>(R.id.first_name)?.text?.toString().orEmpty().trim()
val last  = findViewById<TextInputEditText>(R.id.last_name )?.text?.toString().orEmpty().trim()
if (first.isNotEmpty() && last.isNotEmpty()) {
  val full = "$first $last"
  greetingDisplay.text = "${'$'}{getString(R.string.welcome_to_the_app)} ${'$'}full!"
} else {
  Toast.makeText(this, getString(R.string.please_enter_a_name), Toast.LENGTH_LONG)
    .apply { setGravity(Gravity.CENTER, 0, 0); show() }
}
```

스니펫(Activity1.01: RGB 색상 생성)
```kotlin
var r = findViewById<TextInputEditText>(R.id.red_channel  )?.text?.toString().orEmpty()
var g = findViewById<TextInputEditText>(R.id.green_channel)?.text?.toString().orEmpty()
var b = findViewById<TextInputEditText>(R.id.blue_channel )?.text?.toString().orEmpty()

if (r.isEmpty() || g.isEmpty() || b.isEmpty()) {
  Toast.makeText(this, getString(R.string.invalid_characters_found), Toast.LENGTH_LONG).show()
} else {
  if (r.length == 1) r += r
  if (g.length == 1) g += g
  if (b.length == 1) b += b
  val color = Color.parseColor("#" + r + g + b)
  findViewById<TextView>(R.id.color_creator_display)?.setBackgroundColor(color)
}
```

주의/함정
- `or` vs `||`: 예제(활용 코드는 `or`)는 논-쇼트서킷. 일반적 조건 결합엔 `||` 권장.
- `findViewById(...)? .text.toString()`는 null일 때 "null" 문자열 위험 → `?.text?.toString().orEmpty()` 권장.
- 하드코딩 문자열(예: Activity1.01의 Toast 메시지)은 리소스로 옮기기.

---

## 6. 예제별 핵심 기능과 학습 포인트

Activity1.01: RGB 색상 생성기
- 입력 제약(XML): `digits`, `maxLength`, `textCapCharacters`
- 1자리 보정 규칙: `F` → `FF`
- 색상 파싱/적용: `Color.parseColor("#RRGGBB")` → `TextView.setBackgroundColor`
- 커스텀 스타일/테마(`Theme.Colors`)로 일관된 UI

Exercise1.01 / 1.02: 베이스라인 템플릿
- `Hello World` 수준. 이후 비교/확장을 위한 기준선.

Exercise1.03: 코드에서 WebView 생성 + INTERNET 권한
```kotlin
val webView = WebView(this)
webView.settings.javaScriptEnabled = true
setContentView(webView)
webView.loadUrl("https://www.google.com")
```
- 매니페스트: `<uses-permission android:name="android.permission.INTERNET" />`
- 보안: `webViewClient`, HTTPS, JS 최소화(아래 8장 참고)

Exercise1.04: 테마 색상 커스터마이징
- `values/themes.xml`에서 primary/secondary 바꿔 앱 톤 변경
- 기능은 유지, 룩앤필만 변경하는 연습

Exercise1.05: 이름 입력 → 환영 메시지 + 중앙 Toast
- 리소스 문자열 결합 + 템플릿
- 스타일로 여백/정렬/높이 일관화

---

## 7. UX 모범사례: 검증/피드백/접근성

- 필드별 에러: `TextInputLayout.setError("메시지")`로 즉시/지속 피드백
- 정규식 보강: 16진수 `^[0-9A-Fa-f]{1,2}$`로 로직 이중 방어
- 트리밍: `.trim()`으로 공백만 입력 방지
- 접근성: 중요 콘텐츠에 `contentDescription`(이미지), 충분한 대비/크기, 터치 타겟 48dp 이상
- 피드백 수위: 치명적 오류는 중앙 Toast 또는 다이얼로그, 경미한 안내는 스낵바/헬퍼 텍스트

---

## 8. WebView 보안 체크리스트(Exercise1.03)

- HTTPS 강제, 도메인 화이트리스트 운영
- `webView.webViewClient = WebViewClient()` 설정으로 외부 브라우저 전환 방지
- 자바스크립트는 기본 OFF, 꼭 필요할 때만 ON
- 파일 접근/디버그/컨텐츠 스킴 등 민감 설정 최소화
- 사용자 데이터 입력 받는 페이지는 추가 보안(예: CSP, 입력 검증) 고려

---

## 9. 테스트/품질

- Unit Test: `testImplementation 'junit:junit:4.13.2'`
- Instrumentation/UI Test: `androidTestImplementation 'androidx.test.ext:junit'`, `espresso-core`
- 버전 상이 시 행동 차이 가능 → 한 버전으로 통일 권장
- UI 테스트 예시(개념)
  - 버튼 클릭 후 `TextView` 텍스트/배경색 검증
  - WebView 로딩 완료 대기(에스프레소 `IdlingResource` 활용)

---

## 10. 자주 나오는 시험형 질문과 핵심 답안

- Q: `digits`/`maxLength` 역할? → 입력 허용 문자/최대 길이를 XML 수준에서 제한.
- Q: `TextInputLayout` vs `TextInputEditText`? → 래퍼(힌트/에러/스타일) vs 실제 입력 필드.
- Q: `or`와 `||` 차이? → `or`는 논-쇼트서킷(또는 비트 연산 함수), `||`는 쇼트서킷.
- Q: `Color.parseColor` 포맷? → `#RRGGBB`, `#AARRGGBB` 등.
- Q: `INTERNET` 권한이 필요한 상황? → WebView/네트워크 요청 등 외부 통신 시.
- Q: `values` vs `values-night`? → 표준 값 vs 다크모드 등 야간 전용 오버라이드.
- Q: `compileSdk/targetSdk/minSdk` 의미? → 컴파일 가능 API/동작 보장 목표/최소 지원 범위.
- Q: Android 12 `exported` 왜 필요한가? → 인텐트 수신 가능한 컴포넌트 보안/명시 요구.
- Q: 문자열을 리소스로 관리하는 이유? → i18n/재사용/테스트/유지보수.

---

## 11. 흔한 실수/함정

- `findViewById(...)? .text.toString()`가 null일 때 "null" 문자열 → `.text?.toString().orEmpty()`로 방지
- `or` 사용으로 쇼트서킷 기대 오작동 → `||` 사용 검토
- 색상 문자열 길이/문자 검증 누락 → 파싱 예외/오동작 가능
- Constraint 누락으로 레이아웃 붕괴 → 필수 제약 모두 지정
- 문자열 하드코딩 → 리소스로 이전 필요(테스트/번역성 저하)
- WebView에서 JS 과도 사용 → 보안 공격면 증가

---

## 12. 실전 체크리스트(제출 전 자가점검)

- Gradle 의존성/SDK 범위 정확? Material/ConstraintLayout 포함?
- Manifest에 런처/권한/테마/`exported` 명확?
- Layout에 입력 제약(digits/maxLength/inputType) 설정?
- Kotlin에서 입력값 `trim()`/비어있음 검사/예외 처리?
- 색상 생성/문자열 템플릿 로직 엣지케이스(빈 값/1자리/대소문자) 처리?
- WebView 권한과 보안 설정 점검?
- 문자열/스타일 분리로 일관성/국제화 대비?

---

## 13. 연습 과제(시험 대비)

- 구현: 세 16진수 입력을 받아 1자리 입력은 보정 후 `#RRGGBB`로 파싱해 `View` 배경색 적용. 잘못된 문자는 에러로 필드별 표시.
- 구현: `first_name`/`last_name`이 비면 `TextInputLayout.setError`로 필드 하단에 에러 노출, 모두 채워지면 환영 메시지 출력.
- 서술: `values-night`의 용도와 다크모드에서 색상을 바꾸는 절차 설명.
- 서술: Android 12의 `exported` 요구사항과 보안상의 의의를 설명.
- 서술: WebView 사용 시 필요한 권한과 3가지 보안 수칙 제시.

---

## 14. 부록: 빠른 참조 스니펫

버튼 클릭
```kotlin
findViewById<Button>(R.id.enter_button).setOnClickListener { /* ... */ }
```

중앙 Toast
```kotlin
Toast.makeText(this, msg, Toast.LENGTH_LONG).apply {
  setGravity(Gravity.CENTER, 0, 0)
  show()
}
```

문자열 템플릿 + 리소스
```kotlin
val msg = "${'$'}{getString(R.string.welcome_to_the_app)} ${'$'}name!"
```

색상 파싱/적용
```kotlin
val c = Color.parseColor("#" + r + g + b)
view.setBackgroundColor(c)
```

WebView 기본 보안 설정
```kotlin
val wv = WebView(this)
wv.webViewClient = WebViewClient()
wv.settings.javaScriptEnabled = true // 필요 시
wv.loadUrl("https://example.com")
```

Gradle 의존성(요지)
```groovy
implementation 'androidx.core:core-ktx:1.7.0'
implementation 'androidx.appcompat:appcompat:1.5.1'
implementation 'com.google.android.material:material:1.7.0'
implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
```

---

이 문서와 함께 다음 파일도 참고하세요:
- `Chapter01_코드_비교_리포트.md`: 각 예제의 파일별 변경사항/시사점 비교표
- `Chapter01_학습_가이드.md`: 핵심 스니펫/질문/체크리스트 위주의 간결 가이드

본 완전정리는 1장의 코드와 개념을 모두 포괄하도록 구성되어 있으며, 시험 유형이 코드/서술/보안/UX 어느 쪽이든 대비할 수 있도록 설계되었습니다.

