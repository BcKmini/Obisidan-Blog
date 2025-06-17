// C++ program for implementation of RR scheduling 
#include <iostream> 
#include <cstdio>
#define	NUM_PROC				1000
#define	SWITCH_OVERHEAD	1
#define	TIME_QUANTUM		2

using namespace std; 
  
// Function to find the waiting time for all 
// processes 
int findWaitingTime(int n, int bt[], int wt[], int rt[], int quantum) 
{ 
    // Make a copy of burst times bt[] to store remaining 
    // burst times. 
    int rem_bt[n]; 
    for (int i = 0 ; i < n ; i++) 
        rem_bt[i] =  bt[i]; 
  
    int t = 0; // Current time 
  
    // Keep traversing processes in round robin manner 
    // until all of them are not done. 
    while (1) { 
        bool done = true; 
  
        // Traverse all processes one by one repeatedly 
        for (int i = 0 ; i < n; i++) { 
            if (rem_bt[i] == bt[i]) 			// first running quantum
                rt[i] = t + SWITCH_OVERHEAD;	// response time
            // If burst time of a process is greater than 0 
            // then only need to process further 
            if (rem_bt[i] > 0) { 
                done = false; // There is a pending process 
                printf("%5d: SWITCHING   %5d\n", t, SWITCH_OVERHEAD);
                t = t + SWITCH_OVERHEAD;
  
                if (rem_bt[i] > quantum) { 
                    printf("%5d: proc(%3d)   %5d\n", t, i, quantum);
                    // Increase the value of t i.e. shows 
                    // how much time a process has been processed 
                    t += quantum; 
  
                    // Decrease the burst_time of current process 
                    // by quantum 
                    rem_bt[i] -= quantum; 
                } 
  
                // If burst time is smaller than or equal to 
                // quantum. Last cycle for this process 
                else { 
                    printf("%5d: proc(%3d)   %5d\n", t, i, rem_bt[i]);
                    // Increase the value of t i.e. shows 
                    // how much time a process has been processed 
                    t = t + rem_bt[i]; 
  
                    // Waiting time is current time minus time 
                    // used by this process 
                    wt[i] = t - bt[i]; 
  
                    // As the process gets fully executed 
                    // make its remaining burst time = 0 
                    rem_bt[i] = 0; 
                } 
            } 	// if
        } 	// for
  
        // If all processes are done 
        if (done == true) 
          break; 
    } 
	 return t;		// Completion time
} 
  
// Function to calculate turn around time 
void findTurnAroundTime(int n, int bt[], int wt[], int tat[]) 
{ 
    // calculating turnaround time by adding 
    // bt[i] + wt[i] 
    for (int i = 0; i < n ; i++) 
        tat[i] = bt[i] + wt[i]; 
} 
  
// Function to calculate average time 
void findavgTime(int n, int bt[], int quantum) 
{ 
    int wt[n], tat[n], total_wt = 0, total_tat = 0; 
	 int rt[n], total_rt = 0;	// response time
	 int ct;		// completion time
  
    // Function to find waiting time of all processes 
    ct = findWaitingTime(n, bt, wt, rt, quantum); 
  
    // Function to find turn around time for all processes 
    findTurnAroundTime(n, bt, wt, tat); 
  
	 printf("Switching Time = %d\n", SWITCH_OVERHEAD);
	 printf("Time Quantum   = %d\n", TIME_QUANTUM);

    printf("ProcessID  Arrival Time  Burst Time  Waiting Time  Turnaround Time  Response Time\n");
    for (int i = 0 ; i < n ; i++) {
        total_wt = total_wt + wt[i];
        total_tat = total_tat + tat[i];
		  total_rt = total_rt + rt[i];
        int compl_time = tat[i] + 0;
        printf("    %5d       %7d     %7d       %7d          %7d        %7d\n",
               i, 0, bt[i], wt[i], tat[i], rt[i]);
    }
    printf("Avg. Waiting Time    = %9.2f\n", (float)total_wt / (float)n);
    printf("Avg. Turnaround Time = %9.2f\n", (float)total_tat / (float)n);
	 printf("Avg. Response Time   = %9.2f\n", (float)total_rt / (float)n);
    printf("Completion Time      = %6d\n", ct);
    printf("Thoughput(#Jobs/Time)= %9.2f\n", (float)n / (float)ct);
} 

int inputData(int burst_time[])
{
    int     i = 0;
    int     num;
    do {
        num = scanf("%d", &burst_time[i]);
        if (num <= 0)       // End-of-file or zero data
            break;
        i++;
    } while (1);
    return i;
}
  
// Driver code 
int main(int argc, char *argv[]) 
{ 
    // Burst time of all processes 
    int burst_time[NUM_PROC];
    int n;
  
    // Time quantum 
    int quantum;
   
    if (argc <= 1) 
       quantum = TIME_QUANTUM; 
    else 
       quantum = atoi(argv[1]);
	    
    // Input the burst time data    	
    n = inputData(burst_time); 

    findavgTime(n, burst_time, quantum); 
    return 0; 
} 
