export const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN ?? '';

export const DEFAULT_NEIGHBORHOOD_CENTER = {
  // Approximate center for Indiranagar, Bengaluru (lng, lat)
  longitude: 77.640594,
  latitude: 12.971891,
};

export const CATEGORY_COLORS: Record<string, string> = {
  C: '#C04A2A', // Café (Terracotta)
  D: '#BA7517', // Diner / Restaurant (Amber)
  S: '#1D6E7A', // Store (Deep Teal)
  E: '#8E8E8E', // Experience (Gray)
};
