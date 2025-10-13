# FinGaurd Design System

**Version:** 1.0  
**Last Updated:** October 2025  
**Purpose:** Water purification e-commerce platform focusing on trust, purity, and modern aesthetics

---

## 🎨 Brand Identity

### Core Values
- **Purity & Cleanliness** - Represented through light backgrounds and blue water tones
- **Trust & Reliability** - Conveyed through professional typography and consistent spacing
- **Modern & Approachable** - Achieved via glassmorphism, smooth animations, and friendly UI

### Visual Language
- Clean, minimal interfaces with purposeful whitespace
- Gradient accents for depth and visual interest
- Floating elements to suggest fluidity (water theme)
- Soft shadows and blurred backgrounds for depth perception

---

## 🎭 Color System

### Primary Palette

```css
/* Blue - Trust, Water, Technology */
--color-primary: #2563eb;        /* Main brand color */
--color-primary-50: #eff6ff;     /* Lightest - backgrounds */
--color-primary-100: #dbeafe;    /* Very light - hover states */
--color-primary-200: #bfdbfe;    /* Light - borders */
--color-primary-300: #93c5fd;    /* Medium light - disabled states */
--color-primary-400: #60a5fa;    /* Medium - icons */
--color-primary-500: #2563eb;    /* Base - primary actions */
--color-primary-600: #1e40af;    /* Dark - hover states */
--color-primary-700: #1e3a8a;    /* Darker - active states */
--color-primary-800: #1e3a70;    /* Very dark - text on light */
--color-primary-900: #172554;    /* Darkest - high contrast text */

/* Secondary/Accent - Freshness, Energy */
--color-secondary: #54e8e8;      /* Main accent color */
--color-secondary-50: #f0fdfa;   /* Lightest */
--color-secondary-100: #ccfbf1;  /* Very light */
--color-secondary-200: #99f6e4;  /* Light */
--color-secondary-300: #5eead4;  /* Medium light */
--color-secondary-400: #54e8e8;  /* Base */
--color-secondary-500: #2dd4bf;  /* Medium */
--color-secondary-600: #14b8a6;  /* Dark */
--color-secondary-700: #0f766e;  /* Darker */
--color-secondary-800: #115e59;  /* Very dark */
--color-secondary-900: #134e4a;  /* Darkest */
```

### Semantic Colors

```css
/* Status & Feedback */
--color-success: #22c55e;        /* Green - success states */
--color-success-light: #dcfce7;  /* Light green background */
--color-success-dark: #15803d;   /* Dark green text */

--color-warning: #ff3f3f;        /* Red - warnings, errors */
--color-warning-light: #fee2e2;  /* Light red background */
--color-warning-dark: #dc2626;   /* Dark red text */

--color-info: #3b82f6;           /* Blue - informational */
--color-info-light: #dbeafe;     /* Light blue background */
--color-info-dark: #1e40af;      /* Dark blue text */

--color-neutral: #6b7280;        /* Gray - neutral states */
--color-neutral-light: #f3f4f6;  /* Light gray background */
--color-neutral-dark: #374151;   /* Dark gray text */
```

### Neutral Palette

```css
/* Backgrounds & Surfaces */
--background: #ffffff;           /* Main background */
--background-alt: #fafafa;       /* Alternate background */
--surface: #f3f3f3;              /* Card/component surface */
--surface-secondary: #e1e8ed;    /* Secondary surface */
--surface-alt: #c3d5e0;          /* Alternative surface */
--surface-elevated: #ffffff;     /* Elevated components */

/* Text Colors */
--text-primary: #111111;         /* Primary text - headings */
--text-secondary: #444444;       /* Secondary text - body */
--text-alt: #777777;             /* Alternative text - captions */
--text-disabled: #999999;        /* Disabled text */
--text-inverse: #ffffff;         /* Text on dark backgrounds */
--text-inverse-secondary: rgba(255, 255, 255, 0.8);

/* Borders & Dividers */
--border-light: rgba(0, 0, 0, 0.05);
--border-base: rgba(0, 0, 0, 0.1);
--border-medium: rgba(0, 0, 0, 0.15);
--border-strong: rgba(0, 0, 0, 0.2);
--border-primary: rgba(37, 99, 235, 0.1);
--border-primary-strong: rgba(37, 99, 235, 0.3);
```

