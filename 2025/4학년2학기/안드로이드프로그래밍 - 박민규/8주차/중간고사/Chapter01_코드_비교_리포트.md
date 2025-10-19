# Chapter01 코드 비교 리포트 (Activity1.01 vs Exercise1.01–1.05)

본 문서는 Chapter01 하위 폴더의 여섯 개 안드로이드 프로젝트(Activity1.01, Exercise1.01, Exercise1.02, Exercise1.03, Exercise1.04, Exercise1.05)를 대상으로, 어떤 파일에서 어떤 코드가 추가·변경되었는지와 그 시사점을 세세하게 정리한 비교 보고서입니다. 비교 범위는 다음과 같습니다.

- Kotlin: `MainActivity.kt`
- 레이아웃: `res/layout/activity_main.xml`
- 리소스: `res/values/strings.xml`, `res/values/themes.xml`, `res/values-night/themes.xml`, `res/values/colors.xml`
- 매니페스트: `AndroidManifest.xml`
- Gradle: `app/build.gradle`, `settings.gradle`

---

## 전체 개요

- Activity1.01: 입력값을 받아 RGB 색상을 생성해 화면에 표시하는 예제. Material TextInput과 검증 로직, 커스텀 스타일을 적극 활용.
- Exercise1.01: 기본 템플릿(Hello World) 수준. 비교의 기준선(baseline).
- Exercise1.02: Exercise1.01와 사실상 동일(코드/레이아웃/리소스 차이 거의 없음).
- Exercise1.03: `WebView`를 코드로 생성하여 웹 페이지를 로드. `INTERNET` 권한 추가.
- Exercise1.04: 테마 색상(primary/secondary) 커스터마이징 중심. 코드/레이아웃은 기본 수준.
- Exercise1.05: 이름 입력 후 환영 문구를 표시. 유효성 검사와 `Toast` 위치 지정, 문자열 리소스/스타일 활용.

---

## 프로젝트별 상세 비교

### 1) Activity1.01 (색상 생성기)

- 패키지/네임스페이스
  - `app/build.gradle`: `namespace 'com.example.colors'`
  - `AndroidManifest.xml`: `android:label="@string/app_name"`, `android:theme="@style/Theme.Colors"`

- Kotlin: `app/src/main/java/com/example/colors/MainActivity.kt`
  - 핵심 코드 요약
    - 버튼 클릭 시 세 개의 16진수 채널 입력값(`red_channel`, `green_channel`, `blue_channel`)을 읽어 RGB 색상 생성.
    - 유효성 검사: 하나라도 비어 있으면 `Toast`로 오류 메시지("All Values are required") 표시.
    - 한 자리 입력 보정: 길이가 1이면 같은 문자를 한 번 더 붙여 2자리를 맞춤(예: `F` → `FF`).
    - 색상 생성: 세 채널 문자열을 이어 붙인 후 `Color.parseColor("#..." )`로 파싱, `TextView` 배경색(`setBackgroundColor`) 설정.
  - 사용 주요 API/패턴
    - `TextInputEditText`에서 `.text.toString()`으로 문자열 추출, `Color.parseColor`, `Toast.makeText`, `setOnClickListener`.
    - 논리 연산자 사용: `isEmpty()` 체크를 `or`로 연결(지연 평가가 아닌 점에 유의).
  - 시사점
    - XML 속성으로 입력 허용 문자/길이를 제한하고, Kotlin에서 추가 보정(1자리 → 2자리)까지 수행하는 다층 검증 패턴.
    - View의 배경색 변경으로 즉각적인 피드백을 제공.
    - 실제 앱에서는 각 필드별 오류를 `TextInputLayout.setError(...)`로 표시하는 UX 개선을 고려 가능.

