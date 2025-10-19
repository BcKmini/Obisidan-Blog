# Chapter01 학습 가이드: 코드 중심 완전 정리

본 가이드는 Chapter01의 여섯 프로젝트(Activity1.01, Exercise1.01–1.05)를 기반으로, 시험 대비를 위한 개념/스니펫/함정/질문 포인트를 모두 아우른 요약입니다. 실제 코드와 리소스를 토대로 작성되었으며, 출제 가능성이 높은 영역을 강조합니다.

---

## 전체 로드맵

- 프로젝트 구조와 Gradle 핵심
- 매니페스트와 권한, 테마 지정
- 리소스(문자열/색상/스타일/야간 테마)
- 레이아웃(ConstraintLayout, Material TextInput, Button)
- 액티비티(코틀린) 패턴: findViewById, 클릭 리스너, Toast, 검증
- 주요 예제 스니펫: RGB 색상 생성기, WebView, 환영 메시지
- 실수/함정, 보안/UX 모범사례
- 자주 나오는 시험형 질문, 체크리스트, 자기 점검 문제

---

## 1) 안드로이드 프로젝트 구조 핵심

- `app/src/main/java/.../MainActivity.kt`: 화면 로직(코틀린)
- `app/src/main/res/layout/activity_main.xml`: 화면 배치(레이아웃)
- `app/src/main/res/values/*.xml`: 문자열/색상/스타일/테마
- `app/src/main/AndroidManifest.xml`: 앱/액티비티 선언, 권한
- `app/build.gradle`: 모듈 설정(네임스페이스, SDK, 의존성)
- `settings.gradle`: 루트 프로젝트 이름, 저장소 설정

스니펫: Gradle 기본 구조(app/build.gradle)
```groovy
android {
  namespace 'com.example.myapplication'
  compileSdk 32
  defaultConfig {
    applicationId "com.example.myapplication"
    minSdk 21
    targetSdk 32
  }
}
dependencies {
  implementation 'androidx.core:core-ktx:1.7.0'
  implementation 'com.google.android.material:material:1.7.0'
  implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
}
```

핵심 포인트
- `namespace`는 R 클래스/패키지 경로에 영향. 프로젝트마다 다름(Activity1.01만 `com.example.colors`).
- Material/ConstraintLayout 사용 시 대응 라이브러리 의존성 필요.

---

## 2) 매니페스트(Manifest)와 권한/테마

- 런처 액티비티: `intent-filter`의 `MAIN` + `LAUNCHER`
- 권한: WebView로 외부 페이지 로드시 `INTERNET` 필요(Exercise1.03)
- 테마 지정: `application` 혹은 `activity`의 `android:theme`

스니펫: INTERNET 권한과 런처 액티비티
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

메모
- Activity1.01/Exercise1.04에는 `meta-data android.app.lib_name`가 비어있는 상태로 존재. 실동작 영향 없음(네이티브 라이브러리 연계 시 사용되는 키).

---

## 3) 리소스: 문자열/색상/스타일/테마

- 문자열(strings): UI 텍스트는 가급적 리소스로 관리 → i18n 유리
- 색상(colors): primary/secondary/white/black 등 공통 색 정의
- 스타일/테마(themes): MaterialComponents 테마 상속, 커스텀 스타일로 일관성 확보
- 야간 테마(values-night): 밤 모드 전용 값 오버라이드

스니펫: 커스텀 스타일(Exercise1.05)
```xml
<style name="text_input_greeting" parent="Widget.MaterialComponents.TextInputLayout.OutlinedBox">
  <item name="android:layout_margin">8dp</item>
</style>
<style name="greeting_display" parent="@style/TextAppearance.MaterialComponents.Body1">
  <item name="android:layout_margin">8dp</item>
  <item name="android:gravity">center</item>
  <item name="android:layout_height">40dp</item>
</style>
```

스니펫: Activity1.01의 별도 테마
```xml
<style name="Theme.Colors" parent="Theme.MaterialComponents.DayNight.DarkActionBar">
  <item name="colorPrimary">@color/purple_500</item>
  <item name="colorSecondary">@color/teal_200</item>
</style>
```

시험 포인트
- `values` vs `values-night`의 역할 차이
- 문자열 리소스에서 특수문자 이스케이프(예: `#` → `\#` 또는 `\'` 사용 케이스)

