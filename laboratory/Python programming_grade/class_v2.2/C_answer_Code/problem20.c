
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

    int hasDuplicates = 0;
    for (int i = 0; i < N - 1; i++) {
        if (arr[i] == arr[i + 1]) {
            if (!hasDuplicates) {
                fprintf(outputFile, "%d", arr[i]);
                hasDuplicates = 1;
            } else {
                fprintf(outputFile, " %d", arr[i]);
            }
            while (i < N - 1 && arr[i] == arr[i + 1]) i++;
        }
    }

    if (!hasDuplicates) {
        fprintf(outputFile, "No duplicates");
    }
    fprintf(outputFile, "\n");

    fclose(inputFile);
    fclose(outputFile);
    return 0;
}