- 레이아웃: `app/src/main/res/layout/activity_main.xml`
  - 주요 View 및 속성
    - `TextInputLayout` + `TextInputEditText` 3개(R/G/B)
      - `android:digits="ABCDEFabcdef0123456789"`로 입력 가능한 문자를 16진수로 제한.
      - `android:inputType="textCapCharacters"`로 대문자 입력 유도.
      - `android:maxLength="2"`로 최대 2자리 제한.
    - `MaterialButton`(`@+id/color_creator_button`): 색상 생성 트리거 버튼.
    - `TextView`(`@+id/color_creator_display`): 생성된 색상을 배경색으로 표시.
    - 화면 여백/타이포 스타일: 커스텀 스타일(`@style/screen_layout_margin`, `@style/color_*`) 적용.
  - 시사점
    - Material Components(`TextInputLayout`, `MaterialButton`) 기반 입력/액션 UI 구성.
    - XML 레벨에서의 강력한 입력 제약과 스타일 일관성 확보.

- 리소스: `res/values/strings.xml`
  - 다수의 문자열 추가: 타이틀, 설명, 채널 라벨, 버튼 텍스트, 디스플레이 라벨 등.
  - 특수문자 이스케이프: `'#'` 등 특수문자는 `\'` 사용으로 표시.

- 테마/스타일: `res/values/themes.xml`, `res/values-night/themes.xml`
  - 앱 테마 이름: `Theme.Colors` (기본 템플릿의 `Theme.MyApplication`와 다름).
  - 커스텀 스타일 추가
    - `color_creator_title`, `color_creator_description`, `color_input`, `color_button`, `color_display`, `screen_layout_margin` 등.
  - 시사점
    - 화면별/컴포넌트별 스타일 정의로 UI 일관성 확보.

- Gradle: `app/build.gradle`
  - 의존성 버전은 비교군과 유사하나, `androidTestImplementation`이 최신(예: `junit:1.1.5`, `espresso:3.5.1`).

---

### 2) Exercise1.01 (베이스라인 템플릿)

- Kotlin: `app/src/main/java/com/example/myapplication/MainActivity.kt`
  - 기본 형태: `setContentView(R.layout.activity_main)` 외 로직 없음.

- 레이아웃: `res/layout/activity_main.xml`
  - 기본 `TextView`로 "Hello World!" 표시.

- 리소스/테마
  - `strings.xml`: 앱 이름만 정의.
  - `themes.xml`: `Theme.MyApplication` 기본 설정.

- Gradle/매니페스트
  - 네임스페이스: `com.example.myapplication`.
  - 매니페스트는 기본 런처 액티비티만 선언.

- 시사점
  - 이후 예제들과 비교할 "기준선(baseline)" 역할.

---

### 3) Exercise1.02 (베이스라인 반복)

- 전반적으로 Exercise1.01와 동일
  - `MainActivity.kt`, `activity_main.xml`, `strings.xml`, `themes.xml`, `AndroidManifest.xml`에서 의미있는 차이 없음.
  - Gradle 설정/버전도 동일 계열.

- 시사점
  - 학습 단계 진입 전 템플릿 재확인 혹은 환경 복제 목적의 단계로 해석 가능.

---

### 4) Exercise1.03 (코드로 생성한 WebView + 권한)

- Kotlin: `app/src/main/java/com/example/myapplication/MainActivity.kt`
  - 핵심 코드
    ```kotlin
    val webView = WebView(this)
    webView.settings.javaScriptEnabled = true
    setContentView(webView)
    webView.loadUrl("https://www.google.com")
    ```
  - 특징
    - XML 레이아웃을 쓰지 않고 코드에서 `WebView` 인스턴스를 생성해 컨텐츠 뷰로 지정.
    - 자바스크립트 사용을 허용(`javaScriptEnabled = true`).

- 매니페스트: `AndroidManifest.xml`
  - 아래 권한 추가됨
    ```xml
    <uses-permission android:name="android.permission.INTERNET" />
    ```

- 레이아웃
  - `activity_main.xml`은 여전히 "Hello World!"이나, 실제 실행 경로는 코드의 `WebView`이므로 사용되지 않음.

- 시사점
  - 뷰를 코드에서 동적으로 구성하는 패턴의 데모.
  - `INTERNET` 권한 필요성 및 보안 고려(신뢰되는 URL, `WebViewClient` 설정, 자바스크립트 활성화의 위험 등).

---

### 5) Exercise1.04 (테마 색상 커스터마이징)

