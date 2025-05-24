# input.txt 파일에서 입력 문자열 읽기
with open('input.txt', 'r') as f:
    text = f.read().strip()

# 소문자와 대문자를 각각 나열
lowercase = 'abcdefghijklmnopqrstuvwxyz'
uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

# 대소문자 반전
converted = ""
for ch in text:
    if ch in lowercase:
        index = lowercase.index(ch)
        converted += uppercase[index]
    elif ch in uppercase:
        index = uppercase.index(ch)
        converted += lowercase[index]
    else:
        converted += ch  # 알파벳이 아니면 그대로 추가

# 결과를 output.txt 파일에 쓰기
with open('output.txt', 'w') as f:
    f.write(converted)