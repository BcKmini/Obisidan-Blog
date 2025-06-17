#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#define SWAP(a,b) { double t=(a);(a)=(b);(b)=t; }

void bubblesort(double arr[], int N) {
    for(int k=1; k<N; k++) {
        for(int i=0; i<N-k; i++) {
            if(arr[i] > arr[i+1]) {
                SWAP(arr[i], arr[i+1]);
            }
        }
    }
}

void selectionsort(double arr[], int N) {
    for(int i=0; i<N-1; i++) {
        int min_index = i;
        for(int j=i+1; j<N; j++) {
            if(arr[j] < arr[min_index]) {
                min_index = j;
            }
        }
        if(min_index != i) {
            SWAP(arr[i], arr[min_index]);
        }
    }
}

void insertionsort(double arr[], int N) {
    for(int i=1; i<N; i++) {
        double key = arr[i];
        int j = i - 1;
        while(j >= 0 && arr[j] > key) {
            arr[j+1] = arr[j];
            j--;
        }
        arr[j+1] = key;
    }
}

double* rand_data(int N) {
    double* arr = (double*)malloc(sizeof(double)*N);
    for(int i=0; i<N; i++) {
        arr[i] = rand() / (double)RAND_MAX;
    }
    return arr;
}

// , 100000, 200000, 400000, 1000000
int main() {
    srand((unsigned)time(NULL));
    int sizes[] = {50000};
    double bubbleTimes[5], selectionTimes[5], insertionTimes[5];

    for(int i=0; i<5; i++) {
        int N = sizes[i];
        double* arr = rand_data(N);
        clock_t start = clock();
        bubblesort(arr, N);
        clock_t end = clock();
        bubbleTimes[i] = (double)(end - start) / CLOCKS_PER_SEC;
        free(arr);

        arr = rand_data(N);
        start = clock();
        selectionsort(arr, N);
        end = clock();
        selectionTimes[i] = (double)(end - start) / CLOCKS_PER_SEC;
        free(arr);

        arr = rand_data(N);
        start = clock();
        insertionsort(arr, N);
        end = clock();
        insertionTimes[i] = (double)(end - start) / CLOCKS_PER_SEC;
        free(arr);
    }

    printf("   n    |  Bubble Sort   | Selection Sort  | Insertion Sort\n");
    printf("------------------------------------------------------------\n");
    for(int i=0; i<5; i++) {
        printf("%7d | %14f | %14f | %14f\n",
               sizes[i], bubbleTimes[i], selectionTimes[i], insertionTimes[i]);
    }
    printf("------------------------------------------------------------\n");
    return 0;
}
