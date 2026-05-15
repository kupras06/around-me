# AroundMe Design Guideline: Editorial & Restrained

## 1. Core Philosophy
AroundMe is a **curated city guide**, not a utility app. The design must feel editorial, intentional, and high-end. We prioritize **taste** over **data volume**.

### Principles
- **Editorial over Utilitarian**: Layouts should feel like a magazine or a well-designed travel guide.
- **Restraint over Richness**: Avoid clutter. No star ratings, no review counts, no aggressive shadows.
- **Creator Centric**: Every piece of content is attributed to a person. The "face" behind the recommendation is paramount.
- **Map-First**: The map is the primary interface; everything else is a layer on top.

## 2. Visual Language

### Color Palette
- **Primary (Terracotta)**: `#C04A2A` - Used for primary actions, branding, and "Verified" status.
- **Secondary (Teal)**: `#1D6E7A` - Used for "Trusted Local" accents and secondary actions.
- **Backgrounds**: Off-white (`#FFF8F6`) for light mode, deep matte black (`#141312`) for dark mode.
- **Borders**: Minimal 0.5px hair-thin borders (`#DFC0B8`).

### Typography
- **System**: One typeface (clean sans-serif), two weights (Regular 400, Medium 500).
- **Scale**:
  - `Display`: Large, airy, slightly negative letter-spacing for headings.
  - `Note`: Creator notes use a slightly larger, italicized style to differentiate from metadata.

### Surface & Elevation
- **No Drop Shadows**: Use subtle borders or slight background color shifts to indicate depth.
- **Bottom Sheets**: Primary interaction for place details. Should feel integrated, not like a separate window.

## 3. UI Components

### Buttons
- **Primary**: Filled Terracotta, white text.
- **Secondary**: Outline Teal or Gray, thin 0.5px border.
- **Ghost**: No border, colored text, clear press feedback.

### Pins
- **Category Colors**:
  - Café: Terracotta (`#C04A2A`)
  - Diner: Amber (`#BA7517`)
  - Store: Teal (`#1D6E7A`)
  - Experience: Gray (`#8B716A`)
- **Follower Highlight**: A white ring around pins from creators the user follows.

### Creator Notes
- Displayed prominently.
- Italicized, medium weight.
- Clear attribution (avatar + name) immediately above the note.

## 4. Interaction & Motion
- **Subtle Feedback**: Use Haptics for meaningful actions (saving, following).
- **Transitions**: Smooth, vertical transitions for bottom sheets. Map-to-detail should feel fluid.
- **Loading**: Use brand-specific minimal loaders.

## 5. Implementation Rules
- Always use `Unistyles` for theme consistency.
- No inline styles.
- Components must support both Light and Dark modes.
- Prefer `SharedHeader` and `AuthGate` patterns as defined in `GEMINI.md`.
