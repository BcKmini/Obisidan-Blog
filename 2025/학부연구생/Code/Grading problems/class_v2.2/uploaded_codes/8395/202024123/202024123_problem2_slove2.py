# solve.py

def main():
    # input.txt에서 N 읽기
    with open('input.txt', 'r', encoding='utf-8') as fin:
        line = fin.readline().strip()
        if not line:
            return
        n = int(line)

    # output.txt에 결과 쓰기
    with open('output.txt', 'w', encoding='utf-8') as fout:
        for i in range(n, 0, -1):
            fout.write('*' * i)
            if i > 1:
                fout.write('\n')

if __name__ == '__main__':
    main()
