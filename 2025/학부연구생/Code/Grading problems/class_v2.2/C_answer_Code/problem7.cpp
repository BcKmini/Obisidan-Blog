#include <iostream>
#include <fstream>

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

    // Initialize min and max with the first element
    int min = arr[0], max = arr[0];

    // Loop to find the minimum and maximum values
    for (int i = 1; i < N; i++) {
        if (arr[i] < min) {
            min = arr[i];
        }
        if (arr[i] > max) {
            max = arr[i];
        }
    }

    // Output the results
    outputFile << "Maximum: " << max << "\n";
    outputFile << "Minimum: " << min << "\n";

    inputFile.close();
    outputFile.close();
    
    return 0;
}