### Gradient System

```css
/* Primary Gradients */
--gradient-primary: linear-gradient(135deg, #2563eb, #1e40af);
--gradient-primary-soft: linear-gradient(135deg, #3b82f6, #2563eb);
--gradient-primary-vibrant: linear-gradient(135deg, #60a5fa, #2563eb);

/* Secondary Gradients */
--gradient-secondary: linear-gradient(135deg, #54e8e8, #2dd4bf);
--gradient-secondary-soft: linear-gradient(135deg, #5eead4, #54e8e8);

/* Combined Gradients */
--gradient-hero: linear-gradient(135deg, #2563eb 0%, #54e8e8 100%);
--gradient-overlay: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 100%);
--gradient-mesh: radial-gradient(circle at 20% 50%, rgba(37, 99, 235, 0.1) 0%, transparent 50%),
                 radial-gradient(circle at 80% 80%, rgba(84, 232, 232, 0.1) 0%, transparent 50%);
```

### Opacity Scale

```css
--opacity-0: 0;
--opacity-5: 0.05;
--opacity-10: 0.1;
--opacity-20: 0.2;
--opacity-30: 0.3;
--opacity-40: 0.4;
--opacity-50: 0.5;
--opacity-60: 0.6;
--opacity-70: 0.7;
--opacity-80: 0.8;
--opacity-90: 0.9;
--opacity-100: 1;
```

---

## 📏 Spacing System

### Scale (Based on 4px grid)

```css
--spacing-0: 0;           /* 0px */
--spacing-xs: 0.25rem;    /* 4px - Micro spacing */
--spacing-sm: 0.5rem;     /* 8px - Tight spacing */
--spacing-md: 0.75rem;    /* 12px - Comfortable spacing */
--spacing-base: 1rem;     /* 16px - Base unit */
--spacing-lg: 1.5rem;     /* 24px - Large spacing */
--spacing-xl: 2rem;       /* 32px - Extra large */
--spacing-xxl: 3rem;      /* 48px - Section spacing */
--spacing-3xl: 4rem;      /* 64px - Large sections */
--spacing-4xl: 6rem;      /* 96px - Major sections */
--spacing-5xl: 8rem;      /* 128px - Hero sections */
--spacing-6xl: 12rem;     /* 192px - Massive spacing */

/* Semantic Spacing */
--gap-inline: var(--spacing-base);     /* Horizontal gaps */
--gap-block: var(--spacing-lg);        /* Vertical gaps */
--gap-card: var(--spacing-md);         /* Card internal spacing */
--gap-section: var(--spacing-xxl);     /* Between sections */
```

### Layout Containers

```css
--container-sm: 640px;    /* Small devices */
--container-md: 768px;    /* Tablets */
--container-lg: 1024px;   /* Laptops */
--container-xl: 1280px;   /* Desktops */
--container-2xl: 1536px;  /* Large desktops */
--container-max: 1920px;  /* Maximum width */
```

---

## 🔤 Typography System

### Font Families

```css
--font-primary: "Lexend Deca", sans-serif;    /* Headings, buttons, brand */
--font-secondary: "Urbanist", sans-serif;     /* Body text, UI */
--font-mono: "JetBrains Mono", monospace;     /* Code, technical data */
```

### Font Sizes (Fluid Typography)

```css
/* Mobile-first, scales with viewport */
--text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);      /* 12px - 14px */
--text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);        /* 14px - 16px */
--text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);        /* 16px - 18px */
--text-md: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);       /* 18px - 20px */
--text-lg: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);        /* 20px - 24px */
--text-xl: clamp(1.5rem, 1.3rem + 1vw, 2rem);              /* 24px - 32px */
--text-2xl: clamp(2rem, 1.7rem + 1.5vw, 2.5rem);           /* 32px - 40px */
--text-3xl: clamp(2.5rem, 2rem + 2vw, 3.5rem);             /* 40px - 56px */
--text-4xl: clamp(3rem, 2.5rem + 2.5vw, 4.5rem);           /* 48px - 72px */
--text-5xl: clamp(3.5rem, 3rem + 2.5vw, 5rem);             /* 56px - 80px */
```

