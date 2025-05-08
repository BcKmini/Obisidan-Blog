#include <stdio.h>

int main() {
    int N;
    FILE *inputFile = fopen("input.txt", "r");
    FILE *outputFile = fopen("output.txt", "w");

    fscanf(inputFile, "%d", &N);

    fprintf(outputFile, "Reversed: ");
    while (N > 0) {
        fprintf(outputFile, "%d", N % 10);
        N /= 10;
    }

    fclose(inputFile);
    fclose(outputFile);

    return 0;
}