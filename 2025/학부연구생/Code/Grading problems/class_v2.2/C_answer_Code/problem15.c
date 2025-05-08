
#include <stdio.h>
#include <ctype.h>

int main() {
    char str[101];
    FILE *inputFile = fopen("input.txt", "r");
    FILE *outputFile = fopen("output.txt", "w");

    fscanf(inputFile, "%s", str);
    int vowels = 0, consonants = 0;

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

    fprintf(outputFile, "Vowels: %d\nConsonants: %d", vowels, consonants);

    fclose(inputFile);
    fclose(outputFile);
    return 0;
}
