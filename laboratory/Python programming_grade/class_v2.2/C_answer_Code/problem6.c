#include <stdio.h>
#include <stdlib.h>

int compare_desc(const void *a, const void *b) {
    return (*(int *)b - *(int *)a); // 내림차순 비교 함수
}

int compare_asc(const void *a, const void *b) {
    return (*(int *)a - *(int *)b); // 오름차순 비교 함수
}

int main() {
    FILE *input = fopen("input.txt", "r");
    FILE *output = fopen("output.txt", "w");

    if (input == NULL || output == NULL) {
        printf("파일 열기 오류!\n");
        return 1;
    }

    int n, arr[100], pos[100], neg[100];
    int pos_index = 0, neg_index = 0;

    fscanf(input, "%d", &n);
    for (int i = 0; i < n; i++) {
        fscanf(input, "%d", &arr[i]);
        if (arr[i] >= 0) {
            pos[pos_index++] = arr[i];
        } else {
            neg[neg_index++] = arr[i];
        }
    }

    // 양수 오름차순 정렬
    qsort(pos, pos_index, sizeof(int), compare_asc);
    // 음수 내림차순 정렬
    qsort(neg, neg_index, sizeof(int), compare_desc);

    // 정렬된 결과 출력
    for (int i = 0; i < pos_index; i++) {
        fprintf(output, "%d ", pos[i]);
    }
    for (int i = 0; i < neg_index; i++) {
        fprintf(output, "%d ", neg[i]);
    }
    fprintf(output, "\n");

    fclose(input);
    fclose(output);
    return 0;
}