### Font Weights

```css
--font-thin: 100;
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
--font-black: 900;
```

### Line Heights

```css
--leading-none: 1;
--leading-tight: 1.1;
--leading-snug: 1.25;
--leading-normal: 1.4;
--leading-relaxed: 1.5;
--leading-comfortable: 1.65;
--leading-loose: 1.8;
--leading-extra-loose: 2;
```

### Letter Spacing

```css
--tracking-tighter: -0.05em;
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
--tracking-wider: 0.05em;
--tracking-widest: 0.1em;
```

### Typography Scale Usage

```css
/* Headings */
h1 { font-size: var(--text-4xl); font-weight: var(--font-bold); line-height: var(--leading-tight); }
h2 { font-size: var(--text-3xl); font-weight: var(--font-bold); line-height: var(--leading-snug); }
h3 { font-size: var(--text-2xl); font-weight: var(--font-semibold); line-height: var(--leading-snug); }
h4 { font-size: var(--text-xl); font-weight: var(--font-semibold); line-height: var(--leading-normal); }
h5 { font-size: var(--text-lg); font-weight: var(--font-medium); line-height: var(--leading-normal); }
h6 { font-size: var(--text-md); font-weight: var(--font-medium); line-height: var(--leading-normal); }

/* Body Text */
body { font-size: var(--text-base); line-height: var(--leading-relaxed); }
p { font-size: var(--text-base); line-height: var(--leading-comfortable); }

/* UI Elements */
.label { font-size: var(--text-sm); font-weight: var(--font-medium); letter-spacing: var(--tracking-wide); }
.caption { font-size: var(--text-xs); line-height: var(--leading-normal); color: var(--text-alt); }
.badge { font-size: var(--text-xs); font-weight: var(--font-semibold); letter-spacing: var(--tracking-wider); text-transform: uppercase; }
```

---

## 🎯 Border Radius System

```css
--radius-none: 0;
--radius-xs: 0.125rem;    /* 2px - Subtle rounding */
--radius-sm: 0.25rem;     /* 4px - Small elements */
--radius-base: 0.5rem;    /* 8px - Cards, buttons */
--radius-md: 0.75rem;     /* 12px - Medium components */
--radius-lg: 1rem;        /* 16px - Large cards */
--radius-xl: 1.5rem;      /* 24px - Featured elements */
--radius-2xl: 2rem;       /* 32px - Hero elements */
--radius-3xl: 3rem;       /* 48px - Pill buttons */
--radius-full: 9999px;    /* Circle/Pill */
```

---

## 🌑 Shadow System

```css
/* Elevation Shadows */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-base: 0 4px 6px rgba(0, 0, 0, 0.07);
--shadow-md: 0 6px 12px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 10px 20px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 40px rgba(0, 0, 0, 0.12);
--shadow-2xl: 0 30px 60px rgba(0, 0, 0, 0.15);

/* Colored Shadows */
--shadow-primary: 0 8px 24px rgba(37, 99, 235, 0.2);
--shadow-primary-lg: 0 16px 48px rgba(37, 99, 235, 0.25);
--shadow-secondary: 0 8px 24px rgba(84, 232, 232, 0.2);

/* Inner Shadows */
--shadow-inner: inset 0 2px 4px rgba(0, 0, 0, 0.06);
--shadow-inner-lg: inset 0 4px 8px rgba(0, 0, 0, 0.1);

/* Glow Effects */
--glow-primary: 0 0 20px rgba(37, 99, 235, 0.3);
--glow-secondary: 0 0 20px rgba(84, 232, 232, 0.3);
```

---

## 🎬 Animation System

### Timing Functions

```css
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);
```

### Duration Scale

```css
--duration-instant: 50ms;     /* Instant feedback */
--duration-fast: 150ms;       /* Quick transitions */
--duration-base: 300ms;       /* Standard transitions */
--duration-slow: 500ms;       /* Deliberate animations */
--duration-slower: 700ms;     /* Emphasis animations */
--duration-slowest: 1000ms;   /* Long animations */
```

### Animation Presets

