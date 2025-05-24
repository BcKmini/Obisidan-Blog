
#include <stdio.h>

int main() {
    FILE *inputFile = fopen("input.txt", "r");
    FILE *outputFile = fopen("output.txt", "w");

    int N;
    fscanf(inputFile, "%d", &N);

    int sum = 0;
    while (N > 0) {
        sum += N % 10;
        N /= 10;
    }

    fprintf(outputFile, "%d\n", sum);

    fclose(inputFile);
    fclose(outputFile);
    return 0;
}
