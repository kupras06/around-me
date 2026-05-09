import { HapticTab } from '@/components/haptic-tab';
import { ThemeToggleButton } from '@/components/ThemeToggleButton/ThemeToggleButton';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';

export default function TabLayout() {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.contentAccentSecondary,
        headerTransparent: true,
        headerRight: () => (
          <View style={{ marginRight: 16 }}>
            <ThemeToggleButton variant="neutral" />
          </View>
        ),
        headerTitle: '',
        tabBarButton: HapticTab,
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
          tabBarIcon: ({ color }) => <MaterialIcons name="location-on" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => <MaterialIcons name="bookmark" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="creators"
        options={{
          title: 'Creators',
          tabBarIcon: ({ color }) => <MaterialIcons name="people" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}