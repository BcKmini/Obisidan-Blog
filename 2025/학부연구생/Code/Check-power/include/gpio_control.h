#ifndef GPIO_CONTROL_H
#define GPIO_CONTROL_H

#include <pigpio.h>

class GPIOControl {
public:
    GPIOControl(int pin);
    ~GPIOControl();

    int getValue();

private:
    int gpioPin;
};

#endif
