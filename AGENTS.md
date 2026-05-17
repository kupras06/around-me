# Around Me - Project Guide for AI Agents

## Project Overview
Around Me is a React Native/Expo app that helps users discover and save local places, cafes, restaurants, and experiences. The app features user authentication, map integration with Mapbox, and a tab-based navigation structure.

## Tech Stack
- **Framework**: React Native 0.81 + Expo 54
- **Package Manager**: Bun (see `bun.lock`)
- **Navigation**: Expo Router 6 (file-based routing)
- **State Management**: Redux Toolkit
- **Styling**: React Native Unistyles 3
- **Maps**: Mapbox GL (`@rnmapbox/maps`) with fallback demo mode
- **Authentication**: Supabase
- **UI Components**: Custom `craftrn-ui` component library
- **Linting/Formatting**: Biome 2 + ESLint 9
- **TypeScript**: Strict mode, path alias `@/` maps to project root

## Validation Commands (run in order for changes)
```sh
bun run typecheck          # TypeScript strict check
bun run lint               # ESLint
bun run check              # Biome lint + format check
bun run lint:biome         # Biome lint only
bun run format:check       # Biome format only
bun run lint:fix           # ESLint auto-fix
bun run check:fix          # Biome auto-fix
bun run format             # Biome format write
```

## Boundaries
- **Always**: Modify `app/`, `components/`, `store/`, `hooks/`, `lib/`, `constants/`, `views/`, `craftrn-ui/`
- **Ask first**: New dependencies, env var changes, DB schema changes, biome/eslint config changes, iOS/Android native code
- **Never**: Edit `bun.lock`, `.env` (use `.env.example`), generated files, `node_modules/`, `supabase/functions/`

## Project Structure

### Core App Structure
```
app/                       # Expo Router pages
├── _layout.tsx            # Root layout (Redux, keyboard, gestures providers)
├── (tabs)/                # Tab navigation
│   ├── _layout.tsx
│   ├── index.tsx          # Map/home screen
│   ├── profile.tsx        # Protected
│   ├── saved.tsx          # Protected
│   └── creators.tsx       # Protected
├── auth/                  # login.tsx, register.tsx, reset-password.tsx
└── onboarding/            # link-phone.tsx, link-accounts.tsx

components/                # App-specific components
├── AuthGate/              # AuthGate.tsx, LoginRequired.tsx, LoadingScreen.tsx
├── SharedHeader/          # SharedHeader.tsx
├── ui/                    # icon-symbol.tsx, loader-view.tsx
├── inputs/                # EmailInput, PasswordInput, PhoneNumberInput
├── haptic-tab.tsx
└── external-link.tsx

craftrn-ui/                # Custom UI component library
└── components/
    ├── Button/ / Text/ / Card/ / BottomSheet/
    ├── InputText/ / InputSearch/ / InputOTP/
    ├── Avatar/ / Switch/ / Checkbox/ / Radio/
    ├── Slider/ / SliderDual/ / SegmentedControl/
    ├── ListItem/ / Divider/ / Skeleton/
    ├── PressableScale/ / ButtonRound/
    ├── PhotoCarousel/ / ContextMenu/
    └── PasscodeEntry/

store/                     # Redux Toolkit
├── index.ts               # configureStore
├── hooks.ts               # useAppDispatch, useAppSelector
├── features/
│   ├── auth/              # auth.slice.ts, auth.service.ts, auth.types.ts, oauth.service.ts, auth.mapper.ts
│   └── profile/           # profile.slice.ts, profile.service.ts, profile.types.ts
├── api/
│   └── baseApi.ts
└── slices/
    └── themeSlice.ts

hooks/                     # Custom hooks
├── use-auth.ts
├── use-theme.ts
└── use-color-scheme.ts

lib/                       # Core utilities
├── supabase.ts / logger.ts / env.ts / database.types.ts / theme-preference.ts

constants/                 # map.ts, theme.ts
views/
└── Authentication/        # Auth-specific views
```

## Code Conventions

