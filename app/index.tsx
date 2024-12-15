import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
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
      onPress={() => router.push("/(tabs)/Home")}
    >
      <Image
        source={require("@/assets/images/welcome.png")} // Add a welcome image in the assets folder
        style={styles.image}
      />
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
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.secondary,
    textAlign: "center",
    marginTop: 10,
  },
});
