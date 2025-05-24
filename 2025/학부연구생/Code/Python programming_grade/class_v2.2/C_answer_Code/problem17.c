
#include <stdio.h>
#include <string.h>

int main() {
    char str1[101], str2[101];
    int used[101] = {0};
    FILE *inputFile = fopen("input.txt", "r");
    FILE *outputFile = fopen("output.txt", "w");

    fscanf(inputFile, "%s %s", str1, str2);

    int len1 = strlen(str1);
    int len2 = strlen(str2);

    for (int i = 0; i < len1; i++) {
        for (int j = 0; j < len2; j++) {
            if (str1[i] == str2[j] && !used[j]) {
                fprintf(outputFile, "%c", str1[i]);
                used[j] = 1;
                break;
            }
        }
    }

    fclose(inputFile);
    fclose(outputFile);
    return 0;
}
