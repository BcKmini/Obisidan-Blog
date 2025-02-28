라즈베리파이에서 libgpiod를 사용한 GPIO 버튼 입력 감지 및 전원 활성화

이 프로젝트에서는 라즈베리파이의 GPIO 핀을 활용하여 버튼 입력을 감지하고, 이를 이용해 전원 상태를 토글하는 기능을 구현
기존의 /sys/class/gpio 방식 ->  **최신 GPIO 제어 방식인 libgpiod**를 사용하여 진행(오류가 잡히지를 않아...)

1. 하드웨어 연결

    버튼 모듈을 라즈베리파이의 GPIO 핀에 연결하여 입력을 받을 수 있도록 구성
    VCC(전원), GND(접지), OUT(출력) 핀을 활용해 GPIO 17번 핀(BCM)에서 버튼 입력을 감지

2. 소프트웨어 개발
    **GPIO 제어 클래스(gpio_control.h, gpio_control.cpp)**를 작성하여 libgpiod를 통해 GPIO 핀을 초기화하고, 입력값을 읽는 기능을 구현
    **메인 코드(main.cpp)**에서는 버튼이 눌릴 때마다 전원 상태를 토글하는 로직을 작성하고, 디바운싱 처리를 통해 오작동을 방지
    **CMake를 사용한 빌드 시스템(CMakeLists.txt)**을 구성

3. 빌드 및 실행
    libgpiod를 설치하고, cmake와 make를 이용해 빌드한 후, sudo ./switch 명령어를 실행하면 버튼을 눌러 전원 상태를 변경가능
    실행 중 **Ctrl+C(SIGNAL SIGINT)**를 입력하면 프로그램이 안전하게 종료

4. 결과
    버튼을 눌렀을 때 터미널에 "Power State: ON/OFF" 메시지가 출력되며, 전원 상태가 전환됨을 확인
    기존의 /sys/class/gpio 방식보다 효율적이고 최신 방식인 libgpiod를 활용하여 안정적인 GPIO 제어를 구현
