import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUnistyles } from 'react-native-unistyles';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useCurrentUser } from '@/hooks/use-auth';

export default function TabLayout() {
  const { theme } = useUnistyles();
  const insets = useSafeAreaInsets();
  const { user } = useCurrentUser();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.contentAccentSecondary,
        tabBarButton: HapticTab,
        headerShown: false,
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
          tabBarIcon: ({  focused }) => (
            <IconSymbol
              name="location"
              size={focused ? 28 : 24}
              color={focused ? 'contentAccentSecondary' : 'contentSecondary'}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ focused }) => (
            <IconSymbol name="bookmark" size={24} color={focused ? 'contentAccentSecondary' : 'contentSecondary'}/>
          ),
        }}
      />

      <Tabs.Screen
        name="manage"
        options={{
          title: 'Manage',
          href: user?.is_creator ? '/manage' : null,
          tabBarIcon: ({ focused }) => (
            <IconSymbol name="pencil" size={24} color={focused ? 'contentAccentSecondary' : 'contentSecondary'} />
          ),
        }}
      />

      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          href: user?.is_admin ? '/admin' : null,
          tabBarIcon: ({ focused }) => (
            <IconSymbol name="lock" size={24} color={focused ? 'contentAccentSecondary' : 'contentSecondary'} />
          ),
        }}
      />

      <Tabs.Screen
        name="creators"
        options={{
          title: 'Creators',
          tabBarIcon: ({ focused }) => (
            <IconSymbol name="person.2.fill" size={24} color={focused ? 'contentAccentSecondary' : 'contentSecondary'} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          popToTopOnBlur: true,
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <IconSymbol name="person" size={24} color={focused ? 'contentAccentSecondary' : 'contentSecondary'} />
          ),
        }}
      />
    </Tabs>
  );
}
