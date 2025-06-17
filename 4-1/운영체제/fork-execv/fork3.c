#include <sys/types.h>
#include <unistd.h>
#include <sys/wait.h>
#include <string.h>
#include <stdio.h>
int main(void)
{
    int pid, status;
    char *arg[] = { "./hello", NULL } ;
    char ch;

    pid = fork();
    if (pid > 0) {
        /* parent process */
        printf("PARENT: Child pid = %d\n", pid);
        waitpid(pid, &status, 0);
        printf("PARENT: Child exited.\n");
    } else {
    /* child process */
        printf("CHILD: Child process image will be replaced by %s\n", arg[0]);
        execv(arg[0], arg);
    }
}