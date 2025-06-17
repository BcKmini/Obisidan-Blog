/* File: simulation.c
 * 목적: C언어로 각 정렬 알고리즘(쉘 정렬, heap 정렬, 합병 정렬, quick 정렬)의 실행 시간을 측정하는 시뮬레이션 코드.
 *       배열의 데이터는 0.0 ~ 1.0 범위의 double형 난수로 채워짐.
 *       테스트 배열 크기: 10,000,000; 20,000,000; 40,000,000; 80,000,000; 160,000,000.
 *       실행 시간이 600초(10분) 이상일 경우 "추정(실행시간)" 형식으로 출력함.
 *       결과는 보기 쉬운 테이블 형태로 출력됨.
 */

 #include <stdio.h>
 #include <stdlib.h>
 #include <time.h>
 #include <string.h>
 
 /* 쉘 정렬 함수 (C언어 구현)
    - 미리 정의된 gap sequence를 적용하여 삽입 정렬 방식으로 정렬 */
 void shellSort(double arr[], int n) {
     int gaps[] = {1073643521, 603906049, 268386305, 150958081, 67084289, 37730305, 16764929,
                   9427969, 4188161, 2354689, 1045505, 587521, 260609, 146305, 64769, 36289,
                   16001, 8929, 3905, 2161, 929, 505, 209, 109, 41, 19, 5, 1};
     int gapCount = sizeof(gaps) / sizeof(gaps[0]);
     for (int k = 0; k < gapCount; k++) {
         int gap = gaps[k];
         if (gap > n)
             continue;
         for (int i = gap; i < n; i++) {
             double temp = arr[i];
             int j = i;
             while (j >= gap && arr[j - gap] > temp) {
                 arr[j] = arr[j - gap];
                 j -= gap;
             }
             arr[j] = temp;
         }
     }
 }
 
 /* Heap 정렬 함수 (C언어 구현)
    - 최대 힙(max heap)을 구성한 후 정렬 수행 */
 void heapify(double arr[], int n, int i) {
     int largest = i;
     int left = 2 * i + 1;
     int right = 2 * i + 2;
     if (left < n && arr[left] > arr[largest])
         largest = left;
     if (right < n && arr[right] > arr[largest])
         largest = right;
     if (largest != i) {
         double temp = arr[i];
         arr[i] = arr[largest];
         arr[largest] = temp;
         heapify(arr, n, largest);
     }
 }
 
 void heapSort(double arr[], int n) {
     for (int i = n / 2 - 1; i >= 0; i--) {
         heapify(arr, n, i);
     }
     for (int i = n - 1; i >= 0; i--) {
         double temp = arr[0];
         arr[0] = arr[i];
         arr[i] = temp;
         heapify(arr, i, 0);
     }
 }
 
 /* 합병 정렬 함수 (C언어 구현)
    - 재귀적으로 배열을 분할 후 두 정렬된 배열 부분을 병합 */
 void merge(double arr[], int left, int mid, int right) {
     int n1 = mid - left + 1;
     int n2 = right - mid;
     double *L = (double *) malloc(n1 * sizeof(double));
     double *R = (double *) malloc(n2 * sizeof(double));
     if (L == NULL || R == NULL) {
         fprintf(stderr, "메모리 할당 실패\n");
         exit(EXIT_FAILURE);
     }
     for (int i = 0; i < n1; i++)
         L[i] = arr[left + i];
     for (int j = 0; j < n2; j++)
         R[j] = arr[mid + 1 + j];
     int i = 0, j = 0, k = left;
     while (i < n1 && j < n2) {
         if (L[i] <= R[j])
             arr[k++] = L[i++];
         else
             arr[k++] = R[j++];
     }
     while (i < n1)
         arr[k++] = L[i++];
     while (j < n2)
         arr[k++] = R[j++];
     free(L);
     free(R);
 }
 
 void mergeSort(double arr[], int left, int right) {
     if (left < right) {
         int mid = left + (right - left) / 2;
         mergeSort(arr, left, mid);
         mergeSort(arr, mid + 1, right);
         merge(arr, left, mid, right);
     }
 }
 
 /* Quick 정렬 함수 (C언어 구현)
    - 마지막 요소를 pivot으로 선택하여 partition 후 재귀적으로 정렬 */
 int partition(double arr[], int low, int high) {
     double pivot = arr[high];
     int i = low - 1;
     for (int j = low; j < high; j++) {
         if (arr[j] < pivot) {
             i++;
             double temp = arr[i];
             arr[i] = arr[j];
             arr[j] = temp;
         }
     }
     double temp = arr[i + 1];
     arr[i + 1] = arr[high];
     arr[high] = temp;
     return i + 1;
 }
 
 void quickSort(double arr[], int low, int high) {
     if (low < high) {
         int pi = partition(arr, low, high);
         quickSort(arr, low, pi - 1);
         quickSort(arr, pi + 1, high);
     }
 }
 
 /* 메인 시뮬레이션 함수
    - 각 정렬 알고리즘별로 동일한 난수 배열을 복사하여 실행 시간을 측정
    - 실행 시간이 600초 이상일 경우 "추정(실행시간)"으로 표시
    - 결과를 보기 좋은 테이블 형태로 출력 */
 int main() {
     // 테스트할 배열 크기 (10,000,000; 20,000,000; 40,000,000; 80,000,000; 160,000,000)
     int sizes[] = {10000000, 20000000, 40000000, 80000000, 160000000};
     int numSizes = sizeof(sizes) / sizeof(sizes[0]);
     srand((unsigned int) time(NULL));
 
     // 테이블 헤더 출력 (테두리 포함)
     printf("+--------------+----------------+----------------+----------------+----------------+\n");
     printf("|      n       |    쉘정렬     |   heap정렬     |   합병정렬     |   quick정렬    |\n");
     printf("+--------------+----------------+----------------+----------------+----------------+\n");
 
     for (int idx = 0; idx < numSizes; idx++) {
         int n = sizes[idx];
         double *original = (double *) malloc(n * sizeof(double));
         if (original == NULL) {
             printf("메모리 할당 실패: n = %d\n", n);
             continue;
         }
 
         // 난수 생성: double형 난수 (0.0 ~ 1.0)
         for (int i = 0; i < n; i++) {
             original[i] = (double) rand() / (double) RAND_MAX;
         }
 
         double timeShell = 0, timeHeap = 0, timeMerge = 0, timeQuick = 0;
         clock_t start, end;
         double duration;
         char shell_str[50], heap_str[50], merge_str[50], quick_str[50];
 
         // 쉘 정렬 테스트
         double *arr = (double *) malloc(n * sizeof(double));
         if (arr == NULL) { free(original); continue; }
         memcpy(arr, original, n * sizeof(double));
         start = clock();
         shellSort(arr, n);
         end = clock();
         duration = ((double)(end - start)) / CLOCKS_PER_SEC;
         timeShell = duration;
         free(arr);
 
         // heap 정렬 테스트
         arr = (double *) malloc(n * sizeof(double));
         if (arr == NULL) { free(original); continue; }
         memcpy(arr, original, n * sizeof(double));
         start = clock();
         heapSort(arr, n);
         end = clock();
         duration = ((double)(end - start)) / CLOCKS_PER_SEC;
         timeHeap = duration;
         free(arr);
 
         // 합병 정렬 테스트
         arr = (double *) malloc(n * sizeof(double));
         if (arr == NULL) { free(original); continue; }
         memcpy(arr, original, n * sizeof(double));
         start = clock();
         mergeSort(arr, 0, n - 1);
         end = clock();
         duration = ((double)(end - start)) / CLOCKS_PER_SEC;
         timeMerge = duration;
         free(arr);
 
         // quick 정렬 테스트
         arr = (double *) malloc(n * sizeof(double));
         if (arr == NULL) { free(original); continue; }
         memcpy(arr, original, n * sizeof(double));
         start = clock();
         quickSort(arr, 0, n - 1);
         end = clock();
         duration = ((double)(end - start)) / CLOCKS_PER_SEC;
         timeQuick = duration;
         free(arr);
 
         free(original);
 
         // 실행 시간이 600초 이상이면 "추정(실행시간)" 형식으로 문자열 생성
         if (timeShell >= 600.0)
             sprintf(shell_str, "추정(%.2fs)", timeShell);
         else
             sprintf(shell_str, "%.2fs", timeShell);
         if (timeHeap >= 600.0)
             sprintf(heap_str, "추정(%.2fs)", timeHeap);
         else
             sprintf(heap_str, "%.2fs", timeHeap);
         if (timeMerge >= 600.0)
             sprintf(merge_str, "추정(%.2fs)", timeMerge);
         else
             sprintf(merge_str, "%.2fs", timeMerge);
         if (timeQuick >= 600.0)
             sprintf(quick_str, "추정(%.2fs)", timeQuick);
         else
             sprintf(quick_str, "%.2fs", timeQuick);
 
         // 테이블 행 출력 (각 열의 폭은 16자로 고정)
         printf("|%12d |%16s |%16s |%16s |%16s |\n", n, shell_str, heap_str, merge_str, quick_str);
     }
     printf("+--------------+----------------+----------------+----------------+----------------+\n");
 
     return 0;
 }
 