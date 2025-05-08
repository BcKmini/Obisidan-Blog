#include <iostream>
#include <fstream>
#include <cctype>

int main() {
    char str[101]; // Array to store the input string (max length 100 + null terminator)
    std::ifstream inputFile("input.txt");
    std::ofstream outputFile("output.txt");

    // Read the input string
    inputFile >> str;

    int vowels = 0, consonants = 0;

    // Loop through the string
    for (int i = 0; str[i] != '\0'; i++) {
        char ch = tolower(str[i]);
        if (isalpha(ch)) {
            if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
                vowels++;
            } else {
                consonants++;
            }
        }
    }

    // Output the result
    outputFile << "Vowels: " << vowels << "\nConsonants: " << consonants;

    inputFile.close();
    outputFile.close();
    return 0;
}