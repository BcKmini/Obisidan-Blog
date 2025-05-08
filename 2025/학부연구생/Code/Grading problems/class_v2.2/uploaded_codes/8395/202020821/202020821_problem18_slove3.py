# input.txt에서 문자열을 읽음
with open("input.txt", "r") as f:
    text = f.readline().strip()

# 문자열 뒤집고 대소문자 변경
reversed_swapped = text[::-1].swapcase()

# 결과를 output.txt에 씀
with open("output.txt", "w") as f:
    f.write(reversed_swapped)
