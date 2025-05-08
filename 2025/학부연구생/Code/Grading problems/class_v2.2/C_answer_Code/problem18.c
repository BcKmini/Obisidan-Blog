
#include <stdio.h>

int main() {
    FILE *inputFile = fopen("input.txt", "r");
    FILE *outputFile = fopen("output.txt", "w");

    int N, arr[100];
    fscanf(inputFile, "%d", &N);
    for (int i = 0; i < N; i++) {
        fscanf(inputFile, "%d", &arr[i]);
    }

    for (int i = 0; i < N - 1; i++) {
        for (int j = 0; j < N - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }

    for (int i = 0; i < N; i++) {
        fprintf(outputFile, "%d ", arr[i]);
    }
    fprintf(outputFile, "\n");

    fclose(inputFile);
    fclose(outputFile);
    return 0;
}
