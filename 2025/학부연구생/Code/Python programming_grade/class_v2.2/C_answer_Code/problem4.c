#include <stdio.h>

int main() {
    FILE *input = fopen("input.txt", "r");
    FILE *output = fopen("output.txt", "w");

    if (input == NULL || output == NULL) {
        printf("파일 열기 오류!\n");
        return 1;
    }

    int n, arr[100], odd[100], even[100];
    int odd_index = 0, even_index = 0;

    fscanf(input, "%d", &n);
    for (int i = 0; i < n; i++) {
        fscanf(input, "%d", &arr[i]);
        if (arr[i] % 2 != 0) {
            odd[odd_index++] = arr[i];
        } else {
            even[even_index++] = arr[i];
        }
    }

    for (int i = 0; i < odd_index; i++) {
        fprintf(output, "%d ", odd[i]);
    }
    for (int i = 0; i < even_index; i++) {
        fprintf(output, "%d ", even[i]);
    }
    fprintf(output, "\n");

    fclose(input);
    fclose(output);
    return 0;
}