```css
/* Stagger Animation System */
--stagger-base: 0.1s;
--stagger-step: 0.05s;
--stagger-delay: calc(var(--stagger-base) + (var(--i, 0) * var(--stagger-step)));

/* Common Transitions */
--transition-all: all var(--duration-base) var(--ease-in-out);
--transition-colors: color var(--duration-base) var(--ease-in-out),
                     background-color var(--duration-base) var(--ease-in-out),
                     border-color var(--duration-base) var(--ease-in-out);
--transition-transform: transform var(--duration-base) var(--ease-smooth);
--transition-opacity: opacity var(--duration-base) var(--ease-in-out);
--transition-shadow: box-shadow var(--duration-base) var(--ease-in-out);
```

### Keyframe Animations

```css
@keyframes fade-in {
	from { opacity: 0; }
	to { opacity: 1; }
}

@keyframes fade-in-up {
	from { opacity: 0; transform: translateY(20px); }
	to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in-down {
	from { opacity: 0; transform: translateY(-20px); }
	to { opacity: 1; transform: translateY(0); }
}

@keyframes slide-in-left {
	from { transform: translateX(-100%); }
	to { transform: translateX(0); }
}

@keyframes slide-in-right {
	from { transform: translateX(100%); }
	to { transform: translateX(0); }
}

@keyframes scale-in {
	from { transform: scale(0.9); opacity: 0; }
	to { transform: scale(1); opacity: 1; }
}

@keyframes float {
	0%, 100% { transform: translateY(0) rotate(0deg); }
	25% { transform: translateY(-10px) rotate(2deg); }
	75% { transform: translateY(10px) rotate(-2deg); }
}

@keyframes float-card {
	0%, 100% { transform: translateY(0); }
	50% { transform: translateY(-8px); }
}

@keyframes gradient-shift {
	0%, 100% { background-position: 0% 50%; }
	50% { background-position: 100% 50%; }
}

@keyframes pulse {
	0%, 100% { opacity: 1; }
	50% { opacity: 0.5; }
}

@keyframes spin {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}
```

---

## 🧩 Component Patterns

### Buttons

```css
/* Primary Button */
.btn-primary {
	background: var(--gradient-primary);
	border: none;
	border-radius: var(--radius-2xl);
	color: var(--text-inverse);
	cursor: pointer;
	font-family: var(--font-primary);
	font-size: var(--text-base);
	font-weight: var(--font-semibold);
	padding: var(--spacing-md) var(--spacing-xl);
	transition: var(--transition-transform), var(--transition-shadow);
	text-transform: uppercase;
	letter-spacing: var(--tracking-wide);
}

.btn-primary:hover {
	transform: translateY(-2px);
	box-shadow: var(--shadow-primary);
}

.btn-primary:active {
	transform: translateY(0);
}

/* Secondary Button */
.btn-secondary {
	background: var(--background);
	border: 2px solid var(--color-primary);
	border-radius: var(--radius-2xl);
	color: var(--color-primary);
	cursor: pointer;
	font-family: var(--font-primary);
	font-size: var(--text-base);
	font-weight: var(--font-semibold);
	padding: var(--spacing-md) var(--spacing-xl);
	transition: var(--transition-all);
	text-transform: uppercase;
	letter-spacing: var(--tracking-wide);
}

.btn-secondary:hover {
	background: var(--color-primary-50);
	transform: translateY(-2px);
}

/* Button Sizes */
.btn-sm {
	font-size: var(--text-sm);
	padding: var(--spacing-sm) var(--spacing-lg);
}

.btn-lg {
	font-size: var(--text-lg);
	padding: var(--spacing-lg) var(--spacing-xxl);
}

/* Icon Button */
.btn-icon {
	align-items: center;
	background: transparent;
	border: none;
	border-radius: var(--radius-full);
	color: var(--text-secondary);
	cursor: pointer;
	display: inline-flex;
	justify-content: center;
	padding: var(--spacing-sm);
	transition: var(--transition-colors);
}

.btn-icon:hover {
	background: var(--surface);
	color: var(--color-primary);
}
```

### Cards

