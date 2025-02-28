#include "ina219_sensor.h"
#include <iostream>
#include <unistd.h>

#define INA219_REG_BUS_VOLTAGE  0x02
#define INA219_REG_CURRENT      0x04

INA219Sensor::INA219Sensor(int address) {
    i2cHandle = i2cOpen(1, address, 0); // I2C 버스 1 사용
    if (i2cHandle < 0) {
        std::cerr << "INA219 I2C 연결 실패!" << std::endl;
    }
}

INA219Sensor::~INA219Sensor() {
    i2cClose(i2cHandle);
}

int INA219Sensor::readRegister(int reg) {
    int result = i2cReadWordData(i2cHandle, reg);
    return (result < 0) ? 0 : result;
}

float INA219Sensor::getBusVoltage() {
    int raw = readRegister(INA219_REG_BUS_VOLTAGE);
    return (raw >> 3) * 4.0 / 1000.0; // 변환 (mV → V)
}

float INA219Sensor::getCurrent() {
    int raw = readRegister(INA219_REG_CURRENT);
    return raw * 0.001; // 변환 (mA → A)
}
