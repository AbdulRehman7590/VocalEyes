import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Speech from "expo-speech";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const API_URL = "https://3182-2a09-bac5-5044-254b-00-3b7-2c.ngrok-free.app";

export default function ManualMode() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [ocrResults, setOcrResults] = useState<
    { filename: string; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const requestPermissions = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryStatus =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!cameraStatus.granted || !mediaLibraryStatus.granted) {
      Alert.alert(
        "Permissions required",
        "You need to grant permissions to use this feature."
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

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
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

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
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("files", {
          uri: imageUri,
          name: "uploaded_image.jpg",
          type: "image/jpeg",
        } as any);

        const response = await fetch(`${API_URL}/ocr`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.detail || "Failed to process the image. Please try again."
          );
        }

        const result = await response.json();

        if (result.results && result.results.length > 0) {
          const extractedResults = result.results.map(
            (res: any, index: number) => ({
              filename: res.filename || `File_${index + 1}`,
              text: res.extracted_text || "No text found",
            })
          );
          setOcrResults(extractedResults);
        } else {
          Alert.alert("Error", "No text found in the image.");
        }
        setImageUri(null);
      } catch (error) {
        console.error(error);
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred.";
        Alert.alert("Error", errorMessage);
        setImageUri(null);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleSpeech = async (text: string) => {
    const currentlySpeaking = await Speech.isSpeakingAsync();

    if (currentlySpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      Speech.speak(text, {
        language: "en-US", // Explicitly set language to English US
        pitch: 1.0,
        rate: 1.0,
        onDone: () => setIsSpeaking(false),
        onError: (error) => {
          console.error("Speech error:", error);
          Alert.alert("Speech Error", "Failed to read the text aloud.");
        },
      });
      setIsSpeaking(true);
    }
  };

  const clearResults = () => {
    Speech.stop();
    setIsSpeaking(false);
    setOcrResults([]);
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

      {loading && (
        <ActivityIndicator
          size="large"
          color="#007BFF"
          style={styles.loadingIndicator}
        />
      )}

      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <TouchableOpacity style={styles.uploadButton} onPress={performOCR}>
            <MaterialCommunityIcons
              name="cloud-upload"
              size={20}
              color="#fff"
            />
            <Text style={styles.uploadButtonText}>Upload & Process</Text>
          </TouchableOpacity>
        </View>
      )}

      {ocrResults.length > 0 && (
        <ScrollView style={styles.resultContainer}>
          <Text style={styles.resultTitle}>OCR Results:</Text>
          {ocrResults.map((result, index) => (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.filename}>File: {result.filename}</Text>
              <TouchableOpacity
                style={styles.readButton}
                onPress={() => toggleSpeech(result.text)}
              >
                <MaterialCommunityIcons
                  name={isSpeaking ? "volume-off" : "volume-high"}
                  size={20}
                  color="#fff"
                />
                <Text style={styles.readButtonText}>
                  {isSpeaking ? "Stop" : "Read Aloud"}
                </Text>
              </TouchableOpacity>
              <Text style={styles.resultText}>{result.text}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.clearButton} onPress={clearResults}>
            <MaterialCommunityIcons name="delete" size={20} color="#fff" />
            <Text style={styles.clearButtonText}>Clear Results</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#343A40",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    width: "100%",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  uploadButton: {
    flexDirection: "row",
    backgroundColor: "#28A745",
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  resultItem: {
    marginBottom: 10,
  },
  filename: {
    fontWeight: "bold",
  },
  resultText: {
    color: "#555",
  },
  readButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#17A2B8",
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  readButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  clearButton: {
    flexDirection: "row",
    backgroundColor: "#DC3545",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
});
