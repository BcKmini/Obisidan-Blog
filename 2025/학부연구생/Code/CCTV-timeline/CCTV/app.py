from flask import Flask, render_template, request, jsonify
import os
import cv2
from werkzeug.utils import secure_filename

app = Flask(__name__)

# 설정
UPLOAD_FOLDER = 'static/uploads'  # 업로드된 영상 파일 저장 폴더
FRAMES_FOLDER = 'static/frames'   # 추출된 프레임 저장 폴더
ALLOWED_EXTENSIONS = {'mp4', 'avi', 'mov'}  # 허용되는 파일 형식
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['FRAMES_FOLDER'] = FRAMES_FOLDER

# 업로드 가능한 파일 형식 확인
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# 홈 화면 라우트
@app.route('/')
def index():
    return render_template('index.html')  # templates/index.html 렌더링

# 파일 업로드 라우트
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        # 업로드 디렉토리가 없으면 생성
        if not os.path.exists(app.config['UPLOAD_FOLDER']):
            os.makedirs(app.config['UPLOAD_FOLDER'])
        
        # 파일 저장
        file.save(filepath)
        print(f"File uploaded: {filepath}")  # 업로드된 파일 경로 확인
        return jsonify({'message': f'File uploaded successfully: {filename}', 'filename': filename}), 200
    else:
        return jsonify({'error': 'Invalid file type'}), 400

# 프레임 추출 라우트
@app.route('/extract_frames', methods=['POST'])
def extract_frames():
    video_file = request.form['video_file']
    
    # 영상 파일 경로 설정
    video_path = os.path.join(app.config['UPLOAD_FOLDER'], video_file)
    
    if not os.path.exists(video_path):
        return jsonify({'error': 'Video file not found'}), 404
    
    # 영상 이름으로 폴더 생성
    video_name = video_file.split('.')[0]  # 확장자 제외한 파일 이름
    frames_folder = os.path.join(app.config['FRAMES_FOLDER'], video_name)
    if not os.path.exists(frames_folder):
        os.makedirs(frames_folder)
    
    print(f"Extracting frames from: {video_path}")
    
    # 영상 파일 열기
    video_capture = cv2.VideoCapture(video_path)
    fps = video_capture.get(cv2.CAP_PROP_FPS)  # FPS 정보 얻기
    frame_rate = 1  # 1초마다 1프레임 추출

    frame_count = 0
    frame_files = []

    while True:
        ret, frame = video_capture.read()
        if not ret:
            break  # 영상 끝나면 종료

        # fps/frame_rate → 1초마다 한 프레임씩 추출
        if frame_count % int(fps / frame_rate) == 0:
            frame_filename = f"frame_{frame_count}.jpg"
            frame_path = os.path.join(frames_folder, frame_filename)
            cv2.imwrite(frame_path, frame)

            # 'frames/'를 빼고, video_name/파일명 형식만 JSON으로 넘김
            frame_files.append(f'{video_name}/{frame_filename}')

            print(f"Frame saved: {frame_path}")

        frame_count += 1

    video_capture.release()

    if frame_files:
        return jsonify({"frames": frame_files}), 200
    else:
        return jsonify({"error": "No frames extracted"}), 500

if __name__ == '__main__':
    app.run(debug=True)
