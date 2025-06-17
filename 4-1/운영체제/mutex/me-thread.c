#define ITER (50000000)
#include <pthread.h>
#include <stdio.h>

int gvar = 0;
void * X(void *i);
pthread_mutex_t m;
int main(void)
{
        pthread_t t1;
        pthread_attr_t attr;
        void *status;
        int j;
        pthread_attr_init(&attr);
        pthread_attr_setscope(&attr, PTHREAD_SCOPE_SYSTEM);
        pthread_create(&t1, &attr, X, NULL);
        // Main thread
        for (j = 0; j < ITER; j++) {
        pthread_mutex_lock(&m);
        gvar = gvar + 1;
        pthread_mutex_unlock(&m);
        }
        /////////////////////////
        pthread_join(t1, &status);
        printf("%d\n", gvar);
}
void * X(void *i){
    int j;
    // Child thread
    for ( j = 0; j < ITER; j ++) {
        pthread_mutex_lock(&m);
        gvar = gvar + 1;
        pthread_mutex_unlock(&m);
    }

    pthread_exit(NULL);
}