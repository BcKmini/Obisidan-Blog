#include <stdio.h>

int main() {
    int N, sum = 0;
    FILE *inputFile = fopen("input.txt", "r");
    FILE *outputFile = fopen("output.txt", "w");

    fscanf(inputFile, "%d", &N);

    for (int i = 1; i <= N; i++) {
        sum += i;
    }

    fprintf(outputFile, "Sum: %d\n", sum);

    fclose(inputFile);
    fclose(outputFile);

    return 0;
}