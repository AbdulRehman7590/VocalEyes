import os
import io
from datetime import datetime
from typing import List

import cv2
import numpy as np
import pytesseract
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import shutil

# Initialize FastAPI app
app = FastAPI()

# Directory to save uploaded images
UPLOAD_DIR = "./uploaded_images"
os.makedirs(UPLOAD_DIR, exist_ok=True)  # Create directory if it doesn't exist


# Utility Functions
def clear_upload_folder():
    """Remove all files in the upload directory."""
    try:
        for filename in os.listdir(UPLOAD_DIR):
            file_path = os.path.join(UPLOAD_DIR, filename)
            if os.path.isfile(file_path):
                os.remove(file_path)
        print("Upload folder cleared.")
    except Exception as e:
        raise RuntimeError(f"Failed to clear upload folder: {e}")


def process_image(image_path):
    """Preprocess the image for OCR."""
    try:
        # Load the image
        image = cv2.imread(image_path)

        # Convert to Grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Resize if needed
        height, width = gray.shape[:2]
        if width < 1000:
            scale_factor = 1000 / width
            gray = cv2.resize(
                gray, None, fx=scale_factor, fy=scale_factor, interpolation=cv2.INTER_CUBIC
            )

        # Apply Gaussian Blur to remove noise
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)

        # Apply adaptive thresholding
        thresh = cv2.adaptiveThreshold(
            blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )

        # Increase contrast
        alpha = 1.5  # Simple contrast control
        beta = 0    # Simple brightness control
        contrasted = cv2.convertScaleAbs(thresh, alpha=alpha, beta=beta)

        # Apply morphological operations to enhance text regions
        kernel = np.ones((2, 2), np.uint8)
        morphed = cv2.morphologyEx(contrasted, cv2.MORPH_CLOSE, kernel)

        # Further noise reduction using median blur
        denoised = cv2.medianBlur(morphed, 3)

        # Sharpen the image
        sharpen_kernel = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])
        sharpened = cv2.filter2D(denoised, -1, sharpen_kernel)
        
        # Apply dilation and erosion to connect broken text
        kernel = np.ones((2, 2), np.uint8)
        dilated = cv2.dilate(sharpened, kernel, iterations=1)
        eroded = cv2.erode(dilated, kernel, iterations=1)

        return eroded
    except Exception as e:
        raise RuntimeError(f"Image preprocessing failed: {e}")


def extract_text_from_image(image):
    """Extract text from a processed image using Tesseract OCR."""
    try:
        # Load the image using PIL for Tesseract
        pil_image = Image.fromarray(image)

        custom_config = r"--oem 3 --psm 6"
        text = pytesseract.image_to_string(pil_image, config=custom_config)
        return text.strip()
    except Exception as e:
        print(f"OCR extraction failed: {e}")
        raise RuntimeError(f"OCR extraction failed: {e}")


def preprocess_text(text):
    """Clean and preprocess OCR text output."""
    # text = " ".join(text.split())  # Normalize whitespace
    text = text.replace("|", "l")  # Correct common OCR errors
    return text


@app.get("/")
async def root():
    return {"message": "Welcome to the OCR Service"}


@app.post("/ocr")
async def api_ocr(files: List[UploadFile] = File(...)):
    """
    Endpoint to receive images, save them, process them, and return the extracted text.
    """
    try:
        if not files or len(files) == 0:
            raise HTTPException(status_code=400, detail="No files uploaded.")

        # Clear existing files in the upload folder
        clear_upload_folder()
        
        results = []
        for file in files:
            # Validate the file type
            if file.content_type not in ["image/jpeg", "image/png"]:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid file type for {file.filename}. Only JPEG and PNG are supported.",
                )

            # Define file path to save
            saved_file_path = os.path.join(UPLOAD_DIR, f"Raw_{file.filename}")

            # Save the file to the server
            with open(saved_file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            # Process the saved image
            processed_image = process_image(saved_file_path)
            
            # Save the processed image for debugging
            processed_image_path = os.path.join(UPLOAD_DIR, f"Processed_{file.filename}")
            cv2.imwrite(processed_image_path, processed_image)
            
            # Perform OCR on the processed image
            raw_text = extract_text_from_image(processed_image)
            print(f"Extracted text from {file.filename}: {raw_text}")
            
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
