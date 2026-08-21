# Color Consistency Guide

This guide establishes a unified high-perception color system for the portfolio to ensure visual consistency across all pages while maintaining a premium, modern aesthetic.

## Core Brand Colors

### Primary Brand Color: Ocean Electric Blue (SSA Logo Palette)
The primary brand color used throughout the app matches the official SSA Research Lab 3D shield & wordmark logo:

| Token Name | Light Mode | Dark Mode | Usage |
|------------|------------|-----------|-------|
| `--brand-primary` | `#0284c7` | `#38bdf8` | Primary buttons, links, active accents |
| `--brand-primary-hover` | `#0369a1` | `#7dd3fc` | Hover states |
| `--brand-primary-active` | `#075985` | `#0284c7` | Active/pressed states |
| `--brand-primary-muted` | `rgba(2, 132, 199, 0.08)` | `rgba(56, 189, 248, 0.16)` | Subtle badge & card backgrounds |

### Secondary Accent: Sunset Coral
| Token Name | Light Mode | Dark Mode | Usage |
|------------|------------|-----------|-------|
| `--cta-accent` | `#ea580c` | `#f97316` | High-conversion CTAs, special feature nodes |
| `--cta-accent-hover` | `#c2410c` | `#fb923c` | CTA hover states |

### Semantic Colors

| Token Name | Light Mode | Dark Mode | Usage |
|------------|------------|-----------|-------|
| `--success` | `#059669` | `#10b981` | Success messages, positive actions |
| `--warning` | `#d97706` | `#f59e0b` | Warning states, cautions |
| `--danger` | `#e11d48` | `#f43f5e` | Errors, destructive actions |
| `--info` | `#0284c7` | `#38bdf8` | Informational states |

## Background Colors

### Light Mode Backgrounds
| Token Name | Value | Usage |
|------------|-------|-------|
| `--bg-page` | `#f8fafc` | Main page background (Slate 50) |
| `--bg-elevated` | `#ffffff` | Cards, modals, elevated surfaces |
| `--bg-subtle` | `#f1f5f9` | Secondary sections, form backgrounds (Slate 100) |
| `--bg-muted` | `#e2e8f0` | Muted areas, disabled states (Slate 200) |

### Dark Mode Backgrounds
| Token Name | Value | Usage |
|------------|-------|-------|
| `--bg-page` | `#090d16` | Deep midnight obsidian page background |
| `--bg-elevated` | `#111827` | Cards, modals, elevated surfaces (Slate 900) |
| `--bg-subtle` | `#1e293b` | Secondary sections (Slate 800) |
| `--bg-muted` | `#0f172a` | Muted background panels |

## Text Colors

### Light Mode Text
| Token Name | Value | Usage |
|------------|-------|-------|
| `--text-primary` | `#0f172a` | Main content, headings (Slate 900) |
| `--text-secondary` | `#334155` | Secondary text, descriptions (Slate 700) |
| `--text-muted` | `#64748b` | Placeholder, hints, metadata (Slate 500) |

### Dark Mode Text
| Token Name | Value | Usage |
|------------|-------|-------|
| `--text-primary` | `#f8fafc` | Main content, crisp headings (Slate 50) |
| `--text-secondary` | `#cbd5e1` | Secondary text, descriptions (Slate 300) |
| `--text-muted` | `#94a3b8` | Placeholder, hints, metadata (Slate 400) |

## Border Colors

| Token Name | Light Mode | Dark Mode | Usage |
|------------|------------|-----------|-------|
| `--border-default` | `#dbe2ea` | `#263241` | Standard borders |
| `--border-subtle` | `rgba(0, 0, 0, 0.08)` | `rgba(255, 255, 255, 0.08)` | Subtle separators |
| `--border-focus` | `#4573df` | `#4f8cff` | Focus rings |

## Migration from Hard-Coded Colors

### Replace These Colors

| Old Color | Replace With |
|-----------|--------------|
| `#000`, `#222`, `#222222`, `#191d23`, `#0f172a` | `var(--text-primary)` |
| `#4b5563`, `#6b7280` | `var(--text-secondary)` or `var(--text-muted)` |
| `#ffffff`, `#fff` (as bg) | `var(--bg-elevated)` or `var(--surface)` |
| `#e8ebee` | `var(--bg-subtle)` |
| `#f7f9fc`, `#f8fafc`, `#f0f4f8` | `var(--bg-page)` |
| `#4573df`, `#3b82f6` | `var(--brand-primary)` or `var(--primary)` |
| `#2563eb`, `#1d4ed8` | `var(--brand-primary-hover)` |
| `#33a552`, `#34a853`, `#10b981` | `var(--success)` |
| `#f1792e` | `var(--warning)` |
| `#e81123`, `#dc2626`, `#ef4444` | `var(--danger)` |

## Component-Specific Guidelines

### Buttons
- Primary buttons: Use `--brand-primary` background, white text
- Secondary buttons: Use `--bg-subtle` background, `--text-primary` text
- Outline buttons: Transparent background, `--brand-primary` border and text

### Cards
- Background: `--bg-elevated` (light) or `--surface` (dark)
- Border: `--border-default`
- Hover: Slight shadow increase, optional subtle background shift

### Links
- Default: `--brand-primary`
- Hover: `--brand-primary-hover`
- Visited: Same as default (for consistency)

### Form Inputs
- Background: `--bg-elevated`
- Border: `--border-default`
- Focus: `--border-focus` with focus ring

## Gradients (Use Sparingly)

### Brand Gradient
```css
background: linear-gradient(135deg, var(--brand-primary) 0%, #5a86e6 100%);
```

### Accent Gradient (for special sections)
```css
background: linear-gradient(135deg, var(--brand-primary) 0%, var(--info) 100%);
```

## Implementation Notes

1. **Always use CSS variables** from `styles/tokens.css` instead of hard-coded hex values
2. **Test both themes** - every color change should work in light and dark mode
3. **Keep gradients subtle** - use them for accent areas, not primary UI
4. **Maintain contrast ratios** - ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)

## Files That Need Updates

Priority components that commonly use inconsistent colors:
- `components/welcome/` - Home page welcome section
- `components/Contact/` - Contact form
- `components/Resume/` - Resume section
- `components/Services/` - Services cards
- `components/Skills/` - Skills section
- `components/Articles/` - Article cards
- `components/Projects/` - Project cards (mostly consistent, use as reference)
