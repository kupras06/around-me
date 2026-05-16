import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '@/craftrn-ui/components/Button/Button';
import { InputText } from '@/craftrn-ui/components/InputText/InputText';
import { Text } from '@/craftrn-ui/components/Text';
import { useAuth } from '@/hooks/use-auth';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';

export default function TagPost() {
  const router = useRouter();
  const { user } = useAuth();

  const [url, setUrl] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!url || !placeId) {
      alert('Please enter a post URL and place ID');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('submissions').insert({
        creator_id: user?.id,
        post_url: url,
        place_id: placeId,
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

        <InputText
          label="Post URL"
          placeholder="https://instagram.com/p/..."
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <InputText
          label="Place ID"
          placeholder="Enter Place ID..."
          value={placeId}
          onChangeText={setPlaceId}
          autoCapitalize="none"
          autoCorrect={false}
        />

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
  actions: {
    marginTop: theme.spacing.large,
  },
}));