- 테마: `res/values/themes.xml`, `res/values-night/themes.xml`
  - 기본 템플릿과 달리 primary/secondary 컬러 조합을 바꿈
    - 예: `values/themes.xml`의 primary를 `@color/teal_200`, secondary를 `@color/purple_200`로 설정.
  - 시사점: 머티리얼 테마의 `colorPrimary`, `colorSecondary`가 컴포넌트 전반의 톤을 좌우함을 실습.

- 매니페스트
  - `activity` 내 아래 `meta-data` 존재(기본 템플릿에는 보통 없음)
    ```xml
    <meta-data
        android:name="android.app.lib_name"
        android:value="" />
    ```
  - 실질적 동작에 영향은 없지만, NDK/네이티브 라이브러리 통합 시 사용되는 메타데이터 키로 흔함.

- Kotlin/레이아웃
  - `MainActivity.kt`/`activity_main.xml`은 기본 수준(Hello World) 유지.

- 시사점
  - 기능을 바꾸지 않고도 테마만으로 앱 인상이 크게 달라짐을 확인.

---

### 6) Exercise1.05 (이름 입력 + 환영 문구 표시)

- 레이아웃: `res/layout/activity_main.xml`
  - 구성
    - `TextInputLayout` + `TextInputEditText` 2개(이름/성): `@+id/first_name`, `@+id/last_name`
    - `MaterialButton` `@+id/enter_button`
    - `TextView` `@+id/greeting_display`
    - 공통 스타일: `@style/text_input_greeting`, `@style/button_greeting`, `@style/greeting_display`, `@style/screen_layout_margin`

- 문자열: `res/values/strings.xml`
  - `first_name_text`, `last_name_text`, `enter_button_text`, `welcome_to_the_app`, `please_enter_a_name` 등 추가.

- 테마/스타일: `res/values/themes.xml`
  - 커스텀 스타일 정의
    ```xml
    <style name="text_input_greeting" parent="Widget.MaterialComponents.TextInputLayout.OutlinedBox">
        <item name="android:layout_margin">8dp</item>
    </style>
    <style name="button_greeting">
        <item name="android:layout_margin">8dp</item>
        <item name="android:gravity">center</item>
    </style>
    <style name="greeting_display" parent="@style/TextAppearance.MaterialComponents.Body1">
        <item name="android:layout_margin">8dp</item>
        <item name="android:gravity">center</item>
        <item name="android:layout_height">40dp</item>
    </style>
    ```

- Kotlin: `app/src/main/java/com/example/myapplication/MainActivity.kt`
  - 버튼 클릭 처리 흐름
    1. `first_name`, `last_name`의 텍스트를 `trim()`하여 읽음.
    2. 두 값이 모두 비어 있지 않을 때
       - `val nameToDisplay = firstName.plus(" ").plus(lastName)`로 풀네임 생성.
       - `greetingDisplay.text = " ${getString(R.string.welcome_to_the_app)} ${nameToDisplay}!"`처럼 문자열 템플릿과 리소스 결합.
    3. 둘 중 하나라도 비어 있으면 중앙에 `Toast` 표시
       ```kotlin
       Toast.makeText(this, getString(R.string.please_enter_a_name), Toast.LENGTH_LONG)
           .apply {
               setGravity(Gravity.CENTER, 0, 0)
               show()
           }
       ```
  - 시사점
    - 문자열 하드코딩 대신 리소스 사용으로 국제화(i18n)에 유리.
    - `Toast` 위치 제어로 피드백 가시성 강화.
    - 입력값 트리밍과 비어 있음 체크로 기본 유효성 검증 구현.

---

## 공통/차이점 요약

- 네임스페이스/패키지
  - Activity1.01만 `com.example.colors`; 나머지는 `com.example.myapplication`.

- 기능적 차이
  - Activity1.01: 입력값 → RGB 색상 생성 및 배경색 반영.
  - Exercise1.03: `WebView`로 웹 로딩(자바스크립트 허용, 권한 필요).
  - Exercise1.05: 이름 입력 → 환영 문구/토스트.
  - Exercise1.01/1.02/1.04: 기능적으로는 기본 템플릿 수준(1.04는 테마 변경 중심).

