import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Speech from "expo-speech";
import { performOCRRequest } from "@/src/services/api";

export default function CameraScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [ocrResults, setOcrResults] = useState<
    { filename: string; text: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const takePhoto = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();

    if (!granted) {
      Alert.alert("Permission Denied", "Camera access is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      setImageUri(result.assets[0].uri);
      processOCR(result.assets[0].uri);
    }
  };

  const processOCR = async (uri: string) => {
    setLoading(true);
    try {
      const results = await performOCRRequest(uri);
      setOcrResults(results);

      if (results.length > 0) {
        const text = results.map((res) => res.text).join("\n");
        Speech.speak(text, { language: "en-US" });
      }
    } catch (error) {
      const errormsg =
        error instanceof Error
          ? error.message
          : "Error processing the OCR request.";
      Alert.alert("Error", errormsg);
    } finally {
      setLoading(false);
    }
  };

  const toggleSpeech = async (text: string) => {
    const currentlySpeaking = await Speech.isSpeakingAsync();

    if (currentlySpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      Speech.speak(text, {
        language: "en-US",
        pitch: 1.0,
        rate: 1.0,
        onDone: () => setIsSpeaking(false),
      });
      setIsSpeaking(true);
    }
  };

  const clearResults = () => {
    Speech.stop();
    setOcrResults([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Camera</Text>
      <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
        <Text style={styles.buttonText}>Capture Image</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#007BFF" />}
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {ocrResults.length > 0 && (
        <ScrollView style={styles.results}>
          {ocrResults.map((result, index) => (
            <View key={index}>
              <TouchableOpacity
                style={styles.speechButton}
                onPress={() => toggleSpeech(result.text)}
              >
                <Text>{isSpeaking ? "Stop" : "Read Aloud"}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearResults}
              >
                <Text>Clear Results</Text>
              </TouchableOpacity>
              <Text style={styles.resultText}>{result.text}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
  results: {
    marginTop: 20,
    width: "100%",
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 5,

  },
  resultText: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  clearButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#FF5722",
    borderRadius: 5,
  },
  speechButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
});
