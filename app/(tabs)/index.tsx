import MapboxGL from '@rnmapbox/maps';
import { Stack, useRouter } from 'expo-router';
import { type ElementRef, useEffect, useRef, useState } from 'react';
import { Dimensions, Pressable, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { IconSymbol } from '@/components/ui/icon-symbol';
import {
  CATEGORY_COLORS,
  DEFAULT_NEIGHBORHOOD_CENTER,
  MAPBOX_ACCESS_TOKEN,
} from '@/constants/map';
import { BottomSheet } from '@/craftrn-ui/components/BottomSheet';
import { Text } from '@/craftrn-ui/components/Text';
import { useCurrentUser } from '@/hooks/use-auth';

// If no token is provided, we render a lightweight demo map instead of Mapbox.
const HAS_MAPBOX = Boolean(
  MAPBOX_ACCESS_TOKEN && MAPBOX_ACCESS_TOKEN.length > 0
);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type Pin = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: 'C' | 'D' | 'S' | 'E';
  address?: string;
  blurb?: string;
  creator: {
    id: string;
    display_name: string;
    initials: string;
    verified?: boolean;
  };
};

const MOCK_PINS: Pin[] = [
  {
    id: 'p1',
    name: 'Third Wave Coffee',
    latitude: DEFAULT_NEIGHBORHOOD_CENTER.latitude + 0.0012,
    longitude: DEFAULT_NEIGHBORHOOD_CENTER.longitude + 0.0012,
    category: 'C',
    address: '12th Main, Indiranagar',
    blurb: 'Roastery focused on single-origin espresso.',
    creator: { id: 'c1', display_name: 'Arjun', initials: 'A', verified: true },
  },
  {
    id: 'p2',
    name: 'Sunny Diner',
    latitude: DEFAULT_NEIGHBORHOOD_CENTER.latitude - 0.0005,
    longitude: DEFAULT_NEIGHBORHOOD_CENTER.longitude + 0.0025,
    category: 'D',
    address: '100 Feet Road, Indiranagar',
    blurb: 'All-day diner with a great lemon tart.',
    creator: { id: 'c2', display_name: 'Rhea', initials: 'R', verified: false },
  },
  {
    id: 'p3',
    name: 'Little Green Store',
    latitude: DEFAULT_NEIGHBORHOOD_CENTER.latitude - 0.0012,
    longitude: DEFAULT_NEIGHBORHOOD_CENTER.longitude - 0.0005,
    category: 'S',
    address: 'Cross St, Indiranagar',
    blurb: 'Thoughtful home goods and ceramics.',
    creator: { id: 'c1', display_name: 'Arjun', initials: 'A', verified: true },
  },
];

