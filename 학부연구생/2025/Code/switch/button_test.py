import RPi.GPIO as GPIO
import time

# GPIO 핀 설정
BUTTON_PIN = 17
GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

try:
    while True:
        if GPIO.input(BUTTON_PIN) == GPIO.LOW:  # 스위치 눌림
            print("Button Pressed!")
        else:
            print("Button Released!")
        time.sleep(0.1)
except KeyboardInterrupt:
    GPIO.cleanup()