```css
/* Base Card */
.card {
	background: var(--surface-elevated);
	border: 1px solid var(--border-light);
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-sm);
	padding: var(--spacing-lg);
	transition: var(--transition-shadow), var(--transition-transform);
}

.card:hover {
	box-shadow: var(--shadow-md);
	transform: translateY(-2px);
}

/* Glassmorphism Card */
.card-glass {
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	background: rgba(255, 255, 255, 0.7);
	border: 1px solid rgba(255, 255, 255, 0.3);
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-lg);
}

/* Floating Card */
.card-floating {
	animation: float-card 3s ease-in-out infinite;
	background: var(--surface-elevated);
	backdrop-filter: blur(10px);
	border-radius: var(--radius-lg);
	box-shadow: var(--shadow-xl);
}
```

### Badges

```css
.badge {
	align-items: center;
	background: var(--surface);
	border: 1px solid var(--border-base);
	border-radius: var(--radius-sm);
	color: var(--text-secondary);
	display: inline-flex;
	font-size: var(--text-xs);
	font-weight: var(--font-semibold);
	letter-spacing: var(--tracking-wider);
	padding: var(--spacing-xs) var(--spacing-sm);
	text-transform: uppercase;
	width: fit-content;
}

.badge-primary {
	background: var(--color-primary-100);
	border-color: var(--color-primary-200);
	color: var(--color-primary-700);
}

.badge-success {
	background: var(--color-success-light);
	border-color: var(--color-success);
	color: var(--color-success-dark);
}
```

### Inputs

```css
.input {
	background: var(--background);
	border: 2px solid var(--border-base);
	border-radius: var(--radius-base);
	color: var(--text-primary);
	font-family: var(--font-secondary);
	font-size: var(--text-base);
	padding: var(--spacing-md) var(--spacing-base);
	transition: var(--transition-colors);
	width: 100%;
}

.input:focus {
	border-color: var(--color-primary);
	outline: none;
	box-shadow: 0 0 0 3px var(--color-primary-100);
}

.input:disabled {
	background: var(--surface);
	color: var(--text-disabled);
	cursor: not-allowed;
}

.input::placeholder {
	color: var(--text-alt);
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
--breakpoint-xs: 375px;   /* Small phones */
--breakpoint-sm: 640px;   /* Large phones */
--breakpoint-md: 768px;   /* Tablets */
--breakpoint-lg: 1024px;  /* Laptops */
--breakpoint-xl: 1280px;  /* Desktops */
--breakpoint-2xl: 1440px; /* Large desktops */
--breakpoint-3xl: 1600px; /* Extra large */
--breakpoint-4xl: 2160px; /* 4K displays */
```

### Media Query Usage

```css
/* Small devices and up */
@media (min-width: 640px) { /* tablet styles */ }

/* Medium devices and up */
@media (min-width: 768px) { /* small laptop styles */ }

/* Large devices and up */
@media (min-width: 1024px) { /* desktop styles */ }

/* Extra large devices and up */
@media (min-width: 1280px) { /* large desktop styles */ }

/* 2K and above */
@media (min-width: 1440px) { /* high-res styles */ }

/* 4K displays */
@media (min-width: 2160px) { /* ultra high-res styles */ }
```

---

## 🎨 Glassmorphism System

```css
/* Light Glassmorphism */
.glass-light {
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	background: rgba(255, 255, 255, 0.6);
	border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Medium Glassmorphism */
.glass-medium {
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	background: rgba(255, 255, 255, 0.7);
	border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Strong Glassmorphism */
.glass-strong {
	backdrop-filter: blur(30px);
	-webkit-backdrop-filter: blur(30px);
	background: rgba(255, 255, 255, 0.8);
	border: 1px solid rgba(255, 255, 255, 0.4);
}

/* Dark Glassmorphism */
.glass-dark {
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	background: rgba(0, 0, 0, 0.3);
	border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## 🎯 Z-Index Scale

```css
--z-base: 1;
--z-dropdown: 100;
--z-sticky: 200;
--z-fixed: 300;
--z-modal-backdrop: 400;
--z-modal: 500;
--z-popover: 600;
--z-tooltip: 700;
--z-toast: 800;
--z-header: 9999;
--z-maximum: 10000;
```

---

## 🖼️ Icon System

### Material Symbols Rounded
- **Usage:** Icons throughout the UI
- **Size Scale:** Matches text sizes (16px - 48px)
- **Weight:** 400 (Regular)
- **Style:** Rounded

```css
.icon-xs { font-size: 1rem; }      /* 16px */
.icon-sm { font-size: 1.25rem; }   /* 20px */
.icon-base { font-size: 1.5rem; }  /* 24px */
.icon-lg { font-size: 2rem; }      /* 32px */
.icon-xl { font-size: 2.5rem; }    /* 40px */
.icon-2xl { font-size: 3rem; }     /* 48px */
```

---

## 📐 Grid System

```css
/* 12-Column Grid */
.grid-12 {
	display: grid;
	grid-template-columns: repeat(12, 1fr);
	gap: var(--spacing-base);
}

