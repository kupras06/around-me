import MapboxGL from '@rnmapbox/maps';
import { BottomSheet } from '@/craftrn-ui/components/BottomSheet';
import { Text } from '@/craftrn-ui/components/Text';
import { Stack } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Pressable, Text as RNText, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useUnistyles } from 'react-native-unistyles';
import {
  CATEGORY_COLORS,
  DEFAULT_NEIGHBORHOOD_CENTER,
  MAPBOX_ACCESS_TOKEN,
} from '@/constants/map';

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type Pin = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  category: 'C' | 'D' | 'S' | 'E';
  address?: string;
  blurb?: string;
  creator: { id: string; display_name: string; initials: string; verified?: boolean };
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

export default function MapScreen() {
  const { theme } = useUnistyles();
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const mapRef = useRef<MapboxGL.MapView>(null);

  const [pins] = useState<Pin[]>(MOCK_PINS);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);

  const collapsedHeight = useMemo(() => SCREEN_HEIGHT * 0.36, []);
  const expandedHeight = useMemo(() => SCREEN_HEIGHT * 0.74, []);

  useEffect(() => {
    // If there's a selected pin, open the bottom sheet collapsed first
    if (selectedPin) {
      setSheetVisible(true);
      setSheetExpanded(false);
    }
  }, [selectedPin]);

  function centerOnUser() {
    // For the MVP, center on the neighborhood default (or user location if available)
    cameraRef.current?.setCamera({
      centerCoordinate: [DEFAULT_NEIGHBORHOOD_CENTER.longitude, DEFAULT_NEIGHBORHOOD_CENTER.latitude],
      zoomLevel: 15,
      animationDuration: 700,
    });
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.baseLight }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Map */}
      <MapboxGL.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={MapboxGL.StyleURL.Street}
        logoEnabled={false}
        compassEnabled={false}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          centerCoordinate={[DEFAULT_NEIGHBORHOOD_CENTER.longitude, DEFAULT_NEIGHBORHOOD_CENTER.latitude]}
          zoomLevel={15}
        />

        {/* Pins */}
        {pins.map(pin => (
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
                    backgroundColor: CATEGORY_COLORS[pin.category] ?? '#C04A2A',
                  },
                ]}
              >
                <RNText style={styles.pinLetter}>{pin.category}</RNText>
              </View>

              <View style={styles.pinAvatar}>
                <RNText style={styles.pinAvatarText}>{pin.creator.initials}</RNText>
              </View>
            </View>
          </MapboxGL.PointAnnotation>
        ))}
      </MapboxGL.MapView>

      {/* Top-left search field (minimal) */}
      <Pressable style={[styles.searchBox, { left: 12, top: 48 }]} onPress={() => { }}>
        <RNText style={[styles.searchText, { color: theme.colors.contentSecondary }]}>Search places & creators</RNText>
      </Pressable>

      {/* Top-right filters */}
      <Pressable style={[styles.filterButton, { right: 12, top: 48 }]} onPress={() => { }}>
        <RNText style={{ color: theme.colors.contentPrimary }}>Filters</RNText>
      </Pressable>

      {/* My-location floating button */}
      <Pressable
        style={[styles.myLocationButton, { backgroundColor: '#C04A2A' }]}
        onPress={centerOnUser}
      >
        <RNText style={{ color: '#fff', fontWeight: '600' }}>◎</RNText>
      </Pressable>

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
        <View style={[styles.bottomSheetContent, { minHeight: sheetExpanded ? expandedHeight : collapsedHeight }]}>
          {selectedPin ? (
            <View>
              <View style={styles.sheetHeader}>
                <Text variant="heading3">{selectedPin.name}</Text>
                <View style={[styles.categoryPill, { backgroundColor: CATEGORY_COLORS[selectedPin.category] }]}>
                  <RNText style={styles.categoryPillText}>{selectedPin.category}</RNText>
                </View>
              </View>

              <View style={styles.creatorRow}>
                <View style={styles.creatorAvatarSmall}>
                  <RNText style={styles.creatorAvatarText}>{selectedPin.creator.initials}</RNText>
                </View>
                <View style={{ marginLeft: 8 }}>
                  <RNText style={{ fontWeight: '600' }}>{selectedPin.creator.display_name} {selectedPin.creator.verified ? '✓' : ''}</RNText>
                  <RNText style={{ color: theme.colors.contentSecondary }}>{selectedPin.address}</RNText>
                </View>
              </View>

              <RNText style={{ marginTop: 12, color: theme.colors.contentPrimary }}>{selectedPin.blurb}</RNText>

              {/* Action row (flat icons + text) */}
              <View style={styles.actionRow}>
                <Pressable style={styles.actionItem}><RNText>Save</RNText></Pressable>
                <Pressable style={styles.actionItem}><RNText>Directions</RNText></Pressable>
                <Pressable style={styles.actionItem}><RNText>Call</RNText></Pressable>
                <Pressable style={styles.actionItem}><RNText>Share</RNText></Pressable>
                <Pressable style={styles.actionItem}><RNText>Open</RNText></Pressable>
              </View>

              {/* Nearby curated picks (by same creator) */}
              <RNText style={{ marginTop: 12, fontWeight: '600' }}>More from {selectedPin.creator.display_name}</RNText>
              <View style={styles.nearbyList}>
                {pins
                  .filter(p => p.creator.id === selectedPin.creator.id && p.id !== selectedPin.id)
                  .map(p => (
                    <Pressable key={p.id} onPress={() => setSelectedPin(p)} style={styles.nearbyItem}>
                      <View style={[styles.nearbyThumb, { backgroundColor: CATEGORY_COLORS[p.category] }]} />
                      <RNText style={{ marginTop: 6 }}>{p.name}</RNText>
                    </Pressable>
                  ))}
              </View>

              {/* Expand / Collapse toggle */}
              <Pressable
                onPress={() => setSheetExpanded(v => !v)}
                style={{ marginTop: 12, alignSelf: 'center' }}
              >
                <RNText style={{ color: theme.colors.contentAccent }}>{sheetExpanded ? 'Collapse' : 'More details'}</RNText>
              </Pressable>
            </View>
          ) : (
            <RNText>No place selected</RNText>
          )}
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create(theme => ({
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
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  nearbyList: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  nearbyItem: {
    alignItems: 'center',
    marginRight: 12,
  },
  nearbyThumb: {
    width: 80,
    height: 56,
    borderRadius: 8,
  },
}));
