#include <iostream>
#include <fstream>

int main() {
    std::ifstream inputFile("input.txt");
    std::ofstream outputFile("output.txt");

    int A, B;
    inputFile >> A >> B;

    // 유클리드 호제법을 사용하여 GCD 계산
    while (B != 0) {
        int temp = A % B;
        A = B;
        B = temp;
    }

    outputFile << A << std::endl;

    inputFile.close();
    outputFile.close();

    return 0;
}
