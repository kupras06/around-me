# AroundMe — Product Requirements Document

> **Version:** 1.0 — MVP
> **Date:** May 2026
> **Author:** Solo Founder
> **Status:** In Planning
> **Launch Scope:** Bengaluru, India — Indiranagar + Koramangala

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Product Vision](#3-product-vision)
4. [Target Users](#4-target-users)
5. [App Information](#5-app-information)
6. [Feature Requirements — MVP](#6-feature-requirements--mvp)
7. [UI/UX Requirements](#7-uiux-requirements)
8. [Data Model](#8-data-model)
9. [Tech Stack](#9-tech-stack)
10. [Services & Infrastructure](#10-services--infrastructure)
11. [Business Model](#11-business-model)
12. [Launch Strategy](#12-launch-strategy)
13. [Success Metrics](#13-success-metrics)
14. [Out of Scope — MVP](#14-out-of-scope--mvp)
15. [Risks & Mitigations](#15-risks--mitigations)

---

## 1. Executive Summary

AroundMe is a mobile-first place discovery app that shows users a curated map of quality cafés, restaurants, stores, and experiences — verified by creators they trust. Unlike aggregator platforms that rely on crowd-sourced ratings and algorithmic ranking, AroundMe surfaces recommendations from specific, identifiable people whose taste the user has chosen to follow.

The core insight is that people already filter recommendations mentally by source. They trust a food blogger they follow more than a five-star average from anonymous reviewers. AroundMe makes that trust graph explicit and spatial — a map where every pin has a face behind it.

The MVP launches in Bengaluru, scoped to Indiranagar and Koramangala, with creator onboarding via Instagram and Twitter OAuth. Creators are verified automatically by follower count tier. The app is built solo using React Native with Expo and Supabase, targeting zero infrastructure cost until meaningful traction is achieved.

---

## 2. Problem Statement

### The discovery problem

Existing discovery platforms — Google Maps, Zomato, Swiggy Dineout — are noisy. Thousands of reviews with no signal about the reviewer's taste, algorithmic rankings influenced by paid placement, and a homogenous visual language that makes every place look equally credible. Users spend significant time filtering through irrelevant results to find something they actually trust.

### The trust gap

Star ratings are an average of strangers. A 4.2 rating from 1,400 reviews tells you nothing about whether the place suits your specific taste. People solve this informally by asking friends or following creators on Instagram whose recommendations they trust. There is no product that makes this trust layer the primary interface.

### The creator gap

Creators on Instagram and Twitter regularly recommend places to large engaged audiences, but those recommendations disappear into the feed within 24 hours. There is no persistent, spatial home for a creator's recommendations — no way for their audience to say "show me everything Shreya has recommended in Bangalore on a map."

---

## 3. Product Vision

**AroundMe is a map of good things, curated by people you trust.**

The experience should feel like borrowing a well-travelled friend's notebook of favourite spots — personal, specific, trustworthy. Not a database. Not a search engine. A curated layer on top of the city.

### Design philosophy

- **Editorial over utilitarian.** The visual register is a curated city guide, not an aggregator app.
- **Creator identity is always visible.** Every pin has a name and face attached. Trust comes from who endorsed it.
- **Restraint over richness.** No star ratings, no review counts, no sponsored pins — ever. The absence of these is part of the brand.
- **Map-first.** The map is the product. Everything else is secondary.

---

## 4. Target Users

### Primary user — the discovery seeker

Bengaluru resident, 22–35 years old, active on Instagram and Twitter, already follows food and lifestyle creators, frustrated by the noise on existing platforms. Wants to find a café or restaurant they can trust without reading 200 reviews. Values curation and taste over comprehensiveness.

### Secondary user — the creator

Instagram or Twitter creator with 1,000–200,000 followers, focused on food, lifestyle, or local Bengaluru content. Posts place recommendations regularly but has no persistent home for them. Motivated by giving their audience a better way to act on recommendations and by growing their own profile through a new discovery surface.

### Relationship between the two

The product only works when both users are present. Creators bring the pins and the audience. Discovery seekers bring the daily active usage and the visit behaviour that validates the product.

---

## 5. App Information

| Field | Detail |
|---|---|
| App name | AroundMe |
| Tagline | A map of good things |
| Platform | iOS and Android (React Native) |
| Category | Lifestyle / Travel & Local |
| Languages | English (MVP) |
| Launch city | Bengaluru, India |
| Launch neighbourhoods | Indiranagar, Koramangala |
| Expansion plan | HSR Layout → Jayanagar → Whitefield → all of Bengaluru |
| Monetisation | Free at launch. Premium subscription post-MVP |
| Target launch | Q3 2026 |

### Place categories

| Category | Pin colour | Abbreviation |
|---|---|---|
| Café | Terracotta `#C04A2A` | C |
| Diner / Restaurant | Amber `#BA7517` | D |
| Store | Teal `#1D6E7A` | S |
| Experience | Neutral gray | E |

### Creator verification tiers

| Tier | Follower threshold | Pin approval | Badge |
|---|---|---|---|
| Verified | 10,000+ | Auto-approved | Filled terracotta checkmark |
| Trusted Local | 1,000–9,999 | Manual review queue | Teal outline badge |
| Community | Under 1,000 | Post-MVP | None |

---

## 6. Feature Requirements — MVP

### 6.1 Map screen

- Full-screen map powered by Mapbox, scoped to Indiranagar and Koramangala on first open
- Floating search bar showing current neighbourhood scope — tapping opens neighbourhood selector, not free text search
- Horizontal filter pill strip below search bar: All · Cafés · Diners · Stores · Experiences
- Pins colour-coded by category, with a white ring on pins from creators the user follows
- Tapping a pin raises the place detail bottom sheet
- Panning beyond the seeded boundary is allowed but no pins exist outside it at launch

### 6.2 Place detail bottom sheet

- Place name, category, and neighbourhood
- Creator avatar, name, verification badge, and follower count
- Creator note displayed prominently in italic style — 160 character max
- If multiple followed creators have pinned the same place: stacked avatar row with label "N others you follow also saved this" — tapping expands to show each creator's note
- Three action buttons: Save (outline), Share (outline), Directions (filled — hands off to Google Maps or Apple Maps)

### 6.3 Saved screen

- Personal list of all places the user has saved
- Grouped by category by default
- Toggle to switch to a map view of saved places only
- Each item shows: place name, neighbourhood, category pill, and small avatar of the creator whose pin was saved

### 6.4 Creators screen

- Browsable list of available creators, sorted by neighbourhood relevance
- Each creator card shows: avatar, name, handle, follower count, verification badge, one-line focus description, pin count on AroundMe, and Follow button
- Follow button changes to Following with checkmark on tap — no confirmation dialog
- Horizontal filter strip at top: Food · Lifestyle · Travel · Local

### 6.5 Creator profile screen

- Header photo or terracotta fill if none
- Avatar, name, handle, follower count, verification badge, bio, Follow button
- Full list of the creator's pins — each as a compact card: place name, category, neighbourhood, note truncated to one line
- Tapping any pin opens the place detail bottom sheet
- No external link to Instagram or Twitter in MVP

### 6.6 Creator onboarding flow

- Connect Instagram or Twitter via OAuth
- Follower count pulled automatically — tier assigned and displayed
- Short form: bio field, focus description (e.g. "Bangalore coffee, brunch spots, Indiranagar locals")
- Five steps maximum, no friction
- Creator can start pinning immediately after completing onboarding

### 6.7 Pin submission form (creators only)

- Place name with Google Places autocomplete — prevents duplicate place entries
- Category selector: Café / Diner / Store / Experience
- Note field — 160 character limit with live character counter
- Optional photo upload
- Submit button
- No tags, ratings, or extra fields

### 6.8 Share card

- Pre-composed image card generated on share — not a plain URL
- Card contains: place name, neighbourhood, category, creator name and avatar, creator note truncated to one line, AroundMe wordmark
- Designed to render well as an Instagram Story and WhatsApp image preview
- Embeds a deep link URL — tapping opens the pin in the app, or the App Store / Play Store if not installed

### 6.9 Tagging mechanic (Twitter first)

- Creators tag `@aroundme_blr` on Twitter when posting about a place
- Creator manually submits the post link via the app in MVP — auto-detection is post-MVP
- System checks if the account is a verified or trusted local tier creator
- Verified tier: auto-approved and published to map
- Trusted Local tier: enters manual review queue

### 6.10 Admin review queue

- Simple internal interface (Supabase dashboard or lightweight web UI)
- Shows pending submissions from Trusted Local tier creators
- Approve or reject with one action
- Rejected submissions send no notification in MVP

---

## 7. UI/UX Requirements

### Visual language

- Colour palette: terracotta `#C04A2A` (primary), deep teal `#1D6E7A` (secondary), off-white backgrounds, minimal 0.5px borders
- Typography: one typeface, two weights — regular and medium. Clean and readable
- No gradients, no drop shadows, no decorative effects
- No star ratings anywhere in the app
- No review counts anywhere in the app
- No sponsored or promoted pins anywhere in the app

### Navigation structure

Four bottom tabs, always visible: Map · Saved · Creators · Profile. Map is the default entry point on every app open.

### Map behaviour

- Map fills the full screen edge to edge — no chrome above or below except the bottom nav
- Neighbourhood scope is always visible and is a deliberate user action to change — it does not auto-update as the user pans
- Available neighbourhood scopes at MVP launch: Indiranagar, Koramangala
- Pin clustering activates when zoom level shows more than 8 pins in close proximity

### Creator note treatment

The creator note is the centrepiece of every pin interaction. It is displayed in a slightly larger italic style, never buried below metadata. The creator's avatar and verification tier appear together immediately above it so the user knows who is speaking before they read what they say.

### Share card design

The share card must look intentional and editorial — not a screenshot. It should be visually distinct from Zomato and Google Maps share cards. Warm background, clean typography, creator attribution front and centre.

### Excluded from MVP UI

User reviews or comments, rating or scoring system, venue pages with aggregated data, booking or reservation flows, following other users (only creators), push notifications, any sponsored or promoted placement, community tier creator submissions.

---

## 8. Data Model

### Core entities

**USER**
- `id` uuid PK
- `display_name` string
- `avatar_url` string
- `auth_provider` string — google | apple
- `provider_uid` string
- `created_at` timestamp

**CREATOR** — every creator is also a user
- `id` uuid PK
- `user_id` uuid FK → USER
- `platform` string — instagram | twitter
- `handle` string
- `follower_count` integer
- `tier` string — verified | trusted_local | community
- `verified` boolean
- `verified_at` timestamp
- `bio` string
- `focus_description` string

**PLACE**
- `id` uuid PK
- `name` string
- `category` string — cafe | diner | store | experience
- `lat` float
- `lng` float
- `neighbourhood` string
- `city` string
- `google_place_id` string — used to pull address, hours, photos from Google Places API
- `created_at` timestamp

**PIN** — the core entity; junction between creator and place
- `id` uuid PK
- `creator_id` uuid FK → CREATOR
- `place_id` uuid FK → PLACE
- `note` string — 160 char max
- `photo_url` string
- `source_post_url` string — original Instagram or Twitter post if submitted via tagging
- `status` string — pending | approved | rejected
- `pinned_at` timestamp

**FOLLOW**
- `id` uuid PK
- `user_id` uuid FK → USER
- `creator_id` uuid FK → CREATOR
- `followed_at` timestamp

**SAVED_PLACE**
- `id` uuid PK
- `user_id` uuid FK → USER
- `pin_id` uuid FK → PIN
- `saved_at` timestamp

**SUBMISSION** — inbound pipeline before becoming a PIN
- `id` uuid PK
- `creator_id` uuid FK → CREATOR
- `place_id` uuid FK → PLACE
- `post_url` string
- `platform` string
- `status` string — pending | approved | rejected
- `submitted_at` timestamp

### Key design decisions

- `SUBMISSION` is intentionally separate from `PIN` — not every submission becomes a pin. This is the quality gate.
- `google_place_id` on `PLACE` lets the app pull structured metadata (address, opening hours, photos) from Google Places without maintaining it manually.
- Row Level Security (RLS) on all tables from day one — users can only read approved pins, creators can only edit their own pins, submissions are visible only to the submitting creator and admin.

---

## 9. Tech Stack

### Decision summary

| Layer | Choice | Rationale |
|---|---|---|
| Mobile framework | React Native with Expo | Single codebase for iOS and Android. Largest ecosystem for maps, OAuth, deep links, share sheets. Stays in TypeScript alongside Supabase. |
| Map library | Mapbox via `@rnmapbox/maps` | Full visual control over pin styling, clustering, and dark editorial aesthetic. Better pricing than Google Maps at early scale. |
| Backend | Supabase | Postgres database, auth, real-time, file storage, and edge functions in one platform. Free tier covers MVP scale. No separate server needed. |
| Auth | Supabase Auth | Google and Apple sign-in built in. Instagram and Twitter OAuth handled via custom Supabase edge function. |
| Database | Postgres via Supabase | Relational model suits the data. Row Level Security handles authorisation at database level. |
| File storage | Supabase Storage | Pin photos and share card images. Built-in CDN. No separate service needed. |
| Edge functions | Supabase Edge Functions (Deno) | Follower count checks on OAuth, Twitter webhook handling, share card image generation. |
| Navigation | Expo Router | File-based routing. Stable as of 2025. Handles deep links cleanly. |
| State management | Zustand | Lightweight. Simpler than Redux for a solo developer. Sufficient for MVP complexity. |
| Language | TypeScript | Type safety across the full stack — app and Supabase client share types. |

### Why not the alternatives

**Flutter** — strong framework but the Mapbox Flutter SDK is less mature than the React Native equivalent. Dart is an additional language to maintain solo. Revisit if a Flutter-experienced developer joins.

**Kotlin / Swift native** — Android-only for Kotlin, requires two codebases. No hardware or performance requirements justify going native at MVP stage. Revisit at scale.

**Ionic** — map performance inside a WebView is noticeably worse than a native renderer. The core interaction in AroundMe (map drag, pin tap, bottom sheet swipe) is exactly where WebView performance degrades.

### Expo setup specifics

- Start with Expo managed workflow — handles builds, OTA updates, and device APIs without Xcode or Android Studio locally
- Use EAS Build for cloud builds — produces `.ipa` and `.apk` without local native toolchains
- Eject to bare workflow only if a native module requirement appears that Expo cannot handle — unlikely for MVP scope

### Supabase RLS policy principles

- Users can read all approved pins regardless of follow status
- Users can only read their own saved places and follow relationships
- Creators can create and update their own pins only
- Creators can create submissions — cannot approve or reject
- Admin role can read and update all submissions and pins
- All policies set from day one — retrofitting RLS is significantly harder than setting it up correctly initially

---

## 10. Services & Infrastructure

### Required services

| Service | Tier | Monthly cost | Purpose |
|---|---|---|---|
| Supabase | Free | ₹0 | Database, auth, storage, edge functions, real-time |
| Expo EAS | Free | ₹0 | Cloud builds, OTA updates |
| Mapbox | Free (50k loads/month) | ₹0 | Map rendering |
| Apple Developer Program | Paid | ~₹700 (amortised) | iOS distribution — mandatory |
| Google Play Developer | One-time | ₹2,100 once | Android distribution — mandatory |

**Total recurring cost at MVP: ~₹700/month.**

### Services explicitly not needed at MVP

- No VPS or separate server — Supabase edge functions handle all backend logic
- No Redis or caching layer — Supabase Postgres with correct indexes handles MVP query patterns
- No separate CDN — Supabase Storage has a built-in CDN
- No analytics platform — instrument the core visit metric manually first
- No push notification service — post-MVP
- No separate error monitoring — Expo and Supabase dashboards are sufficient initially

### Scaling triggers

The free tier Supabase plan supports 50,000 monthly active users and 500MB database. Upgrade to the Pro plan (approximately $25/month) when approaching 40,000 MAU or 400MB database usage. Mapbox free tier covers 50,000 map loads per month — upgrade pricing is usage-based and modest at early scale.

---

## 11. Business Model

### Principles

Trust and monetisation are in tension. Every dollar earned from a venue risks corrupting the signal that users came for. The model is structured to protect signal quality at the expense of short-term revenue.

### Layer 1 — Consumer free tier (always)

The map, discovery, and following creators is always free and always unsponsored. This is non-negotiable — it protects the trust layer that makes the product valuable.

### Layer 2 — Premium subscription (post-MVP)

Target price: ₹199–399/month. Unlocks offline maps, curated editorial collections ("Best solo café in Indiranagar"), trip planning mode, and personalised feeds weighted by creator category preference. No ads, no sponsored pins in this tier either.

### Layer 3 — Creator revenue share (post-MVP)

Creators bring the audience that drives premium subscription uptake. Give verified creators a revenue share on premium subscriptions attributed to their followers. Aligns creator incentive with quality of recommendations rather than volume of pins.

### Layer 4 — Venue analytics B2B (post-MVP)

Sell anonymised foot-traffic and sentiment data to venues and brands. Not pay-to-be-listed — pay-to-understand-your-customers. This is the clean version of venue monetisation.

### What is permanently excluded

Sponsored pins, pay-to-rank placement, affiliate commissions per visit. All three corrupt the trust signal that is the product's core value.

---

## 12. Launch Strategy

### Phase 1 — Seed (pre-launch)

Manually seed 60–80 high-quality pins across Indiranagar and Koramangala before the app is publicly available. Identify 8–12 Bengaluru food and lifestyle creators with genuine local credibility in the 5k–80k follower range. Invite them to create accounts and pin their existing recommendations. The app should feel meaningfully populated on day one — a sparse map at launch kills the product.

### Phase 2 — Soft launch (Bengaluru only)

Release to TestFlight and Google Play internal testing. Share with a closed group of 100–200 Bengaluru early adopters. Measure: do users open the map and tap at least one pin in their first session? Do users visit a pinned place within 2 weeks of saving it?

### Phase 3 — Public launch

App Store and Google Play public release. Creators share their AroundMe profiles with their existing audiences on Instagram and Twitter. Each share card that goes out on Instagram Stories is an acquisition surface — the deep link brings new users directly into the pinned place.

### Phase 4 — Expand

Once pin density and visit behaviour metrics are healthy in Indiranagar and Koramangala, expand neighbourhood scope to HSR Layout, then Jayanagar, then Whitefield. Add new creator categories as pin volume grows. Mumbai is the first city expansion — similar creator density and demographic profile to Bengaluru.

---

## 13. Success Metrics

### Core metric — visit rate

**Do users visit pinned places?**

This is the single metric that validates the product. Target: 30% of users who save a pin visit the place within 14 days. If this is true, the app is doing something no existing product does.

### Supporting metrics

| Metric | Target at 90 days post-launch |
|---|---|
| Weekly active users | 500 |
| Pins on map | 150 |
| Verified creators | 15 |
| Average pins per active user session | 3 |
| Follow rate (users who follow at least 1 creator) | 60% |
| Share card opens | 200/month |
| New user installs from share cards | 50/month |

### Anti-metrics — what we explicitly do not optimise for

- Total pins — quality over quantity
- Session length — we want users to find something and go there, not scroll endlessly
- Daily active users — weekly active is a healthier signal for a discovery app

---

## 14. Out of Scope — MVP

The following are explicitly excluded from the MVP and will be re-evaluated post-launch based on user behaviour data.

| Feature | Reason excluded |
|---|---|
| User reviews or comments | Adds noise, contradicts the curator-only model |
| Star ratings | Core brand decision — permanently excluded |
| Booking or reservations | Scope and third-party integration complexity |
| Push notifications | Not needed until retention problem is confirmed |
| Social graph between users | Post-MVP — validate creator-follower loop first |
| Instagram mention auto-detection | Requires Meta Advanced Access API approval — apply post-launch |
| Community tier creator submissions | Quality control risk without sufficient moderation tooling |
| Multiple cities | Density in one city first |
| Web app | Mobile-only for MVP — validate before expanding surface area |
| Venue owner accounts | Post-MVP — risk of compromising editorial integrity |
| In-app messaging | Out of product scope |
| Analytics dashboard for creators | Post-MVP — ship once creators are active |

---

## 15. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Creator quality degrades over time as sponsored recommendations enter | High | High | Public disclosure policy. Community flagging post-MVP. Audit verified accounts periodically. |
| Instagram API restrictions prevent mention auto-detection | High | Medium | Start with manual link submission in MVP. Apply for Meta Advanced Access early. Twitter/X API is more permissive. |
| Cold start — insufficient pins at launch kills initial experience | High | High | Manually seed 60–80 pins before launch. Invite creators before app goes public. Do not launch until minimum density is met. |
| Solo developer bottleneck — feature velocity is low | Medium | Medium | Ruthless MVP scope discipline. Supabase removes backend maintenance overhead. Expo OTA updates reduce release friction. |
| Mapbox pricing at scale | Low | Medium | Free tier covers 50k map loads/month. Pricing beyond that is usage-based and manageable until Series A scale. |
| Creator platform (Instagram/Twitter) API changes | Medium | Medium | No core feature depends on real-time API access in MVP. OAuth is stable. Full API dependency is post-MVP only. |
| User confusion between AroundMe and Google Maps | Low | Low | Clear positioning in onboarding — "recommendations from people you follow, not strangers." |

---

*AroundMe — Product Requirements Document v1.0*
*Bengaluru, India · May 2026*