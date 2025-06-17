#include <semaphore.h>
#include <pthread.h>
#include <stdio.h>

#define TRUE 1
#define FALSE 0
#define N 100           // buffer size
#define ITEMS 100000    // # of items to be produced
#define FINISH (-1)     // flag to indicate 'finish'

typedef sem_t semaphore;

semaphore mutex;
semaphore empty;
semaphore full;

#define down(A) sem_wait(A)
#define up(A)   sem_post(A)

int produce_item();
void consume_item(int consumer_id, int item);
void insert_item(int item);
int remove_item();
void producer(void);
void* consumer(void *cid);

int buff[N];
int count = 0;
int rear = -1;
int front = -1;
int inserted_items = 0;

int main()
{
    pthread_t consumer_thr;
    pthread_attr_t attr;
    void *status;
    int cid = 0; // Consumer id

    // Initialize semaphores
    sem_init(&mutex, 0, 1);
    sem_init(&empty, 0, N);
    sem_init(&full, 0, 0);

    // Initialize buffer
    for (int i = 0; i < N; i++)
        buff[i] = 0;
    count = 0;

    // Thread attributes
    pthread_attr_init(&attr);
    pthread_attr_setscope(&attr, PTHREAD_SCOPE_SYSTEM);

    // Create consumer thread
    pthread_create(&consumer_thr, &attr, consumer, &cid);

    // Run producer in main thread
    producer();

    // Wait for consumer to finish
    pthread_join(consumer_thr, &status);

    return 0;
}

// Producer function
void producer(void)
{
    int item;
    while (inserted_items < ITEMS) {
        item = produce_item();

        // [추가] 빈 슬롯이 있는지 대기
        down(&empty);
        // [추가] 임계영역 진입
        down(&mutex);

        insert_item(item);

        // [추가] 임계영역 해제
        up(&mutex);
        // [추가] 소비자에게 가용 아이템 알림
        up(&full);

        inserted_items++;
    }

    // Notify the consumer of finish
    // [추가] 빈 슬롯 대기
    down(&empty);
    // [추가] 임계영역 진입
    down(&mutex);

    insert_item(FINISH);

    // [추가] 임계영역 해제
    up(&mutex);
    // [추가] 소비자에게 가용 아이템 알림
    up(&full);
}

// Consumer function
void* consumer(void *cid)
{
    int consumer_id = *(int *) cid;
    int item;

    while (TRUE) {
        // [추가] 가용 아이템이 있을 때까지 대기
        down(&full);
        // [추가] 임계영역 진입
        down(&mutex);

        item = remove_item();

        // [추가] 임계영역 해제
        up(&mutex);
        // [추가] 생산자에게 빈 슬롯 존재 알림
        up(&empty);

        if (item == FINISH)
            break;

        consume_item(consumer_id, item);
    }

    pthread_exit(NULL);
}

int produce_item()
{
    static int item = 0;
    return item++;
}

void consume_item(int consumer_id, int item)
{
    // Just consume
    printf("Consumer %d consumes: %d\n", consumer_id, item);
}

void insert_item(int item)
{
    rear = (rear + 1) % N;
    buff[rear] = item;
    // count++;
}

int remove_item()
{
    int item;
    front = (front + 1) % N;
    item = buff[front];
    // count--;
    return item;
}
