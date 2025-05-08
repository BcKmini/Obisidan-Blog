#include <iostream>
#include <fstream>
#include <algorithm>

int main() {
    int N;
    std::ifstream inputFile("input.txt");
    std::ofstream outputFile("output.txt");

    // Read the size of the array
    inputFile >> N;

    int arr[100];
    
    // Read the array elements
    for (int i = 0; i < N; i++) {
        inputFile >> arr[i];
    }

    // Sort the array
    std::sort(arr, arr + N);

    // Remove duplicates
    int uniqueCount = 0;
    for (int i = 0; i < N; i++) {
        if (i == 0 || arr[i] != arr[i - 1]) {
            arr[uniqueCount++] = arr[i];
        }
    }

    // Output the unique elements
    for (int i = 0; i < uniqueCount; i++) {
        outputFile << arr[i] << " ";
    }
    outputFile << "\n";

    inputFile.close();
    outputFile.close();

    return 0;
}