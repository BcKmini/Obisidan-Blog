#include <iostream>
#include <fstream>

int main() {
    int N, arr[100];
    std::ifstream inputFile("input.txt");
    std::ofstream outputFile("output.txt");

    // Read the size of the array
    inputFile >> N;

    // Read the array elements
    for (int i = 0; i < N; i++) {
        inputFile >> arr[i];
    }

    // Check for prime numbers and output them
    for (int i = 0; i < N; i++) {
        bool isPrime = true;
        if (arr[i] < 2) {
            isPrime = false;
        } else {
            for (int j = 2; j * j <= arr[i]; j++) {
                if (arr[i] % j == 0) {
                    isPrime = false;
                    break;
                }
            }
        }
        // If the number is prime, output it
        if (isPrime) {
            outputFile << arr[i] << " ";
        }
    }

    inputFile.close();
    outputFile.close();
    return 0;
}