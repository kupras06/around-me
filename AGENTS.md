# Agent Guidelines

## Purpose

This file is the operating guide for agents working in this repository. Read it before making changes. It is meant to describe the project as it exists now, not as it was planned earlier.

AroundMe is a React Native app built with Expo, Expo Router, and TypeScript. The product direction is a map-first place discovery app where creator identity stays visible and the interface remains minimal and editorial.

## Verified current setup

- Framework: Expo SDK `53`
- React: `19.0.0`
- React Native: `0.79.6`
- Language: TypeScript with `strict: true`
- Routing: Expo Router with typed routes enabled
- Styling: `react-native-unistyles`
- State management: Redux Toolkit + RTK Query
- Auth/backend client: Supabase JS
- Auth persistence: `react-native-mmkv`
- Env validation: `@t3-oss/env-core` + `zod`
- Formatting: Biome
- Linting: Oxlint
- Map library: `@rnmapbox/maps`
- Native projects exist: `ios/` and `android/`
- Package manager declared in repo: `bun`

## Current architecture

### App shell

- Root shell lives in [`app/_layout.tsx`](/Users/prashanthkumar/Developer/rn-practive/around-me/app/_layout.tsx).
- The app is wrapped in:
  - `KeyboardProvider`
  - `GestureHandlerRootView`
  - `react-redux` `Provider`
- Fonts are loaded in the root layout before rendering the app.
- Splash screen hiding is controlled in the root layout.

### Routing

- Expo Router is the source of truth for navigation.
- Current route groups and screens are under `app/`.
- Tab routes live under [`app/(tabs)/`](/Users/prashanthkumar/Developer/rn-practive/around-me/app/%28tabs%29).
- Auth-related routes currently include:
  - [`app/login.tsx`](/Users/prashanthkumar/Developer/rn-practive/around-me/app/login.tsx)
  - [`app/register.tsx`](/Users/prashanthkumar/Developer/rn-practive/around-me/app/register.tsx)
  - [`app/reset-password.tsx`](/Users/prashanthkumar/Developer/rn-practive/around-me/app/reset-password.tsx)
  - [`app/onboarding/link-phone.tsx`](/Users/prashanthkumar/Developer/rn-practive/around-me/app/onboarding/link-phone.tsx)
  - [`app/onboarding/link-accounts.tsx`](/Users/prashanthkumar/Developer/rn-practive/around-me/app/onboarding/link-accounts.tsx)

### Redux

- Store setup lives in [`store/index.ts`](/Users/prashanthkumar/Developer/rn-practive/around-me/store/index.ts).
- Typed hooks live in [`store/hooks.ts`](/Users/prashanthkumar/Developer/rn-practive/around-me/store/hooks.ts).
- App-facing convenience hooks live in:
  - [`hooks/useAuth.ts`](/Users/prashanthkumar/Developer/rn-practive/around-me/hooks/useAuth.ts)
  - [`hooks/useTheme.ts`](/Users/prashanthkumar/Developer/rn-practive/around-me/hooks/useTheme.ts)
- Current slices:
  - [`store/slices/authSlice.ts`](/Users/prashanthkumar/Developer/rn-practive/around-me/store/slices/authSlice.ts)
  - [`store/slices/themeSlice.ts`](/Users/prashanthkumar/Developer/rn-practive/around-me/store/slices/themeSlice.ts)
- RTK Query root API lives in [`store/api/baseApi.ts`](/Users/prashanthkumar/Developer/rn-practive/around-me/store/api/baseApi.ts).
- Formatting config lives in [`biome.json`](/Users/prashanthkumar/Developer/rn-practive/around-me/biome.json).
- Lint config lives in [`.oxlintrc.json`](/Users/prashanthkumar/Developer/rn-practive/around-me/.oxlintrc.json).

Important:

- React auth/theme contexts have been removed.
- Do not reintroduce React context for app-wide auth or theme state unless the user explicitly asks for that architecture change.

### App-level side effects

- App-level auth, routing, and theme side effects live in [`components/AppStateEffects/AppStateEffects.tsx`](/Users/prashanthkumar/Developer/rn-practive/around-me/components/AppStateEffects/AppStateEffects.tsx).
- That file currently handles:
  - initial auth bootstrap
  - Supabase `onAuthStateChange` subscription
  - password recovery redirect behavior
  - onboarding route guards
  - syncing Redux theme state into Unistyles and `Appearance`

Best practice for this repo:

- Keep state in Redux.
- Keep global side effects in app-level effect modules like `AppStateEffects`.
- Keep screen components focused on rendering and user interaction.

