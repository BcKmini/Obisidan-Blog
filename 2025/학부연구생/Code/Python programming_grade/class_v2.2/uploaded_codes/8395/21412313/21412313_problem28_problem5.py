with open("input.txt", "r") as f:
    n = int(f.read().strip())




with open("output.txt", "w") as f:
    for index in range(1,n+1):
        if index % 2 == 1:
            f.write(index)
            if index < n-1:
                f.write("\n")
        