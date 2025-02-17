cmake_minimum_required(VERSION 3.10)
project(switch_control)

set(CMAKE_CXX_STANDARD 17)

# pigpio 및 GTK 라이브러리 찾기
find_package(PkgConfig REQUIRED)
pkg_check_modules(GTK REQUIRED gtk+-3.0)

include_directories(${GTK_INCLUDE_DIRS})
link_directories(${GTK_LIBRARY_DIRS})
add_definitions(${GTK_CFLAGS_OTHER})

include_directories(include)
add_executable(switch src/main.cpp src/gpio_control.cpp src/ina219_sensor.cpp)

# pigpio 및 GTK 라이브러리 추가
target_link_libraries(switch ${GTK_LIBRARIES} pigpio pthread)
