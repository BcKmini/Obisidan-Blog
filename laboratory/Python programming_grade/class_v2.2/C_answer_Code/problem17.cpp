#include <iostream>
#include <fstream>
#include <cstring>

int main() {
    char str1[101], str2[101];
    bool used[101] = { false }; // Array to track used characters from the second string
    std::ifstream inputFile("input.txt");
    std::ofstream outputFile("output.txt");

    // Read two strings from input.txt
    inputFile >> str1 >> str2;

    int len1 = strlen(str1);
    int len2 = strlen(str2);

    // Find common characters
    for (int i = 0; i < len1; i++) {
        for (int j = 0; j < len2; j++) {
            if (str1[i] == str2[j] && !used[j]) {
                outputFile << str1[i];
                used[j] = true; // Mark character as used
                break;
            }
        }
    }

    inputFile.close();
    outputFile.close();
    return 0;
}