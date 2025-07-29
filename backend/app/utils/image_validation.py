import os
from PIL import Image
from PIL.ExifTags import TAGS
import cv2
import numpy as np

def check_exif_data(image_path):
    image = Image.open(image_path)
    exif_data = image.getexif()
    if not exif_data:
        return "Missing or empty EXIF — suspicious"

    readable_exif = {TAGS.get(tag): value for tag, value in exif_data.items() if tag in TAGS}
    if not readable_exif:
        return "Empty or minimal EXIF — may be fake"
    
    return "EXIF data present"

def calculate_image_entropy(image_path):
    image = cv2.imread(image_path, 0)  # grayscale
    histogram = cv2.calcHist([image], [0], None, [256], [0, 256])
    histogram /= histogram.sum()
    entropy = -np.sum(histogram * np.log2(histogram + 1e-7))
    return float(round(entropy, 2))

def is_image_suspicious(image_path, entropy_threshold=4.0):
    exif_result = check_exif_data(image_path)
    entropy = calculate_image_entropy(image_path)

    if "Missing" in exif_result or "Empty" in exif_result:
        if entropy < entropy_threshold:
            return True, {
                "reason": "Low entropy and missing EXIF — likely fake",
                "entropy": entropy,
                "exif": exif_result
            }

    return False, {
        "reason": "Passed basic checks",
        "entropy": entropy,
        "exif": exif_result
    }
