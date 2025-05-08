# input.txt 파일에서 입력 읽기
with open('input.txt', 'r') as f:
    input_data = f.read().strip()

# 쉼표(,)로 나누기
numbers = input_data.split(",")

# 짝수 개수 세기
count = 0
for num in numbers:
    if int(num) % 2 == 0:
        count += 1

# output.txt 파일에 결과 쓰기
with open('output.txt', 'w') as f:
    f.write(str(count))