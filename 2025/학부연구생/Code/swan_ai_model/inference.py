import os
import cv2
import numpy as np
from ultralytics import YOLO

VISUALIZATION = True

model = YOLO("swan_0320model_yolo11n.pt")

input_folder = "datasets/testset"
output_folder = "output"
os.makedirs(output_folder, exist_ok=True)

WINDOW_SIZE = 640
OVERLAP = 320

def process_image(image_path):
    image = cv2.imread(image_path)
    original_h, original_w, _ = image.shape
    image_name = os.path.splitext(os.path.basename(image_path))[0]

    all_detections = []

    for y in range(0, original_h - WINDOW_SIZE + 1, OVERLAP):
        for x in range(0, original_w - WINDOW_SIZE + 1, OVERLAP):
            cropped_img = image[y:y + WINDOW_SIZE, x:x + WINDOW_SIZE]
            results = model(cropped_img, imgsz=640, conf=0.5)

            for result in results:
                for box in result.boxes.data:
                    x1, y1, x2, y2, conf, cls = box.cpu().numpy()
                    x1 += x
                    x2 += x
                    y1 += y
                    y2 += y
                    all_detections.append((int(x1), int(y1), int(x2), int(y2), float(conf), int(cls)))

    final_detections = apply_nms(all_detections)
    yolo_labels = []

    for (x1, y1, x2, y2, conf, cls) in final_detections:
        if VISUALIZATION:
            cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
            label = f"Class {cls} ({conf:.2f})"
            cv2.putText(image, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

        # YOLO 포맷 변환
        x_center = ((x1 + x2) / 2) / original_w
        y_center = ((y1 + y2) / 2) / original_h
        width = (x2 - x1) / original_w
        height = (y2 - y1) / original_h
        yolo_labels.append(f"{cls} {x_center:.6f} {y_center:.6f} {width:.6f} {height:.6f}")

    # 이미지 저장
    out_img_path = os.path.join(output_folder, f"{image_name}.jpg")
    cv2.imwrite(out_img_path, image)

    # 라벨 파일 저장
    label_path = os.path.join(output_folder, f"{image_name}.txt")
    with open(label_path, 'w') as f:
        f.write("0\n")  # 첫 줄: 검수 안됨 표시
        for line in yolo_labels:
            f.write(line + "\n")

    print(f"Processed: {image_path} → {out_img_path}, Labels saved to {label_path}")

def apply_nms(detections, iou_threshold=0.95):
    if len(detections) == 0:
        return []
    boxes = np.array([[x1, y1, x2, y2] for (x1, y1, x2, y2, _, _) in detections])
    scores = np.array([conf for (_, _, _, _, conf, _) in detections])
    indices = cv2.dnn.NMSBoxes(boxes.tolist(), scores.tolist(), score_threshold=0.5, nms_threshold=iou_threshold)
    return [detections[i] for i in indices.flatten()]

# 모든 이미지 처리
for filename in os.listdir(input_folder):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        process_image(os.path.join(input_folder, filename))

print("✅ 모든 이미지 처리 및 라벨 파일 생성 완료!")