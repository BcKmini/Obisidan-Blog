#include "gpio_control.h"
#include <iostream>
#include <csignal>
#include <unistd.h>

bool running = true;

// SIGINT 핸들러 (Ctrl+C를 눌렀을 때 프로그램 종료)
void signalHandler(int signum) {
    running = false;
    std::cout << "Exiting program..." << std::endl;
}

int main() {
    signal(SIGINT, signalHandler);

    const int buttonPin = 17; // 버튼 GPIO 핀 번호

    try {
        GPIOControl button(buttonPin);

        std::cout << "Monitoring button state. Press the button to toggle power state..." << std::endl;

        bool powerState = false;      // 전원 상태 (초기값: OFF)
        bool lastButtonState = true; // 버튼의 초기 상태 (HIGH)

        while (running) {
            int currentButtonState = button.getValue();

            if (currentButtonState == 0 && lastButtonState == 1) { // 버튼이 눌렸을 때 (HIGH → LOW)
                powerState = !powerState; // 전원 상태 토글
                std::cout << "Power State: " << (powerState ? "ON" : "OFF") << std::endl;
                usleep(300000); // 디바운싱 (300ms 대기)
            }

            lastButtonState = currentButtonState; // 버튼 상태 업데이트
            usleep(100000); // 100ms 대기
        }
    } catch (const std::exception &e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }

    return 0;
}
