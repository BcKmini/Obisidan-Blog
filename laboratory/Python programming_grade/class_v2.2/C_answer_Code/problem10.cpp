#include <iostream>
#include <fstream>

int main() {
    int N;
    std::ifstream inputFile("input.txt");
    std::ofstream outputFile("output.txt");

    // Read the integer N
    inputFile >> N;

    int sum = 0;

    // Loop to calculate the sum of digits
    while (N > 0) {
        sum += N % 10;
        N /= 10;
    }

    // Output the result
    outputFile << "Sum of digits: " << sum << "\n";

    inputFile.close();
    outputFile.close();

    return 0;
}