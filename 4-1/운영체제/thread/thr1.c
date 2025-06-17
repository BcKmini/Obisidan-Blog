#include <pthread.h>
#include <stdio.h>
#include <unistd.h>
void * func(void *i);
int main(void)
{
        pthread_t thr;
        printf("\n");
        pthread_create(&thr, NULL, func, NULL);
        printf("Main thread ...\n");
        pthread_join(thr, NULL);
        printf("Joined ...\n");
        }
        
void * func(void *arg)
        {
        printf("Child thread ...\n");
        sleep(60);
        pthread_exit(NULL);
}