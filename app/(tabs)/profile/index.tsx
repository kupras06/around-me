import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import AuthGate from '@/components/AuthGate/AuthGate';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Avatar } from '@/craftrn-ui/components/Avatar';
import { Button } from '@/craftrn-ui/components/Button';
import { Text } from '@/craftrn-ui/components/Text';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useUnistyles();
  const [pins, setPins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id && user?.is_creator) {
      fetchPins();
    }
  }, [user]);

  const fetchPins = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pins')
        .select('*, places(*)')
        .eq('creator_id', user?.id)
        .order('pinned_at', { ascending: false });

      if (error) throw error;
      setPins(data || []);
    } catch (err) {
      console.error('Error fetching creator pins:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <Avatar source={{ uri: user?.avatar_url }} size="large" />
        <Pressable
          style={styles.settingsButton}
          onPress={() => router.push('/profile/settings')}
        >
          <IconSymbol name="gearshape" size={24} color={theme.colors.contentPrimary} />
        </Pressable>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.nameRow}>
          <Text variant="heading2">{user?.display_name}</Text>
          {user?.tier && (
             <View style={styles.badge}>
                <IconSymbol name="checkmark" size={12} color="#fff" />
             </View>
          )}
        </View>
        <Text variant="body2" style={styles.handle}>
          {user?.follower_count?.toLocaleString()} followers
        </Text>
        
        {user?.bio && (
          <Text variant="body2" style={styles.bio}>
            {user.bio}
          </Text>
        )}

        {user?.focus_description && (
          <Text variant="body3" style={styles.focus}>
            Focus: {user.focus_description}
          </Text>
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text variant="heading3">{pins.length}</Text>
          <Text variant="body3">Pins</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <Button 
          variant="primary" 
          onPress={() => router.push('/creator/submit-pin')}
          style={{ flex: 1 }}
        >
          Add Pin
        </Button>
        <Button 
          variant="secondary" 
          onPress={() => router.push('/creator/tag-post')}
          style={{ flex: 1 }}
        >
          Tag Post
        </Button>
      </View>

      <View style={styles.divider} />
      <Text variant="heading3" style={styles.sectionTitle}>Your Recommendations</Text>
    </View>
  );

  const renderPin = ({ item }: { item: any }) => (
    <Pressable style={styles.pinCard}>
      <View style={styles.pinInfo}>
        <Text variant="body1" style={styles.placeName}>{item.places?.name}</Text>
        <Text variant="body3" style={styles.placeMeta}>
          {item.places?.category} • {item.places?.neighbourhood}
        </Text>
        <Text variant="body2" style={styles.pinNote} numberOfLines={2}>
          {item.note}
        </Text>
      </View>
    </Pressable>
  );

  if (!user?.is_creator) {
    // For non-creators, we can redirect or show a basic profile
    // For now, redirecting to settings which is their main profile view
    return (
      <AuthGate>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Avatar source={{ uri: user?.avatar_url }} size="large" />
          <Text variant="heading2" style={{ marginTop: 16 }}>{user?.display_name}</Text>
          <Button 
            onPress={() => router.push('/profile/settings')}
            style={{ marginTop: 24 }}
          >
            Go to Settings
          </Button>
          <Button 
            variant="tertiary"
            onPress={() => router.push('/onboarding')}
            style={{ marginTop: 12 }}
          >
            Become a Creator
          </Button>
        </View>
      </AuthGate>
    );
  }

  return (
    <AuthGate>
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <FlatList
          data={pins}
          renderItem={renderPin}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={fetchPins}
        />
      </View>
    </AuthGate>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundScreen,
  },
  listContent: {
    padding: theme.spacing.large,
    paddingBottom: 100,
  },
  header: {
    marginBottom: theme.spacing.large,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.medium,
  },
  settingsButton: {
    padding: theme.spacing.small,
  },
  profileInfo: {
    gap: theme.spacing.xsmall,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
  },
  handle: {
    color: theme.colors.contentSecondary,
  },
  badge: {
    backgroundColor: '#C04A2A',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bio: {
    marginTop: theme.spacing.small,
    lineHeight: 20,
  },
  focus: {
    color: theme.colors.contentSecondary,
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: theme.spacing.large,
    gap: theme.spacing.xlarge,
  },
  stat: {
    alignItems: 'flex-start',
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing.small,
    marginTop: theme.spacing.xlarge,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xlarge,
  },
  sectionTitle: {
    marginBottom: theme.spacing.medium,
  },
  pinCard: {
    backgroundColor: theme.colors.backgroundNeutral,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pinInfo: {
    gap: theme.spacing.xsmall,
  },
  placeName: {
    fontWeight: '700',
  },
  placeMeta: {
    color: theme.colors.contentSecondary,
    textTransform: 'uppercase',
  },
  pinNote: {
    fontStyle: 'italic',
    marginTop: theme.spacing.xsmall,
  },
}));
