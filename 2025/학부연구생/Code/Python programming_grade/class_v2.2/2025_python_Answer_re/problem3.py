# input.txt 파일에서 입력 읽기
with open('input.txt', 'r') as f:
    n = int(f.read().strip())

# 계단 형태로 별 출력하기
result = ""
for i in range(1, n + 1):
    result += "*" * i
    if i != n:  # 마지막 줄이 아니면 줄바꿈 추가
        result += "\n"

# output.txt 파일에 결과 쓰기
with open('output.txt', 'w') as f:
    f.write(result)