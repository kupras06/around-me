import { useRouter, useSegments } from 'expo-router';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Text } from '@/craftrn-ui/components/Text';
import { IconSymbol } from '../ui/icon-symbol';

type Props = {
  overlay?: boolean;
  title?: string;
};

export default function SharedHeader({ title }: Props) {
  const router = useRouter();
  const segments = useSegments();
  const known = ['index', 'saved', 'creators', 'profile'];
  const current =
    title ||
    (segments
      .slice()
      .reverse()
      .find((s) => known.includes(s)) as string) ||
    'index';

  const pageTitle =
    current === 'index'
      ? 'Map'
      : current.charAt(0).toUpperCase() + current.slice(1);

  return (
    <View style={[styles.header]}>
      <View style={styles.titleWrapper}>
        <Text variant="heading3" style={styles.titleText}>
          {pageTitle}
        </Text>
      </View>

      <Pressable style={styles.side} onPress={() => router.push('/search')}>
        <IconSymbol name="magnifyingglass" size={24} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create((theme, rt) => ({
  header: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    minHeight: 56,
    height: 60 + rt.insets.top,
    paddingTop: rt.insets.top,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.medium,
    backgroundColor: theme.colors.backgroundScreenSecondary,
  },
  side: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    textAlign: 'center',
  },
}));
