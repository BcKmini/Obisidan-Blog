#include <pthread.h>
#include <stdio.h>
void * X(void *p);
void Y(int j);
int global = 0;
int main()
{
pthread_t t1;
    void *status;
    printf("\n");
    pthread_create(&t1, NULL, X, NULL);
    Y(1);
    pthread_join(t1, &status);
    printf("global=%d in main thread after the child thread exiting\n",
    global);
    }

void * X(void *p)
    {
    int i;
    do {
    global = 2;
    for (i = 0; i < 100000; i++) ;
    printf("Child thread: global=%d\n", global);
    } while (1);
    pthread_exit((void *)NULL);
    }

void Y(int j)
{
    int i;
    do {
    global = j;
    for (i = 0; i < 100000; i++) ;
    printf("Main thread: global=%d\n", global);
    } while (1);
}