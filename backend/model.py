import torch
from torchvision import transforms
from PIL import Image
import cv2
import numpy as np
from collections import Counter
import os

# ✅ Load model once globally
model_path = "best_deepfake_model.pt"
model = torch.load(model_path, map_location=torch.device('cpu'), weights_only=False)
model.eval()
class_names = ['fake', 'real']

# 🔄 Preprocessing transform
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5, 0.5, 0.5], std=[0.5, 0.5, 0.5])
])

# 🧠 Predict on a face crop
def predict_face(face_img):
    image = Image.fromarray(cv2.cvtColor(face_img, cv2.COLOR_BGR2RGB))
    input_tensor = transform(image).unsqueeze(0)
    with torch.no_grad():
        output = model(input_tensor)
        _, predicted = torch.max(output, 1)
        return class_names[predicted.item()]

# 📽️ Process video and return result + annotated frames
def process_video_with_annotations(input_path, output_dir='results', num_frames=10):
    os.makedirs(output_dir, exist_ok=True)

    cap = cv2.VideoCapture(input_path)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    width  = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    video_filename = os.path.basename(input_path)
    annotated_video_path = os.path.join(output_dir, f"annotated_{video_filename}")
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(annotated_video_path, fourcc, fps, (width, height))

    frame_indices = np.linspace(0, total - 1, num=num_frames, dtype=int)
    predictions = []
    saved_frames = []

    frame_id = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_id in frame_indices:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, 1.3, 5)

            pred_label = 'no face'
            for (x, y, w, h) in faces:
                face_crop = frame[y:y+h, x:x+w]
                pred_label = predict_face(face_crop)
                color = (0, 255, 0) if pred_label == 'real' else (0, 0, 255)
                cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
                predictions.append(pred_label)
                break

            # Save frame to file
            frame_output_path = os.path.join(output_dir, f"frame_{frame_id}.jpg")
            cv2.imwrite(frame_output_path, frame)
            saved_frames.append(frame_output_path)

        out.write(frame)
        frame_id += 1

    cap.release()
    out.release()

    if predictions:
        final_prediction = Counter(predictions).most_common(1)[0][0]
        real_count = predictions.count('real')
        accuracy = (real_count / len(predictions)) * 100
    else:
        final_prediction = 'no face'
        accuracy = 0.0

    return {
        'video_path': annotated_video_path,
        'prediction': {
            'label': final_prediction,
            'confidence': accuracy
        },
        'heatmaps': saved_frames
    }
