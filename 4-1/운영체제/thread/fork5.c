#include <unistd.h>
#include <sys/wait.h>
#include <stdio.h>
#include <stdlib.h>
void X(int i);
int global = 0;
int main(void)
    {
    int status;
    if (fork() != 0) {
    X(1);
    waitpid(-1, &status, 0);
    } else {
    X(2);
    exit(0);
    }
    printf("global = %d after child process exits\n", global);
    }
void X(int i)
    {
    global = i;
    printf("global = %d\n", global);
}