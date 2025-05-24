
#include <stdio.h>

int main() {
    FILE *inputFile = fopen("input.txt", "r");
    FILE *outputFile = fopen("output.txt", "w");

    int A, B;
    fscanf(inputFile, "%d %d", &A, &B);

    while (B != 0) {
        int temp = A % B;
        A = B;
        B = temp;
    }

    fprintf(outputFile, "%d\n", A);

    fclose(inputFile);
    fclose(outputFile);
    return 0;
}
