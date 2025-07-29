from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import uuid
import logging

from clients.llm_client import analyze_images_as_one_person, IMAGE_ANALYSIS_PROMPT

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI setup
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/analyze-images")
async def analyze_images_endpoint(
    files: list[UploadFile] = File(...),
    prompt: str = Form(IMAGE_ANALYSIS_PROMPT)
):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded.")

    temp_file_paths = []

    try:
        # Save uploaded files to temp directory
        for upload in files:
            unique_name = f"{uuid.uuid4()}_{upload.filename}"
            file_path = os.path.join(UPLOAD_DIR, unique_name)
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(upload.file, buffer)
            temp_file_paths.append(file_path)

        # Analyze images
        result = analyze_images_as_one_person(temp_file_paths, prompt)
        return JSONResponse(content=result, status_code=200)

    except Exception as e:
        logger.exception("Image analysis failed")
        raise HTTPException(status_code=500, detail="Image analysis failed.")

    finally:
        # Clean up temp files
        for path in temp_file_paths:
            if os.path.exists(path):
                os.remove(path)
