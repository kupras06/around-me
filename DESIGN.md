# AroundMe — "A map of good things"

App name: AroundMe
Tagline: “A map of good things”
Launch scope: Bengaluru — Indiranagar + Koramangala
Tone: editorial, minimal, trustworthy
Visual style:
- Primary: Terracotta `#C04A2A`
- Secondary: Deep Teal `#1D6E7A`
- Background: off-white, minimal 0.5px borders
- No gradients, no drop shadows, no decorative effects
- One typeface, two weights (Regular + Medium)

Categories + pin colors:
- Café (C): terracotta `#C04A2A`
- Diner/Restaurant (D): amber `#BA7517`
- Store (S): teal `#1D6E7A`
- Experience (E): neutral gray `#8E8E8E`

Key UX rules (must follow):
- No ratings, no reviews, no sponsored placements anywhere.
- Creator identity always visible (avatar + name + verification badge).
- Map is the primary interface; everything else supports map use.
- Bottom navigation always visible with 4 tabs: Map · Saved · Creators · Profile.
- Use bottom sheets for place details (map remains visible behind).

---

## Short summary

A map-first place discovery app that surfaces curated pins from creators you trust. Editorial voice, minimal UI, transparent curation. Launch scope: Bengaluru — Indiranagar + Koramangala.

Non-negotiable UX rules: no star ratings, no review counts, no sponsored placements. Creator identity is always visible (avatar + name + verification badge). Map is primary; place details appear in bottom sheets and map stays visible behind. Bottom navigation is always present with four tabs: `Map · Saved · Creators · Profile`.

---

## Product principles (how we make decisions)
- Map-first: everything supports exploration on the map; lists and feeds are helpers, not the main event.
- Trust-first: you see curated picks from named creators you can follow and inspect — creator identity is always visible.
- Editorial & minimal: short human blurbs, clear facts, concise UI, and a restrained visual system (no decorative effects).
- Local-first launch: focus on deep quality for Indiranagar + Koramangala before scaling outward.

---

## Core value propositions
- For people who prefer curated discovery over crowd reviews: discover places via trusted creators, not ratings.
- For local creators: an editorial-first canvas to build credibility and showcase curated places.
- For visitors: a clean, trustworthy map to find “good things” quickly.

---

## Primary user journeys
1. Explore the neighborhood map, discover curated pins from creators you follow or from the editorial feed.
2. Tap a pin to open a bottom sheet with the place’s details and the creator’s identity (avatar + name + verification badge).
3. Save a place to a collection for later (offline sync for trips).
4. Follow creators from a dedicated `Creators` tab to tailor what appears on your map.
5. Creators add/curate places via a constrained authoring flow (one-sentence blurb + tags + one image).

---

## Information architecture (top-level)
- Bottom navigation (always visible): `Map | Saved | Creators | Profile`
- `Map` — primary full-screen map with overlay controls (search, filters).
- `Saved` — saved places and collections (map + list views).
- `Creators` — browse, follow, and view creator profiles and their curated picks.
- `Profile` — account, preferences, creator tools (if approved), settings.

---

## Map & pin UX (map is first)

Map behavior
- App opens to the map centered on the user’s location (or neighborhood default if location denied). Map style: minimal, muted labels, off‑white land color so pins and avatars read clearly.
- Pins are lightweight, flat, and color-coded by category. Creators’ avatars overlay pins so creator identity is visible on the map itself.
- Clusters: when zoomed out, show small stack of avatars + a count. Tapping a cluster zooms/breaks it open.
- Touch targets: pins are visually small but have min 44×44 dp touch area.

Pin appearance (flat, no effects)
- Default pin: 32px filled circle in category color with a white category initial (C/D/S/E) centered.
- Creator avatar: 18px circular thumbnail overlapping lower-right of the pin with a 0.5px off-white border so the avatar is always visible.
- Selected pin: 52px circle, avatar grows to 28px, white 1px ring around pin.
- Category → color mapping:
  - Café (C): Terracotta `#C04A2A`
  - Diner / Restaurant (D): Amber `#BA7517`
  - Store (S): Deep Teal `#1D6E7A`
  - Experience (E): Neutral Gray `#8E8E8E`
- Background map base: off-white (suggested `#F7F6F3`). Use 0.5px hairlines for UI divides.

Map controls
- Top-left: minimal search field. Tapping opens a search modal (searches places & creators).
- Top-right: Filters & map style control (e.g., Minimal / Satellite toggle — optional).
- Floating bottom-right: My-location button in terracotta.
- Bottom nav is persistent and visible above any bottom sheet.

