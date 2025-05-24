#include <iostream>
#include <fstream>
#include <algorithm>

int main() {
    std::ifstream input("input.txt");
    std::ofstream output("output.txt");

    int n;
    int arr[100];
    int max_sum, current_sum;

    input >> n;
    for (int i = 0; i < n; i++) {
        input >> arr[i];
    }

    max_sum = arr[0];
    current_sum = arr[0];

    for (int i = 1; i < n; i++) {
        current_sum = std::max(arr[i], current_sum + arr[i]);
        max_sum = std::max(max_sum, current_sum);
    }

    output << max_sum << std::endl;

    input.close();
    output.close();
    return 0;
}