---

## 4) 레이아웃: ConstraintLayout와 Material 컴포넌트

- 기본 컨테이너: `androidx.constraintlayout.widget.ConstraintLayout`
- 입력: `TextInputLayout` + `TextInputEditText`
- 버튼: `com.google.android.material.button.MaterialButton`
- 배치: `app:layout_constraintTop_toBottomOf` 등 제약으로 상하 배치

스니펫: 16진수 입력 제약(Activity1.01)
```xml
<com.google.android.material.textfield.TextInputEditText
  android:id="@+id/red_channel"
  android:inputType="textCapCharacters"
  android:digits="ABCDEFabcdef0123456789"
  android:maxLength="2"
  android:layout_width="match_parent"
  android:layout_height="wrap_content"/>
```

핵심 포인트
- XML로 입력가능 문자/길이를 제한(digits/maxLength)
- `TextInputLayout`를 감싸 힌트/에러 표기를 강화

---

## 5) 코틀린 액티비티 패턴: 이벤트/검증/피드백

공통 패턴
- 레이아웃 지정: `setContentView(R.layout.activity_main)`
- 뷰 접근: `findViewById<ViewType>(R.id.some_id)`
- 클릭 핸들러: `button.setOnClickListener { ... }`
- 문자열: 리소스 결합 `getString(R.string.some)` + 문자열 템플릿
- 피드백: `Toast.makeText(...).show()`

스니펫: 입력 읽기와 기본 검증(Exercise1.05)
```kotlin
val firstName = findViewById<TextInputEditText>(R.id.first_name)?.text.toString().trim()
val lastName  = findViewById<TextInputEditText>(R.id.last_name)?.text.toString().trim()
if (firstName.isNotEmpty() && lastName.isNotEmpty()) {
  val nameToDisplay = firstName.plus(" ").plus(lastName)
  greetingDisplay.text = "${'$'}{getString(R.string.welcome_to_the_app)} ${'$'}nameToDisplay!"
} else {
  Toast.makeText(this, getString(R.string.please_enter_a_name), Toast.LENGTH_LONG)
    .apply { setGravity(Gravity.CENTER, 0, 0); show() }
}
```

스니펫: RGB 색상 생성 로직(Activity1.01)
```kotlin
var r = findViewById<TextInputEditText>(R.id.red_channel)?.text.toString()
var g = findViewById<TextInputEditText>(R.id.green_channel)?.text.toString()
var b = findViewById<TextInputEditText>(R.id.blue_channel)?.text.toString()

if (r.isEmpty() or g.isEmpty() or b.isEmpty()) { // 논-쇼트서킷
  Toast.makeText(this, "All Values are required", Toast.LENGTH_LONG).show()
} else {
  if (r.length == 1) r = r + r
  if (g.length == 1) g = g + g
  if (b.length == 1) b = b + b
  val colorInt = Color.parseColor("#" + r + g + b)
  findViewById<TextView>(R.id.color_creator_display)?.setBackgroundColor(colorInt)
}
```

주의
- `or`는 `||`와 달리 쇼트서킷이 아님. 평가 순서/성능에 차이 가능.
- `findViewById(...)? .text.toString()` 패턴은 뷰가 null이면 `.text` 결과가 null이 되고, `toString()`이 "null" 문자열을 반환할 수 있음 → 비어있음 체크가 실패할 수 있는 잠재 버그. 안전한 접근: `findViewById<...>(id)?.text?.toString().orEmpty()`.

---

## 6) 예제별 핵심 스니펫/포인트

Activity1.01: RGB 생성기(입력 제약 + 색상 표시)
- 입력 제약: `digits`, `maxLength`, `textCapCharacters`
- 1자리 보정: `"F" → "FF"`
- 적용: `Color.parseColor("#RRGGBB")` → `TextView.setBackgroundColor`

Exercise1.03: WebView 로드(코드 생성 + 권한)
```kotlin
val webView = WebView(this)
webView.settings.javaScriptEnabled = true
setContentView(webView)
webView.loadUrl("https://www.google.com")
```
필수 권한
```xml
<uses-permission android:name="android.permission.INTERNET" />
```
보안 메모: `WebViewClient` 설정, HTTPS 강제, JS 활성화 최소화

