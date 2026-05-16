import { Stack, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import AuthGate from '@/components/AuthGate/AuthGate';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Avatar } from '@/craftrn-ui/components/Avatar';
import { Button } from '@/craftrn-ui/components/Button';
import { Text } from '@/craftrn-ui/components/Text';
import { useCurrentUser } from '@/hooks/use-auth';
import type { Tables } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

type Pin = Tables<'pins'> & {
  places: Tables<'places'> | null;
};

export default function ManageScreen() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { theme } = useUnistyles();
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchPins = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pins')
        .select('*, places(*)')
        .eq('user_id', user?.id)
        .order('pinned_at', { ascending: false });

      if (error) throw error;
      setPins((data ?? []) as Pin[]);
    } catch (err) {
      console.error('Error fetching creator pins:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);
  useEffect(() => {
    if (user?.id && user?.is_creator) {
      fetchPins();
    }
  }, [user, fetchPins]);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <Avatar source={{ uri: user?.avatar_url }} size="large" />
        <Button
          variant="secondary"
          size="small"
          onPress={() => router.push('/onboarding/creator-setup')}
        >
          Edit Profile
        </Button>
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
          {user?.follower_count?.toLocaleString()} followers •{' '}
          {user?.tier?.replace('_', ' ').toUpperCase()}
        </Text>

        {user?.bio && (
          <Text variant="body2" style={styles.bio}>
            {user.bio}
          </Text>
        )}
      </View>

      <View style={styles.actionRow}>
        <Button
          variant="primary"
          onPress={() => router.push('/creator/submit-pin')}
          iconLeft={<IconSymbol name="plus" size={18} color="#fff" />}
        >
          Add Pin
        </Button>
        <Button
          variant="secondary"
          onPress={() => router.push('/creator/tag-post')}
          iconLeft={
            <IconSymbol
              name="link"
              size={18}
              color={theme.colors.contentPrimary}
            />
          }
        >
          Tag Post
        </Button>
      </View>

      <View style={styles.divider} />
      <Text variant="heading3" style={styles.sectionTitle}>
        Your Recommendations ({pins.length})
      </Text>
    </View>
  );

  const renderPin = ({ item }: { item: Pin }) => (
    <Pressable style={styles.pinCard}>
      <View style={styles.pinInfo}>
        <View style={styles.pinHeader}>
          <Text variant="body1" style={styles.placeName}>
            {item.places?.name}
          </Text>
          <IconSymbol
            name="chevron.right"
            size={18}
            color={theme.colors.contentSecondary}
          />
        </View>
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
    return (
      <AuthGate>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.emptyContainer}>
          <IconSymbol
            name="person.crop.circle"
            size={64}
            color={theme.colors.contentSecondary}
          />
          <Text variant="heading2" style={{ marginTop: 16 }}>
            Creator Mode
          </Text>
          <Text variant="body2" style={styles.emptyText}>
            This tab is for managing recommendations. Become a creator to start
            pinning places!
          </Text>
          <Button variant="primary" onPress={() => router.push('/onboarding')}>
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
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={fetchPins}
        />
      </View>
    </AuthGate>
  );
}

const styles = StyleSheet.create((theme, runtime) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundScreen,
    paddingTop: runtime.insets.top,
  },
  listContent: {
    paddingHorizontal: theme.spacing.large,
    paddingTop: theme.spacing.large,
    paddingBottom: runtime.insets.bottom + theme.spacing.large,
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
    backgroundColor: theme.colors.interactivePrimary,
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
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing.small,
    marginTop: theme.spacing.xlarge,
  },
  divider: {
    height: 0.5,
    backgroundColor: theme.colors.borderNeutralSecondary,
    marginVertical: theme.spacing.xlarge,
  },
  sectionTitle: {
    marginBottom: theme.spacing.medium,
  },
  pinCard: {
    backgroundColor: theme.colors.backgroundElevated,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    borderWidth: 0.5,
    borderColor: theme.colors.borderNeutralSecondary,
  },
  pinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pinInfo: {
    gap: theme.spacing.xsmall,
  },
  placeName: {
    fontWeight: '700',
    flex: 1,
  },
  placeMeta: {
    color: theme.colors.contentSecondary,
    textTransform: 'uppercase',
  },
  pinNote: {
    fontStyle: 'italic',
    marginTop: theme.spacing.xsmall,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xxlarge,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: theme.spacing.medium,
    color: theme.colors.contentSecondary,
    lineHeight: 22,
  },
}));
