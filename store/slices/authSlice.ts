import { supabase } from '@/lib/supabase';
import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';

import type { AppDispatch, RootState } from '@/store';
import { logger } from '@/lib/logger';

type LinkedAccounts = {
  twitter?: boolean;
  instagram?: boolean;
};

type UserMetadata = {
  displayName?: string;
  phone?: string;
  phoneLinked?: boolean;
  linkedAccounts?: LinkedAccounts;
  onboardingCompleted?: boolean;
  avatarUrl?: string; // New field
};

export type User = {
  id: string;
  displayName: string;
  email?: string;
  phone?: string;
  phoneLinked?: boolean;
  linkedAccounts?: LinkedAccounts;
  onboardingCompleted?: boolean;
  avatarUrl?: string; // New field
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

const mapSupabaseUser = (user: SupabaseUser | null): User | null => {
  if (!user) {
    return null;
  }

  const metadata = (user.user_metadata ?? {}) as UserMetadata;

  return {
    id: user.id,
    displayName: metadata.displayName ?? user.email?.split('@')[0] ?? 'User',
    email: user.email,
    phone: metadata.phone,
    phoneLinked: metadata.phoneLinked ?? false,
    linkedAccounts: metadata.linkedAccounts ?? {},
    onboardingCompleted: metadata.onboardingCompleted ?? false,
    avatarUrl: user.user_metadata.avatar_url as string | undefined, // Map Supabase's avatar_url to our type
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
  },
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
    logger.info("Creating User", { displayName, email, password })
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
          displayName: cleanDisplayName,
          phoneLinked: false,
          linkedAccounts: {},
          onboardingCompleted: false,
        } satisfies UserMetadata,
      },
    });

    if (error) {
      console.log('Register Error', error)
      throw error;
    }

    if (!data.session) {
      throw new Error(
        'Supabase email confirmation is enabled. Disable email confirmation or add a confirm-email flow before using onboarding.',
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
  },
);

export const resetPassword = createAsyncThunk('auth/resetPassword', async (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error('Enter the email for your account.');
  }

  const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
    redirectTo: Linking.createURL('/reset-password'),
  });

  if (error) {
    throw error;
  }
});

export const updatePassword = createAsyncThunk('auth/updatePassword', async (password: string) => {
  if (!password) {
    throw new Error('Enter a new password.');
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    throw error;
  }
});

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
    phoneLinked: trimmedPhone.length > 0,
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
    linkedAccounts: {
      ...(metadata.linkedAccounts ?? {}),
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
    onboardingCompleted: true,
  });
});

export const updateProfile = createAsyncThunk<
  { user: User | null },
  { displayName?: string; phone?: string; avatarUrl?: string },
  { state: RootState }
>('auth/updateProfile', async (payload, { getState }) => {
  const sessionUser = requireSessionUser(getState());
  const currentMetadata = getCurrentMetadata(sessionUser);

  const newMetadata: UserMetadata = { ...currentMetadata };
  let metadataChanged = false;

  if (payload.displayName !== undefined) {
    newMetadata.displayName = payload.displayName.trim();
    metadataChanged = true;
  }

  if (payload.phone !== undefined) {
    newMetadata.phone = payload.phone.trim();
    newMetadata.phoneLinked = payload.phone.trim().length > 0;
    metadataChanged = true;
  }

  if (payload.avatarUrl !== undefined) {
    newMetadata.avatarUrl = payload.avatarUrl;
    metadataChanged = true;
  }

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


export const uploadAvatar = createAsyncThunk<
  { avatarUrl: string },
  { file: { uri: string; name: string; type: string }; bucket: string; path: string },
  { state: RootState; dispatch: AppDispatch } // Add dispatch to thunkAPI
>('auth/uploadAvatar', async ({ file, bucket, path }, { dispatch }) => { // Destructure dispatch
  const fileExtension = file.name.split('.').pop();
  const fileName = `${path}.${fileExtension}`;

  const response = await fetch(file.uri);
  const blob = await response.blob();

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, blob, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    throw uploadError;
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error('Failed to get public URL for avatar.');
  }

  // Dispatch updateProfile to update the user\'s metadata with the new avatar URL
  await dispatch(updateProfile({ avatarUrl: publicUrlData.publicUrl }));

  return { avatarUrl: publicUrlData.publicUrl };
});


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (
      state,
      action: PayloadAction<{ session: Session | null; user: User | null }>,
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
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        if (state.user) {
          state.user.avatarUrl = action.payload.avatarUrl;
        }
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
            uploadAvatar.pending.type,
          ].includes(action.type),
        (state) => {
          state.loading = true;
        },
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
            uploadAvatar.rejected.type,
          ].includes(action.type),
        (state) => {
          state.loading = false;
          state.initialized = true;
        },
      );
  },
});

export const { setAuthState, setRecoveringPassword } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;
export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.user;

export default authSlice.reducer;
