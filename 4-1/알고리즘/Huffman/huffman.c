#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#define MAX_SYMBOLS 128     // ASCII 범위
#define MAX_QUEUE   256     // 허프만 노드 최대 수

// 허프만 트리 노드
typedef struct Node {
    unsigned freq;
    unsigned char sym;      // 심볼 (아스키 코드)
    struct Node *left, *right;
} Node;

// 최소 힙(우선순위 큐) 구조
typedef struct {
    Node *data[MAX_QUEUE];
    int size;
} MinHeap;

// 전역 변수: 빈도 테이블, 코드 저장소
unsigned freq[MAX_SYMBOLS];
char *code[MAX_SYMBOLS];

// 노드 생성
Node* newNode(unsigned char sym, unsigned freq, Node *l, Node *r) {
    Node *n = malloc(sizeof(Node));
    n->sym   = sym;
    n->freq  = freq;
    n->left  = l;
    n->right = r;
    return n;
}

// 최소 힙 초기화
void heapInit(MinHeap *h) {
    h->size = 0;
}

// 힙에 노드 삽입 (상향식)
void heapPush(MinHeap *h, Node *n) {
    int i = h->size++;
    while (i > 0) {
        int p = (i - 1) / 2;
        if (h->data[p]->freq <= n->freq) break;
        h->data[i] = h->data[p];
        i = p;
    }
    h->data[i] = n;
}

// 힙에서 최소 노드 추출 (하향식)
Node* heapPop(MinHeap *h) {
    Node *min = h->data[0];
    Node *last = h->data[--h->size];
    int i = 0;
    while (1) {
        int l = 2*i + 1, r = l + 1;
        if (l >= h->size) break;
        int m = (r < h->size && h->data[r]->freq < h->data[l]->freq) ? r : l;
        if (last->freq <= h->data[m]->freq) break;
        h->data[i] = h->data[m];
        i = m;
    }
    h->data[i] = last;
    return min;
}

// 허프만 트리에서 코드 테이블 생성 (DFS)
void buildCodes(Node *root, char *prefix) {
    if (!root) return;
    // 리프 노드인 경우
    if (!root->left && !root->right) {
        code[root->sym] = strdup(prefix);
    } else {
        int len = strlen(prefix);
        prefix[len] = '0';
        prefix[len+1] = '\0';
        buildCodes(root->left, prefix);
        prefix[len] = '1';
        buildCodes(root->right, prefix);
        prefix[len] = '\0';  // backtrack
    }
}

// 트리 메모리 해제
void freeTree(Node *r) {
    if (!r) return;
    freeTree(r->left);
    freeTree(r->right);
    free(r);
}

int main(void) {
    FILE *fp = fopen("passwd.txt", "r");
    if (!fp) {
        perror("파일 열기 실패");
        return 1;
    }

    // 1) 파일 전체를 읽어 영숫자만 소문자화하여 빈도 집계
    int c;
    while ((c = fgetc(fp)) != EOF) {
        if (isalnum(c)) {
            unsigned char lc = tolower(c);
            freq[lc]++;
        }
    }
    fclose(fp);

    // 2) 빈도 >0인 심볼로 최소 힙 초기화
    MinHeap heap;
    heapInit(&heap);
    for (int i = 0; i < MAX_SYMBOLS; i++) {
        if (freq[i] > 0) {
            heapPush(&heap, newNode((unsigned char)i, freq[i], NULL, NULL));
        }
    }

    // 3) 허프만 트리 구성
    while (heap.size > 1) {
        Node *n1 = heapPop(&heap);
        Node *n2 = heapPop(&heap);
        Node *parent = newNode(0, n1->freq + n2->freq, n1, n2);
        heapPush(&heap, parent);
    }
    Node *root = heapPop(&heap);

    // 4) 코드 테이블 생성
    char prefix[256] = {0};
    buildCodes(root, prefix);

    // 5) 코드북 출력 (알파벳·숫자만 보기)
    printf("Symbol | Frequency | Huffman Code\n");
    printf("---------------------------------\n");
    for (int i = '0'; i <= '9'; i++) {
        if (freq[i] > 0) printf("  %c    |    %6u | %s\n", i, freq[i], code[i]);
    }
    for (int i = 'a'; i <= 'z'; i++) {
        if (freq[i] > 0) printf("  %c    |    %6u | %s\n", i, freq[i], code[i]);
    }
    printf("\n");

    // 6) "kimchang" 인코딩
    const char *msg = "kimchang";
    printf("Encoded \"%s\": ", msg);
    for (const char *p = msg; *p; ++p) {
        unsigned char lc = tolower(*p);
        printf("%s", code[lc]);
    }
    printf("\n");

    // 7) 정리
    freeTree(root);
    for (int i = 0; i < MAX_SYMBOLS; i++) {
        free(code[i]);
    }
    return 0;
}
