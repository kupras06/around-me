import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import {
  ensureProfile,
  fetchProfileById,
  updateProfileById,
} from './profile.service';
import type { ProfileState, ProfileUpdate, UserType } from './profile.types';

const initialState: ProfileState = {
  userProfile: null,
  loading: false,
};

const requireAuthUserId = (state: RootState) => {
  const userId = state.auth.authUser?.id;

  if (!userId) {
    throw new Error('You must be signed in to continue.');
  }

  return userId;
};

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (userId: string) => fetchProfileById(userId)
);

export const ensureCurrentProfile = createAsyncThunk<
  Awaited<ReturnType<typeof ensureProfile>>,
  ProfileUpdate | undefined,
  { state: RootState }
>('profile/ensureCurrentProfile', async (defaults, { getState }) => {
  return ensureProfile(requireAuthUserId(getState()), defaults);
});

export const updateProfile = createAsyncThunk<
  Awaited<ReturnType<typeof updateProfileById>>,
  ProfileUpdate,
  { state: RootState }
>('profile/updateProfile', async (payload, { getState }) => {
  return updateProfileById(requireAuthUserId(getState()), payload);
});

export const linkPhoneNumber = createAsyncThunk<
  Awaited<ReturnType<typeof updateProfileById>>,
  string,
  { state: RootState }
>('profile/linkPhoneNumber', async (phone, { getState }) => {
  return updateProfileById(requireAuthUserId(getState()), {
    phone: phone.trim(),
  });
});

export const setUserType = createAsyncThunk<
  Awaited<ReturnType<typeof updateProfileById>>,
  { user_type: UserType },
  { state: RootState }
>('profile/setUserType', async ({ user_type }, { getState }) => {
  return updateProfileById(requireAuthUserId(getState()), { user_type });
});

export const completeOnboarding = createAsyncThunk<
  Awaited<ReturnType<typeof updateProfileById>>,
  void,
  { state: RootState }
>('profile/completeOnboarding', async (_, { getState }) => {
  return updateProfileById(requireAuthUserId(getState()), {
    onboarding_completed: true,
  });
});

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.userProfile = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        state.loading = false;
      })
      .addCase(ensureCurrentProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        state.loading = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        state.loading = false;
      })
      .addCase(linkPhoneNumber.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        state.loading = false;
      })
      .addCase(setUserType.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        state.loading = false;
      })
      .addCase(completeOnboarding.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        state.loading = false;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith('profile/') &&
          action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith('profile/') &&
          action.type.endsWith('/rejected'),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export const { clearProfile } = profileSlice.actions;

export const selectProfileState = (state: RootState) => state.profile;
export const selectProfile = (state: RootState) => state.profile.userProfile;

export default profileSlice.reducer;