/* Common Grid Patterns */
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--spacing-lg); }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-lg); }
.grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--spacing-lg); }

/* Auto-fit Grid */
.grid-auto-fit {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
	gap: var(--spacing-lg);
}
```

---

## 🎪 Special Effects

### Gradient Backgrounds

```css
.bg-gradient-hero {
	background: linear-gradient(135deg, #2563eb 0%, #54e8e8 100%);
	background-size: 200% 200%;
	animation: gradient-shift 15s ease infinite;
}

.bg-gradient-mesh {
	background: var(--gradient-mesh);
}
```

### Blur Shapes (Floating Elements)

```css
.blur-shape {
	animation: float 20s ease-in-out infinite;
	background: var(--gradient-primary);
	border-radius: var(--radius-full);
	filter: blur(80px);
	opacity: var(--opacity-20);
	position: absolute;
}
```

---

## ♿ Accessibility

### Focus States

```css
*:focus-visible {
	outline: 3px solid var(--color-primary);
	outline-offset: 2px;
}

button:focus-visible,
a:focus-visible {
	outline: 3px solid var(--color-primary);
	outline-offset: 2px;
}
```

### Contrast Ratios
- **Normal Text:** Minimum 4.5:1
- **Large Text (18px+):** Minimum 3:1
- **UI Components:** Minimum 3:1

### Screen Reader Classes

```css
.sr-only {
	border: 0;
	clip: rect(0, 0, 0, 0);
	height: 1px;
	margin: -1px;
	overflow: hidden;
	padding: 0;
	position: absolute;
	width: 1px;
}
```

---

## 📝 Usage Guidelines

### Do's ✅
- Use consistent spacing from the scale
- Apply glassmorphism for overlays and navigation
- Utilize gradient accents for primary actions
- Implement smooth animations for state changes
- Maintain proper contrast ratios
- Use semantic color names for states
- Follow mobile-first responsive approach
- Test animations on lower-end devices

### Don'ts ❌
- Don't use arbitrary spacing values
- Avoid pure black (#000000) - use --text-primary instead
- Don't overuse gradients on every element
- Avoid animation durations > 1s for UI interactions
- Don't use more than 3 font families
- Avoid low contrast color combinations
- Don't nest glassmorphism effects deeply
- Avoid animating expensive properties (width, height)

---

## 🔄 Implementation

### CSS Variable Setup

```css
/* Add to root stylesheet */
@import url("design-system-variables.css");

/* Or inline in :root */
:root {
	/* Copy all variables from above sections */
}
```

### Component Example

```html
<button class="btn-primary btn-lg">
	<span class="material-symbols-rounded icon-base">shopping_cart</span>
	Add to Cart
</button>
```

---

## 📚 Resources

### Fonts
- **Lexend Deca:** https://fonts.google.com/specimen/Lexend+Deca
- **Urbanist:** https://fonts.google.com/specimen/Urbanist

### Icons
- **Material Symbols:** https://fonts.google.com/icons

### Inspiration
- Water purity and cleanliness
- Modern e-commerce patterns
- Trust and professionalism in healthcare/filtration industry

---

## 🔄 Version History

**v1.0** - October 2025
- Initial design system documentation
- Complete color, typography, and spacing scales
- Component patterns and guidelines
- Animation and glassmorphism systems

---

**Maintained by:** FinGaurd Design Team  
**Questions?** Refer to this document for all design decisions and implementations.
