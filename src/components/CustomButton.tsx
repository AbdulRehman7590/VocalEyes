import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/color";

export default function CustomButton({ title, onPress, icon }: any) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {icon && <>{icon}</>}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  text: {
    color: COLORS.buttonText,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
