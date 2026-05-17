import { Stack, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import AuthGate from '@/components/AuthGate/AuthGate';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Avatar } from '@/craftrn-ui/components/Avatar';
import { Button } from '@/craftrn-ui/components/Button';
import { InputText } from '@/craftrn-ui/components/InputText/InputText';
import { Text } from '@/craftrn-ui/components/Text';
import { useCurrentUser } from '@/hooks/use-auth';
import type { Tables } from '@/lib/database.types';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';

type Pin = Tables<'pins'> & {
  places: Tables<'places'> | null;
};

type Submission = Tables<'submissions'> & {
  places: Tables<'places'> | null;
};

type ManageItem = {
  id: number;
  type: 'pin' | 'submission';
  note: string | null;
  places: Tables<'places'> | null;
  status: string;
  sortDate: string | null;
};

export default function ManageScreen() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { theme } = useUnistyles();
  const [items, setItems] = useState<ManageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const getItemKey = (item: Pick<ManageItem, 'id' | 'type'>) =>
    `${item.type}-${item.id}`;

  const fetchPins = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    setLoading(true);
    try {
      const [pinResult, submissionResult] = await Promise.all([
        supabase
          .from('pins')
          .select('*, places(*)')
          .eq('user_id', user.id)
          .order('pinned_at', { ascending: false }),
        supabase
          .from('submissions')
          .select('*, places(*)')
          .eq('user_id', user.id)
          .order('submitted_at', { ascending: false }),
      ]);

      if (pinResult.error) throw pinResult.error;
      if (submissionResult.error) throw submissionResult.error;

      const approvedPins = ((pinResult.data ?? []) as Pin[]).map((pin) => ({
        id: pin.id,
        type: 'pin' as const,
        note: pin.note,
        places: pin.places,
        status: pin.status ?? 'approved',
        sortDate: pin.pinned_at ?? pin.created_at,
      }));

      const submissions = ((submissionResult.data ?? []) as Submission[]).map(
        (submission) => ({
          id: submission.id,
          type: 'submission' as const,
          note: submission.note,
          places: submission.places,
          status: submission.status ?? 'pending',
          sortDate: submission.submitted_at,
        })
      );

      setItems(
        [...approvedPins, ...submissions].sort((a, b) =>
          (b.sortDate ?? '').localeCompare(a.sortDate ?? '')
        )
      );
    } catch (err) {
      logger.error('Error fetching creator pins:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);
  useEffect(() => {
    if (user?.id && user?.is_creator) {
      fetchPins();
    }
  }, [user, fetchPins]);

  const startEditing = (item: ManageItem) => {
    setEditingKey(getItemKey(item));
    setNoteDraft(item.note ?? '');
  };

  const cancelEditing = () => {
    setEditingKey(null);
    setNoteDraft('');
  };

  const handleSaveNote = async (item: ManageItem) => {
    if (!user?.id) {
      return;
    }

    const key = getItemKey(item);
    setSavingKey(key);
    try {
      const { error } = await supabase
        .from(item.type === 'pin' ? 'pins' : 'submissions')
        .update({ note: noteDraft.trim() })
        .eq('id', item.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setItems((prev) =>
        prev.map((current) =>
          getItemKey(current) === key
            ? { ...current, note: noteDraft.trim() }
            : current
        )
      );
      cancelEditing();
    } catch (err) {
      logger.error('Error updating recommendation note:', err);
      alert('Failed to update note.');
    } finally {
      setSavingKey(null);
    }
  };

  const handleResubmit = async (item: ManageItem) => {
    if (!user?.id || item.type !== 'submission') {
      return;
    }

    const key = getItemKey(item);
    setSavingKey(key);
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ status: 'pending' })
        .eq('id', item.id)
        .eq('user_id', user.id);

      if (error) throw error;

      setItems((prev) =>
        prev.map((current) =>
          getItemKey(current) === key
            ? { ...current, status: 'pending' }
            : current
        )
      );
    } catch (err) {
      logger.error('Error resubmitting recommendation:', err);
      alert('Failed to resubmit recommendation.');
    } finally {
      setSavingKey(null);
    }
  };

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
              <IconSymbol name="checkmark" size={12} color="interactiveSecondaryContent" />
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
          iconLeft={<IconSymbol name="plus" size={18} />}
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
              color={'contentSecondary'}
            />
          }
        >
          Tag Post
        </Button>
      </View>

      <View style={styles.divider} />
      <Text variant="heading3" style={styles.sectionTitle}>
        Your Recommendations ({items.length})
      </Text>
    </View>
  );

  const renderStatus = (item: ManageItem) => {
    const status = item.type === 'pin' ? 'approved' : item.status;
    const statusStyle =
      status === 'approved'
        ? styles.statusApproved
        : status === 'rejected'
          ? styles.statusRejected
          : styles.statusPending;

    return (
      <View style={[styles.statusBadge, statusStyle]}>
        <Text variant="body3" style={styles.statusText}>
          {status.toUpperCase()}
        </Text>
      </View>
    );
  };

  const renderPin = ({ item }: { item: ManageItem }) => {
    const itemKey = getItemKey(item);
    const isEditing = editingKey === itemKey;
    const isSaving = savingKey === itemKey;
    const canResubmit =
      item.type === 'submission' && item.status === 'rejected';

    return (
      <View style={styles.pinCard}>
        <View style={styles.pinInfo}>
          <View style={styles.pinHeader}>
            <Text variant="body1" style={styles.placeName}>
              {item.places?.name ?? 'Unnamed place'}
            </Text>
            {renderStatus(item)}
          </View>
          <Text variant="body3" style={styles.placeMeta}>
            {item.places?.category ?? 'Place'} •{' '}
            {item.places?.neighbourhood ?? 'Unknown neighbourhood'}
          </Text>
          {isEditing ? (
            <View style={styles.editGroup}>
              <InputText
                label="Note"
                value={noteDraft}
                onChangeText={(text) => setNoteDraft(text.slice(0, 160))}
                multiline
                numberOfLines={3}
                style={styles.noteInput}
              />
              <Text variant="body3" style={styles.charCount}>
                {noteDraft.length}/160
              </Text>
            </View>
          ) : (
            <Text variant="body2" style={styles.pinNote} numberOfLines={2}>
              {item.note || 'No note added.'}
            </Text>
          )}

          <View style={styles.pinActions}>
            {isEditing ? (
              <>
                <Button
                  variant="secondary"
                  size="small"
                  onPress={cancelEditing}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="small"
                  onPress={() => handleSaveNote(item)}
                  loading={isSaving}
                  disabled={!noteDraft.trim()}
                >
                  Save Note
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="small"
                  onPress={() => startEditing(item)}
                  iconLeft={
                    <IconSymbol
                      name="pencil"
                      size={14}
                      color={'contentPrimary'}
                    />
                  }
                >
                  Edit Note
                </Button>
                {canResubmit && (
                  <Button
                    variant="primary"
                    size="small"
                    onPress={() => handleResubmit(item)}
                    loading={isSaving}
                  >
                    Resubmit
                  </Button>
                )}
              </>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (!user?.is_creator) {
    return (
      <AuthGate errorDescription="Please sign in to manage your recommendations.">
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.emptyContainer}>
          <IconSymbol
            name="person.crop.circle"
            size={64}
            color={'contentSecondary'}
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
    <AuthGate errorDescription="Please sign in to manage your recommendations.">
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <FlatList
          data={items}
          renderItem={renderPin}
          keyExtractor={getItemKey}
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
    gap: theme.spacing.small,
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
  statusBadge: {
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.small,
    paddingVertical: theme.spacing.xxsmall,
  },
  statusApproved: {
    backgroundColor: theme.colors.sentimentSecondaryPositive,
  },
  statusPending: {
    backgroundColor: theme.colors.interactiveSecondary,
  },
  statusRejected: {
    backgroundColor: theme.colors.sentimentSecondaryNegative,
  },
  statusText: {
    color: theme.colors.contentPrimary,
    fontWeight: '700',
  },
  editGroup: {
    gap: theme.spacing.xsmall,
    marginTop: theme.spacing.small,
  },
  noteInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    lineHeight: 20,
  },
  charCount: {
    color: theme.colors.contentTertiary,
    textAlign: 'right',
  },
  pinActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.small,
    marginTop: theme.spacing.small,
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
