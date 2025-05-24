# input.txt 파일에서 입력 읽기
with open('input.txt', 'r') as f:
    n = int(f.read().strip())

# 짝수인지 홀수인지 판별하기
if n % 2 == 0:
    result = "Even"
else:
    result = "Odd"

# output.txt 파일에 결과 쓰기
with open('output.txt', 'w') as f:
    f.write(result)