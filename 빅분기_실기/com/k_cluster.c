#include <stdio.h>
#include <math.h>

typedef struct { double x, y; } Point;

#define INF        1e+20
#define MAXPOINTS 1000

int CC[10];              // Centers of Clusters (최대 10개까지)
int GC[MAXPOINTS];       // 각 점의 군집 ID
Point pts[MAXPOINTS];    // 입력 점 배열

#define SQR(x)       ((x)*(x))
#define DIST(p1,p2) sqrt( SQR((p1).x - (p2).x) + SQR((p1).y - (p2).y) )

int  argmax(double D[], int n);
int  argmindist(Point pt, int CC[], int numcenters);
int  k_cluster(Point pt[], int npts, int CC[], int kclusters);

int main()
{
    int i, kclusters, npts;

    kclusters = 6;     // 변경: 5 → 6
    npts      = 200;   // 변경: 100 → 200

    for (i = 0; i < npts; i++)
        scanf("%lf%lf", &pts[i].x, &pts[i].y);

    k_cluster(pts, npts, CC, kclusters);

    for (i = 0; i < npts; i++)
        printf("%6.3f\t%6.3f %5d\n",
               pts[i].x, pts[i].y, GC[i]);

    return 0;
}

int argmax(double D[], int n)
{
    int i, imax;
    for (imax = 0, i = 1; i < n; i++)
        if (D[imax] < D[i])
            imax = i;
    return imax;
}

int argmindist(Point x, int CC[], int numcenters)
{
    double Dt = INF, tmp;
    int j, ll;
    for (j = 0; j < numcenters; j++) {
        tmp = DIST(x, pts[CC[j]]);
        if (Dt > tmp) {
            Dt = tmp;
            ll = j;
        }
    }
    return ll;
}

int k_cluster(Point pts[], int npts, int CC[], int kclusters)
{
    int i, j, ll, s;
    double D[MAXPOINTS];
    Point cl;

    // farthest-first 초기 중심 선택
    for (j = 1; j < kclusters; j++) {
        for (i = 0; i < npts; i++) {
            D[i] = INF;
            for (ll = 0; ll < j; ll++) {
                cl    = pts[CC[ll]];
                D[i]  = fmin(D[i], DIST(pts[i], cl));
            }
        }
        s       = argmax(D, npts);
        CC[j]   = s;
        GC[s]   = j;
    }

    // 각 점을 가장 가까운 중심으로 할당
    for (i = 0; i < npts; i++) {
        ll     = argmindist(pts[i], CC, kclusters);
        GC[i]  = ll;
    }

    return 0;
}
