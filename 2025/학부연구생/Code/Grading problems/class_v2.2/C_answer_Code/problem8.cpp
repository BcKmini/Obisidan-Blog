#include <iostream>
#include <fstream>

int main() {
    int N;
    std::ifstream inputFile("input.txt");
    std::ofstream outputFile("output.txt");

    // Read the integer N
    inputFile >> N;

    int sum = 0;

    // Loop to calculate the sum from 1 to N
    for (int i = 1; i <= N; i++) {
        sum += i;
    }

    // Output the result
    outputFile << "Sum: " << sum << "\n";

    inputFile.close();
    outputFile.close();

    return 0;
}