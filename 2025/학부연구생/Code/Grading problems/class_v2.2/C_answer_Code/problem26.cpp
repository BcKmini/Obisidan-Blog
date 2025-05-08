#include <iostream>
#include <fstream>

int main() {
    std::ifstream input("input.txt");
    std::ofstream output("output.txt");

    int n, arr[100], odd[100], even[100];
    int odd_index = 0, even_index = 0;

    input >> n;
    for (int i = 0; i < n; i++) {
        input >> arr[i];
        if (arr[i] % 2 != 0) {
            odd[odd_index++] = arr[i];
        } else {
            even[even_index++] = arr[i];
        }
    }

    for (int i = 0; i < odd_index; i++) {
        output << odd[i] << " ";
    }
    for (int i = 0; i < even_index; i++) {
        output << even[i] << " ";
    }
    output << std::endl;

    input.close();
    output.close();
    return 0;
}
