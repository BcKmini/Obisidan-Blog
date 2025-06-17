#include <stdio.h>

#define NUM_PROC    10000

// Function to find the waiting time for all
// processes
void findWaitingTime(int n, int bt[], int wt[], int at[])
{
    int service_time[n];
    service_time[0] = at[0];
    wt[0] = 0;

    // calculating waiting time
    for (int i = 1; i < n ; i++)
    {
        // Add burst time of previous processes
        service_time[i] = service_time[i-1] + bt[i-1];

        // Find waiting time for current process =
        // sum - at[i]
        wt[i] = service_time[i] - at[i];

        // If waiting time for a process is in negative
        // that means it is already in the ready queue
        // before CPU becomes idle so its waiting time is 0
        if (wt[i] < 0)
            wt[i] = 0;
    }
}

// Function to calculate turn around time
void findTurnAroundTime(int n, int bt[], int wt[], int tat[])
{
    // Calculating turnaround time by adding bt[i] + wt[i]
    for (int i = 0; i < n ; i++)
        tat[i] = bt[i] + wt[i];
}

// Function to calculate average waiting and turn-around
// times.
void findavgTime(int n, int bt[], int at[])
{
    int wt[n], tat[n];

    // Function to find waiting time of all processes
    findWaitingTime(n, bt, wt, at);

    // Function to find turn around time for all processes
    findTurnAroundTime(n, bt, wt, tat);

    // Display processes along with all details
    printf("ProcessID  Arrival Time  Burst Time  Waiting Time  Turnaround Time  Completion Time\n");
    int total_wt = 0, total_tat = 0;
    for (int i = 0 ; i < n ; i++)
    {
        total_wt = total_wt + wt[i];
        total_tat = total_tat + tat[i];
        int compl_time = tat[i] + at[i];
        printf("    %5d       %7d     %7d       %7d          %7d          %7d\n",
               i, at[i], bt[i], wt[i], tat[i], compl_time);
    }
    printf("Avg. Waiting Time    = %9.2f\n", (float)total_wt / (float)n);
    printf("Avg. Turnaround Time = %9.2f\n", (float)total_tat / (float)n);
}

int inputData(int arrival_time[], int burst_time[])
{
    int     i = 0;
    int     num;
    do {
        num = scanf("%d %d", &arrival_time[i], &burst_time[i]);
        if (num <= 0)       // End-of-file or zero data
            break;
        i++;
    } while (1);
    return i;
}
// Driver code
int main()
{
    // # of Process
    int     n;

    // Burst time of all processes
    int burst_time[NUM_PROC];

    // Arrival time of all processes
    int arrival_time[NUM_PROC];

    n = inputData(arrival_time, burst_time);
    findavgTime(n, burst_time, arrival_time);
    return 0;
}

