#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

// 앞서 정의한 정렬 함수들의 프로토타입 선언
void bubbleSort(int arr[], int n);
void selectionSort(int arr[], int n);
void insertionSort(int arr[], int n);

int main() {
    int sizes[] = {50000, 100000, 200000, 400000, 1000000};
    int numSizes = sizeof(sizes) / sizeof(sizes[0]);
    int i, j;
    
    for(i = 0; i < numSizes; i++) {
        int n = sizes[i];
        int *arr = (int*) malloc(n * sizeof(int));
        int *temp = (int*) malloc(n * sizeof(int));
        
        for(j = 0; j < n; j++) {
            arr[j] = rand();
        }
        
        clock_t start, end;
        double time_taken;
        
        memcpy(temp, arr, n * sizeof(int));
        start = clock();
        bubbleSort(temp, n);
        end = clock();
        time_taken = (double)(end - start) / CLOCKS_PER_SEC;
        printf("버블 정렬, n = %d, 실행 시간: %f 초\n", n, time_taken);
        
        memcpy(temp, arr, n * sizeof(int));
        start = clock();
        selectionSort(temp, n);
        end = clock();
        time_taken = (double)(end - start) / CLOCKS_PER_SEC;
        printf("선택 정렬, n = %d, 실행 시간: %f 초\n", n, time_taken);
        

        memcpy(temp, arr, n * sizeof(int));
        start = clock();
        insertionSort(temp, n);
        end = clock();
        time_taken = (double)(end - start) / CLOCKS_PER_SEC;
        printf("삽입 정렬, n = %d, 실행 시간: %f 초\n", n, time_taken);
        
        printf("------------------------------------------------------\n");
        
        free(arr);
        free(temp);
    }
    
    return 0;
}
