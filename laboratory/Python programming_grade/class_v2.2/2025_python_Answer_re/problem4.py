# input.txt 파일에서 입력 읽기
with open('input.txt', 'r') as f:
    ch = f.read().strip()

# 알파벳인지 확인하기
if ('a' <= ch <= 'z') or ('A' <= ch <= 'Z'):
    result = "Alphabet"
else:
    result = "Not Alphabet"

# output.txt 파일에 결과 쓰기
with open('output.txt', 'w') as f:
    f.write(result)