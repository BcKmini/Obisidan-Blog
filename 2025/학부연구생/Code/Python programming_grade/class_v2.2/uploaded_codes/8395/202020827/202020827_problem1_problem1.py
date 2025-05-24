# input.txt에서 문자열을 읽는다
with open("input.txt", "r") as infile:
    user_input = infile.read().strip()

count = 0
# 문자열 길이에 따라 분기
for element in user_input:
    count+=1



length = len(user_input)

if length >= 10:
    result = "Long string"
elif length >= 5:
    result = "Medium string"
else:
    result = "Short string"

# output.txt에 결과를 출력
with open("output.txt", "w") as outfile:
    outfile.write(result)