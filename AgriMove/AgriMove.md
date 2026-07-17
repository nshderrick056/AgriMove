# AgriMove — Website Template Prompt Script
# Source: Gatete_Derrick_Assignment2_06.27.2026.md
# Prepared for: Developer / AI Code Generator handoff

---

## OVERVIEW

Build a fully responsive, multi-page web application called **AgriMove** — an agricultural logistics management platform connecting small-scale farmers, transport drivers, and buyers across East Africa (Rwanda, Uganda, Kenya). The platform reduces post-harvest losses by digitising delivery booking, GPS tracking, and logistics communication.

---

## COLOR PALETTE (strict — use these only)

| Name         | Hex       | Usage                                                       |
|--------------|-----------|-------------------------------------------------------------|
| Primary      | `#72BF78` | Primary buttons, navbar active state, hero background, icons|
| Secondary    | `#A0D683` | Hover states, sidebar backgrounds, badges, section accents  |
| Light accent | `#D3EE98` | Card backgrounds, map preview fills, status chips, dividers |
| Highlight    | `#FEFF9F` | CTA highlight buttons, alert banners, pending status pills  |
| Dark green   | `#2a5c2e` | Footer background, navbar (dark variant), admin dashboard   |
| Text on dark | `#ffffff` | All text on green/dark backgrounds                          |
| Deep green   | `#3a7a3e` | Text on light green backgrounds, logo text, link hovers     |

Do NOT use any colors outside this palette except for:
- `#ffffff` (white) for card and page backgrounds
- Standard gray scale (`#f8f8f8`, `#e0e0e0`, `#666`, `#333`) for neutral UI elements
- `#2e7d32` for delivered/success semantic states only

---

## TYPOGRAPHY

- Font family: `Inter`, `Segoe UI`, or `system-ui` (sans-serif fallback)
- Base size: 16px, line-height 1.7
- Headings: font-weight 500 (not bold/700 — keep it clean)
- Sentence case everywhere — no ALL CAPS, no Title Case on buttons
- Multilingual support: English (primary), Kinyarwanda, Swahili (toggle in footer/nav)

---

## GLOBAL LAYOUT RULES

- Max content width: 1200px, centered
- Responsive breakpoints: 320px (mobile), 768px (tablet), 1024px+ (desktop)
- Border radius: 8px for buttons/inputs, 12px for cards, 16px for hero cards
- All borders: 0.5px or 1px — never thick/decorative
- No gradients except the hero section (subtle green gradient only)
- No box shadows except hero card (soft, `0 8px 32px rgba(0,0,0,0.10)`)
- Icon library: Tabler Icons (outline variant only)

---

## PAGE STRUCTURE

The website has the following pages / views:

1. Landing Page (public)
2. Login / Register Page (public)
3. Farmer Dashboard (authenticated)
4. Driver Dashboard (authenticated)
5. Buyer Dashboard (authenticated)
6. Admin Dashboard (authenticated)

---

## PAGE 1 — LANDING PAGE

### 1.1 Navigation Bar
- Background: `#ffffff`, bottom border: `1px solid #D3EE98`
- Left: Logo (tractor icon from Tabler + "AgriMove" in `#3a7a3e`, font-weight 500)
  - Logo icon: 32×32px box, background `#72BF78`, border-radius 8px, white icon inside
- Centre: Nav links — "How it works", "For farmers", "For drivers", "For buyers", "Pricing"
  - Link color: `#666`, hover: `#3a7a3e`
- Right: "Log in" (outline button, border `#72BF78`, text `#3a7a3e`) + "Get started" (solid button, bg `#72BF78`, text white)
- Mobile: Hamburger menu collapsing all nav links into a drawer

### 1.2 Hero Section
- Background: gradient from `#3a7a3e` → `#72BF78` → `#A0D683` (left to right, 135deg)
- Two-column layout (text left, UI card right). Stacks to single column on mobile.

