#include <stdio.h>
#include <stdlib.h>

int main() {
    FILE *input = fopen("input.txt", "r");
    FILE *output = fopen("output.txt", "w");

    if (input == NULL || output == NULL) {
        printf("파일 열기 오류!\n");
        return 1;
    }

    int a, b;
    fscanf(input, "%d %d", &a, &b);

    int result = abs(a - b); // 절댓값 계산
    fprintf(output, "%d\n", result);

    fclose(input);
    fclose(output);
    return 0;
}
