#include <iostream>
#include <fstream>

int main() {
    int N;
    std::ifstream inputFile("input.txt");
    std::ofstream outputFile("output.txt");

    inputFile >> N;

    for (int i = 1; i <= N; i++) {
        for (int j = 1; j <= N; j++) {
            // Print '*' at positions where the two diagonals of the X cross
            if (j == i || j == N - i + 1) {
                outputFile << "*";
            } 
            // Print space at other positions, with conditions to avoid trailing spaces
            else if (j < N &&
                     !((j == i || j > N - i + 1) && i < (float)N / 2 + 1) && // Top half condition
                     !(i > (float)N / 2 + 1 && j > i)) {                      // Bottom half condition
                outputFile << " ";
            }
        }
        // Move to the next line unless it's the last line
        if (i != N) {
            outputFile << "\n";
        }
    }

    inputFile.close();
    outputFile.close();

    return 0;
}