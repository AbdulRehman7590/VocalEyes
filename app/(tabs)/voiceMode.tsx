import React, { useState } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Speech from "expo-speech";
import * as FileSystem from "expo-file-system";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function VoiceMode() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [processedText, setProcessedText] = useState<string>("");
  const [voiceText, setVoiceText] = useState<string>("");

  // Function to take a photo and simulate text extraction
  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      Speech.speak("Processing photo.");
      setProcessedText("Processing...");
      setTimeout(() => setProcessedText("Sample extracted text."), 2000);
    }
  };

  // Function to record voice and save the extracted text
  const recordVoice = async () => {
    Speech.speak("Start speaking...");

    const voiceInput = "This is the extracted text from voice input.";
    setVoiceText(voiceInput);

    const timestamp = new Date().toISOString();
    const fileName = `${FileSystem.documentDirectory}voice_text/voice_${timestamp}.txt`;
    await FileSystem.makeDirectoryAsync(
      FileSystem.documentDirectory + "voice_text/",
      { intermediates: true }
    );
    await FileSystem.writeAsStringAsync(fileName, voiceInput);

    alert("Voice text saved successfully.");
    Speech.speak(voiceInput); 
  };

  return (
    <View style={[styles.container]}>
      <Text style={[styles.title]}>Voice Mode</Text>

      <View style={styles.buttonContainer}>
        {/* Button to take a photo */}
        <TouchableOpacity
          style={[styles.button]}
          onPress={takePhoto}
        >
          <MaterialCommunityIcons name="camera" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Open Camera</Text>
        </TouchableOpacity>

        {/* Button to record voice */}
        <TouchableOpacity
          style={[styles.button]}
          onPress={recordVoice}
        >
          <MaterialCommunityIcons name="microphone" size={24} color="#FFF" />
          <Text style={styles.buttonText}>Save Voice Input</Text>
        </TouchableOpacity>
      </View>

      {/* Display image and processed text */}
      {imageUri && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUri }} style={styles.image} />
          <Text style={styles.text}>{processedText}</Text>
        </View>
      )}

      {/* Display and read out loud the voice input text */}
      {voiceText && (
        <View style={styles.textContainer}>
          <Text style={[styles.text]}>{voiceText}</Text>
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
    padding: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    margin: 5,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  imageContainer: { marginTop: 20, alignItems: "center" },
  image: { width: 200, height: 200, borderRadius: 10 },
  text: { marginTop: 10, fontSize: 16 },
  textContainer: { marginTop: 20, alignItems: "center" },
});
