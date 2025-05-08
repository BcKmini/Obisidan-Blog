#include <iostream>
#include <fstream>

int main() {
    std::ifstream input("input.txt");
    std::ofstream output("output.txt");

    int n, a, b, num, sum = 0;
    int arr[100];

    input >> n;
    for (int i = 0; i < n; i++) {
        input >> arr[i];
    }
    input >> a >> b;

    for (int i = a - 1; i < b; i++) {
        sum += arr[i];
    }

    output << sum << std::endl;

    input.close();
    output.close();
    return 0;
}
