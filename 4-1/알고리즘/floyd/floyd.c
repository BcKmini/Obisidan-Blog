#include <stdio.h>
#define N 10
#define INF 9999

int D[N][N] = {
    { 0,12,INF,INF,INF,15,INF,INF,INF,INF},
    {12, 0, 4,10,INF,INF,INF,INF,INF,INF},
    {INF, 4, 0, 3,13,INF,INF,INF,INF,INF},
    {INF,10, 3, 0,INF,INF,INF,10,INF,INF},
    {INF,INF,13,INF, 0,INF,INF,INF,15,INF},
    {15,INF,INF,INF,INF, 0,21, 7,INF,INF},
    {INF,INF,INF,INF,INF,21, 0,INF,INF,25},
    {INF,INF,INF,10,INF, 7,INF, 0, 9,19},
    {INF,INF,INF,INF,15,INF,INF, 9, 0, 5},
    {INF,INF,INF,INF,INF,INF,25,19, 5, 0}
};

int Path[N][N];

// 도시 이름 정의
char *city_names[] = {
    "서울", "천안", "논산", "대전", "광주", 
    "원주", "강릉", "대구", "부산", "포항"
};

void print_path(int i, int j) {
    if (Path[i][j] == -1 || i == j) return;

    printf("%s -> ", city_names[i]);
    while (i != j) {
        i = Path[i][j];
        printf("%s", city_names[i]);
        if (i != j) printf(" -> ");
    }
    printf("\n");
}

int main() {
    int i, j, k, tmp;

    // 초기 경로 설정
    for (i = 0; i < N; i++)
        for (j = 0; j < N; j++)
            Path[i][j] = (D[i][j] != INF && i != j) ? j : -1;

    // Floyd-Warshall 알고리즘
    for (k = 0; k < N; k++) {
        for (i = 0; i < N; i++) {
            if (i == k) continue;
            for (j = 0; j < N; j++) {
                if (j == k || j == i) continue;
                if (D[i][k] == INF || D[k][j] == INF) continue;

                tmp = D[i][k] + D[k][j];
                if (tmp < D[i][j]) {
                    D[i][j] = tmp;
                    Path[i][j] = Path[i][k];
                }
            }
        }
    }

    // 결과 출력
    for (i = 0; i < N; i++) {
        for (j = 0; j < N; j++) {
            if (i != j && D[i][j] != INF) {
                printf("%s to %s (cost: %d): ", city_names[i], city_names[j], D[i][j]);
                print_path(i, j);
            }
        }
    }

    return 0;
}
