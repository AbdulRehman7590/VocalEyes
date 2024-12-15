import React, { useState } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import uploadImageToOCR from "@/src/services/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ManualMode() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [ocrResults, setOcrResults] = useState<{ filename: string; text: string }[]>([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const performOCR = async () => {
    if (imageUri) {
      try {
        const response = await uploadImageToOCR(imageUri);
        if (response && Array.isArray(response)) {
          setOcrResults(response);
        } else {
          Alert.alert("Error", "No text found in the image.");
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to process the image.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manual Mode</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
          <MaterialCommunityIcons name="camera" size={24} color="#fff" />
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
          <MaterialCommunityIcons name="image" size={24} color="#fff" />
          <Text style={styles.buttonText}>Pick Image</Text>
        </TouchableOpacity>
      </View>

      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <TouchableOpacity style={styles.uploadButton} onPress={performOCR}>
            <MaterialCommunityIcons name="cloud-upload" size={20} color="#fff" />
            <Text style={styles.uploadButtonText}>Upload & Process</Text>
          </TouchableOpacity>
        </View>
      )}

      {ocrResults.length > 0 && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>OCR Results:</Text>
          {ocrResults.map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.filename}>File: {result.filename}</Text>
              <Text style={styles.resultText}>{result.text}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2C3E50",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28A745",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  resultContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "#FFF",
    borderRadius: 10,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  resultItem: {
    marginBottom: 10,
  },
  filename: {
    fontWeight: "bold",
    color: "#007BFF",
  },
  resultText: {
    fontSize: 16,
    color: "#555",
  },
});
