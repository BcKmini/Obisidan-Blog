#include <iostream>
#include <fstream>

int main() {
    std::ifstream input("input.txt");
    std::ofstream output("output.txt");

    int a, b;
    input >> a >> b;

    int result = (a > b) ? (a - b) : (b - a);
    output << result << std::endl;

    input.close();
    output.close();
    return 0;
}
