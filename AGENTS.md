# Around Me - Project Guide for AI Agents

## Project Overview
Around Me is a React Native/Expo app that helps users discover and save local places, cafes, restaurants, and experiences. The app features user authentication, map integration with Mapbox, and a tab-based navigation structure.

## Tech Stack
- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Redux Toolkit
- **Styling**: React Native Unistyles
- **Maps**: Mapbox GL with fallback demo mode
- **Authentication**: Supabase
- **UI Components**: Custom craftrn-ui component library

## Project Structure

### Core App Structure
```
app/
├── _layout.tsx              # Root layout with providers (Redux, keyboard, gestures)
├── (tabs)/                  # Tab navigation container
│   ├── _layout.tsx          # Tab layout configuration
│   ├── index.tsx             # Map/home screen
│   ├── profile.tsx           # User profile screen (protected)
│   ├── saved.tsx             # Saved places screen (protected)
│   └── creators.tsx          # Browse creators screen (protected)
├── login.tsx                # Login screen
├── register.tsx              # Registration screen
├── reset-password.tsx         # Password reset flow
└── onboarding/              # User onboarding flow
    ├── link-phone.tsx
    └── link-accounts.tsx
```

### Component Organization

#### Authentication Components (`/components/AuthGate/`)
- **AuthGate.tsx** - Main authentication wrapper component
  - Handles loading states and authentication checks
  - Shows LoadingScreen when auth is loading
  - Shows LoginRequired modal when user is not authenticated
  - Renders children when authenticated

#### Authentication UI (`/components/LoginRequired/`)
- **LoginRequired.tsx** - Modal component for unauthenticated users
  - BottomSheet modal presentation
  - Clear messaging about sign-in requirements
  - "Sign In" and "Maybe Later" actions

#### Loading States (`/components/LoadingScreen/`)
- **LoadingScreen.tsx** - Loading spinner component
  - Centered ActivityIndicator with brand colors
  - Used during auth checks and data loading

#### Shared Components (`/components/SharedHeader/`)
- **SharedHeader.tsx** - Reusable header component
  - Used across tab screens
  - Consistent header styling and layout

#### Custom UI Library (`/craftrn-ui/`)
- Custom component library with consistent theming
- Components: Button, Text, InputSearch, BottomSheet, etc.
- Uses Unistyles for theme management

## Component Patterns

### Authentication Pattern
Use the `AuthGate` component for any protected route:

```tsx
import AuthGate from '@/components/AuthGate/AuthGate';

export default function ProtectedScreen() {
  return (
    <AuthGate>
      <ActualScreenContent />
    </AuthGate>
  );
}
```

### Screen Structure Pattern
For tab screens, follow this pattern:

```tsx
function ActualScreenName() {
  // Screen content here
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <SharedHeader />
      {/* Screen content */}
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

## Key Architectural Decisions

### 1. Centralized Authentication
- All auth logic is centralized in `AuthGate` component
- Eliminates duplicate auth checking code across screens
- Consistent user experience for loading and login prompts

### 2. Component Grouping by Domain
- Authentication components grouped together
- Shared components separated by function
- Custom UI library isolated for reusability

### 3. Theme Management
- Uses Unistyles for dynamic theming
- Theme colors defined in central theme files
- Consistent spacing and typography system

### 4. Navigation Strategy
- File-based routing with Expo Router
- Tab navigation for main app sections
- Stack navigation for modal flows

## Environment Configuration
- Uses environment variables for Mapbox token and Supabase config
- Font loading handled via expo-font plugin in app.json
- Development vs production configurations

## State Management
- Redux Toolkit for global state
- Slices: auth, theme, and other app state
- Async thunks for API calls and complex state updates

## Important Notes for Development

### Context Management & Change Guidelines

#### Making Changes:
- **Do not make changes unless explicitly asked by the user**
- **Provide clear explanations for what changes accomplish**
- **Use minimal, focused edits rather than over-engineering**

#### Context Management:
- **Maintain context about user preferences and project goals**
- **Remember architectural decisions and coding patterns**
- **Track ongoing tasks and their completion status**
- **Update documentation when significant changes are made**

### When Adding New Protected Screens:
1. Wrap actual content in an `ActualScreenName` component
2. Export the main screen component that uses `AuthGate`
3. Follow the established import patterns

### When Modifying Authentication:
- Update `AuthGate` component for auth logic changes
- Update `LoginRequired` for UI changes
- Update `LoadingScreen` for loading state changes

### When Adding New UI Components:
- Follow existing component patterns
- Use Unistyles for theming

### Map Integration:
- Has demo mode fallback when Mapbox token is missing
- Uses mock data for development
- Category-based color coding for place types

This guide should help maintain consistency and proper architectural patterns when working on the Around Me project.
