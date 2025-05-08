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

    // Output the product of the two largest numbers
    outputFile << "Product: " << arr[N - 1] * arr[N - 2] << "\n";

    inputFile.close();
    outputFile.close();

    return 0;
}