import { env } from '@/lib/env';

export const MAPBOX_ACCESS_TOKEN = env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

export const DEFAULT_NEIGHBORHOOD_CENTER = {
  // Approximate center for Indiranagar, Bengaluru (lng, lat)
  longitude: 77.640594,
  latitude: 12.971891,
};

export const CATEGORY_COLORS: Record<string, string> = {
  C: '#C04A2A', // Café (Terracotta)
  D: '#BA7517', // Diner / Restaurant (Amber)
  S: '#1D6E7A', // Store (Teal)
  E: '#8B716A', // Experience (Warm Gray)
};
