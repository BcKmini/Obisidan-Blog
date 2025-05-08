#include <iostream>
#include <fstream>

int main() {
    int N;
    int arr[50];
    std::ifstream inputFile("input.txt");
    std::ofstream outputFile("output.txt");

    // Read the size of the array
    inputFile >> N;

    // Read the array elements
    for (int i = 0; i < N; i++) {
        inputFile >> arr[i];
    }

    // Print even numbers first
    for (int i = 0; i < N; i++) {
        if (arr[i] % 2 == 0) {
            outputFile << arr[i] << " ";
        }
    }

    // Print odd numbers next
    for (int i = 0; i < N; i++) {
        if (arr[i] % 2 != 0) {
            outputFile << arr[i] << " ";
        }
    }

    inputFile.close();
    outputFile.close();
    return 0;
}