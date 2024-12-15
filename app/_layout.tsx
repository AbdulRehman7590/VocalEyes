// app/_layout.tsx
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./(tabs)/home"
import CameraScreen from "./(tabs)/camera";
import PickerScreen from "./(tabs)/picker";

const Tab = createBottomTabNavigator();

export default function RootLayout() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home-outline";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Camera") {
            iconName = focused ? "camera" : "camera-outline";
          } else if (route.name === "Picker") {
            iconName = focused ? "images" : "images-outline";
          }

          // Return the appropriate icon component
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato", // Color for the active tab
        tabBarInactiveTintColor: "gray", // Color for the inactive tabs
        tabBarStyle: { backgroundColor: "#f8f8f8", paddingBottom: 5 }, // Custom style
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Camera" component={CameraScreen} />
      <Tab.Screen name="Picker" component={PickerScreen} />
    </Tab.Navigator>
  );
}
