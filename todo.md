# MathVision — Project TODO

## Backend Setup
- [x] Create backend folder structure (src/index.ts, src/routes/solve.ts)
- [x] Set up Express server with CORS and TypeScript
- [x] Implement GET /api/health endpoint
- [x] Implement POST /api/solve endpoint with equation type detection
- [x] Add support for Algebraic equations (3 steps)
- [x] Add support for Integral equations (4 steps)
- [x] Add support for Differential equations (4 steps)
- [x] Add support for Trigonometric equations (4 steps)
- [ ] Test backend endpoints with sample equations

## Frontend Setup
- [ ] Update theme colors in theme.config.js to match MathVision palette
- [ ] Update app.config.ts with app name and branding
- [ ] Generate custom app logo and update assets
- [x] Install Supabase dependencies (@supabase/supabase-js)
- [x] Install Zustand for state management

## Frontend Components & Utilities
- [x] Create constants/colors.ts with MathVision color palette
- [x] Create lib/supabase.ts with Supabase client initialization
- [x] Create stores/authStore.ts (Zustand store for user and session)
- [x] Create stores/equationStore.ts (Zustand store for equation data)
- [x] Create components/GradientButton.tsx (reusable gradient button)
- [x] Create components/GlassCard.tsx (reusable glass-morphism card)

## Frontend Screens
- [x] Implement Splash screen (app/index.tsx) with 2-second delay and session check
- [x] Implement Login screen (app/(auth)/login.tsx) with email/password form
- [x] Implement Signup screen (app/(auth)/signup.tsx) with full name, email, password
- [x] Implement Home screen (app/(main)/home.tsx) with greeting, input, and chips
- [x] Implement Processing screen (app/(main)/processing.tsx) with animated timeline
- [x] Implement Result screen (app/(main)/result.tsx) with solution display
- [x] Implement Explainer screen (app/(main)/explainer.tsx) with step navigation

## Frontend Navigation & Auth
- [x] Set up Expo Router file structure for auth and main screens
- [x] Implement root layout with Supabase session listener
- [x] Implement auth flow (redirect to login if no session)
- [x] Implement logout functionality
- [ ] Test session persistence on app restart

## Frontend Features
- [x] Implement equation input with placeholder text
- [x] Implement quick equation chips (4 samples)
- [x] Implement Solve button with API call to /api/solve
- [x] Implement Processing timeline animation (5 steps, 800ms apart)
- [x] Implement Result screen with type and solver badges
- [x] Implement Explainer screen with step navigation (Prev/Next)
- [ ] Implement smooth slide animation between steps
- [x] Add success message on last step

## Testing & Validation
- [x] Test backend health endpoint
- [x] Test backend solve endpoint with all 4 equation types
- [ ] Test Supabase authentication (login, signup, session)
- [ ] Test full user flow: Splash → Login → Home → Solve → Result → Explainer
- [ ] Test logout and return to login
- [ ] Verify all screens follow design specifications
- [ ] Test on iOS and Android (Expo Go)
- [ ] Verify no console errors

## Polish & Delivery
- [x] Ensure all screens have correct colors and styling
- [ ] Add haptic feedback to buttons
- [ ] Verify responsive layout on different screen sizes
- [ ] Create initial checkpoint
- [ ] Deliver project to user

## Bug Fixes
- [x] Fix Processing screen: Animated.Value cannot be initialized in useState on web platform
