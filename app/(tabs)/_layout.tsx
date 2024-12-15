import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Home from "./Home";
import ManualMode from "./ManualMode";
import VoiceMode from "./VoiceMode";
import Settings from "./Settings";

const Tabs = createBottomTabNavigator();

export default function TabsLayout() {
  return (
    <Tabs.Navigator
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof MaterialCommunityIcons.glyphMap = 'home-outline';

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'ManualMode') {
          iconName = focused ? 'camera' : 'camera-outline';
        } else if (route.name === 'VoiceMode') {
          iconName = focused ? 'microphone' : 'microphone-outline';
        }else if (route.name === 'Settings') {
          iconName = focused ? 'cog' : 'cog-outline';
        }

        // Return the appropriate icon component
        return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato', // Color for the active tab
      tabBarInactiveTintColor: 'gray', // Color for the inactive tabs
      tabBarStyle: { backgroundColor: '#f8f8f8', paddingBottom: 5 }, // Custom style
    })}
    >
      <Tabs.Screen name="Home" component={Home} />
      <Tabs.Screen name="ManualMode" component={ManualMode} />
      <Tabs.Screen name="VoiceMode" component={VoiceMode} />
      <Tabs.Screen name="Settings" component={Settings} />
    </Tabs.Navigator>
  );
}
