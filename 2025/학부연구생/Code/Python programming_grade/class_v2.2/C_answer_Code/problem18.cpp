#include <iostream>
#include <fstream>

int main() {
    std::ifstream inputFile("input.txt");
    std::ofstream outputFile("output.txt");

    int N;
    inputFile >> N;
    int arr[100];  // N의 최대값이 100이므로 최대 크기 설정

    for (int i = 0; i < N; i++) {
        inputFile >> arr[i];
    }

    // 버블 정렬
    for (int i = 0; i < N - 1; i++) {
        for (int j = 0; j < N - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }

    // 정렬된 배열을 출력
    for (int i = 0; i < N; i++) {
        outputFile << arr[i] << " ";
    }
    outputFile << std::endl;

    inputFile.close();
    outputFile.close();

    return 0;
}
