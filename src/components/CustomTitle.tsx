import React from "react";
import { Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/color";

export default function CustomTitle({ text }: { text: string }) {
  return <Text style={styles.title}>{text}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: "center",
  },
});
