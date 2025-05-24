
#include <stdio.h>

int main() {
    int N, arr[100];
    FILE *inputFile = fopen("input.txt", "r");
    FILE *outputFile = fopen("output.txt", "w");

    fscanf(inputFile, "%d", &N);
    for (int i = 0; i < N; i++) {
        fscanf(inputFile, "%d", &arr[i]);
    }

    for (int i = 0; i < N; i++) {
        int isPrime = 1;
        if (arr[i] < 2) {
            isPrime = 0;
        } else {
            for (int j = 2; j * j <= arr[i]; j++) {
                if (arr[i] % j == 0) {
                    isPrime = 0;
                    break;
                }
            }
        }
        if (isPrime) {
            fprintf(outputFile, "%d ", arr[i]);
        }
    }

    fclose(inputFile);
    fclose(outputFile);
    return 0;
}
