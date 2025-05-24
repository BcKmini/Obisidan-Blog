#include <stdio.h>
#include <limits.h>

int main() {
    FILE *input = fopen("input.txt", "r");
    FILE *output = fopen("output.txt", "w");

    if (input == NULL || output == NULL) {
        printf("파일 열기 오류!\n");
        return 1;
    }

    int n, num, max_value = INT_MIN, min_value = INT_MAX;

    fscanf(input, "%d", &n);
    for (int i = 0; i < n; i++) {
        fscanf(input, "%d", &num);
        if (num > max_value) {
            max_value = num;
        }
        if (num < min_value) {
            min_value = num;
        }
    }

    fprintf(output, "%d\n", max_value - min_value);

    fclose(input);
    fclose(output);
    return 0;
}
