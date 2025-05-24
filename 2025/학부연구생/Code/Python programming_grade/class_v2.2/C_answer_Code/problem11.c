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

    int product = arr[N - 1] * arr[N - 2];
    fprintf(outputFile, "Product: %d\n", product);

    fclose(inputFile);
    fclose(outputFile);

    return 0;
}