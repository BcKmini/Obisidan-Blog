cmake_minimum_required(VERSION 3.10)
project(switch_control)

set(CMAKE_CXX_STANDARD 17)

include_directories(include)
add_executable(switch src/main.cpp src/gpio_control.cpp)
target_link_libraries(switch gpiod)
