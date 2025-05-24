#include <iostream>
#include <fstream>
#include <cctype> // for toupper() and tolower()

int main() {
    char str[101]; // Array to store the input string (max length 100 + null terminator)
    std::ifstream inputFile("input.txt");
    std::ofstream outputFile("output.txt");

    // Read the input string from input.txt
    inputFile >> str;

    // Find the length of the string
    int len = 0;
    while (str[len] != '\0') {
        len++;
    }

    // Loop through the string in reverse order
    for (int i = len - 1; i >= 0; i--) {
        // Change the case of each character
        if (isupper(str[i])) {
            outputFile << (char)tolower(str[i]);
        } else if (islower(str[i])) {
            outputFile << (char)toupper(str[i]);
        } else {
            outputFile << str[i];
        }
    }

    inputFile.close();
    outputFile.close();
    return 0;
}