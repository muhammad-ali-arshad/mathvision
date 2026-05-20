# MathVision Mobile App — Design Document

## Overview

MathVision is a premium AI Math Tutor mobile app built with Expo and React Native. The design prioritizes dark mode elegance, intuitive navigation, and a polished user experience across iOS and Android.

**Design Principles:**
- Dark theme (#0A0A1A background) with purple-to-blue gradient accents
- Premium feel with glass-morphism cards and soft shadows
- One-handed usage optimized for mobile portrait (9:16)
- Apple HIG-aligned interactions and feedback

---

## Screen List

1. **Splash** — App launch screen with loading indicator
2. **Login** — User authentication (email/password)
3. **Signup** — New account creation
4. **Home** — Main screen with equation input and quick chips
5. **Processing** — Animated solving timeline
6. **Result** — Solution display with type and answer badges
7. **Explainer** — Step-by-step solution walkthrough

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Background | #0A0A1A | Screen backgrounds (all screens) |
| Card | #12122A | Card/surface backgrounds |
| Border | rgba(108, 99, 255, 0.3) | Card borders, input focus glow |
| Gradient Start | #6C63FF | Primary gradient (buttons, accents) |
| Gradient End | #3B82F6 | Secondary gradient (buttons, accents) |
| Accent | #A78BFA | Highlight text, secondary accent |
| Text | #FFFFFF | Primary text |
| Subtext | #9CA3AF | Secondary text, labels |
| Success | #34D399 | Success states, checkmarks |
| Error | #F87171 | Error messages, warnings |

---

## Screen Specifications

### 1. Splash Screen (`app/index.tsx`)

**Layout:**
- Full #0A0A1A background
- Centered content

**Elements:**
- "MathVision" — 44px, bold white with purple text-shadow glow
- "Your AI Math Tutor" — 16px, accent purple (#A78BFA)
- Purple spinning ring (60px, pulsing ActivityIndicator or custom animated ring)

**Behavior:**
- Display for 2 seconds
- Check Supabase session
- Route to Login (no session) or Home (session exists)

---

### 2. Login Screen (`app/(auth)/login.tsx`)

**Layout:**
- Full dark screen, top-to-bottom structure

**Sections:**

**Top (30% of screen):**
- "MathVision" — Large bold white, gradient text or accent purple
- "Solve. Learn. Understand." — 16px grey subtext

**Middle (GlassCard):**
- "Welcome Back" — 24px bold white
- Email input — dark bg, white text, purple border glow on focus, borderRadius: 12
- Password input — same style + eye icon toggle (Ionicons eye/eye-off)
- "Sign In" GradientButton — full width, 52px tall
- Error text — red (#F87171), hidden unless error occurs

**Bottom:**
- "Don't have an account?" grey + "Sign Up" in accent purple (tappable)

**Behavior:**
- Call `supabase.auth.signInWithPassword({ email, password })`
- Show spinner on button while loading
- Display error message on failure
- Navigate to `/(main)/home` on success

---

### 3. Signup Screen (`app/(auth)/signup.tsx`)

**Layout:**
- Same as Login, with expanded form

**GlassCard Contents:**
- "Create Account" — 24px bold white
- Full Name input
- Email input
- Password input
- Confirm Password input
- "Create Account" GradientButton — full width
- Inline red error if passwords don't match

**Behavior:**
- Call `supabase.auth.signUp({ email, password, options: { data: { full_name } } })`
- Show spinner while loading
- On success: replace card with green success message — "✅ Check your email to confirm your account"

**Bottom:**
- "Already have an account?" + "Sign In" link in accent purple

---

### 4. Home Screen (`app/(main)/home.tsx`)

**Layout:**
- Top bar with greeting and avatar
- Input card for equation entry
- Quick equation chips
- Logout link at bottom

**Top Bar:**
- Left: "Hi, [Name] 👋" — 24px bold white (from `user.user_metadata.full_name`)
- Right: Avatar circle — 40px, purple→blue gradient, white initials, bold

**Input Card (GlassCard):**
- TextInput — large, monospace font, white text, placeholder "Enter your equation…"
- "Solve" GradientButton — full width, below input

**Chips Row (horizontal ScrollView, no scrollbar):**
- 4 quick-access equation pills:
  - `x² − 5x + 6 = 0` (Algebraic)
  - `∫ x² dx` (Integral)
  - `sin²(x) + cos²(x)` (Trigonometric)
  - `dy/dx + y = eˣ` (Differential)
- Style: purple border, dark bg, white text, borderRadius: 20, paddingHorizontal: 14
- Tapping fills the input field

**Bottom:**
- "Logout" link — small grey text, calls `supabase.auth.signOut()` → clears store → navigates to login

---

### 5. Processing Screen (`app/(main)/processing.tsx`)

**Layout:**
- Full dark screen, all content centered

**Top Section:**
- "Solving…" — 22px bold white
- The equation — 16px accent purple, monospace

**Animated Timeline (vertical, 5 steps):**
- ○ Parsing equation
- ○ Detecting type
- ○ Solving symbolically
- ○ Generating steps
- ○ Formatting result

**Step States:**
- Waiting: grey empty circle
- Active: pulsing purple filled circle (use `Animated.loop` scale pulse)
- Done: green filled circle with white ✓

**Behavior:**
- Steps activate one by one, 800ms apart
- After all 5 complete:
  - Call `POST /api/solve` with equation
  - Save response to `equationStore`
  - Navigate to Result screen

---

### 6. Result Screen (`app/(main)/result.tsx`)

**Layout:**
- Vertical stack, centered content

**Elements:**
- "✓ Solution Found" — green, bold, 24px
- GlassCard: equation — monospace, centered, white
- Two small badges side by side: type (purple bg) + solver (blue bg)
- GlassCard: answer — 28px bold white monospace, centered
- "View Steps →" GradientButton — navigates to Explainer

---

### 7. Explainer Screen (`app/(main)/explainer.tsx`)

**Layout:**
- Top progress indicator
- Step content cards
- Navigation buttons at bottom

**Top:**
- "Step 2 of 3" — bold white + purple progress bar below

**Content Cards:**
- GlassCard: math expression — large, monospace, centered, white
- GlassCard: explanation — grey italic text

**Navigation:**
- Step slides left/right with smooth animation
- Bottom row:
  - "← Prev" — outlined grey button (dimmed + disabled on step 1)
  - "Next →" — GradientButton (hidden on last step)
- On last step: show "✅ Complete!" in green below buttons

---

## Component Specifications

### GradientButton

**Props:**
- `label` (string) — Button text
- `onPress` (function) — Press handler
- `loading?` (boolean) — Shows spinner when true

**Style:**
- Background: expo-linear-gradient (#6C63FF → #3B82F6)
- Text: white, bold
- Border radius: 14px
- Height: 52px (default)
- Full width by default

### GlassCard

**Props:**
- `children` (ReactNode) — Card content

**Style:**
- Background: #12122A
- Border: 1px rgba(108, 99, 255, 0.3)
- Border radius: 20px
- Soft purple shadow (elevation/shadowOpacity)
- Padding: 20–24px

---

## User Flows

### Authentication Flow
1. App launches → Splash (2 seconds)
2. Check session
3. No session → Login
4. Login → Home (on success)
5. Signup → Email confirmation → Login → Home

### Solving Flow
1. Home → Enter equation or tap chip
2. Press "Solve" → Processing screen
3. Timeline animates (5 steps, 800ms apart)
4. API call completes → Result screen
5. Tap "View Steps" → Explainer screen
6. Navigate through steps with Prev/Next
7. Last step → "✅ Complete!" message

### Logout Flow
1. Home → Tap "Logout"
2. Clear auth store
3. Clear equation store
4. Navigate to Login

---

## Design Rules (Strict)

- **Background:** #0A0A1A on every screen, no exceptions
- **Cards:** #12122A, purple-tinted border, borderRadius: 20, soft purple shadow
- **Buttons:** expo-linear-gradient (#6C63FF → #3B82F6), white bold text, borderRadius: 14
- **Inputs:** dark bg, white text, purple glow on focus, borderRadius: 12
- **Icons:** @expo/vector-icons Ionicons for all icons
- **Padding:** Generous 20–24px throughout
- **Text:** Use monospace for equations, default for UI text
- **Colors:** Strictly follow the palette above; no deviations

---

## Accessibility & Interaction

- All buttons have clear press feedback (scale, opacity, or haptic)
- Error messages displayed in red (#F87171)
- Success states in green (#34D399)
- Loading states show spinner on buttons or timeline
- Tab bar navigation (if applicable) uses Ionicons
- SafeArea handled by ScreenContainer component
