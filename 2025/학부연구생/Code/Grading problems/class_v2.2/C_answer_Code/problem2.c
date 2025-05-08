#include <stdio.h>

int main() {
    FILE *input = fopen("input.txt", "r");
    FILE *output = fopen("output.txt", "w");

    if (input == NULL || output == NULL) {
        printf("파일 열기 오류!\n");
        return 1;
    }

    int n, arr[100], a, b, sum = 0;

    fscanf(input, "%d", &n);
    for (int i = 0; i < n; i++) {
        fscanf(input, "%d", &arr[i]);
    }
    fscanf(input, "%d %d", &a, &b);

    for (int i = a - 1; i < b; i++) {
        sum += arr[i];
    }

    fprintf(output, "%d\n", sum);

    fclose(input);
    fclose(output);
    return 0;
}
