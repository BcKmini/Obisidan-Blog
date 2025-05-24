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

    // Loop to print the inverted triangle with stars
    for (int i = N; i >= 1; i--) {
        for (int j = 1; j <= i; j++) {
            outputFile << "*";
        }
        outputFile << "\n";
    }

    // Close the file streams
    inputFile.close();
    outputFile.close();

    return 0;
}