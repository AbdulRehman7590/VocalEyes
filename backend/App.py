import io
from datetime import datetime
from typing import List

import cv2
import numpy as np
import pytesseract
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse

# Initialize FastAPI app
app = FastAPI()


# Utility Functions
def process_image(image_obj=None):
    """Preprocess the image for OCR."""
    try:
        if image_obj:
            # Convert to OpenCV format
            image = cv2.cvtColor(np.array(image_obj), cv2.COLOR_RGB2BGR)
        else:
            raise ValueError("No valid image source provided.")

        # Convert to Grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Resize if needed
        height, width = gray.shape[:2]
        if width < 1000:
            scale_factor = 1000 / width
            gray = cv2.resize(
                gray,
                None,
                fx=scale_factor,
                fy=scale_factor,
                interpolation=cv2.INTER_CUBIC,
            )

        # Apply adaptive thresholding
        processed_image = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )

        return processed_image
    except Exception as e:
        raise RuntimeError(f"Image preprocessing failed: {e}")


def extract_text_from_image(image):
    """Extract text from a processed image using Tesseract OCR."""
    try:
        custom_config = r"--oem 3 --psm 6"
        text = pytesseract.image_to_string(image, config=custom_config)
        return text.strip()
    except Exception as e:
        raise RuntimeError(f"OCR extraction failed: {e}")


def preprocess_text(text):
    """Clean and preprocess OCR text output."""
    text = " ".join(text.split())  # Normalize whitespace
    text = text.replace("|", "l")  # Correct common OCR errors
    return text


@app.get("/")
async def root():
    return {"message": "Welcome to the OCR Service"}


@app.post("/ocr")
async def api_ocr(files: List[UploadFile] = File(...)):
    """
    Endpoint to receive images, process them, and return the extracted text.
    """
    try:
        if not files or len(files) == 0:
            raise HTTPException(status_code=400, detail="No files uploaded.")

        results = []

        for file in files:
            # Validate the file type
            if file.content_type not in ["image/jpeg", "image/png"]:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid file type for {file.filename}. Only JPEG and PNG are supported.",
                )

            # Read the uploaded file into memory
            image_data = await file.read()

            # Process the image using PIL
            image = Image.open(io.BytesIO(image_data))
            processed_image = process_image(image_obj=image)

            # Perform OCR on the processed image
            raw_text = extract_text_from_image(processed_image)

            # Preprocess the extracted text
            processed_text = preprocess_text(raw_text)

            # Append results
            results.append(
                {
                    "filename": file.filename,
                    "extracted_text": processed_text,
                }
            )

        return JSONResponse(content={"results": results})

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


# Entrypoint for the server
if __name__ == "__main__":
    import uvicorn

    print("Starting the FastAPI OCR service...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
