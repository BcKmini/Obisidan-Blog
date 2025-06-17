// C program to implement Shortest Job first with Arrival Time
#include <stdio.h>
#define NUM_PROC    10000

int mat[NUM_PROC][6];
/*  mat[i][0]: process ID
    mat[i][1]: arrival time
    mat[i][2]: burst time
    mat[i][3]:
    mat[i][4]: waiting time
    mat[i][5]: turnaround time
    mat[i][6]:
*/

void swap(int *a, int *b)
{
    int temp = *a;
    *a = *b;
    *b = temp;
}

void arrangeArrival(int num, int mat[][6])
{
    for(int i=0; i<num; i++) {
        for(int j=0; j<num-i-1; j++) {
            if(mat[j][1] > mat[j+1][1]) {
                for(int k=0; k<5; k++) {
                    swap(&mat[j][k], &mat[j+1][k]);
                }
            }
        }
    }
}

void completionTime(int num, int mat[][6])
{
    int temp, val;
    mat[0][3] = mat[0][1] + mat[0][2];
    mat[0][5] = mat[0][3] - mat[0][1];
    mat[0][4] = mat[0][5] - mat[0][2];

    for(int i=1; i<num; i++) {
        temp = (mat[i-1][3]>mat[i][1]) ? mat[i-1][3] : mat[i][1];	// earliest start time of the next job
        int low = mat[i][2];
        for(int j=i; j<num; j++) {
            if(temp >= mat[j][1] && low >= mat[j][2]) {
                low = mat[j][2];
                val = j;
            }
        }
        mat[val][3] = temp + mat[val][2];
        mat[val][5] = mat[val][3] - mat[val][1];
        mat[val][4] = mat[val][5] - mat[val][2];
        for(int k=0; k<6; k++) {
            swap(&mat[val][k], &mat[i][k]);
        }
    }
}

int main()
{
    int     num = 0;
    int     i = 0;
    int     readnum;

    // Read data: arrival time, burst time
    do {
        readnum = scanf("%d %d", &mat[i][1], &mat[i][2]);   // arrival time, burst time
        if (readnum <= 0)       // End-of-file or zero data
            break;
        mat[i][0] = i;          // Process ID
        i++;
    } while (1);
    num = i;

    arrangeArrival(num, mat);
    completionTime(num, mat);

    // Display processes along with all details
    printf("ProcessID  Arrival Time  Burst Time  Waiting Time  Turnaround Time  Completion Time\n");
    int total_wt = 0, total_tat = 0;
    for (int i = 0 ; i < num ; i++)
    {
        total_wt = total_wt + mat[i][4];
        total_tat = total_tat + mat[i][5];
        int compl_time = mat[i][5] + mat[i][1];
        printf("    %5d       %7d     %7d       %7d          %7d          %7d\n",
               mat[i][0], mat[i][1], mat[i][2], mat[i][4], mat[i][5], compl_time);
    }
    printf("Avg. Waiting Time    = %9.2f\n", (float)total_wt / (float)num);
    printf("Avg. Turnaround Time = %9.2f\n", (float)total_tat / (float)num);
}