**Left — Hero text:**
- Badge pill (rounded): icon + "East Africa · Rwanda · Uganda · Kenya" — bg `rgba(255,255,255,0.2)`, text white, font-size 12px
- H1: "Move your harvest. Connect your market." — white, 36px, font-weight 500
- Paragraph: mission summary (2–3 lines) — white at 88% opacity
- Two CTA buttons:
  - Primary: "Start for free →" — bg `#FEFF9F`, text `#3a7a3e`, font-weight 500
  - Ghost: "Watch how it works" — transparent bg, white text, white border at 60% opacity

**Right — Live Tracker UI card:**
- White card, border-radius 16px, soft shadow
- Header row: map icon + "Live delivery tracker" label + green "● Live" pill (bg `#D3EE98`, text `#3a7a3e`)
- Map preview box: bg `#D3EE98`, height 120px, border-radius 10px
  - Show two dots (pickup = `#72BF78`, destination = `#3a7a3e`) connected by a dashed SVG path
  - A third dot (driver position) in `#FEFF9F` along the path
- Below map: 3 delivery rows (ID + cargo + status pill each)
  - Status pills: "En route" = `#D3EE98` bg / `#3a7a3e` text | "Delivered" = light green | "Pending" = `#FEFF9F` bg / dark yellow text
- Stats strip (3 equal columns): Active deliveries / On-time rate / Drivers online
  - Each stat: bg `#D3EE98`, border-radius 8px, large number in `#3a7a3e`

### 1.3 Features Section
- White background, padding 3rem
- Section title (centered): "Everything your logistics needs"
- Subtitle (centered, muted): "Built specifically for agricultural transport in East Africa"
- 4-column card grid (2×2 on tablet, 1 column on mobile)

**Feature cards** (white bg, 0.5px border `#D3EE98`, border-radius 12px, padding 1.25rem):
1. Icon bg `#D3EE98` — **Real-time GPS tracking**: Track every delivery live. Farmers and buyers see driver location and ETA.
2. Icon bg `#FEFF9F` — **Delivery scheduling**: Book transport days ahead with automated driver assignment.
3. Icon bg `#A0D683` — **SMS notifications**: Stay informed via SMS on low-bandwidth 2G networks. No data required.
4. Icon bg `#72BF78` (icon white) — **Reports & analytics**: Admins track delivery history, route efficiency, and cargo loss stats.

### 1.4 User Roles Section
- Background: `#D3EE98`
- Title: "Built for every role in the chain"
- Subtitle: "Each user gets a tailored experience — simple enough for any literacy level"
- 4-column card grid (white cards, subtle green border)

**Role cards:**

| Role    | Avatar bg | Icon            | Key capabilities (list 4) |
|---------|-----------|-----------------|---------------------------|
| Farmer  | `#A0D683` | ti-plant        | Create requests · Track shipments · Receive SMS · View history |
| Driver  | `#72BF78` | ti-truck (white)| View nearby jobs · Accept/reject · GPS guidance · Update status |
| Buyer   | `#FEFF9F` | ti-shopping-cart| Track incoming · Arrival alerts · Confirm receipt · Transaction history |
| Admin   | `#3a7a3e` | ti-settings (`#D3EE98`) | Manage users · Monitor deliveries · Generate reports · Handle complaints |

Capabilities listed as a checkmark (`✓`) list in `#3a7a3e`, font-size 11px.

### 1.5 Dashboard Preview Section
- Background: light gray (`#f8fdf8`)
- Title: "A dashboard for every stakeholder"
- Subtitle: "Clean, responsive interfaces for desktop and mobile"
- Show a realistic browser-frame dashboard mockup:
  - Dark green (`#3a7a3e`) top nav bar with logo, role tabs (Farmer / Driver / Buyer / Admin), user icon
  - Left sidebar: `#f8fdf8` bg, border-right `#D3EE98`
    - Sidebar items: Dashboard (active — bg `#D3EE98`, text `#3a7a3e`) · My deliveries · Track shipment · Notifications · History · Settings
  - Main area: 3 metric cards + recent deliveries table
    - Metric cards: "Active deliveries", "Deliveries this month", "Estimated savings"
    - Table columns: ID · Cargo · Destination · Driver · Status

