#include <iostream>
#include <fstream>

int main() {
    // Declare a variable to store the input value N
    int N;

    // Create input and output file streams
    std::ifstream inputFile("input.txt");
    std::ofstream outputFile("output.txt");

    // Read the integer N from the input file
    inputFile >> N;

    // Loop to print the pyramid with stars
    for (int i = 1; i <= N; i++) {
        // Print spaces before stars
        for (int j = 1; j <= N - i; j++) {
            outputFile << " ";
        }
        // Print stars
        for (int k = 1; k <= 2 * i - 1; k++) {
            outputFile << "*";
        }
        outputFile << "\n";
    }

    // Close the file streams
    inputFile.close();
    outputFile.close();

    return 0;
}