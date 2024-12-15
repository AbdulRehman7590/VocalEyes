import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { COLORS } from "@/src/constants/color";

export default function Welcome() {
  const [username, setUsername] = useState<string>("User");
  const router = useRouter();

  useEffect(() => {
    const fetchUsername = async () => {
      const storedName = await AsyncStorage.getItem("username");
      if (storedName) setUsername(storedName);
    };

    fetchUsername();
  }, []);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push("/(tabs)/home")}
    >
      <Text style={styles.welcomeText}>Welcome, {username}!</Text>
      <Text style={styles.subtitle}>
        Tap anywhere to proceed to the Home page.
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  welcomeText: { fontSize: 32, fontWeight: "bold", color: COLORS.primary },
  subtitle: { fontSize: 18, marginTop: 10, color: COLORS.secondary },
});
