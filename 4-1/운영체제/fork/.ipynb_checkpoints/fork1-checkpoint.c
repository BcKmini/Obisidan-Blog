#include <sys/types.h>
#include <unistd.h>
#include <sys/wait.h>
#include <stdio.h>
int main(void)
{
    int pid, status;
    pid = fork();
    if (pid > 0) {
    /* parent process */
        printf("PARENT: child=%d\n", pid);
        do { } while (1);
        } else { /* pid == 0 */
        /* child process */
        printf("CHILD: child process is running.\n");
        do { } while (1);
    }
}