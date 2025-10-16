# Kavita Enterprises Website - Complete Documentation

**Version:** 1.0  
**Last Updated:** October 16, 2025  
**Website:** KavitaEnterprises.github.io

---

## Table of Contents

1. [Overview](#overview)
2. [Design System](#design-system)
3. [Page Structure & Flow](#page-structure--flow)
4. [Components](#components)
5. [Features & Functionality](#features--functionality)
6. [Data Structure](#data-structure)
7. [User Flows](#user-flows)
8. [Technical Architecture](#technical-architecture)
9. [Audit Checklist](#audit-checklist)

---

## 1. Overview

### Business Description
Kavita Enterprises specializes in water purification solutions, offering RO systems, filters, pumps, and related parts/accessories. The business operates via WhatsApp-based ordering with no payment gateway integration.

### Website Purpose
- Product catalog and information display
- Lead generation through WhatsApp integration
- Expert consultation booking
- Customer support via chatbot

### Target Audience
- Residential customers (families, households)
- Commercial clients (offices, businesses)
- Water quality conscious consumers in India

---

## 2. Design System

### 2.1 Color Palette

#### Primary Colors
```css
--primary: #0891B2 (Cyan-600)
--primary-dark: #0E7490 (Cyan-700)
--secondary: #06B6D4 (Cyan-500)
```

#### Accent Colors
```css
--green-600: #16A34A (Success, Discounts)
--red-500: #EF4444 (Discount badges)
--pink-500: #EC4899 (Favorites)
--blue-600: #2563EB (Delivery info)
--orange-500: #F97316 (Warnings/Alerts)
```

#### Neutral Colors
```css
--gray-50: #F9FAFB (Backgrounds)
--gray-100: #F3F4F6 (Light sections)
--gray-200: #E5E7EB (Borders)
--gray-500: #6B7280 (Secondary text)
--gray-600: #4B5563 (Body text)
--gray-900: #111827 (Headings)
--white: #FFFFFF
```

### 2.2 Typography

#### Font Family
- **Primary:** System fonts (sans-serif stack)
- **Fallback:** -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial

#### Font Sizes
```css
text-xs: 0.75rem (12px)
text-sm: 0.875rem (14px)
text-base: 1rem (16px)
text-lg: 1.125rem (18px)
text-xl: 1.25rem (20px)
text-2xl: 1.5rem (24px)
text-3xl: 1.875rem (30px)
text-4xl: 2.25rem (36px)
text-5xl: 3rem (48px)
```

#### Font Weights
```css
font-normal: 400
font-medium: 500
font-semibold: 600
font-bold: 700
```

### 2.3 Spacing System

```css
gap-1: 0.25rem (4px)
gap-2: 0.5rem (8px)
gap-3: 0.75rem (12px)
gap-4: 1rem (16px)
gap-6: 1.5rem (24px)
gap-8: 2rem (32px)

p-2: 0.5rem (8px)
p-4: 1rem (16px)
p-6: 1.5rem (24px)
p-8: 2rem (32px)
```

### 2.4 Border Radius

```css
rounded: 0.25rem (4px)
rounded-lg: 0.5rem (8px)
rounded-xl: 0.75rem (12px)
rounded-2xl: 1rem (16px)
rounded-full: 9999px (circular)
```

### 2.5 Shadows

```css
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1)
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
```

### 2.6 Icons

**System:** Material Symbols Rounded
- Size: 16px (text-sm), 20px (text-base), 24px (text-lg)
- Weight: 400
- Fill: 0 (outlined) or 1 (filled for favorites)

---

## 3. Page Structure & Flow

### 3.1 Site Map

```
Homepage (index.html)
├── Hero Section
├── Featured Products (4 items)
├── Categories
├── Why Choose Us
├── Expert Advice Form
└── Footer

Products Page (products.html)
├── Hero Banner
├── Filters Sidebar
│   ├── Category Filter
│   ├── Price Range Filter
│   └── Search Box
└── Product Grid

Product Detail Page (product.html)
├── Product Gallery
├── Product Info
│   ├── Name, SKU, Price
│   ├── MRP (strikethrough) + Discount %
│   ├── Quantity Selector
│   ├── Add to Cart Button
│   ├── Prepaid Promo Card
│   └── Product Tabs (Description, Specifications, Warranty)
└── Related Products

Cart Page (cart.html)
├── Cart Items List (clickable products)
├── Order Summary Sidebar
│   ├── Subtotal
│   ├── Delivery Charges (dynamic)
│   ├── Installation (FREE)
│   ├── Total
│   ├── Checkout Button
│   ├── Prepaid Promo Card
│   └── Trust Badges
└── Checkout Modal (WhatsApp redirect)

Static Pages
├── Contact (contact.html)
├── Terms & Conditions (terms.html)
├── Shipping & Returns (shipping-returns.html)
├── Warranty (warranty.html)
└── Wholesale (wholesale.html)
```

### 3.2 Navigation Structure

#### Header (All Pages)
- Logo (links to home)
- Navigation Links: Home, Products, About, Contact
- Search Bar
- Cart Icon (with counter badge)
- Mobile Menu (hamburger)

#### Footer (All Pages)
- Quick Links (Products, About, Contact, etc.)
- Categories
- Customer Support
- Legal Links
- Social Media
- Copyright

---

## 4. Components

### 4.1 Product Card

**Used On:** Homepage, Products Page
**Dimensions:** Responsive grid (1-4 columns)

**Structure:**
```
┌─────────────────────────────────┐
│ [♡] [🛒]    [15% OFF] [Category]│ ← Top Actions & Badges
│                                 │
│        Product Image            │
│                                 │
│  SKU-XXX                        │
│  Product Name (2 lines max)     │
│  Description (2 lines max)      │
│                                 │
│  ₹X,XXX [MRP strikethrough]     │
│  [⭐ 4.8]                       │
│                                 │
│  [Tag] [Tag]                    │
│                                 │
│  [View Details →]               │
└─────────────────────────────────┘
```

**Button Layout (Top-Left):**
- Favorite Button: 40x40px, white/95 backdrop, rounded-full, z-30
- Cart Button: 40x40px, white/95 backdrop, rounded-full (below favorite)
- Gap: 8px (gap-2)

**Badge Layout (Top-Right):**
- Discount Badge (if applicable): Red gradient, rounded-full
- Category Badge: Color-coded gradient, rounded-full
- Layout: Side-by-side with gap-2

**Price Display:**
- MRP (if exists): Gray, strikethrough, 14px
- Selling Price: 24px, bold, gradient text (primary → secondary)
- Discount Percentage: Red badge (-X%)

**Visual States:**
- Default: Border gray-200, shadow-sm
- Hover: shadow-md, translate-y-1 (lift effect)
- Cart Button Click: Green for 1 second with checkmark

### 4.2 Header Component

**Height:** 64px (h-16)
**Background:** White with border-bottom
**Position:** Sticky top-0, z-50

**Desktop Layout:**
```
[Logo] [Nav Links] [Search Bar] [Cart (badge)]
```

**Mobile Layout:**
```
[Logo]                      [Hamburger]
[Search Bar (full width)]
```

**Cart Badge:**
- Size: 18px circle
- Background: Red gradient
- Position: Top-right of cart icon
- Shows: Total item count

### 4.3 Footer Component

**Background:** Gray-900 (dark)
**Text Color:** Gray-300
**Links Hover:** Primary color

**Layout (Desktop):**
```
┌──────────────────────────────────────────────┐
│  [Company Info]  [Quick Links]  [Categories] │
│  [Logo + Desc]   [Products]     [RO Systems] │
│                  [About]        [Filters]    │
│                  [Contact]      [Parts]      │
│                                              │
│  [Customer Support]          [Social Media]  │
│  [WhatsApp, Email, Phone]   [Icons]         │
│                                              │
│  Copyright © 2025 Kavita Enterprises         │
└──────────────────────────────────────────────┘
```

### 4.4 Chatbot Widget

**Position:** Fixed bottom-right
**Size:** 56x56px button, expands to 400x600px
**Color:** Primary gradient

**Features:**
- 24/7 automated responses
- Product inquiries
- Warranty information
- Contact information
- WhatsApp redirect for human support

**Dialog Position:**
- Desktop: Bottom-right corner
- Mobile: Full screen overlay

### 4.5 WhatsApp Float Button

**Position:** Fixed bottom-right (below chatbot)
**Size:** 56x56px
**Color:** Green (#25D366)
**Icon:** WhatsApp logo
**Hover:** Scale 1.1, shadow-lg

### 4.6 Prepaid Promo Card

**Used On:** Product Detail Page, Cart Page
**Background:** Gradient green-50 to emerald-50

**Structure:**
```
┌─────────────────────────────────────────┐
│ 💰 Save More on Your Order!            │
│ Delivery + Prepaid discounts           │
│                                         │
│ 🚚 Delivery Savings:                   │
│ [✓] Orders ≥ ₹1,999: ₹199 (save ₹100) │
│ [✓] Orders ≥ ₹4,999: FREE (save ₹299)  │
│                                         │
│ 💰 Prepaid Discounts:                  │
│ [✓] 5% off (up to ₹100) ≤ ₹5,000      │
│ [✓] Flat ₹250 off > ₹5,000            │
│                                         │
│ Flow: Cart → WhatsApp → Confirm → Pay │
│                                         │
│ ℹ️ Redirected to WhatsApp for checkout│
└─────────────────────────────────────────┘
```

### 4.7 Delivery Charge Display (Cart Page)

**Location:** Order Summary → Between Subtotal and Total

**Dynamic Display:**
- **< ₹1,999:** ₹299 (standard, gray text)
- **≥ ₹1,999:** ~~₹299~~ ₹199 (green, strikethrough original)
- **≥ ₹4,999:** ~~₹299~~ FREE (bold green)

**Savings Badge:**
- Shows when discounted/free
- Color: Green-50 background
- Text: "Save ₹X! Add ₹Y more for FREE delivery"

---

## 5. Features & Functionality

### 5.1 Cart System

**Implementation:** `app-main.js` - `Cart` object

**Methods:**
```javascript
Cart.getCart() // Returns array of cart items
Cart.addItem(id, quantity) // Adds or increments product
Cart.updateItemQuantity(id, quantity) // Updates quantity
Cart.removeItem(id) // Removes product
Cart.clearCart() // Empties cart
Cart.updateCartIcon() // Updates header badge count
```

**Storage:** localStorage key: `'cart'`

**Data Structure:**
```json
[
  {
    "id": "1",
    "quantity": 2
  }
]
```

**Behavior:**
- If product exists: Increment quantity
- If new product: Add with quantity
- Quantity 0 or less: Remove from cart
- Updates persist across sessions

### 5.2 Favorites System

**Implementation:** `app-main.js` - `Favorites` object

**Methods:**
```javascript
Favorites.getSaved() // Returns array of favorite IDs
Favorites.isSaved(id) // Checks if product is favorited
Favorites.toggle(id) // Adds/removes favorite
```

**Storage:** localStorage key: `'favorites'`

**Visual States:**
- Saved: Pink background, filled heart icon
- Not saved: White background, outlined heart icon

**Event System:**
- Dispatches `'favorites:updated'` event on change
- Updates all favorite buttons across page

### 5.3 Pricing System

**Dual Pricing Model:**

1. **MRP (Maximum Retail Price)** - Original price
2. **Selling Price** - Discounted/actual price

**Display Logic:**
```javascript
const sellingPrice = product.sellingPrice || product.price || 0;
const mrp = product.mrp || null;

if (mrp && mrp > sellingPrice) {
  discountPercent = Math.round(((mrp - sellingPrice) / mrp) * 100);
  // Show: ₹X,XXX with strikethrough MRP
} else {
  // Show: ₹X,XXX only
}
```

**Discount Badge:**
- Only shown when MRP > sellingPrice
- Format: "X% OFF"
- Color: Red gradient
- Position: Top-right with category badge

### 5.4 Delivery Charge System

**Tiers:**

| Order Subtotal | Delivery Charge | Savings | Display |
|----------------|-----------------|---------|---------|
| < ₹1,999 | ₹299 | ₹0 | Gray text |
| ≥ ₹1,999 | ₹199 | ₹100 | ~~₹299~~ ₹199 (green) |
| ≥ ₹4,999 | ₹0 (FREE) | ₹299 | ~~₹299~~ FREE (bold green) |

**Implementation:** `cart.html` - `updateCartSummary()` function

**Tooltip Updates:**
- Standard: "Add ₹X more to save ₹100"
- Discounted: "Add ₹X more for FREE delivery"
- Free: "FREE delivery on orders ≥ ₹4,999"

### 5.5 Prepaid Discount System

**Manual Application:** Applied by staff during WhatsApp checkout

**Tiers:**

| Order Subtotal | Discount | Max Cap |
|----------------|----------|---------|
| ≤ ₹5,000 | 5% | ₹100 |
| > ₹5,000 | Flat | ₹250 |

**Note:** Not automatically calculated, shown as promotion only

### 5.6 Search Functionality

**Location:** Header (all pages)

**Features:**
- Real-time search on products page
- Searches: Product name, description, SKU, category
- Case-insensitive
- Updates results count dynamically

**Implementation:**
```javascript
searchInput.addEventListener('input', (e) => {
  searchTerm = e.target.value.toLowerCase().trim();
  filterProducts();
  displayProducts();
});
```

### 5.7 Filter System (Products Page)

**Filter Types:**

1. **Category Filter**
   - Radio buttons: All, RO Systems, Filters, Parts, Accessories
   - Badge colors: Blue, Green, Purple, Orange
   - URL parameter: `?category=RO%20Systems`

2. **Price Range Filter**
   - Radio buttons: All, Under ₹5,000, ₹5,000-₹10,000, ₹10,000-₹20,000, Above ₹20,000
   - Uses sellingPrice for comparison

3. **Search Filter**
   - Text input in sidebar
   - Searches across all product fields

**URL Integration:**
- Category from URL takes precedence
- Multiple categories supported: `?categories=RO+Systems,Filters`
- Updates browser history on filter change

### 5.8 Product Gallery (Product Detail Page)

**Layout:**
- Main image: Large display with border
- Thumbnails: 4-5 below main image
- Click thumbnail: Updates main image
- Default: First image in array

### 5.9 Quantity Selector

**Location:** Product Detail Page

**Controls:**
- Minus button (disabled at quantity 1)
- Quantity display (center)
- Plus button

**Validation:**
- Minimum: 1
- No maximum (business can handle large orders)

### 5.10 Related Products

**Logic:** Same category, exclude current product

**Display:** Horizontal scroll/grid (4 products)

**Price Display:** Uses sellingPrice || price fallback

### 5.11 Product Tabs (Product Detail Page)

**Tabs:**
1. **Description** - Full product description
2. **Specifications** - Technical details table
3. **Warranty** - Warranty information (if applicable)

**Implementation:** JavaScript tab switching, aria-selected attributes

---

## 6. Data Structure

### 6.1 Products Database

**File:** `data/products.json`

**Schema:**
```json
{
  "id": "1",
  "sku": "KE-RO-001",
  "name": "Product Name",
  "category": "RO Systems|Filters|Parts|Accessories",
  "description": "Detailed product description",
  "price": 12999, // Fallback price
  "sellingPrice": 9999, // Actual selling price
  "mrp": 15999, // Original MRP (optional)
  "images": [
    "assets/images/product_1.jpg",
    "assets/images/product_2.jpg"
  ],
  "tags": ["Tag1", "Tag2", "Tag3"],
  "warranty": "1 year manufacturer warranty",
  "specifications": {
    "Brand": "Value",
    "Model": "Value",
    "Capacity": "Value"
  },
  "inStock": true,
  "featured": true
}
```

**Required Fields:**
- id, sku, name, category, description, price, images (min 1)

**Optional Fields:**
- sellingPrice, mrp, tags, warranty, specifications, inStock, featured

### 6.2 Category Badge Colors

**Mapping:** Consistent across all pages

```javascript
{
  'RO Systems': 'bg-gradient-to-r from-blue-500 to-blue-600',
  'Filters': 'bg-gradient-to-r from-green-500 to-green-600',
  'Parts': 'bg-gradient-to-r from-purple-500 to-purple-600',
  'Accessories': 'bg-gradient-to-r from-orange-500 to-orange-600'
}
```

### 6.3 localStorage Structure

**Keys Used:**

1. **cart** (Array)
```json
[
  {"id": "1", "quantity": 2},
  {"id": "3", "quantity": 1}
]
```

2. **favorites** (Array)
```json
["1", "5", "12"]
```

3. **chatbot-messages** (Array) - Chat history

---

## 7. User Flows

### 7.1 Browse & Add to Cart Flow

```
1. User lands on homepage
   ↓
2. Views featured products OR clicks "Products"
   ↓
3. [Products Page] Applies filters (optional)
   ↓
4. Clicks product card OR quick add button
   ↓
   ├─ Quick Add: Product added to cart (1 qty)
   │              Green checkmark feedback
   │              Cart badge updates
   │
   └─ View Details: Goes to product detail page
      ↓
      5. Views gallery, reads description, specs
      ↓
      6. Selects quantity
      ↓
      7. Clicks "Add to Cart"
      ↓
      8. Success alert shown
      ↓
      9. Cart badge updates
```

### 7.2 Checkout Flow

```
1. User clicks cart icon in header
   ↓
2. Reviews cart items
   │ ├─ Can update quantities
   │ ├─ Can remove items
   │ └─ Can click product to view details
   ↓
3. Reviews order summary
   │ ├─ Subtotal calculated
   │ ├─ Delivery charge shown (dynamic)
   │ └─ Total calculated
   ↓
4. Reads prepaid promo card
   │ ├─ Delivery savings explained
   │ └─ Prepaid discounts explained
   ↓
5. Clicks "Proceed to Checkout"
   ↓
6. Checkout modal opens
   │ ├─ Reviews order details
   │ ├─ Sees WhatsApp redirect message
   │ └─ Clicks "Continue to WhatsApp"
   ↓
7. WhatsApp opens with pre-filled message
   │ ├─ Customer details
   │ ├─ Cart items
   │ ├─ Total amount
   │ └─ Special requests
   ↓
8. Staff confirms availability
   ↓
9. Staff applies prepaid discount
   ↓
10. Customer completes payment (offline/bank transfer)
    ↓
11. Order confirmed
```

### 7.3 Expert Consultation Flow

```
1. User scrolls to "Expert Advice" section (homepage)
   ↓
2. Fills out form:
   │ ├─ Name (required)
   │ ├─ Phone (required)
   │ ├─ Address (required)
   │ ├─ Family Size (optional)
   │ └─ Water Source (optional)
   ↓
3. Clicks "Get Expert Advice"
   ↓
4. WhatsApp opens with formatted message
   ↓
5. Staff responds with consultation
```

### 7.4 Chatbot Interaction Flow

```
1. User clicks chatbot icon (bottom-right)
   ↓
2. Chatbot dialog opens
   ↓
3. User types query
   ↓
4. Bot analyzes query (regex patterns)
   │
   ├─ Product inquiry → Shows product info
   ├─ Warranty → Shows warranty details
   ├─ Contact → Shows contact options
   ├─ Pricing → Shows price ranges
   └─ General → Shows help message
   ↓
5. User can continue conversation or close
   ↓
6. If unresolved: Bot suggests WhatsApp contact
```

---

## 8. Technical Architecture

### 8.1 File Structure

```
KavitaEnterprises.github.io/
├── index.html              # Homepage
├── products.html           # Product listing
├── product.html            # Product detail
├── cart.html              # Shopping cart
├── contact.html           # Contact page
├── terms.html             # Terms & conditions
├── shipping-returns.html  # Shipping info
├── warranty.html          # Warranty info
├── wholesale.html         # Wholesale inquiry
├── robots.txt             # SEO crawling rules
├── sitemap.xml            # SEO sitemap
│
├── assets/
│   └── images/            # Product & UI images
│       ├── hero.png
│       ├── ro_system_1.jpg
│       └── ...
│
├── components/
│   ├── header.html        # Reusable header
│   ├── footer.html        # Reusable footer
│   ├── icons-sprite.html  # SVG icons
│   └── whatsapp-float.html # WhatsApp button
│
├── css/
│   └── style.css          # Global styles (Tailwind)
│
├── data/
│   └── products.json      # Products database
│
└── js/
    ├── include.js         # Component loader
    ├── main.js            # Global utilities
    ├── products-db.js     # Product data handler
    ├── app-main.js        # Cart, Favorites, Alerts
    └── chat-assistant.js  # Chatbot logic
```

### 8.2 Component Loading System

**Implementation:** `js/include.js`

**Usage:**
```html
<div data-include="components/header.html"></div>
```

**Process:**
1. Scans for `[data-include]` elements
2. Fetches component HTML
3. Injects into DOM
4. Removes `[data-include]` attribute
5. Fires `'components-loaded'` event

### 8.3 Product Data Loading

**Implementation:** `js/products-db.js`

**Centralized Loading:**
```javascript
window.ProductDB = {
  getAllProducts: async () => {
    // Caches products after first load
    // Returns array of all products
  }
};
```

**Benefits:**
- Single source of truth
- Caching reduces API calls
- Consistent error handling

### 8.4 Dependencies

**CSS Framework:** Tailwind CSS (via CDN)
```html
<script src="https://cdn.tailwindcss.com"></script>
```

**Icons:** Material Symbols Rounded
```html
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded" />
```

**No Build Process:** Static site, no npm/webpack required

### 8.5 Browser Compatibility

**Supported Browsers:**
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

**Features Used:**
- ES6+ JavaScript (arrow functions, async/await, template literals)
- Fetch API
- localStorage
- CSS Grid & Flexbox

**Fallbacks:**
- Placeholder images for broken product images
- Default values for missing product data
- Error handling for failed API calls

### 8.6 Performance Considerations

**Optimizations:**
- Lazy loading images (browser native)
- Product data caching
- Minimal external dependencies
- Static HTML (no server rendering)

**Current Issues to Address:**
- No image compression pipeline
- No minification (CSS/JS)
- No HTTP/2 push
- No service worker (offline support)

---

## 9. Audit Checklist

### 9.1 Visual Consistency Audit

#### Colors
- [ ] All primary buttons use cyan gradient (primary → primary-dark)
- [ ] All discount badges use red gradient
- [ ] All category badges use correct color mapping
- [ ] Favorite buttons turn pink when active
- [ ] Cart buttons turn green on successful add
- [ ] Links hover to primary color
- [ ] Footer uses gray-900 background

#### Typography
- [ ] All headings use bold weight (font-bold)
- [ ] Body text uses gray-600 or gray-900
- [ ] Prices use consistent size (text-2xl for main price)
- [ ] SKU uses monospace font (font-mono)
- [ ] All text meets WCAG contrast ratios

#### Spacing
- [ ] Product cards have consistent padding (p-6)
- [ ] Sections have consistent gaps (gap-4, gap-6, gap-8)
- [ ] Header height is 64px (h-16) across all pages
- [ ] Footer padding is consistent
- [ ] Mobile spacing matches desktop proportionally

#### Buttons
- [ ] Favorite buttons: 40x40px on all pages
- [ ] Cart quick-add buttons: 40x40px on all pages
- [ ] Primary CTAs use gradient with hover effects
- [ ] Secondary buttons use border-2 with hover
- [ ] Disabled states have opacity-50

#### Badges
- [ ] Discount badges always top-right
- [ ] Category badges always next to discount (if present)
- [ ] Favorite button always top-left alone
- [ ] Cart button always below favorite
- [ ] Trust badges consistent across pages

### 9.2 Functionality Audit

#### Cart System
- [ ] Add to cart from product page works
- [ ] Quick add from product cards works (homepage & products page)
- [ ] Quantity increment/decrement works
- [ ] Remove item works
- [ ] Cart badge shows correct count
- [ ] Cart persists across page reloads
- [ ] Empty cart shows empty state
- [ ] Visual feedback (green checkmark) shows on add

#### Favorites System
- [ ] Toggle favorite works on all pages
- [ ] Favorite state persists across reloads
- [ ] Favorite icon updates correctly (outlined ↔ filled)
- [ ] Button background changes to pink when saved
- [ ] Events update all instances across page

#### Pricing Display
- [ ] MRP shows with strikethrough when present
- [ ] Discount percentage calculates correctly
- [ ] sellingPrice used as primary display price
- [ ] Fallback to price field works if sellingPrice missing
- [ ] Cart shows correct prices (sellingPrice || price)
- [ ] Related products show correct prices

#### Delivery Charges
- [ ] Standard ₹299 shown for orders < ₹1,999
- [ ] ₹199 shown for orders ≥ ₹1,999 (with strikethrough)
- [ ] FREE shown for orders ≥ ₹4,999 (with strikethrough)
- [ ] Savings badge shows when discounted/free
- [ ] Tooltip updates with threshold amounts
- [ ] Total includes delivery charges

#### Filters (Products Page)
- [ ] Category filter updates products
- [ ] Price range filter works correctly
- [ ] Search filter searches all fields
- [ ] Multiple filters work together (AND logic)
- [ ] Results count updates
- [ ] URL parameter loads correct category
- [ ] Clear filters resets to all products

#### Search (Global)
- [ ] Header search works on all pages
- [ ] Products page search updates in real-time
- [ ] Case-insensitive matching
- [ ] No results shows appropriate message

#### Product Detail
- [ ] Gallery thumbnails update main image
- [ ] Quantity selector works (min 1, no max)
- [ ] Add to cart adds correct quantity
- [ ] Tabs switch correctly (Description, Specs, Warranty)
- [ ] Related products show same category
- [ ] Related products exclude current product
- [ ] Prepaid promo card displays correctly

#### Cart Page
- [ ] Product images are clickable (go to product page)
- [ ] Product names are clickable (go to product page)
- [ ] Hover effects work on links
- [ ] Prepaid promo shows delivery section first
- [ ] Prepaid promo shows prepaid section second
- [ ] Promo card only shows when cart has items
- [ ] Checkout button triggers WhatsApp modal
- [ ] WhatsApp message formats correctly

#### Navigation
- [ ] All header links work
- [ ] Logo links to homepage
- [ ] Footer links work
- [ ] Mobile menu toggles correctly
- [ ] Back to top button works (if present)

#### Forms
- [ ] Expert advice form validates required fields
- [ ] Form submits to WhatsApp with correct formatting
- [ ] Contact form works
- [ ] Wholesale inquiry form works

#### Chatbot
- [ ] Opens/closes correctly
- [ ] Responds to queries
- [ ] Product patterns recognized
- [ ] Warranty patterns recognized
- [ ] Contact patterns recognized
- [ ] WhatsApp redirect works for unresolved queries

### 9.3 Data Consistency Audit

#### Product Data
- [ ] All products have required fields (id, sku, name, category, description, price, images)
- [ ] All product IDs are unique
- [ ] All SKUs are unique
- [ ] Image paths are correct and images exist
- [ ] Categories match predefined list
- [ ] Prices are positive numbers
- [ ] sellingPrice ≤ mrp (if both present)
- [ ] Specifications formatted as key-value object
- [ ] Tags are array of strings

#### Category Consistency
- [ ] Category names match exactly across:
  - [ ] products.json
  - [ ] products.html filters
  - [ ] getCategoryBadgeColor() function
  - [ ] Navigation menus

#### Price Field Usage
- [ ] Homepage uses: `sellingPrice || price || 0`
- [ ] Products page uses: `sellingPrice || price || 0`
- [ ] Product detail uses: `sellingPrice || price || 0`
- [ ] Cart page uses: `sellingPrice || price` (from matched product)
- [ ] Related products use: `sellingPrice || price || 0`

#### Image Paths
- [ ] All product images use relative paths: `assets/images/`
- [ ] No absolute paths: ~~`/assets/images/`~~
- [ ] Fallback image exists: `assets/images/placeholder.jpg`

#### Links
- [ ] All internal links use relative paths
- [ ] Product page links: `product.html?id=X` (not `/product.html`)
- [ ] Products page link: `products.html` (not `/products.html`)
- [ ] No broken links (404s)

### 9.4 Responsive Design Audit

#### Breakpoints
- [ ] Mobile (<640px): Single column, stacked layout
- [ ] Tablet (640-1024px): 2 columns, adjusted spacing
- [ ] Desktop (>1024px): Full layout, 3-4 columns

#### Mobile-Specific
- [ ] Header collapses to hamburger menu
- [ ] Product cards stack vertically
- [ ] Cart items stack vertically
- [ ] Forms are full-width with larger touch targets
- [ ] Chatbot goes full-screen
- [ ] Footer stacks vertically
- [ ] Buttons are minimum 44x44px (touch target)

#### Images
- [ ] All images are responsive (max-w-full, h-auto)
- [ ] Product images maintain aspect ratio
- [ ] Hero images scale properly
- [ ] No horizontal scrolling

### 9.5 Content Audit

#### Text Content
- [ ] All dummy "Lorem ipsum" text replaced
- [ ] Product descriptions are accurate and detailed
- [ ] No placeholder text in UI
- [ ] No "TODO" or "Coming soon" messages
- [ ] Warranty information is complete
- [ ] Specifications are filled out

#### Contact Information
- [ ] WhatsApp number is correct: +91 9821560609
- [ ] Email address is correct (if applicable)
- [ ] Business address is correct
- [ ] Support hours listed: 11 AM - 5 PM Mon-Sat

#### Legal Pages
- [ ] Terms & Conditions complete
- [ ] Shipping & Returns policy complete
- [ ] Warranty policy complete
- [ ] Privacy policy complete (if applicable)

### 9.6 SEO Audit

#### Meta Tags
- [ ] All pages have `<title>` tags
- [ ] All pages have meta descriptions
- [ ] Meta descriptions are 150-160 characters
- [ ] Open Graph tags for social sharing
- [ ] Favicon present

#### Heading Structure
- [ ] One H1 per page
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Headings are descriptive
- [ ] No skipped heading levels

#### Alt Text
- [ ] All images have alt attributes
- [ ] Alt text is descriptive
- [ ] Product images use product name + description

#### URLs
- [ ] URLs are clean and descriptive
- [ ] Product page uses `?id=` parameter
- [ ] No special characters in URLs

#### Sitemap & Robots
- [ ] sitemap.xml includes all pages
- [ ] robots.txt allows crawling
- [ ] No orphaned pages

### 9.7 Performance Audit

#### Load Time
- [ ] Homepage loads in <3 seconds
- [ ] Products page loads in <3 seconds
- [ ] Product detail page loads in <3 seconds

#### Image Optimization
- [ ] Images are compressed (JPEG quality 80-85%)
- [ ] Images are correctly sized (not oversized)
- [ ] Consider WebP format for better compression

#### JavaScript
- [ ] No console errors
- [ ] No unused JavaScript
- [ ] Scripts load in correct order

#### CSS
- [ ] No unused CSS
- [ ] Critical CSS inline (for above-fold content)

### 9.8 Browser Testing

#### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Mobile Browsers
- [ ] iOS Safari
- [ ] Chrome Mobile (Android)
- [ ] Samsung Internet

#### Test Scenarios
- [ ] Add to cart
- [ ] Checkout flow
- [ ] Search & filters
- [ ] Form submissions
- [ ] Responsive breakpoints

### 9.9 Accessibility Audit

#### Keyboard Navigation
- [ ] All interactive elements focusable
- [ ] Focus visible (outline or ring)
- [ ] Tab order is logical
- [ ] Enter/Space work on buttons

#### Screen Reader
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Buttons have descriptive text
- [ ] ARIA labels where needed
- [ ] Heading structure is logical

#### Color Contrast
- [ ] Text meets WCAG AA (4.5:1 for normal text)
- [ ] Large text meets WCAG AA (3:1)
- [ ] UI elements meet contrast requirements

#### Forms
- [ ] Required fields marked
- [ ] Error messages are clear
- [ ] Success messages are clear
- [ ] Labels associated with inputs

---

## 10. Pre-Launch Checklist

### Content
- [ ] Replace all dummy product data with real products
- [ ] Add real product images (high quality)
- [ ] Write unique product descriptions
- [ ] Add specifications for all products
- [ ] Verify pricing (MRP + selling price)
- [ ] Add warranty information
- [ ] Update contact information
- [ ] Review and finalize legal pages

### Design
- [ ] Final design review
- [ ] Check all pages on mobile
- [ ] Verify brand consistency
- [ ] Check all images load correctly
- [ ] Test all hover states

### Functionality
- [ ] Run full audit checklist (Section 9)
- [ ] Test checkout flow end-to-end
- [ ] Test all forms
- [ ] Verify WhatsApp integration
- [ ] Test chatbot responses

### SEO
- [ ] Add meta descriptions to all pages
- [ ] Verify sitemap.xml
- [ ] Set up Google Search Console
- [ ] Set up Google Analytics (if needed)
- [ ] Submit sitemap to search engines

### Performance
- [ ] Optimize all images
- [ ] Test page load times
- [ ] Fix any console errors
- [ ] Verify mobile performance

### Legal & Compliance
- [ ] Privacy policy (if collecting data)
- [ ] Cookie notice (if using cookies)
- [ ] GST compliance (display GST number if applicable)
- [ ] Business registration details

---

## 11. Known Issues & Future Enhancements

### Current Limitations
1. No payment gateway (WhatsApp-based ordering only)
2. No order tracking system
3. No user accounts/profiles
4. No product reviews/ratings (showing dummy 4.8)
5. No inventory management
6. Manual prepaid discount application
7. No automated email confirmations

### Future Enhancements
1. **Phase 2 Features:**
   - User authentication
   - Order history
   - Wishlist (separate from favorites)
   - Product reviews and ratings
   - Live inventory status
   - Enhanced search with filters

2. **Technical Improvements:**
   - Image CDN integration
   - Progressive Web App (PWA)
   - Service worker for offline support
   - Build process (minification, bundling)
   - Automated testing

3. **Business Features:**
   - Payment gateway integration
   - Order management dashboard
   - Automated email notifications
   - Invoice generation
   - Inventory tracking

---

## 12. Maintenance Guidelines

### Regular Tasks

**Weekly:**
- Check for broken links
- Monitor console for errors
- Review chatbot conversation logs (if tracked)

**Monthly:**
- Update product inventory
- Review and respond to WhatsApp inquiries
- Check analytics for user behavior
- Update featured products

**Quarterly:**
- Content audit
- SEO performance review
- Security updates (dependencies)
- Design refresh considerations

### Adding New Products

1. Open `data/products.json`
2. Add new product object with all required fields
3. Ensure unique ID and SKU
4. Add product images to `assets/images/`
5. Test product displays correctly on all pages
6. Verify filters work with new product
7. Check related products logic

### Modifying Design

1. Update Tailwind classes in HTML
2. Test responsive breakpoints
3. Verify consistency across all pages
4. Check browser compatibility
5. Update this documentation if design system changes

---

## 13. Support & Contact

### Development Team
**Primary Contact:** [Your Name/Team]
**Email:** [Your Email]
**WhatsApp:** [Your Number]

### Business Contact
**Business Name:** Kavita Enterprises
**WhatsApp:** +91 9821560609
**Support Hours:** 11 AM - 5 PM (Monday - Saturday)

### Documentation Updates
Last Updated: October 16, 2025
Version: 1.0
Next Review: Before Launch

---

**End of Documentation**

This document serves as the single source of truth for the Kavita Enterprises website. Any changes to design, functionality, or data structure should be reflected here.
