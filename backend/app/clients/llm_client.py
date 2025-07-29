import os
import logging
from collections import Counter
from dotenv import load_dotenv
from google import genai
from utils.clean_json_result import parse_json_response
from utils.image_validation import is_image_suspicious


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()
API_KEY = os.getenv("GENAI_API_KEY")

if not API_KEY:
    logger.error("GENAI_API_KEY is not set in .env file.")
    exit(1)

client = genai.Client(api_key=API_KEY)

IMAGE_ANALYSIS_PROMPT = (
    "Analyze this image and extract the person's personal info: name, surname, and date_of_birth."
    "Return the result as a JSON object with keys: name, surname, and date_of_birth. "
    "If you cannot determine any attribute, set it to 'unknown'. "
    "If the document doesn't look valid return: Not valid "
    "If you detect multiple different identities in the images, return exactly: "
    '{"error": "Multiple identities detected, please check the files"}. '
    "If you cannot extract any valid data, return exactly: "
    '{"error": "No valid data"}.'
)

def analyze_images_as_one_person(image_paths: list[str], prompt: str) -> dict:
    extracted_data = []

    for image_path in image_paths:
        if not os.path.exists(image_path):
            logger.warning(f"Image not found: {image_path}")
            continue

        is_fake, validation_info = is_image_suspicious(image_path)
        if is_fake:
            logger.warning(f"Image flagged as suspicious: {image_path} → {validation_info}")
            continue
        try:
            logger.info(f"Uploading image: {image_path}")
            image_data = client.files.upload(file=image_path)

            logger.info(f"Analyzing: {image_path}")
            response = client.models.generate_content(
                model="gemma-3-4b-it",
                contents=[image_data, prompt],
                #  generation_config={
                #     "temperature": 0.7
                # }
            )


            parsed = parse_json_response(response.text)
            if parsed:
                extracted_data.append(parsed)

        except Exception as e:
            logger.exception(f"Failed to process image: {image_path}")

    if not extracted_data:
        return {"error": "No valid data"}

    # Fields to compare across all images
    fields = ["name", "surname", "date_of_birth"]
    field_values = {field: set() for field in fields}

    for data in extracted_data:
        for field in fields:
            value = data.get(field, "").strip().lower()
            if value and value != "unknown":
                field_values[field].add(value)

    # Check if there are conflicting values (multiple identities)
    for field, values in field_values.items():
        if len(values) > 1:
            return {"error": "Multiple identities detected, please check the files"}

    # Check if all values are unknown or empty
    if all(len(values) == 0 for values in field_values.values()):
        return {"error": "No valid data"}

    # Otherwise, return the first extracted result (or you could merge)
    return extracted_data[0]
