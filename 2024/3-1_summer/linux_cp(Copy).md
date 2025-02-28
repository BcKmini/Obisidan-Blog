<h2 id="📌10-cp-copy">📌10. cp (Copy)</h2>
<p>Let’s start making some copies of these files. Much like copy and pasting files in other operating systems, the shell gives us an even simpler way of doing that.</p>
<blockquote>
<p>$ cp mycoolfile /home/pete/Documents/cooldocs</p>
</blockquote>
<p>mycoolfile is the file you want to copy and /home/pete/Documents/cooldocs is where you are copying the file to.</p>
<p>You can copy multiple files and directories as well as use wildcards. A wildcard is a character that can be substituted for a pattern based selection, giving you more flexibility with searches. You can use wildcards in every command for more flexibility.</p>
<ul>
<li>the wildcard of wildcards, it's used to represent all single characters or any string.</li>
<li>? used to represent one character</li>
<li>[] used to represent any character within the brackets</li>
</ul>
<blockquote>
<p>$ cp *.jpg /home/pete/Pictures</p>
</blockquote>
<p>This will copy all files with the .jpg extension in your current directory to the Pictures directory.</p>
<p>A useful command is to use the -r flag, this will recursively copy the files and directories within a directory.</p>
<p>Try to do a cp on a directory that contains a couple of files to your Documents directory. Didn’t work did it? Well that’s because you’ll need to copy over the files and directories inside as well with -r command.</p>
<blockquote>
<p>$ cp -r Pumpkin/ /home/pete/Documents</p>
</blockquote>
<p>One thing to note, if you copy a file over to a directory that has the same filename, the file will be overwritten with whatever you are copying over. This is no bueno if you have a file that you don’t want to get accidentally overwritten. You can use the -i flag (interactive) to prompt you before overwriting a file.</p>
<blockquote>
<p>$ cp -i mycoolfile /home/pete/Pictures</p>
</blockquote>
<hr />
<h2 id="📝exercises">📝Exercises</h2>
<p>Copy over a couple of files, be careful not to overwrite anything important.</p>
<hr />
<h2 id="💻quiz">💻Quiz</h2>
<p>What flag do you need to specify to copy over a directory?</p>
<hr />
<h2 id="📌10-cp-복사">📌10. cp (복사)</h2>
<p>이 파일의 사본을 만들기 시작해 봅시다. 다른 운영 체제에서 파일을 복사하여 붙여넣는 것과 마찬가지로, 셸은 우리에게 더 간단한 방법을 제공합니다.</p>
<blockquote>
<p>$ cp mycoolfile /home/pete/문서/cooldocs</p>
</blockquote>
<p>mycoolfile은 복사하려는 파일이고 /home/pete/Documents/cooldocs는 파일을 복사할 위치입니다.</p>
<p>여러 파일과 디렉토리를 복사할 수 있고 와일드카드를 사용할 수도 있습니다. 와일드카드는 패턴 기반 선택을 대체할 수 있는 문자로, 검색에 더 많은 유연성을 제공합니다. 모든 명령에서 와일드카드를 사용하여 더 많은 유연성을 얻을 수 있습니다.</p>
<ul>
<li>와일드카드의 와일드카드는 모든 단일 문자나 문자열을 나타내는 데 사용됩니다.</li>
<li>? 한 문자를 나타내는 데 사용됨</li>
<li>[]는 괄호 안의 모든 문자를 나타내는 데 사용됩니다.</li>
</ul>
<blockquote>
<p>$ cp *.jpg /홈/피트/사진</p>
</blockquote>
<p>이렇게 하면 현재 디렉토리에 있는 .jpg 확장자를 가진 모든 파일이 그림 디렉토리로 복사됩니다.</p>
<p>유용한 명령은 -r 플래그를 사용하는 것입니다. 이 명령은 디렉토리 내의 파일과 디렉토리를 재귀적으로 복사합니다.</p>
<p>문서 디렉토리에 파일 몇 개가 있는 디렉토리에서 cp를 시도해 보세요. 작동하지 않았나요? 글쎄요, 그 이유는 -r 명령으로 파일과 디렉토리도 복사해야 하기 때문입니다.</p>
<blockquote>
<p>$ cp -r 호박/ /home/pete/문서</p>
</blockquote>
<p>한 가지 주의할 점은 같은 파일 이름을 가진 디렉토리에 파일을 복사하면 복사하는 내용으로 파일이 덮어쓰여진다는 것입니다. 실수로 덮어쓰여지는 것을 원치 않는 파일이 있다면 이것은 좋지 않습니다. -i 플래그(대화형)를 사용하여 파일을 덮어쓰기 전에 묻도록 할 수 있습니다.</p>
<blockquote>
<p>$ cp -i mycoolfile /home/pete/사진</p>
</blockquote>
<hr />
<h2 id="📝수업-과정">📝수업 과정</h2>
<p>여러 개의 파일을 복사하세요. 중요한 내용을 덮어쓰지 않도록 주의하세요.
<img alt="" src="https://velog.velcdn.com/images/mi_nini/post/05ee6f07-4d08-4e42-bda5-30194f670b49/image.png" /></p>
<hr />
<h2 id="💻퀴즈">💻퀴즈</h2>
<p>디렉토리를 복사하려면 어떤 플래그를 지정해야 합니까?
정답 : -r</p>