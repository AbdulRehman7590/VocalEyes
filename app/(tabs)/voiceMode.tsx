import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";

const VoiceMode = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [voiceText, setVoiceText] = useState<string>("");
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      // Cleanup the recording when the component unmounts
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [recording]);

  // Function to start recording
  const startRecording = async () => {
    try {
      console.log("Requesting permissions...");
      const permission = await Audio.requestPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Denied",
          "You need to grant audio permissions to record."
        );
        return;
      }

      console.log("Setting audio mode for iOS...");
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true, // Enable recording on iOS
        playsInSilentModeIOS: true, // Allow recording even in silent mode
        staysActiveInBackground: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX, // Correct constant
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      });

      console.log("Starting recording...");
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await newRecording.startAsync();

      setRecording(newRecording);
      setIsRecording(true);
    } catch (error) {
      console.error("Failed to start recording:", error);
      Alert.alert("Error", "Could not start recording.");
    }
  };

  // Function to stop recording and transcribe
  const stopRecording = async () => {
    try {
      console.log("Stopping recording...");
      await recording?.stopAndUnloadAsync();
      const uri = recording?.getURI();

      if (uri) {
        console.log("Recording stopped, URI:", uri);
        transcribeAudio(uri);
      }

      setRecording(null);
      setIsRecording(false);
    } catch (error) {
      console.error("Failed to stop recording:", error);
      Alert.alert("Error", "Could not stop recording.");
    }
  };

  // Function to transcribe audio using Deepgram
  const transcribeAudio = async (audioUri: string) => {
    try {
      const audioData = await fetch(audioUri);
      const audioBlob = await audioData.blob();

      const formData = new FormData();
      formData.append("file", audioBlob);

      const response = await axios.post(
        "https://api.deepgram.com/v1/listen",
        formData,
        {
          headers: {
            Authorization: "Token <YOUR_DEEPGRAM_API_KEY>", // Replace with your Deepgram API key
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const transcription =
        response.data.results.channels[0].alternatives[0].transcript;
      setVoiceText(transcription);
    } catch (error) {
      console.error("Error transcribing audio:", error);
      Alert.alert("Error", "Failed to transcribe audio. Please try again.");
    }
  };

  // Function to toggle reading aloud transcribed text
  const toggleReadAloud = (text: string) => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      Speech.speak(text, {
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
      });
      setIsSpeaking(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Mode</Text>

      {/* Start/Stop recording */}
      <TouchableOpacity
        style={[
          styles.button,
          isRecording ? styles.stopButton : styles.recordButton,
        ]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <MaterialCommunityIcons
          name={isRecording ? "stop-circle" : "microphone"}
          size={24}
          color="#FFF"
        />
        <Text style={styles.buttonText}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Text>
      </TouchableOpacity>

      {/* Display the transcribed text */}
      {voiceText ? (
        <View style={styles.textContainer}>
          <Text style={styles.text}>{voiceText}</Text>
          <TouchableOpacity
            style={[styles.button, styles.readButton]}
            onPress={() => toggleReadAloud(voiceText)}
          >
            <MaterialCommunityIcons name="volume-high" size={24} color="#FFF" />
            <Text style={styles.buttonText}>
              {isSpeaking ? "Stop" : "Read Aloud"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.placeholderText}>
          Press record to start speaking.
        </Text>
      )}
    </View>
  );
};

export default VoiceMode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    margin: 5,
    elevation: 2,
  },
  recordButton: {
    backgroundColor: "#28A745",
  },
  stopButton: {
    backgroundColor: "#DC3545",
  },
  readButton: {
    backgroundColor: "#FF5722",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  textContainer: {
    marginTop: 20,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  placeholderText: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: "italic",
    color: "#888",
  },
});
