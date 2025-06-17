#include <stdio.h>

int main() {
    int coins[90];
    for (int i = 0; i < 90; i++) {
        coins[i] = i + 1;
    }

    int arr[] = {10, 20, 5};
    int min = arr[0];
    for (int i = 1; i < 3; i++) {
        if (arr[i] < min) {
            min = arr[i];
        }
    }
    printf("Smallest coin: %d\n", min);

    int arr9[] = {25, 20, 30, 10, 40, 50, 60, 80, 70};
    min = arr9[0];
    for (int i = 1; i < 9; i++) {
        if (arr9[i] < min) {
            min = arr9[i];
        }
    }
    printf("Smallest coin from 9: %d\n", min);

    int arr3[] = {30, 25, 10, 20, 50, 60, 70, 80, 40};
    int group1 = arr3[0], group2 = arr3[3], group3 = arr3[6];
    int groupMin = (group1 < group2) ? (group1 < group3 ? group1 : group3) : (group2 < group3 ? group2 : group3);
    printf("Smallest coin from 3 groups: %d\n", groupMin);

    return 0;
}
