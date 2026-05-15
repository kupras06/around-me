# AroundMe - Gemini CLI Project Mandates

This file serves as the foundational guidance for Gemini CLI when working on the AroundMe project. It supersedes general defaults and ensures architectural consistency.

## Project Vision & Tech Stack
AroundMe is a curated map discovery app (Bengaluru MVP).
- **Framework**: React Native with Expo (Managed Workflow)
- **Navigation**: Expo Router (File-based)
- **Styling**: React Native Unistyles (Theme-driven)
- **Backend**: Supabase (Auth, DB, Storage, Edge Functions)
- **State**: Redux Toolkit (Slices: `auth`, `theme`)
- **Maps**: Mapbox GL (with `HAS_MAPBOX` fallback demo mode)
- **UI**: Custom `craftrn-ui` library

## Architectural Mandates

### 1. Authentication & Protection
- **Pattern**: Every protected screen MUST follow the `AuthGate` wrapping pattern.
- **Implementation**: Wrap the `ActualScreenContent` inside an `AuthGate` in the exported default function.
- **Example**:
  ```tsx
  function ActualScreen() { 
    return <View><SharedHeader /><Text>Content</Text></View>; 
  }
  export default function Screen() {
    return <AuthGate><ActualScreen /></AuthGate>;
  }
  ```

### 2. Creator Flow Logic
- **Tiers**: `verified` (Auto-approve), `trusted_local` (Review queue), `community` (Post-MVP).
- **Profile**: Creators have a "Public Profile" view in the `Profile` tab. Settings are moved to a sub-page (`/profile/settings`).
- **Pins**: Creators can submit pins via `/creator/submit-pin` or tag posts via `/creator/tag-post`.

### 3. Styling & Theming
- **Tool**: Always use `Unistyles` for styles. Avoid inline styles or standard `StyleSheet` where possible.
- **Theme**: Access colors, spacing, and border radii via the `theme` object in `StyleSheet.create((theme) => (...))`.
- **Guideline**: Adhere strictly to [DESIGN_GUIDELINE.md](./DESIGN_GUIDELINE.md) for all UI/UX implementation.

## Context Management & Workflow Guidelines

### 1. Research-First Approach
- Before editing, use `grep_search` and `read_file` to understand existing patterns in `craftrn-ui` or `app/`.
- Always check `tasks.md` for current progress and pending items.

### 2. Surgical Edits
- Prefer `replace` for targeted modifications to maintain file integrity and minimize context noise.
- Ensure all imports are correctly updated when moving logic or adding dependencies.

### 3. Verification
- After UI changes, verify that components still adhere to the `SharedHeader` and `AuthGate` patterns.
- Ensure deep links and file-based routing paths are preserved in `expo-router`.

## Directory Map
- `app/`: Routing and screen components.
- `components/`: Shared logic components (AuthGate, SharedHeader).
- `craftrn-ui/`: Atomic UI components.
- `store/`: Redux logic and thunks.
- `lib/`: Utilities (supabase client, logger).
- `supabase/`: Edge functions and configuration.
