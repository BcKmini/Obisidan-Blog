# input.txt 파일에서 입력 받기
with open("input.txt", "r") as f:
    n = int(f.readline())                 # 첫 번째 줄: N
    numbers = list(map(int, f.readline().split()))  # 두 번째 줄: N개의 정수

# 최대값, 최소값 계산
max_value = max(numbers)
min_value = min(numbers)
difference = max_value - min_value

# 결과를 output.txt에 저장
with open("output.txt", "w") as f:
    f.write(str(difference))
