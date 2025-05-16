
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os
from flask_cors import CORS
from model import process_video_with_annotations  # Updated model import

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
RESULT_FOLDER = "static/results"
ALLOWED_EXTENSIONS = {"mp4", "avi", "mov"}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["RESULT_FOLDER"] = RESULT_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/upload", methods=["POST"])
def upload_video():
    if "video" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["video"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        video_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(video_path)

        result = process_video_with_annotations(video_path, output_dir=RESULT_FOLDER)

        return jsonify(
            {
                "video_url": f'/results/{os.path.basename(result["video_path"])}',
                "prediction": {
                    "label": result["prediction"]["label"],
                    "confidence": result["prediction"]["confidence"],
                },
                "heatmaps": [
                    f"/results/{os.path.basename(p)}" for p in result["heatmaps"]
                ],
            }
        )

    return jsonify({"error": "Invalid file type"}), 400


@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


@app.route("/results/<filename>")
def result_file(filename):
    return send_from_directory(app.config["RESULT_FOLDER"], filename)


if __name__ == "__main__":
    app.run(debug=True)