## Auth and Supabase

### What is implemented

- Supabase client lives in [`lib/supabase.ts`](/Users/prashanthkumar/Developer/rn-practive/around-me/lib/supabase.ts).
- Auth state is Redux-backed.
- Supabase session persistence uses MMKV storage.
- Registration, login, logout, password reset, password update, onboarding metadata updates, and session restore are implemented in the auth slice.
- Onboarding state is currently stored in Supabase user metadata.

### Current behavior

- Unauthenticated users trying to access protected tabs are redirected to `/login`.
- Registered users are expected to continue into onboarding.
- Users with incomplete onboarding are redirected to `/onboarding/link-phone`.
- Password recovery sessions are redirected to `/reset-password`.

### Important constraints

- The current register flow expects `supabase.auth.signUp()` to return a session immediately.
- If Supabase email confirmation is enabled, the current onboarding flow will not work as-is.
- If email confirmation is turned on later, add an explicit confirm-email flow instead of silently working around it.

### Best practices

- Do not create new Supabase clients inside screens or components.
- Keep auth/session logic centralized in the auth slice plus app-level effects.
- Do not put Supabase subscriptions in random screens.
- Prefer async thunks or RTK Query integration over ad hoc fetch logic spread through components.
- Never expose service-role keys or server-only secrets in the app.

## Theme and styling

### What is implemented

- Unistyles is configured in [`craftrn-ui/themes/unistyles.ts`](/Users/prashanthkumar/Developer/rn-practive/around-me/craftrn-ui/themes/unistyles.ts).
- Theme tokens live in [`craftrn-ui/themes/config.ts`](/Users/prashanthkumar/Developer/rn-practive/around-me/craftrn-ui/themes/config.ts).
- Theme state lives in the Redux theme slice.
- Theme synchronization into Unistyles happens in `AppStateEffects`.

### Best practices

- Prefer theme tokens over hardcoded colors, spacing, and radii.
- If a color is product-semantic, add or reuse a token before hardcoding it repeatedly.
- Keep category colors aligned with [`constants/map.ts`](/Users/prashanthkumar/Developer/rn-practive/around-me/constants/map.ts) and [`DESIGN.md`](/Users/prashanthkumar/Developer/rn-practive/around-me/DESIGN.md).
- Reuse the local UI kit under `craftrn-ui/components/` before building one-off controls.

Important caveat:

- Babel config points the Unistyles plugin root at `app` in [`babel.config.js`](/Users/prashanthkumar/Developer/rn-practive/around-me/babel.config.js).
- Shared components outside `app/` already use Unistyles in this repo, but plugin-dependent behavior outside `app/` should be validated carefully when changing styling internals.

## Formatting and linting

### What is implemented

- Biome is the committed formatter.
- Oxlint is the committed linter.
- Current scripts in [`package.json`](/Users/prashanthkumar/Developer/rn-practive/around-me/package.json):
  - `bun run format`
  - `bun run format:check`
  - `bun run lint`
  - `bun run lint:fix`

### Current repo state

- `bun run lint` runs successfully and currently reports warnings, not errors.
- `bun run format:check` currently reports formatting drift in existing files.
- That drift is real repo state; do not assume the repository is already fully Biome-formatted.

### Best practices

- Use Biome as the source of truth for formatting.
- Use Oxlint as the source of truth for linting.
- Do not add or rely on Prettier or ESLint config unless the user explicitly asks for a multi-tool setup.
- When touching files, prefer formatting the files you changed rather than triggering a broad repo-wide rewrite unless the user asks for a formatting sweep.
- If you change env, Redux, or routing conventions, keep the tooling config aligned with the resulting code style and file layout.

## Env and config

### Verified env system

- Env parsing lives in [`lib/env.ts`](/Users/prashanthkumar/Developer/rn-practive/around-me/lib/env.ts).
- It currently uses `@t3-oss/env-core`.
- Current validated client env vars are:
  - `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN`
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Best practices

- Add new env vars to `lib/env.ts` instead of reading raw `process.env` throughout the app.
- Keep client-exposed values behind the `EXPO_PUBLIC_` prefix.
- If a new env var is required for local setup, update [`.env.example`](/Users/prashanthkumar/Developer/rn-practive/around-me/.env.example) in the same change.

## Map setup

- Map constants live in [`constants/map.ts`](/Users/prashanthkumar/Developer/rn-practive/around-me/constants/map.ts).
- The main map screen is [`app/(tabs)/index.tsx`](/Users/prashanthkumar/Developer/rn-practive/around-me/app/%28tabs%29/index.tsx).
- Current behavior is intentionally tolerant of missing Mapbox config and falls back to a demo map UI.

