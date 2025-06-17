#include <sys/types.h>
#include <unistd.h>
#include <sys/wait.h>
#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int pid, status;
    char *arg[] = { "./hello", NULL };

    while(1) {
        pid = fork();
        if (pid > 0) {
            printf("PARENT: Child pid = %d\n", pid);
            waitpid(pid, &status, 0);
            printf("PARENT: Child exited.\n");
        } else if (pid == 0) {
            printf("CHILD: Child process image will be replaced by %s\n", arg[0]);
            execv(arg[0], arg);
            perror("execv");
            exit(1);
        } else {
            perror("fork");
            exit(1);
        }
    }
    return 0;
}
