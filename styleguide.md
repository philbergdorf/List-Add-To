# List-Add-To Style Guide

Reference design: Migros grocery app (Swiss retail). All UI work must follow these patterns.

---

## Colors

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#FF6600` | Brand orange — icons, links, active tab, badges, CTAs |
| `--color-primary-light` | `#FFF2E6` | Orange tint backgrounds (selected chips, subtle highlights) |
| `--color-bg` | `#F2F2F7` | Page background (iOS system gray) |
| `--color-surface` | `#FFFFFF` | Cards, header, tab bar, modals |
| `--color-text` | `#1C1C1E` | Primary text (headings, prices, product names) |
| `--color-text-secondary` | `#8E8E93` | Secondary text (unit info, timestamps, placeholders) |
| `--color-text-tertiary` | `#C7C7CC` | Disabled / hint text |
| `--color-border` | `#E5E5EA` | Dividers, card borders, input borders |
| `--color-green` | `#1EA650` | Success state, Cumulus-style floating CTA |
| `--color-red` | `#FF3B30` | Destructive actions, error states |
| `--color-discount` | `#FF6600` | Discount badge background (orange, white text) |

---

## Typography

All text uses the system font stack (SF Pro on iOS, system-ui fallback).

| Element | Size | Weight | Color | Notes |
|---|---|---|---|---|
| Page title | 22px | **Bold (700)** | `--color-text` | Left-aligned, below header icons |
| Section title | 17px | **Bold (700)** | `--color-text` | Left-aligned |
| Section link ("Alle anzeigen") | 14px | Medium (500) | `--color-primary` | Right-aligned, same row as title |
| Subtitle / description | 13px | Regular (400) | `--color-text-secondary` | Below section titles |
| Product name | 13px | Semibold (600) | `--color-text` | Max 2 lines, `line-clamp-2` |
| Price | 17px | **Bold (700)** | `--color-text` | |
| Strikethrough price | 13px | Regular (400) | `--color-text-secondary` | `line-through` |
| Unit / weight info | 11px | Regular (400) | `--color-text-secondary` | e.g. "1 kg  1.95/kg" |
| Search placeholder | 15px | Regular (400) | `--color-text-secondary` | |
| Tab bar label | 10px | Medium (500) | gray / orange when active |
| Badge text ("20%") | 11px | **Bold (700)** | `#FFFFFF` on orange bg |
| Floating CTA | 15px | Semibold (600) | `#FFFFFF` on green bg |

---

## Spacing & Layout

| Property | Value |
|---|---|
| Max app width | `428px` (centered with `mx-auto`) |
| Page horizontal padding | `16px` (`px-4`) |
| Section vertical gap | `24px` between sections |
| Section header bottom margin | `12px` |
| Card gap (horizontal scroll) | `8px` (`gap-2`) |
| Card border radius | `12px` (`rounded-xl`) |
| Card internal padding | `8px` image area, `12px` text area |
| Banner border radius | `12px` |
| Search bar height | `36px` |
| Header height | `44px` (below safe area) |
| Tab bar height | `50px` + safe area bottom inset |
| Bottom content padding | `80px` (clears tab bar) |

---

## Components

### Header
- **Background**: White with `backdrop-blur-md`, border-bottom
- **Top row**: Left = app icon (orange rounded square), Right = action icons (scan, person)
- **Title row**: Large bold page title, left-aligned
- **Sticky** at top of scroll area

### Search Bar
- Full-width rounded pill (`rounded-full`)
- Background: `#EFEFF4` (light gray)
- Left search icon (gray), placeholder text
- No border

### Filter Chips
- Row of horizontal scrollable pills
- Border: 1px `--color-border`, rounded-full
- Active state: `--color-primary` border + text, light orange bg
- Padding: `6px 14px`
- Font: 13px medium

### Section Header
- Flex row: title left, "Alle anzeigen" link right
- Title: 17px bold
- Link: 14px medium, `--color-primary`

### Horizontal Scroll Row
- `overflow-x-auto`, `no-scrollbar`, `snap-x snap-mandatory`
- Cards peek from right edge (don't pad right side of container)
- Left padding: `16px` (matches page padding)
- Gap: `8px`

### Product Card
- White background, `rounded-xl`, subtle shadow
- Image: top, `aspect-[4/3]`, `rounded-lg` (inside 8px padding)
- Discount badge: top-left overlay, orange bg, rounded, white bold text
- "Neu" badge: purple/dark bg variant
- Below image: product name (13px semibold, 2-line clamp), price, unit info
- Card min-width in scroll: `140px`

### Promotional Banner
- Full-width or near-full-width
- `rounded-xl`, image fills, optional gradient overlay for text
- Text overlay: white, bold

### Recipe Card
- White bg, `rounded-xl`
- Image with heart/favorite button overlay (top-right, white circle bg)
- Title below image: 13px semibold, 2 lines
- Duration row: clock icon + text, 11px gray

### Bottom Tab Bar
- Fixed bottom, white bg with `backdrop-blur-md`
- 5 equally-spaced items (or 4 for this app)
- Icon (24px) + label (10px) stacked vertically
- Active: `--color-primary` (orange), inactive: `--color-text-secondary`
- Respects `env(safe-area-inset-bottom)`

### Floating CTA Button
- Fixed position, centered above tab bar
- Green bg (`--color-green`), white text
- Rounded-full pill shape
- Padding: `12px 24px`
- Shadow for elevation
- Optional left icon

### Toast / Notification
- Top of screen (respects safe area)
- Dark bg (`gray-900`), white text, rounded-xl
- Auto-dismiss after 2.5s
- Check icon for success variant

---

## Iconography
- Style: Outline / line icons (Feather-style), 24px
- Stroke width: 1.8px
- Color inherits from parent text color
- Common icons: home, list, search, person, heart, clock, chevron, plus, scan

---

## Interaction Patterns
- **Tap targets**: Minimum 44px height for all interactive elements
- **Cards**: Entire card is tappable, slight press feedback
- **Scroll**: Horizontal sections use momentum scroll with snap
- **Navigation**: Tab bar for main sections, back arrow for detail pages
- **Pull-to-refresh**: Optional on scrollable pages

---

## Dark Mode
Not implemented — light mode only for this prototype.
