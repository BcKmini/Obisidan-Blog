#include <iostream>
#include <fstream>

int main() {
    std::ifstream inputFile("input.txt");
    std::ofstream outputFile("output.txt");

    int N;
    inputFile >> N;

    int sum = 0;

    // 각 자리수의 합 계산
    while (N > 0) {
        sum += N % 10;
        N /= 10;
    }

    outputFile << sum << std::endl;

    inputFile.close();
    outputFile.close();

    return 0;
}
