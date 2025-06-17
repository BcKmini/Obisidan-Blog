#include <stdio.h>
#include <time.h>
#include <stdlib.h>

int *find_bad_coin3(int *coins, int n);

int main(int argc, char *argv[]) {
    int i, n, fake;
    int *coins, *bad_coin;
    
    if (argc < 2) {
        printf("Usage: %s <number of coins>\n", argv[0]);
        return 1;
    }

    n = atoi(argv[1]);

    srand(time(NULL));
    coins = (int *) malloc(n * sizeof(int)); // n만큼 할당, 가짜 동전을 포함할 수 있도록

    for(i = 0; i < n; i++) 
        coins[i] = 10; // 동전 모두 10으로 설정 (진짜 동전)

    fake = rand() % n;  // 가짜 동전 위치 랜덤으로 선택
    coins[fake] = 5;     // 가짜 동전의 값은 5로 설정

    bad_coin = find_bad_coin3(coins, n);  // 가짜 동전 찾기
    printf("coins[%d] = %d, found bad coin at index: %d, coins[%d] = %d\n", 
           fake, coins[fake], (int)(bad_coin - coins), (int)(bad_coin - coins), *bad_coin);

    free(coins); // 메모리 해제
    return 0;
}

int *find_bad_coin3(int *coins, int n) {
    int i, one3rd = (n + 2) / 3, sum1 = 0, sum2 = 0, sum3 = 0;
    static int count = 0;

    if (n <= 3) {
        count++;
        printf("Found it! with %d iteration\n", count);
        if (coins[0] < coins[1]) return coins;
        else if (coins[1] < coins[2]) return coins + 1;
        else return coins + 2;
    }

    int *coins2 = coins + one3rd;
    int *coins3 = coins + 2 * one3rd;

    for (i = 0; i < one3rd; i++) {
        sum1 += coins[i];
        sum2 += coins2[i];
        sum3 += coins3[i];
    }

    count++;

    if (sum1 < sum2)
        return find_bad_coin3(coins, one3rd);
    else if (sum2 < sum3)
        return find_bad_coin3(coins2, one3rd);
    else
        return find_bad_coin3(coins3, one3rd);
}
