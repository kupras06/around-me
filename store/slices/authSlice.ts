import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { logger } from '@/lib/logger';
import { supabase } from '@/lib/supabase';
import type { RootState } from '@/store';

type LinkedAccounts = {
  twitter?: boolean;
  instagram?: boolean;
};

export type UserMetadata = {
  display_name?: string;
  phone?: string;
  phone_linked?: boolean;
  linked_accounts?: LinkedAccounts;
  onboarding_completed?: boolean;
  avatar_url?: string; // New field
};

export type User = {
  id: string;
  display_name: string;
  email?: string;
  phone?: string;
  phone_linked?: boolean;
  linked_accounts?: LinkedAccounts;
  onboarding_completed?: boolean;
  avatar_url?: string; // New field
};

type AuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  initialized: boolean;
  isRecoveringPassword: boolean;
};

type RegisterPayload = {
  displayName: string;
  email?: string;
  password?: string;
};

const initialState: AuthState = {
  session: null,
  user: null,
  loading: true,
  initialized: false,
  isRecoveringPassword: false,
};

export const mapSupabaseUser = (user: SupabaseUser | null): User | null => {
  if (!user) {
    return null;
  }

  const metadata = (user.user_metadata ?? {}) as UserMetadata;

  return {
    id: user.id,
    display_name: metadata.display_name ?? user.email?.split('@')[0] ?? 'User',
    email: user.email,
    phone: metadata.phone,
    phone_linked: metadata.phone_linked ?? false,
    linked_accounts: metadata.linked_accounts ?? {},
    onboarding_completed: metadata.onboarding_completed ?? false,
    avatar_url: metadata.avatar_url as string | undefined, // Map Supabase's avatar_url to our type
  };
};

const getCurrentMetadata = (sessionUser: SupabaseUser | null): UserMetadata => {
  return ((sessionUser?.user_metadata ?? {}) as UserMetadata) ?? {};
};

const requireSessionUser = (state: RootState) => {
  const sessionUser = state.auth.session?.user;

  if (!sessionUser) {
    throw new Error('You must be signed in to continue.');
  }

  return sessionUser;
};

const updateMetadata = async (nextMetadata: UserMetadata) => {
  const { data, error } = await supabase.auth.updateUser({
    data: nextMetadata,
  });

  if (error) {
    throw error;
  }

  return {
    session: data.user ? null : null,
    user: mapSupabaseUser(data.user),
  };
};

export const bootstrapAuth = createAsyncThunk('auth/bootstrap', async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return {
    session,
    user: mapSupabaseUser(session?.user ?? null),
  };
});

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const normalizedEmail = email.trim().toLowerCase();

    logger.info(`Login attempt with email: ${normalizedEmail} `, password);
    if (!normalizedEmail || !password) {
      throw new Error('Enter your email and password.');
    }

    const {
      data: { session, user: signedInUser },
      error,
    } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      logger.error(`Login error: ${error.message}`, error);
      throw error;
    }

    const mappedUser = mapSupabaseUser(signedInUser);

    if (!mappedUser) {
      throw new Error('Sign in did not return a user.');
    }

    return {
      session,
      user: mappedUser,
    };
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
});

export const register = createAsyncThunk(
  'auth/register',
  async ({ displayName, email, password }: RegisterPayload) => {
    const cleanDisplayName = displayName.trim();
    const normalizedEmail = email?.trim().toLowerCase() ?? '';
    logger.info('Creating User', { displayName, email, password });
    if (!cleanDisplayName) {
      throw new Error('Enter a display name.');
    }

    if (!normalizedEmail || !password) {
      throw new Error('Email and password are required.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          display_name: cleanDisplayName,
          phone_linked: false,
          linked_accounts: {},
          onboarding_completed: false,
        } satisfies UserMetadata,
      },
    });

    if (error) {
      console.log('Register Error', error);
      throw error;
    }

    if (!data.session) {
      throw new Error(
        'Supabase email confirmation is enabled. Disable email confirmation or add a confirm-email flow before using onboarding.'
      );
    }

    const mappedUser = mapSupabaseUser(data.user);

    if (!mappedUser) {
      throw new Error('Registration did not return a user.');
    }

    return {
      session: data.session,
      user: mappedUser,
    };
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      throw new Error('Enter the email for your account.');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(
      normalizedEmail,
      {
        redirectTo: Linking.createURL('/reset-password'),
      }
    );

    if (error) {
      throw error;
    }
  }
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (password: string) => {
    if (!password) {
      throw new Error('Enter a new password.');
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw error;
    }
  }
);

