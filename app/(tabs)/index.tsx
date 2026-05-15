import MapboxGL from '@rnmapbox/maps';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Pressable, Text as RNText, View } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import {
  CATEGORY_COLORS,
  DEFAULT_NEIGHBORHOOD_CENTER,
  MAPBOX_ACCESS_TOKEN,
} from '@/constants/map';
import { BottomSheet } from '@/craftrn-ui/components/BottomSheet';
import { Text } from '@/craftrn-ui/components/Text';
import { useAuth } from '@/hooks/use-auth';
import { IconSymbol } from '@/components/ui/icon-symbol';

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
  // Simple, non-geospatial demo mapping from lat/lng to pixels for demo purposes.
  // This keeps the UI functional without a Mapbox token.
  const mapWidth = SCREEN_WIDTH;
  const mapHeight = SCREEN_HEIGHT;
  const DEMO_SCALE = 50000; // pixels per degree (heuristic for demo)

  console.log('DemoMap rendered with pins:', pins.length);
  return (
    <View style={[styles.map, { backgroundColor: '#F7F6F3' }]}>
      {pins.map((pin) => {
        const dx = (pin.longitude - center.longitude) * DEMO_SCALE;
        const dy = (pin.latitude - center.latitude) * DEMO_SCALE;
        const x = mapWidth / 2 + dx;
        const y = mapHeight / 2 - dy; // invert lat for screen Y
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
              <RNText style={styles.pinLetter}>{pin.category}</RNText>
            </View>

            <View
              style={[
                styles.pinAvatar,
                isSelected && { transform: [{ scale: 1.4 }] },
              ]}
            >
              <RNText style={styles.pinAvatarText}>
                {pin.creator.initials}
              </RNText>
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
  const { user } = useAuth();
  const cameraRef = useRef<any>(null);
  const mapRef = useRef<MapboxGL.MapView | null>(null);

  // Set Mapbox token at runtime only if present.
  useEffect(() => {
    if (HAS_MAPBOX && MapboxGL?.setAccessToken) {
      MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);
    }
  }, []);

  const [pins] = useState<Pin[]>(MOCK_PINS);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);

  const collapsedHeight = useMemo(() => SCREEN_HEIGHT * 0.36, []);
  const expandedHeight = useMemo(() => SCREEN_HEIGHT * 0.74, []);

  useEffect(() => {
    if (selectedPin) {
      setSheetVisible(true);
      setSheetExpanded(false);

      // If Mapbox is available, center camera on selected pin for better context.
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

    // Demo fallback: noop (could animate pins or show toast)
  }
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Map or demo fallback when Mapbox token is missing */}
      {HAS_MAPBOX ? (
        <MapboxGL.MapView
          ref={mapRef}
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

          {/* Pins */}
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
                        CATEGORY_COLORS[pin.category] ?? '#C04A2A',
                    },
                  ]}
                >
                  <RNText style={styles.pinLetter}>{pin.category}</RNText>
                </View>

                <View style={styles.pinAvatar}>
                  <RNText style={styles.pinAvatarText}>
                    {pin.creator.initials}
                  </RNText>
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

      {/* My-location floating button */}
      <Pressable
        style={[styles.myLocationButton, { backgroundColor: '#C04A2A' }]}
        onPress={centerOnUser}
      >
        <RNText style={{ color: '#fff', fontWeight: '600' }}>◎</RNText>
      </Pressable>

      {/* Add Pin FAB (Creators only) */}
      {user?.is_creator && (
        <Pressable
          style={styles.addPinButton}
          onPress={() => router.push('/creator/submit-pin')}
        >
          <IconSymbol name="plus" size={24} color="#fff" />
        </Pressable>
      )}

      {/* Bottom sheet for place details */}
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
        <View
          style={[
            styles.bottomSheetContent,
            { minHeight: sheetExpanded ? expandedHeight : collapsedHeight },
          ]}
        >
          {selectedPin ? (
            <View>
              <View style={styles.sheetHeader}>
                <View>
                  <Text variant="heading2" style={{ marginBottom: 2 }}>{selectedPin.name}</Text>
                  <Text variant="body3" color="contentSecondary">{selectedPin.address}</Text>
                </View>
                <View
                  style={[
                    styles.categoryPill,
                    { backgroundColor: CATEGORY_COLORS[selectedPin.category] },
                  ]}
                >
                  <RNText style={styles.categoryPillText}>
                    {selectedPin.category}
                  </RNText>
                </View>
              </View>

              <View style={styles.creatorRow}>
                <View style={styles.creatorAvatarSmall}>
                  <RNText style={styles.creatorAvatarText}>
                    {selectedPin.creator.initials}
                  </RNText>
                </View>
                <View style={{ marginLeft: 10 }}>
                  <Text variant="body2" style={{ fontWeight: '500' }}>
                    {selectedPin.creator.display_name}{' '}
                    {selectedPin.creator.verified && (
                      <RNText style={{ color: theme.colors.interactivePrimary }}>✓</RNText>
                    )}
                  </Text>
                </View>
              </View>

              <View style={{ marginTop: 16, marginBottom: 24 }}>
                <Text variant="creatorNote" color="contentPrimary">
                  "{selectedPin.blurb}"
                </Text>
              </View>

              {/* Action row */}
              <View style={styles.actionRow}>
                <Pressable style={[styles.actionButton, styles.actionButtonOutline]}>
                  <Text variant="body2" style={{ fontWeight: '500' }}>Save</Text>
                </Pressable>
                <Pressable style={[styles.actionButton, styles.actionButtonOutline]}>
                  <Text variant="body2" style={{ fontWeight: '500' }}>Share</Text>
                </Pressable>
                <Pressable style={[styles.actionButton, styles.actionButtonFilled]}>
                  <Text variant="body2" style={{ fontWeight: '500', color: '#fff' }}>Directions</Text>
                </Pressable>
              </View>

              {/* Nearby curated picks */}
              <View style={{ marginTop: 32 }}>
                <Text variant="heading3" style={{ marginBottom: 12 }}>
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
                        <Text variant="body3" style={{ marginTop: 8 }}>{p.name}</Text>
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

const styles = StyleSheet.create(() => ({
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
    color: '#fff',
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
    borderColor: '#F7F6F3',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#666',
  },
  pinAvatarText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  searchBox: {
    position: 'absolute',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    minWidth: 180,
    elevation: 3,
  },
  searchText: {
    fontSize: 14,
  },
  filterButton: {
    position: 'absolute',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  myLocationButton: {
    position: 'absolute',
    right: 16,
    bottom: 88,
    width: 44,
    height: 44,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPinButton: {
    position: 'absolute',
    right: 16,
    bottom: 148,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1D6E7A',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bottomSheetContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryPillText: {
    color: '#fff',
    fontWeight: '700',
  },
  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  creatorAvatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#666',
  },
  creatorAvatarText: {
    color: '#fff',
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonOutline: {
    borderWidth: 0.5,
    borderColor: '#DFC0B8',
  },
  actionButtonFilled: {
    backgroundColor: '#C04A2A',
  },
  nearbyList: {
    flexDirection: 'row',
    gap: 16,
  },
  nearbyItem: {
    width: 120,
  },
  nearbyThumb: {
    width: '100%',
    aspectRatio: 1.6,
    borderRadius: 4,
  },
}));
