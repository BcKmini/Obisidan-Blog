#include <iostream>
#include <fstream>

int main() {
    std::ifstream input("input.txt");
    std::ofstream output("output.txt");

    int n, num;
    int max_value, min_value;

    if (!input.is_open()) {
        std::cerr << "Error opening input file!" << std::endl;
        return 1;
    }

    input >> n;
    if (n > 0) {
        input >> num;
        max_value = num;
        min_value = num;
        
        for (int i = 1; i < n; i++) {
            input >> num;
            if (num > max_value) {
                max_value = num;
            }
            if (num < min_value) {
                min_value = num;
            }
        }
    }

    int difference = max_value - min_value;
    std::cout << max_value << min_value;

    output << difference << std::endl;

    input.close();
    output.close();
    return 0;
}
