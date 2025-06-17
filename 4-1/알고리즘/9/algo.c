#include <stdio.h>
#include <limits.h>               // INT_MAX 사용 위해 추가

// 수정 포인트: 도시 개수 변경 시 V 값만 수정
#define V 10                     

const char* cityNames[V] = {
    // 수정 포인트: 순서 변경 시 graph 초기화도 동일한 인덱스 기준으로 맞출 것
    "서울","천안","논산","광주","대전",
    "원주","강릉","포항","대구","부산"
};

const int INF = INT_MAX;

// 수정 포인트: graph[i][j]에 각 구간 가중치 입력, 연결 없으면 INF
int graph[V][V] = {
    /* 서울 */ {   0,  12, INF, INF, INF,  15, INF, INF, INF, INF},
    /* 천안 */ {  12,   0,   4, INF,  10, INF, INF, INF, INF, INF},
    /* 논산 */ { INF,   4,   0,  13,   3, INF, INF, INF, INF, INF},
    /* 광주 */ { INF, INF,  13,   0, INF, INF, INF, INF, INF,  15},
    /* 대전 */ { INF,  10,   3, INF,   0, INF, INF, INF,  10, INF},
    /* 원주 */ {  15, INF, INF, INF, INF,   0,  21, INF,   7, INF},
    /* 강릉 */ { INF, INF, INF, INF, INF,  21,   0,  25, INF, INF},
    /* 포항 */ { INF, INF, INF, INF, INF, INF,  25,   0,  19,   5},
    /* 대구 */ { INF, INF, INF, INF,  10,   7, INF,  19,   0,   9},
    /* 부산 */ { INF, INF, INF,  15, INF, INF, INF,   5,   9,   0}
};

void dijkstra(int src, int dist[], int prev[]) {
    int visited[V] = {0};

    // 초기화
    for (int i = 0; i < V; i++) {
        dist[i] = graph[src][i];
        prev[i] = (graph[src][i] != INF && i != src) ? src : -1;
    }
    dist[src] = 0;
    visited[src] = 1;

    // 메인 루프
    for (int k = 1; k < V; k++) {
        int min = INF, u = -1;
        for (int i = 0; i < V; i++) {
            if (!visited[i] && dist[i] < min) {
                min = dist[i];
                u = i;
            }
        }
        if (u == -1) break;
        visited[u] = 1;

        // 인접 정점 완화
        for (int v = 0; v < V; v++) {
            if (!visited[v] && graph[u][v] != INF
                && dist[u] + graph[u][v] < dist[v]) {
                dist[v] = dist[u] + graph[u][v];
                prev[v] = u;
            }
        }
    }
}

// 경로 재구성 및 출력
void printPath(int prev[], int v) {
    if (v < 0) return;
    printPath(prev, prev[v]);
    printf("%s ", cityNames[v]);
}

int main() {
    int dist[V], prev[V];

    // 시작점(src) 변경 시 두 번째 인자 src 인덱스 조정
    dijkstra(0, dist, prev);  // 0: 서울

    printf("서울 기준 최단 경로 및 거리\n");
    for (int i = 0; i < V; i++) {
        if (i == 0) {
            printf("서울 → 서울 : 0\n");
        } else if (dist[i] != INF) {
            printf("서울 → ");
            printPath(prev, i);
            printf(": %d\n", dist[i]);
        } else {
            printf("서울 → %s: 연결 없음\n", cityNames[i]);
        }
    }

    return 0;
}