Best practices:

- Preserve the no-token fallback path unless the user explicitly asks to remove it.
- Do not make local development depend on a Mapbox token if the existing fallback can still work.

## RTK Query guidance

- Shared root API is [`store/api/baseApi.ts`](/Users/prashanthkumar/Developer/rn-practive/around-me/store/api/baseApi.ts).
- It currently uses `fakeBaseQuery()` and has no injected endpoints yet.

Best practices:

- Add server-backed query/mutation logic by injecting endpoints into `baseApi`.
- Do not create multiple unrelated RTK Query root APIs unless there is a strong reason.
- Prefer stable tag types and invalidation strategy before adding many endpoints.
- If the backend logic is Supabase-specific and not a natural RTK Query fit, keep it in slices/thunks or dedicated service modules instead of forcing it into RTK Query.

## Repository layout

- `app/`: Expo Router screens and layouts
- `components/`: app-level shared UI and effect components
- `hooks/`: app-facing hooks built on Redux
- `store/`: Redux store, slices, typed hooks, RTK Query root API
- `lib/`: shared infrastructure modules like env and Supabase
- `constants/`: app constants
- `craftrn-ui/`: local design system / reusable components
- `icons/`, `tetrisly-icons/`: icon components
- `assets/`: images and fonts
- `ios/`, `android/`: native projects

## Commands

Use existing scripts first:

- `bun run start`
- `bun run ios`
- `bun run android`
- `bun run web`
- `bun run format`
- `bun run format:check`
- `bun run lint`
- `bun run lint:fix`
- `bun run tsc`

Notes:

- `bun run tsc` is the most reliable validation currently available in-repo.
- `bun run lint` now uses Oxlint, not Expo ESLint.
- `bun run format:check` uses Biome and may fail until existing formatting drift is intentionally cleaned up.
- Jest is declared, but no meaningful test suite is established in the current repo state.

## Product constraints

These constraints are supported by current docs and screens:

- Map is the primary interface.
- Bottom navigation remains `Map`, `Saved`, `Creators`, `Profile`.
- Creator identity should remain visible anywhere a place or pin appears.
- No star ratings, no review counts, no sponsored-placement style UI.
- Visual style should remain restrained and editorial rather than noisy or gamified.

Use [`README.md`](/Users/prashanthkumar/Developer/rn-practive/around-me/README.md) and [`DESIGN.md`](/Users/prashanthkumar/Developer/rn-practive/around-me/DESIGN.md) for product context.

## Working rules for future changes

- Inspect existing files before changing architecture.
- Prefer small coherent changes over broad rewrites.
- Do not assume planned backend or feature layers exist unless you can see them in the repo.
- Update nearby types when data shape changes.
- When adding new shared behavior, choose one home for it:
  - Redux slice for state
  - RTK Query for injected endpoints
  - `lib/` for infra
  - `components/` for app-level effects or shared UI
  - `hooks/` for app-facing access patterns
- Do not put navigation side effects in many different screens if they belong at the app shell level.

## Practical best practices

- Keep route components thin.
- Prefer typed selectors and typed dispatch via `store/hooks.ts`.
- Use `unwrap()` on thunks when screens need request-style success/error handling.
- Reuse UI kit primitives before inventing new button/input/text components.
- Avoid hardcoding backend URLs, keys, or repeated route strings when a shared constant or typed path would be more stable.
- Preserve mobile realities: async loading states, offline tolerance, and safe fallbacks matter.

## Verification checklist

Before considering work complete, verify as many of these as apply:

- `bun run tsc` passes
- `bun run lint` still runs cleanly enough for the intended change
- route paths still match Expo Router files
- auth redirects still behave correctly
- onboarding flow still works
- theme switching still affects Unistyles-backed UI
- map still works with and without a Mapbox token
- Redux state shape changes did not break app-facing hooks
- new env requirements are reflected in `.env.example`
- changed files are formatted consistently with Biome, even if the whole repo has not been normalized yet

## Guardrails

- Do not overwrite user changes in a dirty worktree.
- Do not assume missing config should be generated unless the user asked for that.
- Do not reintroduce React context for app-wide auth/theme state without a reason.
- Do not convert the product into a ratings/reviews feed.
- Do not add visual noise that conflicts with the project’s product direction.

## Output discipline

- Avoid large outputs after acceptance.
- Never re-send full files unless explicitly requested.
- If the user asks for the final file, then show it.
- If a diff is large, summarize the change and provide key hunks unless asked for full content.