---

## Place detail: bottom sheet (map remains visible behind)

Sheet rules
- Bottom nav must remain visible at all times; bottom sheet appears above nav. Collapsed and expanded states must not cover the bottom nav.
- Map stays fully interactive behind the sheet (panning the map repositions things while sheet is open).
- No shadows or decorative overlays — sheets are solid off-white with 0.5px hairline separators and 16px top radii.

Collapsed state (quick glance)
- Height: ~36% of screen (above bottom nav).
- Content: thumbnail (if any), place name, category pill, creator chip (avatar + name + verified badge), one-line blurb (editorial voice), primary actions row.

Expanded state (detail)
- Height: ~74% of screen (above bottom nav).
- Content layout:
  - Header: place name (Medium), category pill, single-line location/address.
  - Creator chip (persistent): avatar + name + verified badge (tapable to open creator profile).
  - Editor’s blurb: up to 2–3 lines (prefer short, human-first sentences).
  - Key facts: opening hours, phone, official site, price level (icon-based, not numeric rating), accessibility tags.
  - Action row (flat icons + text): `Save` / `Directions` / `Call` / `Share` / `Open in Maps`
  - Nearby curated picks: small horizontal list of other pins by the same creator (tap to switch selection).
- No ratings or review counts shown anywhere.

Saved behavior
- Saving opens a tiny modal to choose collection (or create a new one). Saved items can store a short personal note.

---

## Creators (trust & identity)

Creators tab
- A browsable, searchable list of creators (avatar, name, short bio, primary neighborhoods, `Follow` button, verification badge).
- Creator profile: header with avatar + name + verification badge; short bio; curated collections; map view of all their pins (tapping a pin centers map with their selected pin highlighted).
- Creator verification badge: earned by editorial review; visible next to name everywhere the creator appears.
- Follow mechanics: following a creator boosts their pins on your map and can filter to "Only picks by creators you follow".

Creator contribution & publishing
- Short submission UI: pick an existing POI or create a new record, select category, upload one hero photo, write a 1–2 sentence editorial blurb, add 2–4 tags.
- Moderation: initially manual editorial review for quality, with automation to surface spam.
- Creator controls: mark picks as `archived` or `seasonal` (e.g., pop-ups).

Trust signals (no numeric ratings)
- `Verified` badge and short bio.
- Public list of creator’s curated picks.
- Editorial notes (when a pick is an “editor’s pick”).

---

## Saved (your personal map)
- Two views: list and map (tap switches).
- Collections: create named collections (e.g., “Coffee for work”, “Date night”).
- Offline mode: allow downloading a neighborhood (Indiranagar or Koramangala) for offline access to saved pins and map tiles (Pro feature).
- Each saved place shows the creator chip and your personal note.

---

## Profile & Creator tools

Profile view
- Minimal account information, followed creators, saved collections, app preferences (map density, follow recommendations).
- Creator tools (if enabled for the account): draft manager, analytics (impressions, saves — private to creators), editorial guidelines.

Settings & privacy
- Location permission explained in-context: “Use location to center the map and show nearby curated picks.”
- Data export and account deletion features.

---

## Visual system — editorial minimal

Color palette
- Primary (Terracotta): `#C04A2A` (used for CTAs, selected states, brand marks)
- Secondary (Deep Teal): `#1D6E7A` (used for accents and icons)
- Amber (Diner/Restaurant): `#BA7517`
- Experience Gray: `#8E8E8E`
- Background off-white: `#F7F6F3` (base surfaces)
- Hairline divider: slightly darker `#EDEBE8` at 0.5px

Typography
- Single typeface: `Inter` (or a similar neutral sans-serif) — two weights: `Regular` and `Medium`.
- Sizes (mobile baseline):
  - Body: 16 / Inter Regular
  - UI labels: 14 / Inter Regular
  - Headline: 18–20 / Inter Medium
  - Creator name (chips): 14 / Inter Medium

Iconography & imagery
- Line icon set — single stroke weight, single color (deep teal or black/gray).
- Photos: editorial, natural, tightly cropped hero images. No decorative filters or excessive embellishment.

Spacing & tokens
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 px
- Border radii: 12 px for cards, 16 px top corners for bottom sheet
- Hairline borders: 0.5px for separators

Accessibility
- Minimum hit target 44×44 px for important taps.
- Ensure color contrast for text is WCAG AA compatible; avoid using color alone to indicate category — use category initials (C/D/S/E) or icon + color.

---

