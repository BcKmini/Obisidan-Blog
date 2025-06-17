#define ITER (50000000)
#include <pthread.h>
#include <stdio.h>
int gvar = 0;

void * X(void *i);
        int main(void)
        {
        pthread_t t1;
        pthread_attr_t attr;
        void *status;
        int j;

        pthread_create(&t1, &attr, X, NULL);
        // Main thread
        /////////////////////////
        for (j = 0; j < ITER; j++) {
        gvar = gvar + 1;
        }
        /////////////////////////

        pthread_join(t1, &status);
        printf("%d\n", gvar);
}

void * X(void *i)
        {
        int j;
        
        // Child thread
        /////////////////////////
        for (j = 0; j < ITER; j++) {
        gvar = gvar + 1;
        }
        /////////////////////////
        pthread_exit(NULL);
        }