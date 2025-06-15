#include <iostream>
#include <fstream>

int main() {
    std::ifstream inputFile("input.txt");
    std::ofstream outputFile("output.txt");

    char s[100];
    int length = 0;

    // 문자열 읽기
    inputFile.getline(s, 100);

    // 문자열 길이 계산
    while (s[length] != '\0') {
        length++;
    }

    bool isPalindrome = true;
    int left = 0;
    int right = length - 1;

    // 공백을 무시하고 비교
    while (left < right) {
        // 왼쪽에서 공백 건너뜀
        while (left < right && s[left] == ' ') {
            left++;
        }
        // 오른쪽에서 공백 건너뜀
        while (left < right && s[right] == ' ') {
            right--;
        }
        // 문자 비교
        if (s[left] != s[right]) {
            isPalindrome = false;
            break;
        }
        left++;
        right--;
    }

    if (isPalindrome) {
        outputFile << "Yes" << std::endl;
    } else {
        outputFile << "No" << std::endl;
    }

    inputFile.close();
    outputFile.close();

    return 0;
}
