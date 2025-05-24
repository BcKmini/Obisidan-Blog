
#include <stdio.h>

int main() {
    int N;
    int arr[50];
    FILE *inputFile = fopen("input.txt", "r");
    FILE *outputFile = fopen("output.txt", "w");

    fscanf(inputFile, "%d", &N);
    for (int i = 0; i < N; i++) {
        fscanf(inputFile, "%d", &arr[i]);
    }

    for (int i = 0; i < N; i++) {
        if (arr[i] % 2 == 0) {
            fprintf(outputFile, "%d ", arr[i]);
        }
    }
    for (int i = 0; i < N; i++) {
        if (arr[i] % 2 != 0) {
            fprintf(outputFile, "%d ", arr[i]);
        }
    }

    fclose(inputFile);
    fclose(outputFile);
    return 0;
}
