# Creator-Only Features Task List

This task list outlines the steps to implement the creator-specific features defined in the PRD, such as the pin submission form, creator onboarding, and the social media tagging mechanic.

- [ ] **1. Implement Creator Onboarding Flow**
  - [ ] Set up Instagram and Twitter OAuth integration via Supabase Edge Functions.
  - [ ] Implement logic to fetch the creator's follower count automatically.
  - [ ] Assign creator verification tier (`Verified`, `Trusted Local`, `Community`) based on follower count.
  - [ ] Build the creator profile setup form (fields: `bio`, `focus_description`).
  - [ ] Ensure seamless transition to the app allowing immediate pin submission after onboarding.

- [ ] **2. Build the Pin Submission Form**
  - [ ] Create the UI for adding a new pin.
  - [ ] Integrate Google Places autocomplete API for the Place Name input to prevent duplicates.
  - [ ] Implement the Category selector (`Café`, `Diner`, `Store`, `Experience`).
  - [ ] Build the Note text area with a strict 160-character limit and a live character counter.
  - [ ] Implement the optional photo upload feature (integrating with `ImagePicker` and Supabase Storage).
  - [ ] Create the submit logic to save the pin or submission to the database, respecting the creator's tier.

- [ ] **3. Implement the Tagging Mechanic (Post Link Submission)**
  - [ ] Build the UI for creators to manually submit an Instagram/Twitter post link.
  - [ ] Add backend logic to process the submission based on the creator's tier.
  - [ ] Set up auto-approval logic for `Verified` tier creators (publishes directly to the map).
  - [ ] Set up the manual review queue routing for `Trusted Local` tier creators.

- [ ] **4. Supabase Database & Security Rules Updates**
  - [ ] Ensure RLS policies are strictly defined for `SUBMISSION` and `PIN` tables (creators can only create/update their own pins/submissions).
  - [ ] Configure the Edge Functions needed for follower count fetching and tier assignment.

- [ ] **5. Admin Review Queue (For Trusted Local Submissions)**
  - [ ] Create a lightweight internal dashboard/UI for reviewing pending submissions.
  - [ ] Implement one-click approve/reject actions for pending submissions.