function DemoMap({
  pins,
  center,
  onPinPress,
  selectedPinId,
}: {
  pins: Pin[];
  center: { latitude: number; longitude: number };
  onPinPress: (p: Pin) => void;
  selectedPinId?: string | null;
}) {
  const { theme } = useUnistyles();
  const mapWidth = SCREEN_WIDTH;
  const mapHeight = SCREEN_HEIGHT;
  const DEMO_SCALE = 50000;

  return (
    <View
      style={[styles.map, { backgroundColor: theme.colors.backgroundScreen }]}
    >
      {pins.map((pin) => {
        const dx = (pin.longitude - center.longitude) * DEMO_SCALE;
        const dy = (pin.latitude - center.latitude) * DEMO_SCALE;
        const x = mapWidth / 2 + dx;
        const y = mapHeight / 2 - dy;
        const isSelected = selectedPinId === pin.id;

        return (
          <Pressable
            key={pin.id}
            onPress={() => onPinPress(pin)}
            style={{ position: 'absolute', left: x - 26, top: y - 26 }}
          >
            <View
              style={[
                styles.pinCircle,
                { backgroundColor: CATEGORY_COLORS[pin.category] },
              ]}
            >
              <Text style={styles.pinLetter}>{pin.category}</Text>
            </View>

            <View
              style={[
                styles.pinAvatar,
                isSelected && { transform: [{ scale: 1.4 }] },
              ]}
            >
              <Text style={styles.pinAvatarText}>{pin.creator.initials}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function MapScreen() {
  const { theme } = useUnistyles();
  const router = useRouter();
  const { user } = useCurrentUser();
  const cameraRef = useRef<ElementRef<typeof MapboxGL.Camera> | null>(null);

  useEffect(() => {
    if (HAS_MAPBOX && MapboxGL?.setAccessToken) {
      MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);
    }
  }, []);

  const [pins] = useState<Pin[]>(MOCK_PINS);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  useEffect(() => {
    if (selectedPin) {
      setSheetVisible(true);
      if (
        HAS_MAPBOX &&
        cameraRef.current &&
        typeof cameraRef.current.setCamera === 'function'
      ) {
        cameraRef.current.setCamera({
          centerCoordinate: [selectedPin.longitude, selectedPin.latitude],
          zoomLevel: 16,
          animationDuration: 400,
        });
      }
    }
  }, [selectedPin]);

  function centerOnUser() {
    if (
      HAS_MAPBOX &&
      cameraRef.current &&
      typeof cameraRef.current.setCamera === 'function'
    ) {
      cameraRef.current.setCamera({
        centerCoordinate: [
          DEFAULT_NEIGHBORHOOD_CENTER.longitude,
          DEFAULT_NEIGHBORHOOD_CENTER.latitude,
        ],
        zoomLevel: 15,
        animationDuration: 700,
      });
      return;
    }
  }
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {HAS_MAPBOX ? (
        <MapboxGL.MapView
          style={styles.map}
          styleURL={MapboxGL.StyleURL.Street}
          logoEnabled={false}
          compassEnabled={false}
        >
          <MapboxGL.Camera
            ref={cameraRef}
            centerCoordinate={[
              DEFAULT_NEIGHBORHOOD_CENTER.longitude,
              DEFAULT_NEIGHBORHOOD_CENTER.latitude,
            ]}
            zoomLevel={15}
          />

          {pins.map((pin) => (
            <MapboxGL.PointAnnotation
              key={pin.id}
              id={pin.id}
              coordinate={[pin.longitude, pin.latitude]}
              onSelected={() => setSelectedPin(pin)}
            >
              <View style={styles.markerWrapper}>
                <View
                  style={[
                    styles.pinCircle,
                    {
                      backgroundColor:
                        CATEGORY_COLORS[pin.category] ??
                        theme.colors.interactivePrimary,
                    },
                  ]}
                >
                  <Text style={styles.pinLetter}>{pin.category}</Text>
                </View>

                <View style={styles.pinAvatar}>
                  <Text style={styles.pinAvatarText}>
                    {pin.creator.initials}
                  </Text>
                </View>
              </View>
            </MapboxGL.PointAnnotation>
          ))}
        </MapboxGL.MapView>
      ) : (
        <DemoMap
          pins={pins}
          center={DEFAULT_NEIGHBORHOOD_CENTER}
          onPinPress={(p) => setSelectedPin(p)}
          selectedPinId={selectedPin?.id ?? null}
        />
      )}

      <Pressable
        style={[
          styles.myLocationButton,
          { backgroundColor: theme.colors.interactivePrimary },
        ]}
        onPress={centerOnUser}
      >
        <Text style={{ color: theme.colors.interactivePrimaryContent }}>◎</Text>
      </Pressable>

      {user?.is_creator && (
        <Pressable
          style={[
            styles.addPinButton,
            { backgroundColor: theme.colors.interactiveSecondary },
          ]}
          onPress={() => router.push('/creator/submit-pin')}
        >
          <IconSymbol
            name="plus"
            size={24}
            color={theme.colors.interactiveSecondaryContent}
          />
        </Pressable>
      )}

      <BottomSheet
        visible={sheetVisible}
        onRequestClose={() => {
          setSheetVisible(false);
          setSelectedPin(null);
        }}
        enableSwipeToClose
        enableOverlayTapToClose
        showHandleBar
      >
        <View style={styles.bottomSheetContent}>
          {selectedPin ? (
            <View>
              <View style={styles.sheetHeader}>
                <View style={{ flex: 1 }}>
                  <Text variant="heading2" style={{ marginBottom: 2 }}>
                    {selectedPin.name}
                  </Text>
                  <Text variant="body3" color="contentSecondary">
                    {selectedPin.address}
                  </Text>
                </View>
                <View
                  style={[
                    styles.categoryPill,
                    { backgroundColor: CATEGORY_COLORS[selectedPin.category] },
                  ]}
                >
                  <Text style={styles.categoryPillText}>
                    {selectedPin.category}
                  </Text>
                </View>
              </View>

              <View style={styles.creatorRow}>
                <View style={styles.creatorAvatarSmall}>
                  <Text style={styles.creatorAvatarText}>
                    {selectedPin.creator.initials}
                  </Text>
                </View>
                <View style={{ marginLeft: theme.spacing.small }}>
                  <Text variant="body2" style={{ fontWeight: '500' }}>
                    {selectedPin.creator.display_name}{' '}
                    {selectedPin.creator.verified && (
                      <Text style={{ color: theme.colors.interactivePrimary }}>
                        ✓
                      </Text>
                    )}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  marginTop: theme.spacing.medium,
                  marginBottom: theme.spacing.large,
                }}
              >
                <Text
                  variant="body1"
                  color="contentPrimary"
                  style={{ fontStyle: 'italic' }}
                >
                  "{selectedPin.blurb}"
                </Text>
              </View>

              <View style={styles.actionRow}>
                <Pressable
                  style={[styles.actionButton, styles.actionButtonOutline]}
                >
                  <Text variant="body2" style={{ fontWeight: '500' }}>
                    Save
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, styles.actionButtonOutline]}
                >
                  <Text variant="body2" style={{ fontWeight: '500' }}>
                    Share
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.actionButton,
                    styles.actionButtonFilled,
                    { backgroundColor: theme.colors.interactivePrimary },
                  ]}
                >
                  <Text
                    variant="body2"
                    style={{
                      fontWeight: '500',
                      color: theme.colors.interactivePrimaryContent,
                    }}
                  >
                    Directions
                  </Text>
                </Pressable>
              </View>

              <View style={{ marginTop: theme.spacing.xxlarge }}>
                <Text
                  variant="heading3"
                  style={{ marginBottom: theme.spacing.medium }}
                >
                  More from {selectedPin.creator.display_name}
                </Text>
                <View style={styles.nearbyList}>
                  {pins
                    .filter(
                      (p) =>
                        p.creator.id === selectedPin.creator.id &&
                        p.id !== selectedPin.id
                    )
                    .map((p) => (
                      <Pressable
                        key={p.id}
                        onPress={() => setSelectedPin(p)}
                        style={styles.nearbyItem}
                      >
                        <View
                          style={[
                            styles.nearbyThumb,
                            { backgroundColor: CATEGORY_COLORS[p.category] },
                          ]}
                        />
                        <Text
                          variant="body3"
                          style={{ marginTop: theme.spacing.xsmall }}
                        >
                          {p.name}
                        </Text>
                      </Pressable>
                    ))}
                </View>
              </View>
            </View>
          ) : (
            <Text variant="body1">No place selected</Text>
          )}
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinCircle: {
    width: 32,
    height: 32,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinLetter: {
    color: theme.colors.interactivePrimaryContent,
    fontWeight: '700',
    fontSize: 14,
  },
  pinAvatar: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    width: 18,
    height: 18,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: theme.colors.borderNeutralSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundScreen,
  },
  pinAvatarText: {
    color: theme.colors.contentPrimary,
    fontSize: 10,
    fontWeight: '700',
  },
  myLocationButton: {
    position: 'absolute',
    right: theme.spacing.large,
    bottom: theme.spacing.xxlarge * 2,
    width: 44,
    height: 44,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPinButton: {
    position: 'absolute',
    right: theme.spacing.large,
    bottom: theme.spacing.xxlarge * 3.5,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheetContent: {
    paddingHorizontal: theme.spacing.large,
    paddingVertical: theme.spacing.medium,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryPill: {
    paddingHorizontal: theme.spacing.small,
    paddingVertical: theme.spacing.xsmall,
    borderRadius: theme.borderRadius.full,
  },
  categoryPillText: {
    color: theme.colors.interactivePrimaryContent,
    fontWeight: '700',
    fontSize: 12,
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.small,
  },
  creatorAvatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.backgroundElevated,
  },
  creatorAvatarText: {
    color: theme.colors.contentPrimary,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing.small,
    marginTop: theme.spacing.small,
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonOutline: {
    borderWidth: 0.5,
    borderColor: theme.colors.borderNeutralSecondary,
  },
  actionButtonFilled: {
    backgroundColor: theme.colors.interactivePrimary,
  },
  nearbyList: {
    flexDirection: 'row',
    gap: theme.spacing.medium,
  },
  nearbyItem: {
    width: 120,
  },
  nearbyThumb: {
    width: '100%',
    aspectRatio: 1.6,
    borderRadius: theme.borderRadius.small,
  },
}));
