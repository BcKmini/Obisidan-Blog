import board
import busio
from adafruit_ina219 import INA219

i2c = busio.I2C(board.SCL, board.SDA)
sensor = INA219(i2c)

print(f"전압: {sensor.bus_voltage:.3f} V")
print(f"전류: {sensor.current:.3f} mA")
print(f"전력: {sensor.power:.3f} mW")
