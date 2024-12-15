const BASE_URL = "https://5584-2a09-bac5-5042-254b-00-3b7-13.ngrok-free.app";

/**
 * Upload an image to the OCR backend for text extraction.
 * @param {string} imageUri - The URI of the image to upload.
 * @returns {Promise<Object>} - The response from the server, including the extracted text.
 */
export const uploadImageToOCR = async (imageUri) => {
  const formData = new FormData();
  formData.append("files", {
    uri: imageUri,
    name: "uploaded_image.jpg",
    type: "image/jpeg",
  });

  try {
    const response = await fetch(`${BASE_URL}/ocr`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.detail || "Failed to process the image. Please try again."
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error in uploadImageToOCR:", error.message);
    throw error;
  }
};

/**
 * Fetch a basic ping message from the backend to test the connection.
 * @returns {Promise<string>} - The message from the server.
 */
export const fetchPing = async () => {
  try {
    const response = await fetch(`${BASE_URL}/`);
    if (!response.ok) {
      throw new Error("Failed to connect to the server.");
    }
    const result = await response.json();
    return result.message;
  } catch (error) {
    console.error("Error in fetchPing:", error.message);
    throw error;
  }
};