Exercise1.05: 이름 입력 → 환영 메시지
- 리소스 문자열 조합 + 템플릿
- 중앙 Toast: `setGravity(Gravity.CENTER, 0, 0)`
- 커스텀 스타일로 일관된 여백/타이포

---

## 7) 유효성 검사/UX 모범사례

- 필드별 에러 표시: `TextInputLayout.setError("메시지")` 활용
- 입력 정규식: 16진수 `^[0-9A-Fa-f]{1,2}$`로 보강(로직/UX 이중 방어)
- 트리밍 필수: `.trim()`으로 공백만 입력 방지
- 피드백 위치: 중요한 오류는 중앙 Toast, 지속 메세지는 필드 에러/HelperText

---

## 8) WebView 보안 체크리스트

- 외부 URL 로드 시: `https://` 사용, 도메인 화이트리스트
- JS 필요 최소화: `javaScriptEnabled` 기본 OFF, 꼭 필요할 때만 ON
- 내장 브라우저 처리: `webView.webViewClient = WebViewClient()` 설정으로 외부 브라우저 전환 방지
- 파일 접근/디버그 비활성화 검토

---

## 9) 자주 나오는 시험형 질문과 답 포인트

- Q: `digits`/`maxLength`의 역할은? → XML 수준 입력 제약(허용 문자/최대 길이).
- Q: `TextInputLayout` vs `TextInputEditText`? → 레이아웃(힌트/에러/스타일 제공) vs 실제 입력 필드.
- Q: `or`와 `||` 차이? → `or`는 비트/논리 연산 함수(논-쇼트서킷), `||`는 쇼트서킷 논리연산자.
- Q: `Color.parseColor` 인자 포맷? → `#RRGGBB` 또는 `#AARRGGBB` 등.
- Q: `INTERNET` 권한이 필요한 이유? → WebView 외부 페이지 로드 등 네트워크 접근.
- Q: 문자열 리소스를 쓰는 이유? → i18n/재사용/중앙관리, 하드코딩 회피.
- Q: 야간 테마(values-night)의 용도? → 다크모드 등 시간/테마별 값 오버라이드.

---

## 10) 실수/함정 목록

- `findViewById(...)? .text.toString()` → null 시 "null" 문자열 반환 위험 → `.text?.toString().orEmpty()` 권장.
- `or` 사용으로 쇼트서킷 미적용 → `||` 기대 동작과 다를 수 있음.
- 문자열 하드코딩(예: Activity1.01의 Toast 메시지) → 리소스로 이동 필요.
- WebView에서 JS 무분별 활성화 → 보안면에서 취약점 가능.
- ConstraintLayout 제약 누락 → 뷰가 겹치거나 예상치 못한 위치.

---

## 11) 최종 체크리스트

- Gradle: Material/ConstraintLayout 의존성 추가됨?
- Manifest: 권한/테마/런처 액티비티 정확?
- Layout: `TextInputLayout`/`TextInputEditText` 구조와 제약 설정?
- Kotlin: `setOnClickListener` 내 입력 검증, 리소스 문자열 사용?
- 색상 생성/문자열 조합 로직 정확? 엣지케이스(빈 값/한 자리) 처리?
- WebView: `INTERNET` 권한, 보안 설정 검토?

---

## 12) 자기 점검 문제(간단 구현/서술)

- 구현: 세 개의 16진수 입력을 받아 `#RRGGBB`를 만든 뒤 View 배경색으로 적용하라. 1자리 입력 시 보정 규칙을 구현하라.
- 구현: `first_name`/`last_name`이 비었을 때 필드별 에러를 `TextInputLayout.setError`로 표시하라.
- 서술: `values`와 `values-night`의 차이를 설명하고, 다크모드에서 색상을 바꾸는 방법을 서술하라.
- 서술: `digits`/`maxLength`/`inputType`의 역할과 상호작용을 설명하라.
- 서술: `WebView` 사용 시 보안 고려사항 3가지를 제시하라.

---

## 13) 부록: 빠른 참조 스니펫

버튼 클릭 리스너
```kotlin
findViewById<Button>(R.id.enter_button).setOnClickListener { /* ... */ }
```

Toast(중앙 정렬)
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

WebView 기본 설정
```kotlin
val wv = WebView(this)
wv.webViewClient = WebViewClient()
wv.settings.javaScriptEnabled = true // 필요 시에만
wv.loadUrl("https://example.com")
```

