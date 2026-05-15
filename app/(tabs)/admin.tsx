import { Stack, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import AuthGate from '@/components/AuthGate/AuthGate';
import { Button } from '@/craftrn-ui/components/Button';
import { Text } from '@/craftrn-ui/components/Text';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/lib/supabase';
import { logger } from '@/lib/logger';

type Submission = {
  id: string;
  creator_id: string;
  place_id: string;
  post_url?: string;
  note?: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  creators: {
    display_name: string;
    handle: string;
  };
  places: {
    name: string;
    category: string;
    neighbourhood: string;
  };
};

export default function AdminReviewScreen() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*, creators(display_name, handle), places(name, category, neighbourhood)')
        .eq('status', 'pending')
        .order('submitted_at', { ascending: true });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (err) {
      logger.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.is_admin) {
      fetchSubmissions();
    }
  }, [user, fetchSubmissions]);

  const handleReview = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // If approved, in a real app we might trigger a DB function to create a PIN
      // or do it here manually if RLS allows.
      
      setSubmissions(prev => prev.filter(s => s.id !== id));
      alert(`Submission ${status}!`);
    } catch (err) {
      logger.error(`Error updating submission status:`, err);
      alert('Failed to update status.');
    }
  };

  const renderSubmission = ({ item }: { item: Submission }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text variant="body1" style={styles.placeName}>{item.places?.name}</Text>
        <Text variant="body3" style={styles.category}>{item.places?.category}</Text>
      </View>
      
      <Text variant="body2" style={styles.creatorInfo}>
        By {item.creators?.display_name} (@{item.creators?.handle})
      </Text>

      {item.note && (
        <Text variant="body2" style={styles.note}>"{item.note}"</Text>
      )}

      {item.post_url && (
        <Text variant="body3" style={styles.url}>{item.post_url}</Text>
      )}

      <View style={styles.actions}>
        <Button 
          variant="primary" 
          size="small" 
          onPress={() => handleReview(item.id, 'approved')}
          style={{ flex: 1 }}
        >
          Approve
        </Button>
        <Button 
          variant="negative" 
          size="small" 
          onPress={() => handleReview(item.id, 'rejected')}
          style={{ flex: 1 }}
        >
          Reject
        </Button>
      </View>
    </View>
  );

  if (!user?.is_admin) {
    return (
      <View style={styles.centered}>
        <Text variant="heading3">Access Denied</Text>
        <Text variant="body2">Only administrators can access this screen.</Text>
      </View>
    );
  }

  return (
    <AuthGate>
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Review Submissions', headerShown: true }} />
        <FlatList
          data={submissions}
          renderItem={renderSubmission}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={fetchSubmissions}
          ListHeaderComponent={
            <Text variant="heading3" style={styles.title}>
              Pending Submissions ({submissions.length})
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text variant="body2">No pending submissions to review.</Text>
            </View>
          }
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
  },
  title: {
    marginBottom: theme.spacing.large,
  },
  card: {
    backgroundColor: theme.colors.backgroundNeutral,
    borderRadius: theme.borderRadius.medium,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xsmall,
  },
  placeName: {
    fontWeight: '700',
    flex: 1,
  },
  category: {
    color: theme.colors.contentSecondary,
    textTransform: 'uppercase',
  },
  creatorInfo: {
    color: theme.colors.contentSecondary,
    marginBottom: theme.spacing.small,
  },
  note: {
    fontStyle: 'italic',
    marginBottom: theme.spacing.small,
  },
  url: {
    color: theme.colors.interactivePrimary,
    marginBottom: theme.spacing.medium,
    textDecorationLine: 'underline',
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.small,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xlarge,
  },
  empty: {
    alignItems: 'center',
    marginTop: theme.spacing.xxlarge,
  },
}));
