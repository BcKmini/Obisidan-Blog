#include <stdio.h>

int *bsearch(int *arr, int key, int n);

int main() {
    int a[] = {10, 20, 25, 35, 45, 55, 60, 75, 80, 90, 95};
    int *aptr, key;
    int end = sizeof(a) / sizeof(int);
    puts("Enter key: ");
    scanf("%d", &key);
    aptr = bsearch(a, key, end);
    if (aptr == NULL)
        printf("%d is not found\n", key);
    else
        printf("A[%d]=%d,%d\n", aptr - a, *aptr, (int)(aptr - a));
}

int *bsearch(int *arr, int key, int n) {
    int mid = n / 2;
    if (n == 1)
        return arr[0] == key ? arr : NULL;
    if (key < arr[mid])
        return bsearch(arr, key, mid);
    else
        return bsearch(arr + mid, key, n - mid);
}
