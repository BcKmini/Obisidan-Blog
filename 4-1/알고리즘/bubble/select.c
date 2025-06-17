#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define SWAP(a, b) { double tmp = (a); (a) = (b); (b) = tmp; }

double* rand_data(int N) {
    double *arr = (double*)malloc(sizeof(double) * N);
    for(int i = 0; i < N; i++) {
        arr[i] = rand() / (double)RAND_MAX;
    }
    return arr;
}

void selectionsort(double arr[], int N) {
    for(int i = 0; i < N - 1; i++) {
        int min_index = i;
        for(int j = i + 1; j < N; j++) {
            if(arr[j] < arr[min_index]) {
                min_index = j;
            }
        }
        if(min_index != i) {
            SWAP(arr[i], arr[min_index]);
        }
    }
}

int main() {
    clock_t tstart;
    int N = 100000;
    double *arr;

    srand((unsigned)time(NULL));
    arr = rand_data(N);

    tstart = clock();
    selectionsort(arr, N);
    printf("Selection sort time: %f\n", (double)(clock() - tstart) / CLOCKS_PER_SEC);

    free(arr);
    return 0;
}