- 레이아웃 차이
  - Activity1.01, Exercise1.05: `TextInputLayout`/`TextInputEditText`를 활용한 폼 UI.
  - Exercise1.03: 실사용 레이아웃은 코드에서 동적 생성(기본 XML은 미사용).

- 매니페스트 차이
  - Exercise1.03: `<uses-permission android:name="android.permission.INTERNET" />` 추가.
  - Activity1.01, Exercise1.04: `activity` 내 `meta-data android.app.lib_name` 존재(빈 값). 동작 영향은 없음.

- 테마/스타일 차이
  - Activity1.01: `Theme.Colors` 및 여러 커스텀 컴포넌트 스타일 정의.
  - Exercise1.04: 기본 테마 컬러(primary/secondary) 조합 변경 → 앱 톤 변경.
  - Exercise1.05: 입력/버튼/디스플레이용 커스텀 스타일 정의.

- Gradle 차이
  - 의존성군은 유사. Activity1.01의 UI 테스트 라이브러리 버전이 소폭 최신.

---

## 추가 시사점 및 개선 여지

- 입력 검증 UX
  - Activity1.01/Exercise1.05 모두 입력값 검증을 `Toast`나 단일 메시지로 처리. `TextInputLayout.setError(...)`로 필드 단위 오류를 시각화하면 UX 향상.
  - 16진수 입력의 경우 XML의 `android:digits`로 1차 필터링, Kotlin에서 정규식/범위 검증(`^[0-9A-Fa-f]{1,2}$`)을 병행하면 견고함 상승.

- 보안/네트워크
  - Exercise1.03의 `WebView`는 `INTERNET` 권한과 자바스크립트 활성화로 공격표면이 커짐. `WebViewClient` 설정, 도메인 화이트리스트, HTTPS 강제 등 강화 필요.

- 스타일 일관성
  - Activity1.01/Exercise1.05처럼 스타일을 분리하면 유지보수성이 상승. Exercise1.01/1.02/1.03/1.04에도 동일한 패턴을 적용해 일관된 룩앤필 확보 가능.

- 테스트/품질
  - UI 테스트 라이브러리 버전 차이는 호환성/안정성에 영향. 모든 예제에서 동일 버전으로 통일하거나 최신화하는 것이 바람직.

---

## 파일별 핵심 변경 포인트 빠른 인덱스

- Activity1.01
  - `MainActivity.kt`: 색상 생성 로직(입력→보정→파싱→배경색).
  - `res/layout/activity_main.xml`: RGB 입력용 `TextInputLayout` 3개 + 버튼 + 결과 `TextView`.
  - `res/values/strings.xml`: 색상 생성 관련 문자열 다수 추가.
  - `res/values/themes.xml`: `Theme.Colors`, `color_*` 스타일 정의.
  - `AndroidManifest.xml`: 앱 라벨/테마 지정.

- Exercise1.01/1.02
  - 기본 템플릿(Hello World). 의미있는 변경 없음.

- Exercise1.03
  - `MainActivity.kt`: 코드 생성 `WebView`, JS 활성화, `loadUrl`.
  - `AndroidManifest.xml`: `INTERNET` 권한 추가.

- Exercise1.04
  - `res/values/themes.xml`: primary/secondary 색상 조합 변경.
  - `AndroidManifest.xml`: `activity` 내 `meta-data` 존재.

- Exercise1.05
  - `MainActivity.kt`: 이름 입력 검증, 환영 문구 표시, 중앙 `Toast`.
  - `res/layout/activity_main.xml`: 이름/성 입력, 버튼, 결과 표시용 `TextView`.
  - `res/values/strings.xml`: 입력 라벨/버튼/메시지 문자열 추가.
  - `res/values/themes.xml`: 입력/버튼/디스플레이용 커스텀 스타일 정의.

---

본 보고서는 실제 소스 파일을 기준으로 작성되었으며, 각 예제가 의도한 학습 포인트(입력 검증, Material 컴포넌트 사용, 동적 뷰 생성, 권한, 테마 커스터마이징, 문자열 리소스/국제화)를 단계적으로 보여주고 있음을 확인했습니다.