### Naming
| Category | Convention | Example |
|---|---|---|
| Files | kebab-case | `use-auth.ts`, `icon-symbol.tsx` |
| React components | PascalCase (file + export) | `AuthGate.tsx` → `export default function AuthGate` |
| Functions/variables | camelCase | `useAppDispatch`, `signInWithPassword` |
| Constants | SCREAMING_SNAKE or PascalCase | `MAPBOX_ACCESS_TOKEN`, `CATEGORY_COLORS` |
| Types/interfaces | PascalCase (no `I` prefix) | `type AuthState`, `type Props` |
| Redux slices | camelCase with `.slice.ts` | `auth.slice.ts` |

### Styling (Unistyles)
```tsx
import { StyleSheet, useUnistyles } from 'react-native-unistyles';

function Component() {
  const { theme } = useUnistyles();
  const styles = useMemo(() => createStyles(theme), [theme]);
  // ...
}

const createStyles = (theme: UnistylesTheme) =>
  StyleSheet.create({
    container: { backgroundColor: theme.colors.background },
  });
```
- Always use `useMemo(() => createStyles(theme), [theme])`
- Colors come from `theme.colors` — never hardcoded
- No StyleSheet.create at module level (use dynamic unistyles)

### Imports
- Use `@/` path alias — never deep relative paths (`../../../`)
- Order: packages → `@/` internals
- Type-only imports: `import type { Foo } from '...'`

### Component Patterns
```tsx
// Screen with AuthGate (protected route pattern)
function ActualScreenName() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SharedHeader />
      {/* content */}
    </View>
  );
}

export default function ScreenName() {
  return (
    <AuthGate>
      <ActualScreenName />
    </AuthGate>
  );
}
```

### Craftrn UI Components (import from full path, not barrel)
```tsx
import { BottomSheet } from '@/craftrn-ui/components/BottomSheet';
import { Text } from '@/craftrn-ui/components/Text';
import { Button } from '@/craftrn-ui/components/Button';
import { InputSearch } from '@/craftrn-ui/components/InputSearch';
```

### Existing Utilities (don't recreate)
| What | Where |
|---|---|
| Logger | `@/lib/logger` |
| Supabase client | `@/lib/supabase` |
| Env/schema validation | `@/lib/env` (uses zod + `@t3-oss/env-core`) |
| Theme constants | `@/constants/theme` |
| Map constants | `@/constants/map` |
| Auth hooks | `@/hooks/use-auth` (useCurrentUser, login/logout/register) |
| Theme hook | `@/hooks/use-theme` |
| Redux dispatch/selector | `@/store/hooks` (useAppDispatch, useAppSelector) |
| Auth state | `@/store/features/auth/auth.slice` |
| Profile state | `@/store/features/profile/profile.slice` |
| Assertions | `invariant` from `es-toolkit` |
| Icons | `@/components/ui/icon-symbol` (expo-symbols / vector icons) |

### TypeScript
- Strict mode enabled — no `any` (use `unknown` + type guards)
- Props typed as `type Props = { ... }` (not interface, no `I` prefix)
- No unused locals/params (enforced by ESLint)

## Map Integration
- Demo mode fallback when `MAPBOX_ACCESS_TOKEN` is missing
- Uses mock data for development (no backend required)
- Category color coding in `@/constants/map` (`CATEGORY_COLORS`)

## Documentation
- **PRD.md**: Product Requirements Document
- **DESIGN_GUIDELINE.md**: Visual and interaction design standards (mandatory for all UI/UX work)
- **tasks.md**: Current development tasks and progress

## Git Workflow

### Starting Work on an Issue
1. Create a branch from `main` with a descriptive name:
   ```sh
   git checkout main && git pull
   git checkout -b <type>/<short-description>
   ```
   Branch types: `feat/`, `fix/`, `chore/`, `refactor/`, `docs/`
   
   Examples: `fix/login-crash`, `feat/dark-mode-toggle`, `chore/upgrade-expo`

2. Make focused, incremental commits with clear messages.

### Before Opening a PR
1. Run validation commands (see above): `typecheck → lint → check`
2. If validation passes:
   ```sh
   git add <files>
   git commit -m "<type>: <description>"
   git push -u origin HEAD
   ```
3. Open a PR on GitHub — keep it small and focused on one issue.
4. Link the PR to the issue it resolves.

### Commit Message Convention
```
<type>: <imperative description>
```
Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `style`, `test`

## Environment
- Copy `.env.example` → `.env` for local setup
- Key vars: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`, `MAPBOX_ACCESS_TOKEN`

This guide should help maintain consistency and proper architectural patterns when working on the Around Me project.
