
#include <stdio.h>
#include <string.h>

int main() {
    FILE *inputFile = fopen("input.txt", "r");
    FILE *outputFile = fopen("output.txt", "w");

    char s[100];
    fgets(s, 100, inputFile);

    int length = strlen(s);
    if (s[length - 1] == '\n') s[length - 1] = '\0'; // Remove newline character

    int left = 0, right = length - 1;
    int isPalindrome = 1;

    while (left < right) {
        while (left < right && s[left] == ' ') left++;
        while (left < right && s[right] == ' ') right--;
        if (s[left] != s[right]) {
            isPalindrome = 0;
            break;
        }
        left++;
        right--;
    }

    if (isPalindrome) {
        fprintf(outputFile, "Yes\n");
    } else {
        fprintf(outputFile, "No\n");
    }

    fclose(inputFile);
    fclose(outputFile);
    return 0;
}
