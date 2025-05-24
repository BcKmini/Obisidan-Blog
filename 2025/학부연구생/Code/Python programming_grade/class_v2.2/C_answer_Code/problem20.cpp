#include <iostream>
#include <fstream>

int main() {
    std::ifstream inputFile("input.txt");
    std::ofstream outputFile("output.txt");

    int N;
    inputFile >> N;
    int arr[100];

    for (int i = 0; i < N; i++) {
        inputFile >> arr[i];
    }

    // 오름차순 정렬 (버블 정렬)
    for (int i = 0; i < N - 1; i++) {
        for (int j = 0; j < N - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }

    bool hasDuplicates = false;

    // 중복 요소 찾기 (작은 수부터)
    for (int i = 0; i < N - 1; i++) {
        if (arr[i] == arr[i + 1]) {
            if (!hasDuplicates) {
                outputFile << arr[i];
                hasDuplicates = true;
            } else {
                outputFile << " " << arr[i];
            }
            
            // 같은 요소가 연속되면 건너뜀
            while (i < N - 1 && arr[i] == arr[i + 1]) {
                i++;
            }
        }
    }

    if (!hasDuplicates) {
        outputFile << "No duplicates";
    }
    outputFile << std::endl;

    inputFile.close();
    outputFile.close();

    return 0;
}
