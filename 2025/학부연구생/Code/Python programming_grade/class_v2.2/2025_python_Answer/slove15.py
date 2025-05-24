# input.txt에서 한 줄 읽어오기
with open('input.txt', 'r', encoding='utf-8') as f:
    text = f.readline().strip()

# 모두 소문자로 변환
text = text.lower()

# 모음 집합 정의
vowels = set('aeiou')

# 카운트 변수 초기화
v_count = 0
c_count = 0

# 문자열 순회하며 알파벳만 검사
for ch in text:
    if ch.isalpha():            # 영문자 여부 확인
        if ch in vowels:
            v_count += 1        # 모음인 경우
        else:
            c_count += 1        # 자음인 경우

# 결과를 output.txt에 기록
with open('output.txt', 'w', encoding='utf-8') as f:
    f.write(f'Vowels: {v_count}\n')
    f.write(f'Consonants: {c_count}')
