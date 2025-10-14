# Design Guidelines: Hybrid Application Tracking System

## Design Approach

**Selected Approach:** Design System - Material Design 3 with Linear-inspired refinements

**Justification:** This application tracking system is utility-focused, information-dense, and requires clear data visualization across multiple dashboards. Material Design 3 provides robust component patterns for complex data interfaces, while Linear's aesthetic brings modern polish to productivity tools.

**Key Design Principles:**
- Clarity over decoration: Information hierarchy drives all visual decisions
- Purposeful color: Status colors and data visualization take priority
- Efficient scanning: Dense information organized for quick comprehension
- Role-specific identity: Visual cues distinguish user contexts

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary):**
- Background Base: 222 15% 8%
- Surface: 222 15% 11%
- Surface Elevated: 222 15% 14%
- Primary Brand: 210 100% 60% (Trust-inspiring blue)
- Text Primary: 0 0% 98%
- Text Secondary: 0 0% 70%
- Border Subtle: 222 15% 20%

**Status Colors (Both Modes):**
- Applied/Pending: 210 90% 55% (Blue)
- In Progress/Reviewed: 45 95% 60% (Amber)
- Interview/Active: 270 85% 65% (Purple)
- Success/Offer: 145 75% 50% (Green)
- Rejected/Closed: 0 75% 58% (Red)
- Bot Automated: 180 70% 55% (Teal)

**Light Mode:**
- Background Base: 0 0% 100%
- Surface: 0 0% 98%
- Surface Elevated: 0 0% 96%
- Primary: 210 100% 50%
- Text Primary: 222 15% 15%
- Text Secondary: 0 0% 40%
- Border Subtle: 0 0% 88%

### B. Typography

**Font Families:**
- Primary: Inter (via Google Fonts) - UI, body text, data
- Monospace: JetBrains Mono - Timestamps, IDs, technical data

**Type Scale:**
- Display (Dashboard Headers): 2.25rem, 700 weight
- H1 (Page Titles): 1.875rem, 600 weight
- H2 (Section Headers): 1.5rem, 600 weight
- H3 (Card Headers): 1.25rem, 600 weight
- Body Large: 1rem, 400 weight, 1.6 line-height
- Body: 0.875rem, 400 weight, 1.5 line-height
- Caption: 0.75rem, 500 weight, 1.4 line-height
- Label: 0.6875rem, 600 weight, uppercase, 0.05em tracking

### C. Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16 (e.g., p-4, gap-6, m-8)

**Grid System:**
- Dashboard: 12-column responsive grid
- Card layouts: 4px gap for dense data, 16px for card grids
- Sidebar navigation: Fixed 256px (lg:), collapsible on mobile

**Container Strategy:**
- Full-width dashboards: max-w-screen-2xl with px-6
- Content sections: max-w-7xl
- Form containers: max-w-2xl
- Cards: Responsive width with min-w-[280px]

### D. Component Library

**Navigation:**
- Sidebar: Fixed left, collapsible, role indicator badge at top
- Top bar: Breadcrumbs, user menu, notifications icon
- Role switcher: Prominent dropdown showing current role context

**Dashboards:**
- Metric cards: Glass-morphism elevated surfaces with icon, value, label, trend indicator
- Chart containers: White/dark surface with 16px padding, subtle border
- Activity feed: Timeline with connecting lines, role badges, timestamps
- Quick actions: Floating action button (bottom right) for primary actions

**Data Display:**
- Application cards: Compact design with status pill, role badge, date, key metrics
- Status timeline: Horizontal stepper showing application progress with role indicators
- Activity log: Chronological list with avatar/bot icon, action, timestamp, expandable details
- Data tables: Sortable headers, row hover states, inline actions, pagination

**Forms & Inputs:**
- Input fields: Outlined style, floating labels, helper text below
- Dropdowns: Material-style with search for role selection
- Buttons: Primary (filled), Secondary (outlined), Ghost (text)
- Status pills: Rounded-full badges with status-specific colors

**Status Indicators:**
- Application status: Large pills with icons (check, clock, user, x)
- Role badges: Small rounded badges (Technical: blue, Non-technical: purple)
- Update source: Bot icon (automated) vs User avatar (manual)
- Priority indicators: Color-coded dots (high: red, medium: amber, low: green)

**Modals & Overlays:**
- Create application: Multi-step wizard with progress indicator
- Application details: Side panel (right) with full history, comments
- Confirmation dialogs: Centered with clear primary/secondary actions

### E. Animations

**Minimal, Purposeful Motion:**
- Card hover: Subtle elevation increase (2px translate)
- Status transitions: Color fade (300ms ease)
- Loading states: Skeleton screens (no spinners)
- Page transitions: Fade in content (200ms)

**Dashboard-Specific:**
- Chart rendering: Animate on data load (stagger: 50ms)
- Metric counters: Count-up animation on dashboard load
- Timeline: Fade-in stages sequentially

---

## Role-Specific Design Considerations

**Applicant Dashboard:**
- Focus on personal application cards in grid layout
- Large "Create Application" CTA
- Status overview with visual progress indicators

**Bot Mimic Dashboard:**
- Technical applications queue with automation status
- Workflow trigger controls prominently placed
- Activity log showing automated actions with timestamps

**Admin Dashboard:**
- Split view: Job postings management + Non-technical applications
- Bulk action controls for status updates
- Metrics showing manual vs automated application ratio

---

## Images

**Dashboard Hero (All Roles):**
- Subtle abstract pattern background (geometric lines, low opacity)
- Position: Top of dashboard, height ~200px
- Style: Gradient overlay from brand color to background

**Empty States:**
- Illustration style: Line art, minimal, matching brand colors
- "No applications" state for applicant
- "No pending queue" for bot mimic
- "No job postings" for admin

**User Avatars:**
- Generated initials circles for users
- Bot icon: Distinctive robot/automation symbol in teal