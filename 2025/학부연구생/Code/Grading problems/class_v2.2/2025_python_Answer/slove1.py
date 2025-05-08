# input.txt 에서 N 읽기
with open('input.txt', 'r') as f:
    N = int(f.readline().strip())

# output.txt 에 결과 쓰기
with open('output.txt', 'w') as f:
    for i in range(1, N + 1):
        # 한 줄에 i개의 별 출력
        for _ in range(i):
            f.write('*')
        # 줄바꿈 (마지막 줄 이후에도 개행 필요하면 그대로 놔둠)
        if i != N:
            f.write('\n')
