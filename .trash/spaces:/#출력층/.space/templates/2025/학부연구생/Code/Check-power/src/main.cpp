#include "gpio_control.h"
#include "ina219_sensor.h"
#include <iostream>
#include <csignal>
#include <gtk/gtk.h>
#include <thread>
#include <chrono>

#define BUTTON_PIN 17

bool running = true;
GtkWidget *label;

// SIGINT 핸들러 (Ctrl+C 눌렀을 때 종료)
void signalHandler(int signum) {
    running = false;
    std::cout << "Exiting program..." << std::endl;
}

// GTK UI 업데이트
void updateDisplay(float voltage, float current, float power) {
    char buffer[256];
    snprintf(buffer, sizeof(buffer),
             "전압  : %.3f V\n"
             "전류  : %.3f A\n"
             "전력  : %.3f W\n",
             voltage, current, power);

    gtk_label_set_text(GTK_LABEL(label), buffer);
}

// 전력 데이터를 지속적으로 측정하고 화면에 업데이트하는 함수
void powerMonitorThread(INA219Sensor *sensor) {
    while (running) {
        float voltage = sensor->getBusVoltage();
        float current = sensor->getCurrent();
        float power = voltage * current; // 전력 (W) 계산

        // GUI 업데이트
        g_idle_add((GSourceFunc)updateDisplay, new float[3]{voltage, current, power});

        std::this_thread::sleep_for(std::chrono::seconds(1)); // 1초마다 갱신
    }
}

// GTK 창 초기화
static void activate(GtkApplication *app, gpointer user_data) {
    GtkWidget *window;
    window = gtk_application_window_new(app);
    gtk_window_set_title(GTK_WINDOW(window), "전력 모니터링");
    gtk_window_set_default_size(GTK_WINDOW(window), 300, 200);

    label = gtk_label_new("Loading...");
    gtk_container_add(GTK_CONTAINER(window), label);

    gtk_widget_show_all(window);
}

// 메인 함수 (버튼 + GUI)
int main(int argc, char **argv) {
    signal(SIGINT, signalHandler);

    // pigpio 초기화
    if (gpioInitialise() < 0) {
        std::cerr << "pigpio 초기화 실패!" << std::endl;
        return 1;
    }

    GPIOControl button(BUTTON_PIN);
    INA219Sensor powerSensor;

    std::cout << "Press the button to toggle ON/OFF..." << std::endl;

    bool lastButtonState = true;
    bool toggleState = false;

    // GTK 애플리케이션 초기화
    GtkApplication *app = gtk_application_new("com.raspberrypi.power_monitor", G_APPLICATION_DEFAULT_FLAGS);
    g_signal_connect(app, "activate", G_CALLBACK(activate), NULL);

    // 전력 측정 스레드 시작
    std::thread powerThread(powerMonitorThread, &powerSensor);

    // 버튼 입력 감지 루프
    while (running) {
        int currentButtonState = button.getValue();

        if (currentButtonState == 0 && lastButtonState == 1) {
            toggleState = !toggleState;
            std::cout << (toggleState ? "ON" : "OFF") << std::endl; // 버튼 상태만 로그 출력
        }

        lastButtonState = currentButtonState;
        std::this_thread::sleep_for(std::chrono::milliseconds(100));
    }

    // 프로그램 종료 시 GTK 종료
    g_application_quit(G_APPLICATION(app));
    g_object_unref(app);
    powerThread.join();

    gpioTerminate(); // pigpio 종료

    return 0;
}
