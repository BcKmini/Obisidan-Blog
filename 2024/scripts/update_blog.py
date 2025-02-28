import feedparser
import git
import os

# 벨로그 RSS 피드 URL
rss_url = 'https://api.velog.io/rss/@mi_nini'


# 깃허브 레포지토리 경로
repo_path = '.'

# 시리즈별 폴더 경로
posts_dir_3_2 = os.path.join(repo_path, 'velog-posts/3-2')
posts_dir_3_1_summer = os.path.join(repo_path, 'velog-posts/3-1_summer')

# 'velog-posts/3-2' 폴더가 없다면 생성
if not os.path.exists(posts_dir_3_2):
    os.makedirs(posts_dir_3_2)

# 레포지토리 로드
repo = git.Repo(repo_path)

# RSS 피드 파싱
feed = feedparser.parse(rss_url)

# 3-1_summer 폴더의 파일 목록 가져오기 (중복 체크를 위해)
existing_files_3_1 = set()
if os.path.exists(posts_dir_3_1_summer):
    existing_files_3_1 = set(os.listdir(posts_dir_3_1_summer))

# 각 글을 파일로 저장하고 커밋
for entry in feed.entries:
    # 파일 이름에서 유효하지 않은 문자 제거 또는 대체
    file_name = entry.title
    file_name = file_name.replace('/', '-')  # 슬래시를 대시로 대체
    file_name = file_name.replace('\\', '-')  # 백슬래시를 대시로 대체
    file_name += '.md'

    # 중복 여부 체크
    if file_name in existing_files_3_1:
        print(f"Skipping {file_name} as it already exists in 3-1_summer")
        continue

    # 파일 경로 생성
    file_path = os.path.join(posts_dir_3_2, file_name)

    # 파일이 이미 존재하지 않으면 생성
    if not os.path.exists(file_path):
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(entry.description)  # 글 내용을 파일에 작성

        # 깃허브 커밋
        repo.git.add(file_path)
        repo.git.commit('-m', f'Add post: {entry.title}')

# 변경 사항을 깃허브에 푸시
repo.git.push()
