import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

import { Button } from '@/craftrn-ui/components/Button/Button';
import { InputText } from '@/craftrn-ui/components/InputText/InputText';
import { Text } from '@/craftrn-ui/components/Text';
import { useCurrentUser } from '@/hooks/use-auth';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';

const CATEGORIES = [
  { label: 'Café', value: 'cafe', color: '#C04A2A' },
  { label: 'Diner', value: 'diner', color: '#BA7517' },
  { label: 'Store', value: 'store', color: '#1D6E7A' },
  { label: 'Experience', value: 'experience', color: '#8B716A' },
];

export default function SubmitPin() {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { theme } = useUnistyles();

  const [placeName, setPlaceName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!placeName || !note) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // 1. Create or find Place (simplified for MVP)
      const { data: placeData, error: placeError } = await supabase
        .from('places')
        .insert({
          name: placeName,
          category,
          neighbourhood: 'Indiranagar',
          city: 'Bengaluru',
        })
        .select()
        .single();

      if (placeError) throw placeError;

      // 2. Create Pin or Submission
      const status = user?.tier === 'verified' ? 'approved' : 'pending';
      const table = status === 'approved' ? 'pins' : 'submissions';

      const { error: pinError } = await supabase.from(table).insert({
        user_id: user?.id,
        place_id: placeData.id,
        note,
        status,
      });

      if (pinError) throw pinError;

      alert(
        status === 'approved' ? 'Pin published!' : 'Submission sent for review!'
      );
      router.back();
    } catch (err) {
      logger.error('Error submitting pin:', err);
      alert('Failed to submit pin. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Add New Pin', headerShown: true }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.inputGroup}>
          <InputText
            label="Place Name"
            placeholder="Search for a place..."
            value={placeName}
            onChangeText={setPlaceName}
          />
          <Text variant="body3" style={styles.hint}>
            Google Places search would go here in production.
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text variant="body2" style={styles.label}>
            Category
          </Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                activeOpacity={0.7}
                style={[
                  styles.categoryCard,
                  category === cat.value && {
                    borderColor: cat.color,
                    backgroundColor: `${cat.color}08`,
                  },
                ]}
                onPress={() => setCategory(cat.value)}
              >
                <View
                  style={[styles.colorDot, { backgroundColor: cat.color }]}
                />
                <Text
                  variant="body2"
                  style={[
                    styles.categoryText,
                    category === cat.value && {
                      color: cat.color,
                      fontWeight: '500',
                    },
                  ]}
                >
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <InputText
            label="Your Note"
            placeholder="What makes this place special? (160 chars max)"
            value={note}
            onChangeText={(text) => setNote(text.slice(0, 160))}
            multiline
            numberOfLines={4}
            style={[styles.textArea, { fontStyle: 'italic' }]}
          />
          <Text
            variant="body3"
            style={[
              styles.charCount,
              note.length > 160 && { color: theme.colors.sentimentNegative },
            ]}
          >
            {note.length}/160
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            onPress={handleSubmit}
            size="large"
            loading={loading}
            disabled={!placeName || !note || note.length > 160}
          >
            Submit Pin
          </Button>
        </View>
      </ScrollView>
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
    gap: 32,
  },
  inputGroup: {
    gap: theme.spacing.small,
  },
  label: {
    fontWeight: '500',
    color: theme.colors.contentSecondary,
  },
  charCount: {
    color: theme.colors.contentTertiary,
    textAlign: 'right',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    lineHeight: 24,
  },
  hint: {
    color: theme.colors.contentTertiary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.small,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.medium,
    borderWidth: 0.5,
    borderColor: theme.colors.contentPrimary,
    borderRadius: theme.borderRadius.medium,
    minWidth: '47%',
    gap: theme.spacing.small,
    backgroundColor: theme.colors.backgroundScreen,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryText: {
    color: theme.colors.contentPrimary,
  },
  actions: {
    marginTop: 16,
  },
}));
