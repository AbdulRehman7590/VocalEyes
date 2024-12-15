import React from "react";
import { View, Button, StyleSheet } from "react-native";
import CustomTitle from "../../src/components/CustomTitle";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <CustomTitle text="Home" />
      <Button
        title="Manual Mode"
        onPress={() => router.push("/(tabs)/manualMode")}
      />
      <Button
        title="Voice Mode"
        onPress={() => router.push("/(tabs)/voiceMode")}
      />
      <Button
        title="Settings"
        onPress={() => router.push("/(tabs)/settings")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", gap: 20, padding: 20 },
});
