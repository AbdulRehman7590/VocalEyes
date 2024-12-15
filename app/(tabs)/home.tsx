import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import CustomTitle from "@/src/components/CustomTitle";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <CustomTitle text="Home" />

      <TouchableOpacity
        style={[styles.button, styles.manualButton]}
        onPress={() => router.push("/(tabs)/ManualMode")}
      >
        <MaterialCommunityIcons name="camera" size={24} color="#FFF" />
        <Text style={styles.buttonText}>Manual Mode</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.voiceButton]}
        onPress={() => router.push("/(tabs)/VoiceMode")}
      >
        <MaterialCommunityIcons name="microphone" size={24} color="#FFF" />
        <Text style={styles.buttonText}>Voice Mode</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.settingsButton]}
        onPress={() => router.push("/(tabs)/Settings")}
      >
        <MaterialCommunityIcons name="cog" size={24} color="#FFF" />
        <Text style={styles.buttonText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  manualButton: {
    backgroundColor: "#4CAF50",
  },
  voiceButton: {
    backgroundColor: "#2196F3",
  },
  settingsButton: {
    backgroundColor: "#FF5722",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
