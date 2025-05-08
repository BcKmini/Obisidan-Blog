#include <stdio.h>

int main() {
    int N, sum = 0;
    FILE *inputFile = fopen("input.txt", "r");
    FILE *outputFile = fopen("output.txt", "w");

    fscanf(inputFile, "%d", &N);

    while (N > 0) {
        sum += N % 10;
        N /= 10;
    }

    fprintf(outputFile, "Sum of digits: %d\n", sum);

    fclose(inputFile);
    fclose(outputFile);

    return 0;
}