### 1.6 CTA Section
- Background: `#72BF78`
- H2: "Ready to reduce your post-harvest losses?" — white, 28px
- Paragraph: "Join farmers, drivers, and buyers across East Africa already using AgriMove." — white, 85% opacity
- Two buttons: "Create your account →" (bg `#FEFF9F`, text `#3a7a3e`) + "Talk to our team" (ghost, white border)

### 1.7 Footer
- Background: `#2a5c2e`
- 4-column grid: Brand column (logo + one-line description) + Platform links + Company links + Support links
- All link text: `rgba(255,255,255,0.55)`, hover: `#A0D683`
- Column headings: `#D3EE98`, 11px uppercase, letter-spacing 0.05em
- Footer bottom bar: `#1e4422` — copyright left, language selector right

---

## PAGE 2 — LOGIN / REGISTER

- Centered card layout (max-width 420px), white card, border-radius 16px, soft shadow
- Logo + "AgriMove" at top center
- Toggle tabs: "Log in" | "Sign up" — active tab underlined in `#72BF78`

**Log in form:**
- Email or phone number input
- Password input (show/hide toggle)
- "Forgot password?" link — `#72BF78`
- Submit button: full-width, bg `#72BF78`, white text, "Log in"
- Divider: "or"
- "Don't have an account? Sign up" link

**Sign up form:**
- Full name input
- Email or phone number input
- Password input
- Role selector (dropdown): Farmer / Transporter / Buyer
- Submit button: "Create account"
- Terms of service note below (small, muted)

---

## PAGE 3 — FARMER DASHBOARD

### Layout
- Top navbar: `#3a7a3e` bg, white logo left, notification bell + user avatar right
- Left sidebar (collapsible on mobile): `#f8fdf8` bg, border-right `1px solid #D3EE98`
  - Items: Dashboard · My deliveries · New request · Track shipment · Notifications · History · Settings · Logout
  - Active state: bg `#D3EE98`, text `#3a7a3e`, font-weight 500
- Main content area: white, padding 1.5rem

### Main Content

**Greeting bar:** "Welcome back, [Name] · [Location]" — muted text, 13px

**Metric cards row (3 cards):**
- Active deliveries (count)
- Deliveries this month (count + % delta)
- Estimated savings (currency + description)
- Card style: bg `#f8fdf8`, border-radius 8px, label 11px muted above, value 20px `#3a7a3e`

**New delivery request button:** Prominent, full-width or top-right, bg `#72BF78`, white text, "＋ New request"

**Recent deliveries table:**
- Columns: Request ID · Cargo type · Weight · Pickup location · Destination · Assigned driver · Status · Actions
- Status pills: Pending (`#FEFF9F`/dark-yellow) · Assigned (`#A0D683`/`#3a7a3e`) · En route (`#D3EE98`/`#3a7a3e`) · Delivered (light green) · Cancelled (light red)
- Actions: View details · Cancel (only if Pending)

**Notifications panel (right sidebar or bottom section):**
- List of recent alerts (SMS sent, driver assigned, delivery confirmed)
- Each item: icon + message + timestamp

### New Delivery Request Modal/Page
Fields:
- Cargo type (text)
- Weight (kg)
- Pickup location (map pin selector or text input)
- Destination (map pin selector or text input)
- Preferred date + time picker
- Additional notes (optional textarea)
- Estimated cost (auto-calculated, display only)
- Submit: "Send request" (bg `#72BF78`)

---

## PAGE 4 — DRIVER DASHBOARD

### Layout
Same sidebar/navbar structure as Farmer dashboard.

