from flask import Flask, request, jsonify, render_template
import os
import cv2
import json
import pandas as pd
from ultralytics import YOLO
from datetime import timedelta

app = Flask(__name__)

UPLOAD_FOLDER = 'static/uploads'
FRAME_FOLDER = 'static/frames'
DETECTION_FOLDER = 'static/detections'  

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(FRAME_FOLDER, exist_ok=True)
os.makedirs(DETECTION_FOLDER, exist_ok=True)

MODEL_PATH = 'all_yolo11x_imgsz640_orgin.pt'  
model = YOLO(MODEL_PATH)

def extract_frames(video_path, output_folder):
    """비디오에서 1초당 1프레임을 추출"""
    os.makedirs(output_folder, exist_ok=True)
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)  
    frame_interval = int(fps) if fps > 0 else 30  
    frame_count = 0
    saved_frames = []
    frame_times = []  

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        if frame_count % frame_interval == 0:
            frame_filename = f"frame_{frame_count}.jpg"
            frame_path = os.path.join(output_folder, frame_filename)
            cv2.imwrite(frame_path, frame)
            saved_frames.append(frame_filename)
            frame_times.append(frame_count / fps)  

        frame_count += 1

    cap.release()
    return saved_frames, frame_times, fps

def detect_animals(frames_folder, fps, video_name):
    """프레임을 분석하여 동물이 검출된 시간을 CSV에 저장"""
    detection_results = []

    for frame_filename in sorted(os.listdir(frames_folder), key=lambda x: int(x.split('_')[1].split('.')[0])):
        frame_path = os.path.join(frames_folder, frame_filename)
        frame_index = int(frame_filename.split('_')[1].split('.')[0])  
        video_time = frame_index / fps  

        frame = cv2.imread(frame_path)
        detections = model(frame)[0].boxes.data.cpu().numpy()

        for detection in detections:
            x1, y1, x2, y2, confidence, class_id = detection
            if confidence > 0.5:  
                class_name = model.names[int(class_id)]
                detection_results.append({'time': str(timedelta(seconds=video_time)), 'animal': class_name})

    detection_results.sort(key=lambda x: list(map(int, x['time'].split(':'))))

    csv_path = os.path.join(DETECTION_FOLDER, f"{video_name}_detection_results.csv")
    json_path = os.path.join(DETECTION_FOLDER, f"{video_name}_detection_results.json")

    df = pd.DataFrame(detection_results)
    df.to_csv(csv_path, index=False, encoding='utf-8')

    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(detection_results, f, ensure_ascii=False, indent=4)

    return csv_path, json_path

def get_detected_times_from_csv(csv_path):
    """CSV 파일에서 'time' 컬럼을 읽어 검출된 시간 리스트 반환"""
    if not os.path.exists(csv_path):
        print(f"⚠️ CSV 파일을 찾을 수 없습니다: {csv_path}")
        return []  

    df = pd.read_csv(csv_path)
    
    if "time" not in df.columns:
        print(f"⚠️ CSV 파일에 'time' 컬럼이 없습니다: {csv_path}")
        return []

    detected_times = []
    for time_str in df["time"]:
        try:
            h, m, s = map(int, time_str.split(":"))
            total_seconds = h * 3600 + m * 60 + s
            detected_times.append(total_seconds)
        except ValueError:
            print(f"⚠️ 시간 변환 오류: {time_str}")

    return sorted(set(detected_times))  

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    """비디오 파일 업로드"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    return jsonify({'message': 'File uploaded successfully', 'filename': file.filename})

@app.route('/extract_frames', methods=['POST'])
def extract_video_frames():
    """프레임 추출 및 CSV 파일에서 탐지된 시간 가져오기"""
    video_file = request.form.get('video_file')
    if not video_file:
        return jsonify({'error': 'No video file provided'})

    video_path = os.path.join(UPLOAD_FOLDER, video_file)
    video_name = os.path.splitext(video_file)[0]
    output_folder = os.path.join(FRAME_FOLDER, video_name)

    frames, frame_times, fps = extract_frames(video_path, output_folder)

    csv_path, json_path = detect_animals(output_folder, fps, video_name)

    detected_times = get_detected_times_from_csv(csv_path)

    if not frames:
        return jsonify({'error': 'Frame extraction failed'}), 500

    return jsonify({
        'frames': [f"{video_name}/{f}" for f in frames],  
        'frame_times': frame_times,  
        'detected_times': detected_times,  
        'csv': csv_path,
        'json': json_path
    })

if __name__ == '__main__':
    app.run(debug=True)
