import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ManualMode"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="camera" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="VoiceMode"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="microphone" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Settings"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