### Special: Drive Mode
- Toggle button in top nav: "Drive Mode" — when ON, switches UI to large-button layout
- In Drive Mode:
  - Buttons minimum 56px height
  - Font-size minimum 18px
  - Map takes up 60% of screen
  - Only 2 actions visible: "Mark as picked up" | "Mark as delivered"

### Main Content

**Available requests list:**
- Each card: Pickup location → Destination · Cargo type · Weight · Estimated distance · Estimated pay
- Two action buttons per card: "Accept" (bg `#72BF78`) | "Reject" (outline, red border)

**Active delivery card (when en route):**
- Map embed (Google Maps, full-width)
- Cargo details row
- Status update buttons: "Picked up" → "En route" → "Delivered"
- Contact farmer button (phone icon)

**Earnings summary:**
- Weekly / monthly toggle
- Bar chart (green bars using `#72BF78` and `#A0D683`)

---

## PAGE 5 — BUYER DASHBOARD

### Layout
Same sidebar/navbar. Lighter overall — buyers mostly view, not act.

### Main Content

**Incoming deliveries panel:**
- Card per incoming delivery: Farmer name · Cargo · Quantity · Expected arrival · Driver · Status
- "Confirm delivery" button appears only when status = Delivered (bg `#72BF78`)
- "View on map" link (opens GPS tracker)

**Delivery history table:**
- Columns: Date · Cargo · Quantity · Farmer · Total cost · Status
- Filter by: date range, status, cargo type

**Notification preferences:**
- Toggle: Email alerts · SMS alerts
- Alert triggers: Dispatched · En route · 30 min from arrival · Delivered

---

## PAGE 6 — ADMIN DASHBOARD

### Layout
- Top nav: `#2a5c2e` (darker than regular nav for visual hierarchy)
- Sidebar includes additional items: Users · All deliveries · Reports · Complaints · System logs · Settings

### Main Content

**Overview metrics row (4 cards):**
- Total active users · Deliveries today · System uptime · Unresolved complaints
- Values in large font, `#3a7a3e`

**User management table:**
- Columns: Name · Role · Phone · Region · Status · Actions (Edit · Suspend · Delete)
- Filter by role: All · Farmer · Driver · Buyer

**Delivery monitoring table:**
- Columns: ID · Farmer · Driver · Cargo · Status · Last update · Actions
- Actions: View details · Reassign driver · Flag issue

**Reports panel:**
- Generate report button: date range picker + report type (Delivery summary / Route efficiency / User activity)
- Export as PDF or CSV
- Recent report history list

**Complaints / support panel:**
- List of open complaints with priority badge (High `#FEFF9F` / Medium `#D3EE98` / Resolved gray)
- Click to view thread and respond

---

## COMPONENT LIBRARY (reuse across all pages)

### Buttons
| Variant  | Bg        | Text      | Border         | Use case              |
|----------|-----------|-----------|----------------|-----------------------|
| Primary  | `#72BF78` | `#ffffff` | none           | Main CTA actions      |
| Outline  | transparent | `#3a7a3e` | `1.5px #72BF78` | Secondary actions    |
| Ghost    | transparent | `#3a7a3e` | `0.5px #A0D683` | Tertiary / table actions |
| Danger   | transparent | `#c62828` | `1px #c62828`  | Cancel / delete       |
| Highlight| `#FEFF9F` | `#3a7a3e` | none           | Hero CTA, key prompts |

All buttons: border-radius 8px, padding 8px 16px, font-size 13–14px, font-weight 500, sentence case.

### Status Pills
| Status     | Background | Text color |
|------------|------------|------------|
| Pending    | `#FEFF9F`  | `#7a7000`  |
| Assigned   | `#A0D683`  | `#2a5c2e`  |
| En route   | `#D3EE98`  | `#3a7a3e`  |
| Delivered  | `#e8f5e9`  | `#2e7d32`  |
| Cancelled  | `#fdecea`  | `#c62828`  |

