// 쉘정려확인
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <math.h>
typedef struct Point {
    double x;
    double y;
} Point;

#define DIST(P,Q) sqrt((P.x-Q.x)*(P.x-Q.x) + (P.y-Q.y)*(P.y-Q.y))

double ClosestPair(Point P[], int left, int right);

int compare(const void *a, const void *b);
int compare_y(const void *a, const void *b);

int main(int argc, char *argv[])
{
    int i, j, n, clk;
    Point *data;
    double dist, dist1, start, end;
    srand(time(NULL));
    //srand(1);
    n = atoi(argv[1]);
    data = (Point *) malloc(n * sizeof(Point));
    for (i = 0; i < n; i++) {
        data[i].x = rand() / (double) RAND_MAX;
        data[i].y = rand() / (double) RAND_MAX;
    }
    printf("\n");
    start = clock();
    qsort(data, n, sizeof(Point), compare);
    if (n <= 20) {
        for (i = 0; i < n; i++)
            printf("%4.3f %4.3f\n", data[i].x, data[i].y);
        printf("\n");
    }
    dist = ClosestPair(data, 0, n);
    end = clock();

    printf("min dist= %15.6g :Elapsed time= %6.2f\n", dist,
           (end - start) / CLOCKS_PER_SEC);

    if (n <= 1000) {
        dist1 = 1e20;
        for (i = 0; i < n; i++)
            for (j = i + 1; j < n; j++)
                dist1 = fmin(dist1, DIST(data[i], data[j]));
        printf("error=%15.6g\n", dist - dist1);
    }
}

int compare(const void *a, const void *b)
{
    return (((Point *) a)->x) > (((Point *) b)->x);
}

int compare_y(const void *a, const void *b)
{
    return (((Point *) a)->y) > (((Point *) b)->y);
}

double ClosestPair(Point P[], int left, int right)
{
    Point *Ptmp;
    double dist1, dist2, dist = 1e20, dist0, dx, dy;
    double ds2 = sqrt(2.0);
    int lb, rb, i, j, mid = (left + right) / 2;
    if (right - left <= 3) {    // 3 points 
        for (i = left; i < right; i++)
            for (j = i + 1; j < right; j++)
                dist = fmin(dist, DIST(P[i], P[j]));
        return dist;
    }
    dist1 = ClosestPair(P, left, mid);
    dist2 = ClosestPair(P, mid, right);
    dist = fmin(dist1, dist2);
    lb = mid - 1;
    rb = mid;
    while ((lb >= left)) {
        if ((P[mid].x - P[lb].x) > dist)
            break;
        lb--;
    }
    if (lb <= left)
        lb++;
    while ((rb < right)) {
        if ((P[rb].x - P[mid - 1].x) > dist)
            break;
        rb++;
    };
    if (rb >= right)
        rb--;

// 확인하려면 #if문에 0과 1을 바꿔서 확인한다.   
#if 0
        for(i=lb; i<mid ; i++)
           for(j=mid; j<=rb; j++)
             dist = fmin(dist, DIST(P[i], P[j]) );
#endif

#if 1
    qsort(P + lb, mid - lb, sizeof(Point), compare_y);
    qsort(P + mid, rb - mid + 1, sizeof(Point), compare_y);
    dist0 = dist;
    for (i = lb; i < mid; i++) {
        j = mid;
        while ((j <= rb) && ((dy = fabs(P[j].y - P[i].y)) > dist0))
            j++;
        while ((j <= rb) && ((dy = fabs(P[j].y - P[i].y)) <= dist0)) {
            dx = (P[i].x - P[j].x);
            dist = fmin(dist, sqrt(dx * dx + dy * dy));
            j++;
        }
    }
    //qsort(P+lb,    mid-lb, sizeof(Point), compare);
    //qsort(P+mid, rb-mid+1, sizeof(Point), compare);
    qsort(P + lb, rb - lb + 1, sizeof(Point), compare);
#endif

    return dist;
}