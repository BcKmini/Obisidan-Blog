#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#define TRUE    1
#define FALSE   0
int main(int argc, char *argv[])
{
        if (argc < 2) {
                fprintf(stderr, "Please provide the number of pairs <arrival time, burst time>\n");
                fprintf(stderr, "Ex: gen_rand 100\n");
                exit(1);
        }

        int     n = atoi(argv[1]);
        int     ATZERO = FALSE;
        if (argc == 3 && atoi(argv[2]) == 0)
                ATZERO = TRUE;          // arrival time is always 0
        int     at, bt;         // arrival time, burst time
        int     cur_at;
        srand(time(NULL));
        for (int i = 0; i < n; i++) {
                at = rand() % 11;               // 0 ~ 10
                bt = rand() % 10 + 1;   // 1 ~ 10
                cur_at = cur_at + at;
                if (ATZERO)
                        printf("%d %d\n", 0, bt);
                else
                        printf("%d %d\n", cur_at, bt);
        }
}

