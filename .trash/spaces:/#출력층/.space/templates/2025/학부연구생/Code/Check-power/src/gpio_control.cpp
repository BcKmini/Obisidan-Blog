#include "gpio_control.h"
#include <iostream>

GPIOControl::GPIOControl(int pin) : gpioPin(pin) {
    gpioSetMode(gpioPin, PI_INPUT);
    gpioSetPullUpDown(gpioPin, PI_PUD_UP); // 내부 풀업 설정
}

GPIOControl::~GPIOControl() {}

int GPIOControl::getValue() {
    return gpioRead(gpioPin);
}