Pills: border-radius 20px, padding 3px 10px, font-size 11px, font-weight 500.

### Form Inputs
- Border: `1px solid #D3EE98`
- Focus border: `1.5px solid #72BF78`
- Border-radius: 8px
- Height: 40px
- Label: 12px, `#666`, above input
- Error state: border `#c62828`, small red message below

### Cards
- Background: `#ffffff`
- Border: `0.5px solid #D3EE98`
- Border-radius: 12px
- Padding: 1rem 1.25rem
- No box-shadow (except hero card)

### Notification/Alert Banner
- Info: bg `#D3EE98`, left border `3px solid #72BF78`, text `#3a7a3e`
- Warning: bg `#FEFF9F`, left border `3px solid #d4ac00`, text `#5a4a00`
- Success: bg `#e8f5e9`, left border `3px solid #2e7d32`, text `#1b5e20`
- Error: bg `#fdecea`, left border `3px solid #c62828`, text `#7f0000`

---

## FUNCTIONAL REQUIREMENTS (UI must support these — from SRS)

- FR 1: User registration with role selection (Farmer / Driver / Buyer)
- FR 2: Login with email or phone + password, password recovery flow
- FR 3: Farmer creates delivery request (form with cargo, weight, pickup, destination, schedule)
- FR 3.2: Driver sees available requests list
- FR 3.3: Driver accepts/rejects requests
- FR 3.4: Cancel request (Farmer or Driver, Pending only)
- FR 4: Real-time GPS tracking view (Google Maps embed)
- FR 4.2: Driver updates delivery status (Pending → Picked up → En route → Delivered)
- FR 4.3: Buyer confirms delivery
- FR 5: Notifications panel (SMS sent events + email events visible in UI)
- FR 6: Admin generates and exports delivery reports
- FR 6.2: All users can view past delivery history
- FR 7: Admin manages users and monitors system

---

## NON-FUNCTIONAL REQUIREMENTS (affect UI/UX design)

- NFR 3: Pages load within 3 seconds — no heavy animations, lazy-load images
- NFR 5: Interface simple enough for users with basic smartphone skills — use icons + labels, avoid jargon
- NFR 6: English as primary language, with toggle for Kinyarwanda and Swahili
- NFR 9: Works on Chrome, Firefox, Edge
- NFR 10: Accessible on Android smartphones and desktop — mobile-first responsive design
- NFR 14: No personal data displayed in shareable views (mask phone numbers, etc.)

---

## TECH STACK (frontend)

- Framework: React.js
- Styling: CSS Modules or Tailwind CSS (use palette variables)
- Map: Google Maps JavaScript API
- Icons: Tabler Icons (outline only)
- Notifications: toast library (e.g., react-toastify), styled to match palette
- API communication: REST/JSON over HTTPS
- State management: React Context or Redux
- Mobile responsiveness: CSS Grid + Flexbox, mobile-first

---

## ACCESSIBILITY NOTES

- All icon-only buttons must have `aria-label`
- Color is not the sole indicator of status — always pair with text label or icon
- Minimum touch target size: 44×44px (for mobile/farmer use)
- Error messages written in plain language — no error codes, no technical jargon
- High contrast maintained: dark green text on light green backgrounds passes WCAG AA

---

## CONTENT NOTES

- Placeholder farmer name: "Jean-Pierre Habimana · Eastern Province, Rwanda"
- Sample cargo types: Tomatoes, Maize, Beans, Sorghum, Cassava, Bananas
- Sample locations: Kigali Market, Huye Depot, Musanze Hub, Nyagatare Farm
- Currency: Rwandan Franc (RWF), Ugandan Shilling (UGX), Kenyan Shilling (KES)
- Weight unit: kilograms (kg)
- Distance unit: kilometres (km)
- Date format: DD/MM/YYYY

---

*End of AgriMove Website Prompt Script*
*Author: GATETE Derrick — ALU Assignment 2 — 27 June 2026*
