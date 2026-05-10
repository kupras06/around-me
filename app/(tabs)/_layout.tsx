import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabLayout() {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.contentAccentSecondary,
        tabBarButton: HapticTab,
        headerShown: false,
        sceneStyle: {
          backgroundColor: theme.colors.backgroundScreen,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.backgroundScreen,
          paddingTop: 10,
          height: 60 + insets.bottom,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => (
            <IconSymbol
              name="location"
              size={focused ? 28 : 24}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="bookmark" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="creators"
        options={{
          title: 'Creators',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="person.2.fill" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          popToTopOnBlur: true,
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <IconSymbol name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
