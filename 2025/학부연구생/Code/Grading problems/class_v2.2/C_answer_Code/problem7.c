#include <stdio.h>

int main() {
    int N, arr[100];
    FILE *inputFile = fopen("input.txt", "r");
    FILE *outputFile = fopen("output.txt", "w");

    fscanf(inputFile, "%d", &N);

    for (int i = 0; i < N; i++) {
        fscanf(inputFile, "%d", &arr[i]);
    }

    int max = arr[0], min = arr[0];
    
    for (int i = 1; i < N; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
        if (arr[i] < min) {
            min = arr[i];
        }
    }

    fprintf(outputFile, "Maximum: %d\n", max);
    fprintf(outputFile, "Minimum: %d\n", min);

    fclose(inputFile);
    fclose(outputFile);

    return 0;
}