import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter, useSegments } from 'expo-router';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { StyleSheet, UnistylesRuntime } from 'react-native-unistyles';
import { ButtonRound } from '@/craftrn-ui/components/ButtonRound/ButtonRound';
import { Text } from '@/craftrn-ui/components/Text';

type Props = {
  overlay?: boolean;
  title?: string;
};

const MapIcon = ({
  color = '#000',
  size = 18,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
  >
    <Path
      fill={color}
      d="M20.5 3.5l-5.5 2.2-5.6-2.4-6 2.6v13.1l6-2.6 5.6 2.4 5.5-2.2v-13.1zM9 18.9V6.1l4 1.7v12.8L9 18.9z"
    />
  </Svg>
);

export default function SharedHeader({ overlay = false, title }: Props) {
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

  const isIndex = current === 'index';

  return (
    <View style={[styles.header, overlay ? styles.headerOverlay : null]}>
      <View style={styles.side}>
        {!isIndex ? (
          <ButtonRound
            onPress={() => router.push('/')}
            variant="neutral"
            renderContent={({ iconSize, iconColor }) => (
              <MapIcon color={iconColor} size={iconSize} />
            )}
            accessibilityLabel="Go to map"
          />
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <View style={styles.titleWrapper}>
        <Text variant="heading3" style={styles.titleText}>
          {pageTitle}
        </Text>
      </View>

      <View style={styles.side}>
        <ButtonRound
          onPress={() => router.push('/search')}
          variant="neutral"
          renderContent={({ iconSize, iconColor }) => (
            <MaterialIcons name="search" color={iconColor} size={iconSize} />
          )}
          accessibilityLabel="Search"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  header: {
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.small,
    backgroundColor: theme.colors.backgroundScreen,
  },
  headerOverlay: {
    position: 'absolute',
    top: UnistylesRuntime.insets.top + theme.spacing.small,
    left: theme.spacing.large,
    right: theme.spacing.large,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  side: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    textAlign: 'center',
  },
}));
