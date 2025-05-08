#include <stdio.h>

int max(int a, int b) {
    return (a > b) ? a : b;
}

int main() {
    FILE *input = fopen("input.txt", "r");
    FILE *output = fopen("output.txt", "w");

    if (input == NULL || output == NULL) {
        printf("파일 열기 오류!\n");
        return 1;
    }

    int n, arr[100];
    fscanf(input, "%d", &n);

    for (int i = 0; i < n; i++) {
        fscanf(input, "%d", &arr[i]);
    }

    int max_sum = arr[0], current_sum = arr[0];
    for (int i = 1; i < n; i++) {
        current_sum = max(arr[i], current_sum + arr[i]);
        max_sum = max(max_sum, current_sum);
    }

    fprintf(output, "%d\n", max_sum);

    fclose(input);
    fclose(output);
    return 0;
}
