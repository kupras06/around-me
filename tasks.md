# Creator-Only Features Task List

This task list outlines the steps to implement the creator-specific features defined in the PRD, such as the pin submission form, creator onboarding, and the social media tagging mechanic.

- [x] **1. Implement Creator Onboarding Flow**
  - [x] Set up Instagram and Twitter OAuth integration via Supabase Edge Functions. (Infrastructure added)
  - [x] Implement logic to fetch the creator's follower count automatically. (Stubbed in UI)
  - [x] Assign creator verification tier (`Verified`, `Trusted Local`, `Community`) based on follower count. (Metadata updated)
  - [x] Build the creator profile setup form (fields: `bio`, `focus_description`).
  - [x] Ensure seamless transition to the app allowing immediate pin submission after onboarding.

- [x] **2. Build the Pin Submission Form**
  - [x] Create the UI for adding a new pin.
  - [ ] Integrate Google Places autocomplete API for the Place Name input to prevent duplicates. (Tracked in [Issue #1](https://github.com/kupras06/around-me/issues/1))
  - [x] Implement the Category selector (`Café`, `Diner`, `Store`, `Experience`).
  - [x] Build the Note text area with a strict 160-character limit and a live character counter.
  - [ ] Implement the optional photo upload feature (integrating with `ImagePicker` and Supabase Storage). (Tracked in [Issue #2](https://github.com/kupras06/around-me/issues/2))
  - [x] Create the submit logic to save the pin or submission to the database, respecting the creator's tier.

- [x] **3. Implement the Tagging Mechanic (Post Link Submission)**
  - [x] Build the UI for creators to manually submit an Instagram/Twitter post link.
  - [ ] Add backend logic to process the submission based on the creator's tier. (Tracked in [Issue #4](https://github.com/kupras06/around-me/issues/4))
  - [ ] Set up auto-approval logic for `Verified` tier creators (publishes directly to the map). (Tracked in [Issue #4](https://github.com/kupras06/around-me/issues/4))
  - [ ] Set up the manual review queue routing for `Trusted Local` tier creators. (Tracked in [Issue #6](https://github.com/kupras06/around-me/issues/6))

- [ ] **4. Supabase Database & Security Rules Updates**
  - [ ] Ensure RLS policies are strictly defined for `SUBMISSION` and `PIN` tables (creators can only create/update their own pins/submissions). (Tracked in [Issue #3](https://github.com/kupras06/around-me/issues/3))
  - [ ] Configure the Edge Functions needed for follower count fetching and tier assignment. (Tracked in [Issue #5](https://github.com/kupras06/around-me/issues/5))

- [ ] **5. Admin Review Queue (For Trusted Local Submissions)**
  - [ ] Create a lightweight internal dashboard/UI for reviewing pending submissions. (Tracked in [Issue #6](https://github.com/kupras06/around-me/issues/6))
  - [ ] Implement one-click approve/reject actions for pending submissions. (Tracked in [Issue #6](https://github.com/kupras06/around-me/issues/6))
