import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '@/craftrn-ui/components/Button/Button';
import { Text } from '@/craftrn-ui/components/Text';
import { useAuth } from '@/hooks/use-auth';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';

export default function TagPost() {
  const router = useRouter();
  const { user } = useAuth();

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!url) {
      alert('Please enter a post URL');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('submissions').insert({
        creator_id: user?.id,
        post_url: url,
        platform:
          url.includes('twitter.com') || url.includes('x.com')
            ? 'twitter'
            : 'instagram',
        status: 'pending',
      });

      if (error) throw error;

      alert('Post submitted for tagging! We will process it shortly.');
      router.back();
    } catch (err) {
      logger.error('Error submitting post link:', err);
      alert('Failed to submit link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Tag a Post', headerShown: true }} />
      <View style={styles.content}>
        <Text variant="heading3">Submit a post link</Text>
        <Text variant="body2" style={styles.subtitle}>
          Tag @aroundme_blr on Twitter or Instagram, then paste the link here.
          Verified creators&apos; posts are automatically mapped.
        </Text>

        <View style={styles.inputGroup}>
          <Text variant="body2" style={styles.label}>
            Post URL
          </Text>
          <TextInput
            style={styles.input}
            placeholder="https://instagram.com/p/..."
            value={url}
            onChangeText={setUrl}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.actions}>
          <Button
            onPress={handleSubmit}
            size="large"
            loading={loading}
            disabled={!url}
          >
            Submit Link
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundScreen,
  },
  content: {
    padding: theme.spacing.large,
    gap: theme.spacing.xlarge,
  },
  subtitle: {
    color: theme.colors.contentSecondary,
    lineHeight: 22,
  },
  inputGroup: {
    gap: theme.spacing.small,
  },
  label: {
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.contentPrimary,
    borderRadius: theme.borderRadius.small,
    padding: theme.spacing.medium,
    fontSize: 16,
  },
  actions: {
    marginTop: theme.spacing.large,
  },
}));
