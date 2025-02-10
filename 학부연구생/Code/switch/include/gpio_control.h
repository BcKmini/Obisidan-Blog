#ifndef GPIO_CONTROL_H
#define GPIO_CONTROL_H

#include <gpiod.h>
#include <string>

class GPIOControl {
public:
    GPIOControl(int pin);       // 생성자: GPIO 핀 초기화
    ~GPIOControl();             // 소멸자: GPIO 리소스 정리
    int getValue() const;       // GPIO 값 읽기

private:
    int pinNumber;              // GPIO 핀 번호
    gpiod_chip *chip;           // GPIO 칩 핸들
    gpiod_line *line;           // GPIO 라인 핸들
};

#endif // GPIO_CONTROL_H
