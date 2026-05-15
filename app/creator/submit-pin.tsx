import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, TextInput, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { Button } from '@/craftrn-ui/components/Button/Button';
import { Text } from '@/craftrn-ui/components/Text';
import { useAuth } from '@/hooks/use-auth';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';

const CATEGORIES = [
  { label: 'Café', value: 'cafe', color: '#C04A2A' },
  { label: 'Diner', value: 'diner', color: '#BA7517' },
  { label: 'Store', value: 'store', color: '#1D6E7A' },
  { label: 'Experience', value: 'experience', color: '#666666' },
];

export default function SubmitPin() {
  const router = useRouter();
  const { user } = useAuth();

  const [placeName, setPlaceName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubit = async () => {
    if (!placeName || !note) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // 1. Create or find Place (simplified for MVP)
      // In real app, we'd use Google Place ID to avoid duplicates
      const { data: placeData, error: placeError } = await supabase
        .from('places')
        .insert({
          name: placeName,
          category,
          neighbourhood: 'Indiranagar', // Default for MVP
          city: 'Bengaluru',
        })
        .select()
        .single();

      if (placeError) throw placeError;

      // 2. Create Pin or Submission
      const status = user?.tier === 'verified' ? 'approved' : 'pending';
      const table = status === 'approved' ? 'pins' : 'submissions';

      const { error: pinError } = await supabase.from(table).insert({
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
          <Text variant="body2" style={styles.label}>
            Place Name
          </Text>
          <TextInput
            style={styles.input}
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
                style={[
                  styles.categoryCard,
                  category === cat.value && {
                    borderColor: cat.color,
                    backgroundColor: cat.color + '10',
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
                      fontWeight: '700',
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
          <View style={styles.labelRow}>
            <Text variant="body2" style={styles.label}>
              Your Note
            </Text>
            <Text
              variant="body3"
              style={[styles.charCount, note.length > 160 && { color: 'red' }]}
            >
              {note.length}/160
            </Text>
          </View>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="What makes this place special? (160 chars max)"
            value={note}
            onChangeText={(text) => setNote(text.slice(0, 160))}
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.actions}>
          <Button
            onPress={handleSubit}
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
    gap: theme.spacing.xlarge,
  },
  inputGroup: {
    gap: theme.spacing.small,
  },
  label: {
    fontWeight: '600',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    color: theme.colors.contentSecondary,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.informativePrimary,
    borderRadius: theme.borderRadius.small,
    padding: theme.spacing.medium,
    fontSize: 16,
    color: theme.colors.contentPrimary,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  hint: {
    color: theme.colors.contentSecondary,
    fontStyle: 'italic',
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
    borderWidth: 1,
    borderColor: theme.colors.informativePrimary,
    borderRadius: theme.borderRadius.medium,
    minWidth: '47%',
    gap: theme.spacing.small,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoryText: {
    color: theme.colors.contentPrimary,
  },
  actions: {
    marginTop: theme.spacing.large,
  },
}));
