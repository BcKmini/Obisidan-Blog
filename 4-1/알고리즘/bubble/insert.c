#include <stdio.h>
#include <stdlib.h>
#include <time.h>

double* rand_data(int N) {
    double *arr = (double*)malloc(sizeof(double) * N);
    for(int i = 0; i < N; i++) {
        arr[i] = rand() / (double)RAND_MAX;
    }
    return arr;
}

void insertionsort(double arr[], int N) {
    for(int i = 1; i < N; i++) {
        double key = arr[i];
        int j = i - 1;
        while(j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}

int main() {
    clock_t tstart;
    int N = 100000;
    double *arr;

    srand((unsigned)time(NULL));
    arr = rand_data(N);

    tstart = clock();
    insertionsort(arr, N);
    printf("Insertion sort time: %f\n", (double)(clock() - tstart) / CLOCKS_PER_SEC);

    free(arr);
    return 0;
}
