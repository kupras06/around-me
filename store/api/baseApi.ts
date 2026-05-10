import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * Shared RTK Query API root.
 * Feature-specific endpoints should be added via `injectEndpoints`.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Auth', 'Creator', 'Pin', 'Place', 'SavedPlace', 'User'],
  endpoints: () => ({}),
});
