# input.txt에서 쉼표로 구분된 숫자 문자열을 읽음
with open("input.txt", "r") as f:
    input_data = f.read().strip()

# 문자열을 ',' 기준으로 나누어 정수로 변환
input_list = input_data.split(",")

numbers = []
total =0
for item in input_list:
    total += int(item)
    # numbers.append(int(item))

# 합계를 계산
# total = sum(numbers)

# output.txt에 결과를 저장
with open("output.txt", "w") as f:
    f.write(str(total))
