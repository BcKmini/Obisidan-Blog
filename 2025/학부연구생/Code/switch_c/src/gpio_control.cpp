#include "gpio_control.h"
#include <stdexcept>
#include <iostream>

GPIOControl::GPIOControl(int pin) : pinNumber(pin) {
    chip = gpiod_chip_open_by_number(0); // gpiochip0 열기
    if (!chip) {
        throw std::runtime_error("Failed to open gpiochip0");
    }

    line = gpiod_chip_get_line(chip, pinNumber);
    if (!line) {
        throw std::runtime_error("Failed to get GPIO line");
    }

    // GPIO 입력 모드로 요청
    if (gpiod_line_request_input(line, "gpio_control") < 0) {
        throw std::runtime_error("Failed to request GPIO line as input");
    }
}

GPIOControl::~GPIOControl() {
    if (chip) {
        gpiod_chip_close(chip); // GPIO 칩 닫기
    }
}

int GPIOControl::getValue() const {
    int value = gpiod_line_get_value(line);
    if (value < 0) {
        throw std::runtime_error("Failed to read GPIO value");
    }
    return value;
}