## Data model (essential fields)
- `Place`
  - `id`, `name`, `latitude`, `longitude`, `category` (C/D/S/E), `address`, `hours`, `phone`, `website`, `hero_image_url`, `tags[]`
  - `creator_id` (the curating creator)
  - `blurb` (short editorial text)
  - `is_verified` (optional business verification flag — not displayed as an endorsement)
- `Creator`
  - `id`, `display_name`, `avatar_url`, `bio`, `verified` (boolean), `neighborhoods[]`
- `Pin` (a published curation)
  - `id`, `place_id`, `creator_id`, `blurb`, `published_at`
- `User` and `SavedCollection` — basic ownership linking

API endpoints (examples)
- `GET /v1/pins?bbox={sw_lng,sw_lat,ne_lng,ne_lat}&categories=[C,D]` — returns pins for map viewport
- `GET /v1/pins/:id` — place + pin details
- `GET /v1/creators?neighborhood=Indiranagar` — creator list
- `POST /v1/pins` — create draft/publish (creator-only; needs moderation/approval)

Map tile + geocoding
- Use Mapbox (recommended) or Google Maps. Mapbox is preferred for highly-customizable minimal styles to match the brand palette.

---

## Moderation, verification & trust
- Creator verification: editorial review and identity checks for a `verified` badge. Start manual to ensure quality.
- Moderation pipeline: initial manual curation plus spam filters; in-app reporting mechanism per pin.
- Editorial guidelines: limit length of blurbs (e.g., 280 chars max), require hero image for new pins, require one tag at publish.

---

## Monetization (respecting "no ads, no sponsored placements")
- Subscription model: `AroundMe Pro` for power users (offline maps, larger image uploads, saved collections sync).
- Creator tools subscription: analytics dashboards, priority editorial review, promotional tools (never used to pay for placement; only creator tools).
- Local events & ticketed curated experiences (co-marketing) — clearly labelled as events, not "sponsored placements".

---

## Launch plan (Indiranagar + Koramangala)
1. Seed content (0–4 weeks)
   - Hire a small editorial team of 6–10 local curators & 20 invited local creators.
   - Seed 800–1,200 high-quality curated pins across both neighborhoods (mix of cafés, restaurants, stores, experiences).
2. Beta community (4–8 weeks)
   - Invite local food & community groups for private beta; collect feedback.
   - Local launch events (pop-ups in partner cafes), PR with city lifestyle editors.
3. Public launch (8–12 weeks)
   - Social launch featuring creator spotlights and neighborhood editorial guides.
   - Partnerships with local creator communities (not paid placements — creator-centric engagement).
4. Growth (3–12 months)
   - Measure retention, saves, follows, session length.
   - Iterate map density & filtering and expand to next neighborhoods.

Key launch metrics (first 90 days)
- Number of curated pins published
- Number of active creators
- DAU / 7-day retention
- Saves per active user
- Average session duration on the map
- Follow conversions (users following creators)

---

## Roadmap (first 12 months)
- Month 0–3: MVP iOS + Android; map core; seed creators; bottom sheets; saved collections; basic creator flow.
- Month 3–6: Pro features (offline map), creator analytics, improved moderation tooling, search ranking by follow graph.
- Month 6–12: Expand city coverage, creator collaboration features (collections / routes), desktop web map viewer.

---

## Implementation recommendations
- Frontend: React Native or native (Swift/Kotlin). Use Mapbox SDK to get a highly-customizable, minimal map style.
- Backend: GraphQL or RESTful API with geospatial indexing (PostGIS or MongoDB geospatial).
- Media: CDN for photos; small hero images with strict size/crop rules for consistency.
- Moderation: lightweight dashboard for editorial approvals (manual + automated spam detection).
- Analytics: instrument map interactions (pin taps, saves, follows) to measure engagement.

---

## Brand & launch assets I can provide next
- Figma UI kit: map screens, bottom sheet components, icon set, color tokens, and component variants.
- Mapbox style JSON matching the off-white minimal aesthetic and the brand palette.
- Editorial style guide: voice examples, creator onboarding copy, in-app onboarding flows.
- Implementation-ready design spec: component sizes, states, API contract samples.

---

## Quick examples (copy + UI microcopy)
- Onboarding prompt for location: “Let us use your location to show curated picks near you. You can change this anytime.”
- Creator follow CTA: `Follow` (secondary terracotta outline → filled terracotta when following).
- Save action microcopy: `Saved to "Coffee for work"`.

---

If you want any of these expanded into a Figma kit, clickable prototype, or implementation-ready spec, tell me which and I’ll prepare the next artifact.
