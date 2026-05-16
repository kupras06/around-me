import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import type { Session } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';
import type { RootState } from '@/store';
import {
  clearProfile,
  fetchProfile,
} from '@/store/features/profile/profile.slice';
import type { Profile } from '@/store/features/profile/profile.types';
import {
  getCurrentAuthUser,
  getCurrentSession,
  sendPasswordResetEmail,
  signInWithPassword,
  signOut,
  signUpWithPassword,
  updateAuthPassword,
} from './auth.service';
import type {
  AuthState,
  AuthUser,
  OAuthProvider,
  RegisterPayload,
} from './auth.types';
import { startOAuthFlow, unlinkOAuthProvider } from './oauth.service';

const initialState: AuthState = {
  session: null,
  authUser: null,
  initialized: false,
  loading: true,
};

export const bootstrapAuth = createAsyncThunk(
  'auth/bootstrap',
  async (_, { dispatch }) => {
    const session = await getCurrentSession();
    const authUser = await getCurrentAuthUser();

    if (authUser) {
      await dispatch(fetchProfile(authUser.id)).unwrap();
    }

    return { session, authUser };
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }, { dispatch }) => {
    const result = await signInWithPassword(payload);
    const profile = await dispatch(fetchProfile(result.authUser.id)).unwrap();
    return { ...result, profile };
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { dispatch }) => {
    const result = await signUpWithPassword(payload);
    const profile = await dispatch(fetchProfile(result.authUser.id)).unwrap();
    return { ...result, profile };
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    await signOut();
    dispatch(clearProfile());
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string) => sendPasswordResetEmail(email)
);

export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (password: string) => updateAuthPassword(password)
);

export const signInWithProvider = createAsyncThunk<
  { session: Session | null; authUser: AuthUser | null; profile?: Profile },
  OAuthProvider,
  { state: RootState }
>('auth/signInWithProvider', async (provider, { getState, dispatch }) => {
  const currentUserId = getState().auth.authUser?.id;
  const result = await startOAuthFlow(provider, currentUserId);

  logger.info('Result OAUTH', result);
  if (result.authUser) {
    const profile = await dispatch(fetchProfile(result.authUser.id)).unwrap();
    return { ...result, profile };
  }

  return result;
});

export const unlinkProvider = createAsyncThunk<
  { authUser: AuthUser | null },
  OAuthProvider
>('auth/unlinkProvider', async (provider) => {
  await unlinkOAuthProvider(provider);
  return { authUser: await getCurrentAuthUser() };
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (
      state,
      action: PayloadAction<{
        session: Session | null;
        authUser: AuthUser | null;
      }>
    ) => {
      state.session = action.payload.session;
      state.authUser = action.payload.authUser;
      state.loading = false;
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(bootstrapAuth.fulfilled, (state, action) => {
        state.session = action.payload.session;
        state.authUser = action.payload.authUser;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(bootstrapAuth.rejected, (state) => {
        state.session = null;
        state.authUser = null;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.session = action.payload.session;
        state.authUser = action.payload.authUser;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.session = action.payload.session;
        state.authUser = action.payload.authUser;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(signInWithProvider.fulfilled, (state, action) => {
        state.session = action.payload.session;
        state.authUser = action.payload.authUser;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(unlinkProvider.fulfilled, (state, action) => {
        state.authUser = action.payload.authUser;
        state.loading = false;
        state.initialized = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.session = null;
        state.authUser = null;
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
            signInWithProvider.pending.type,
            unlinkProvider.pending.type,
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
            signInWithProvider.rejected.type,
            unlinkProvider.rejected.type,
          ].includes(action.type),
        (state) => {
          state.loading = false;
          state.initialized = true;
        }
      )
      .addMatcher(
        (action) =>
          [
            resetPassword.fulfilled.type,
            updatePassword.fulfilled.type,
          ].includes(action.type),
        (state) => {
          state.loading = false;
          state.initialized = true;
        }
      );
  },
});

export const { setAuthState } = authSlice.actions;

export const selectAuthState = (state: RootState) => state.auth;
export const selectAuthUser = (state: RootState) => state.auth.authUser;
export const selectIsAuthenticated = (state: RootState) =>
  Boolean(state.auth.authUser);

export default authSlice.reducer;
