import { createClient } from '@supabase/supabase-js';
import { createMMKV } from 'react-native-mmkv';

import { env } from '@/lib/env';

const supabaseUrl = env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase env. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
  );
}

const storage = createMMKV({
  id: 'around-me-supabase-auth',
});

const mmkvStorage = {
  getItem: async (key: string) => storage.getString(key) ?? null,
  setItem: async (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: async (key: string) => {
    storage.remove(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: mmkvStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
