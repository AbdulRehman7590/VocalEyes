export const performOCRRequest = async (
  uri: string
): Promise<{ filename: string; text: string }[]> => {
  const API_URL = "https://07fc-175-107-228-196.ngrok-free.app";

  try {
    const formData = new FormData();
    formData.append("files", {
      uri,
      name: "uploaded_image.jpg",
      type: "image/jpeg",
    } as any);

    const response = await fetch(`${API_URL}/ocr`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("OCR request failed.");
    }

    const result = await response.json();
    return result.results.map((res: any, index: number) => ({
      filename: res.filename || `File_${index + 1}`,
      text: res.extracted_text || "No text found",
    }));
  } catch (error) {
    throw new Error("Error processing the OCR request.");
  }
};
