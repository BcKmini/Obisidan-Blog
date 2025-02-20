#ifndef INA219_SENSOR_H
#define INA219_SENSOR_H

#include <pigpio.h>

class INA219Sensor {
public:
    INA219Sensor(int address = 0x40);
    ~INA219Sensor();

    float getBusVoltage();
    float getCurrent();

private:
    int i2cHandle;
    int readRegister(int reg);
};

#endif
