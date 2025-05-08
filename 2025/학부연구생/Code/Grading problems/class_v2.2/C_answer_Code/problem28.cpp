#include <iostream>
#include <fstream>
#include <algorithm>

int main() {
    std::ifstream input("input.txt");
    std::ofstream output("output.txt");

    int n, arr[100], pos[100], neg[100];
    int pos_index = 0, neg_index = 0;

    input >> n;
    for (int i = 0; i < n; i++) {
        input >> arr[i];
        if (arr[i] >= 0) {
            pos[pos_index++] = arr[i];
        } else {
            neg[neg_index++] = arr[i];
        }
    }

    std::sort(pos, pos + pos_index);
    std::sort(neg, neg + neg_index, std::greater<int>());

    for (int i = 0; i < pos_index; i++) {
        output << pos[i] << " ";
    }
    for (int i = 0; i < neg_index; i++) {
        output << neg[i] << " ";
    }
    output << std::endl;

    input.close();
    output.close();
    return 0;
}
