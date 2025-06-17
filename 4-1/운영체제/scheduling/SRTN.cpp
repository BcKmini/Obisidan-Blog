#include <bits/stdc++.h>
#include <cstdio>
#define NUM_PROC    10000

using namespace std;

struct Process {
    int pid; // Process ID
    int at; // Arrival Time
    int bt; // Burst Time
};

// Function to find the waiting time for all
// processes
void findWaitingTime(Process proc[], int n,
                                int wt[])
{
    int rt[n];

    // Copy the burst time into rt[]
    for (int i = 0; i < n; i++)
        rt[i] = proc[i].bt;

    int complete = 0, t = 0, minm = INT_MAX;
    int shortest = 0, finish_time;
    bool check = false;

    // Process until all processes gets
    // completed
    while (complete != n) {

        // Find process with minimum
        // remaining time among the
        // processes that arrives till the
        // current time`
        for (int j = 0; j < n; j++) {
            if ((proc[j].at <= t) &&
            (rt[j] < minm) && rt[j] > 0) {
                minm = rt[j];
                shortest = j;
                check = true;
            }
        }

        if (check == false) {
            t++;
            continue;
        }

        // Reduce remaining time by one
        rt[shortest]--;

        // Update minimum
        minm = rt[shortest];
        if (minm == 0)
            minm = INT_MAX;

        // If a process gets completely
        // executed
        if (rt[shortest] == 0) {

            // Increment complete
            complete++;
            check = false;

            // Find finish time of current
            // process
            finish_time = t + 1;

            // Calculate waiting time
            wt[shortest] = finish_time -
                        proc[shortest].bt -
                        proc[shortest].at;

            if (wt[shortest] < 0)
                wt[shortest] = 0;
        }
        // Increment time
        t++;
    }
}

// Function to calculate turn around time
void findTurnAroundTime(Process proc[], int n,
                        int wt[], int tat[])
{
    // calculating turnaround time by adding
    // bt[i] + wt[i]
    for (int i = 0; i < n; i++)
        tat[i] = proc[i].bt + wt[i];
}

// Function to calculate average time
void findavgTime(Process proc[], int n)
{
    int wt[n], tat[n];
    int total_wt = 0, total_tat = 0;

    // Function to find waiting time of all
    // processes
    findWaitingTime(proc, n, wt);

    // Function to find turn around time for
    // all processes
    findTurnAroundTime(proc, n, wt, tat);

    // Display processes along with all
    // details
    printf("ProcessID  Arrival Time  Burst Time  Waiting Time  Turnaround Time  Completion Time\n");
//    int total_wt = 0, total_tat = 0;
    for (int i = 0 ; i < n ; i++)
    {
        total_wt = total_wt + wt[i];
        total_tat = total_tat + tat[i];
        int compl_time = tat[i] + proc[i].at;
        printf("    %5d       %7d     %7d       %7d          %7d          %7d\n",
               proc[i].pid, proc[i].at, proc[i].bt, wt[i], tat[i], compl_time);
    }
    printf("Avg. Waiting Time    = %9.2f\n", (float)total_wt / (float)n);
    printf("Avg. Turnaround Time = %9.2f\n", (float)total_tat / (float)n);


}

int inputData(Process proc[])
{
    int     i = 0;
    int     num;
    do {
        num = scanf("%d %d", &proc[i].at, &proc[i].bt);
        if (num <= 0)       // End-of-file or zero data
            break;
        proc[i].pid = i;
        i++;
    } while (1);
    return i;
}

// Driver code
int main()
{
//    Process proc[] = { { 1, 1, 6 }, { 2, 1, 8 },
//                    { 3, 2, 7 }, { 4, 3, 3 } };
    Process proc[NUM_PROC];

    int n = inputData(proc);

    findavgTime(proc, n);
    return 0;
}
