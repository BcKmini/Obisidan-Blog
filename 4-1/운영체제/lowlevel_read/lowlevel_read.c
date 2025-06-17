#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdio.h>
#include <unistd.h>

int main(){

	int fd;
	char buff[1024];
	int nb, cnt;
	int i;
	
	fd = open("/usr/share/dict/american-english", O_RDONLY);
	nb = 1024;
	cnt = read(fd, buff, nb);
	for (i = 0; i < cnt; i++)
		printf("%c", buff[i]);
}


