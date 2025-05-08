#include <stdio.h>
#include <stdlib.h>

int compare(const void *a, const void *b) {
    return (*(int*)a - *(int*)b);
}

int main() {
    int N, arr[100];
    FILE *inputFile = fopen("input.txt", "r");
    FILE *outputFile = fopen("output.txt", "w");

    fscanf(inputFile, "%d", &N);

    for (int i = 0; i < N; i++) {
        fscanf(inputFile, "%d", &arr[i]);
    }

    qsort(arr, N, sizeof(int), compare);

    fprintf(outputFile, "%d ", arr[0]);
    for (int i = 1; i < N; i++) {
        if (arr[i] != arr[i - 1]) {
            fprintf(outputFile, "%d ", arr[i]);
        }
    }

    fclose(inputFile);
    fclose(outputFile);

    return 0;
}