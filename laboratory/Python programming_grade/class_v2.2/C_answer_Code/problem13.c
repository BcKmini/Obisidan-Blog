
#include <stdio.h>
#include <ctype.h>

int main() {
    char str[101];
    FILE *inputFile = fopen("input.txt", "r");
    FILE *outputFile = fopen("output.txt", "w");

    fscanf(inputFile, "%s", str);

    int len = 0;
    while (str[len] != '\0') len++;

    for (int i = len - 1; i >= 0; i--) {
        if (isupper(str[i]))
            fprintf(outputFile, "%c", tolower(str[i]));
        else if (islower(str[i]))
            fprintf(outputFile, "%c", toupper(str[i]));
        else
            fprintf(outputFile, "%c", str[i]);
    }

    fclose(inputFile);
    fclose(outputFile);
    return 0;
}