export const linkPhoneNumber = createAsyncThunk<
  { user: User | null },
  string,
  { state: RootState }
>('auth/linkPhoneNumber', async (phone, { getState }) => {
  const sessionUser = requireSessionUser(getState());
  const metadata = getCurrentMetadata(sessionUser);
  const trimmedPhone = phone.trim();

  return await updateMetadata({
    ...metadata,
    phone: trimmedPhone,
    phone_linked: trimmedPhone.length > 0,
  });
});

export const linkAccounts = createAsyncThunk<
  { user: User | null },
  LinkedAccounts,
  { state: RootState }
>('auth/linkAccounts', async (payload, { getState }) => {
  const sessionUser = requireSessionUser(getState());
  const metadata = getCurrentMetadata(sessionUser);

  return await updateMetadata({
    ...metadata,
    linked_accounts: {
      ...(metadata.linked_accounts ?? {}),
      ...payload,
    },
  });
});

export const completeOnboarding = createAsyncThunk<
  { user: User | null },
  void,
  { state: RootState }
>('auth/completeOnboarding', async (_, { getState }) => {
  const sessionUser = requireSessionUser(getState());
  const metadata = getCurrentMetadata(sessionUser);

  return await updateMetadata({
    ...metadata,
    onboarding_completed: true,
  });
});

export const updateProfile = createAsyncThunk<
  { user: User | null },
  { display_name?: string; phone?: string; avatar_url?: string },
  { state: RootState }
>('auth/updateProfile', async (payload, { getState }) => {
  const sessionUser = requireSessionUser(getState());
  const currentMetadata = getCurrentMetadata(sessionUser);

  const newMetadata: UserMetadata = { ...currentMetadata };
  let metadataChanged = false;

  if (payload.display_name !== undefined) {
    newMetadata.display_name = payload.display_name.trim();
    metadataChanged = true;
  }

  if (payload.phone !== undefined) {
    newMetadata.phone = payload.phone.trim();
    newMetadata.phone_linked = payload.phone.trim().length > 0;
    metadataChanged = true;
  }

  if (payload.avatar_url !== undefined) {
    newMetadata.avatar_url = payload.avatar_url;
    metadataChanged = true;
  }

  logger.info('updateProfile', metadataChanged, newMetadata);
  if (!metadataChanged) {
    return { user: mapSupabaseUser(sessionUser) };
  }

  const { data, error } = await supabase.auth.updateUser({
    data: newMetadata, // Always update metadata
  });

  if (error) {
    throw error;
  }

  return {
    user: mapSupabaseUser(data.user),
  };
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (
      state,
      action: PayloadAction<{ session: Session | null; user: User | null }>
    ) => {
      state.session = action.payload.session;
      state.user = action.payload.user;
      state.loading = false;
      state.initialized = true;
    },
    setRecoveringPassword: (state, action: PayloadAction<boolean>) => {
      state.isRecoveringPassword = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.session = action.payload.session;
        state.user = action.payload.user;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.session = null;
        state.user = null;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.session = action.payload.session;
        state.user = action.payload.user;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.session = null;
        state.user = null;
        state.loading = false;
        state.initialized = true;
        state.isRecoveringPassword = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.session = action.payload.session;
        state.user = action.payload.user;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.initialized = true;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
        state.initialized = true;
        state.isRecoveringPassword = false;
      })
      .addCase(linkPhoneNumber.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(linkAccounts.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(completeOnboarding.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loading = false;
        state.initialized = true;
      })
      .addMatcher(
        (action) =>
          [
            login.pending.type,
            logout.pending.type,
            register.pending.type,
            resetPassword.pending.type,
            updatePassword.pending.type,
            linkPhoneNumber.pending.type,
            linkAccounts.pending.type,
            completeOnboarding.pending.type,
            updateProfile.pending.type,
          ].includes(action.type),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) =>
          [
            login.rejected.type,
            logout.rejected.type,
            register.rejected.type,
            resetPassword.rejected.type,
            updatePassword.rejected.type,
            linkPhoneNumber.rejected.type,
            linkAccounts.rejected.type,
            completeOnboarding.rejected.type,
            updateProfile.rejected.type,
          ].includes(action.type),
        (state) => {
          state.loading = false;
          state.initialized = true;
        }
      );
  },
});

export const { setAuthState, setRecoveringPassword } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.user;

export default authSlice.reducer;
