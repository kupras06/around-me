import { HapticTab } from '@/components/HapticTab/HapticTab';
import { ThemeToggleButton } from '@/components/ThemeToggleButton/ThemeToggleButton';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import Svg, { Path, SvgProps } from 'react-native-svg';
import { useUnistyles } from 'react-native-unistyles';

const MapIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={24} height={24} {...props}>
    <Path d="M12 2C8 2 5 5 5 9c0 5.25 7 11 7 11s7-5.75 7-11c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
  </Svg>
);

const SavedIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={24} height={24} {...props}>
    <Path d="M6 2h12v20l-6-4-6 4V2z" />
  </Svg>
);

const CreatorsIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={24} height={24} {...props}>
    <Path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z" />
  </Svg>
);

const ProfileIcon = (props: SvgProps) => (
  <Svg viewBox="0 0 24 24" width={24} height={24} {...props}>
    <Path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z" />
  </Svg>
);

export default function TabLayout() {
  const { theme } = useUnistyles();

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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <MapIcon fill={color} />,
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => <SavedIcon fill={color} />,
        }}
      />

      <Tabs.Screen
        name="creators"
        options={{
          title: 'Creators',
          tabBarIcon: ({ color }) => <CreatorsIcon fill={color} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <ProfileIcon fill={color} />,
        }}
      />
    </Tabs>
  );
}
