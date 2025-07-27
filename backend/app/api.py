from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
import shutil
import os
from clients.llm_client import analyze_image, IMAGE_ANALYSIS_PROMPT
from utils.clean_json_result import *

app = FastAPI()

# Temporary directory to store uploaded files
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/analyze-image")
async def analyze_image_endpoint(
    file: UploadFile = File(...),
    prompt: str = Form(IMAGE_ANALYSIS_PROMPT)
):
    """
    Endpoint to analyze an image using the GenAI model.
    - `file`: The image file to analyze.
    - `prompt`: Optional prompt for the analysis.
    """
    try:
        # Save the uploaded file to a temporary location
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Call the analyze_image function
        result = analyze_image(file_path, prompt)

        # Clean up the uploaded file
        os.remove(file_path)

        # Clean the result using the clean_json_result function
        cleaned_result = clean_json_result(result)

        # Return the cleaned result as JSON
        return JSONResponse(content={"result": cleaned_result}, status_code=200)

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid JSON format: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image analysis failed: {str(e)}")