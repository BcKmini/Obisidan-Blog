#include <sys/types.h>
#include <unistd.h>
#include <sys/wait.h>
#include <stdio.h>

int main(void)
{

    int pid, status;

    pid = fork();
    printf("pid = %d\n", pid);
    while ( 1 ) ;
    
}