#include <sys/types.h>
#include <unistd.h>
#include <sys/wait.h>
#include <stdio.h>

int main(void)
{
    int pid, status;
    pid = fork();
    if (pid > 0) {
        printf("PARENT: Child pid = %d\n", pid);
        waitpid(pid, &status, 0);
        printf("PARENT: Child exited (parent is still running)\n");
        do {} while (1);
    } else {
        printf("CHILD : Child process is running.\n");
        do {} while (1);
    }
}
