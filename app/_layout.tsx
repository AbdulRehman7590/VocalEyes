import { Stack } from "expo-router";
import React from "react";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false,
          headerLeft: () => <></>,
          
        }} 
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          headerLeft: () => <></>,
        }}
      />
      <Stack.Screen name="+not-found" options={{}} />
    </Stack>
  );
}
