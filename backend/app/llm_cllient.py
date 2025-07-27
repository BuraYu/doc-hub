import os
import logging
from dotenv import load_dotenv
from google import genai

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()
API_KEY = os.getenv("GENAI_API_KEY")

if not API_KEY:
    logger.error("GENAI_API_KEY is not set in .env file.")
    exit(1)

# Initialize the GenAI client
client = genai.Client(api_key=API_KEY)

# Constants
IMAGE_ANALYSIS_PROMPT = "Can you analyze this image, I need the name, surname, DOB and where it was issued."
DEFAULT_IMAGE_PATH = os.getenv("IMAGE_PATH", "backend/data/sample-data/test.jpg")

def analyze_image(image_path: str, prompt: str) -> str:
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found at: {image_path}")
    
    try:
        logger.info(f"Uploading image: {image_path}")
        image_data = client.files.upload(file=image_path)
    except Exception as e:
        logger.exception("Failed to upload image.")
        raise

    try:
        response = client.models.generate_content(
            model="gemma-3-4b-it",
            contents=[image_data, prompt] 
        )
        return response.text
    except Exception as e:
        logger.exception("Failed to generate content from model.")
        raise

if __name__ == "__main__":
    try:
        result = analyze_image(DEFAULT_IMAGE_PATH, IMAGE_ANALYSIS_PROMPT)
        logger.info(f"Model Response:\n{result}")
    except Exception as e:
        logger.error(f"Image analysis failed: {e}")
