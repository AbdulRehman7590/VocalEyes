import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  Button,
  StyleSheet,
} from "react-native";
import { COLORS } from "../../src/constants/color";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [username, setUsername] = useState("");

  const toggleTheme = async () => {
    setIsDarkMode((prev) => !prev);
    await AsyncStorage.setItem("theme", isDarkMode ? "light" : "dark");
  };

  const saveUsername = async () => {
    await AsyncStorage.setItem("username", username);
    alert("Username saved!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      <View style={styles.settingRow}>
        <Text style={styles.label}>Dark Mode:</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.label}>Set Username:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <Button title="Save Username" onPress={saveUsername} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  label: { fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.secondary,
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
  },
});
