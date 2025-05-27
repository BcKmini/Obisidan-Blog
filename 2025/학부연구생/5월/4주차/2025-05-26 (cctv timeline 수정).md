5/27 -> 17시 

- 1. user마다 서버 영상 목록 수정
- 2. label box 타임라인 바꾸기 ->  ![[수정사항.png]]

1. app.py 수정
```python
@app.route('/api/videos')
@login_required
def get_server_videos():
# 현재 로그인한 유저가 업로드한 Video 레코드 조회

videos = (
Video.query
.filter_by(user_id=current_user.id)
.order_by(Video.created_at.desc())
.all()
)
files = []
for v in videos:
path = os.path.join(UPLOAD_FOLDER, v.filename)
if os.path.exists(path) and allowed_file(v.filename):
files.append(v.filename)
  
return jsonify([{'filename': fn} for fn in files])
```

2. label box 수정
v1
![[스크린샷 2025-05-27 11.28.18.png]]

- 1. dot -- dot을 연결
- 2. clip을 다운받을때 연결된 클립을 다운 받을 수 있게 구현 
- (먼저 CSV 클립을 어떻게 연결시킬지에 대한 생각)
- 3. clip에 따온 mp4 영상을 어떻게 병합할지에 대한 고민(긴 영상 경우 겹침 현상이 발생)
- 