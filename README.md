# monis.rent — Workspace Designer

> Interactive workspace configurator for office equipment rental in Bali, Indonesia.

Digital nomads and startups can visually build their dream office setup — picking desks, chairs, monitors, lighting, plants, and accessories — then rent everything with a single click.

---

## Tech Stack

| | Technology | Version |
|---|---|---|
| **Framework** | Next.js (App Router) | 16.0.10 |
| **Styling** | Tailwind CSS | v4 |
| **Language** | TypeScript | 5.x |
| **State** | Zustand | 5.x |
| **Animations** | Framer Motion | 12.x |
| **Icons** | Lucide React | 0.5x |

---

## Features

- **Live SVG preview** — workspace renders in real-time as items are selected; spring-physics animations via Framer Motion
- **Category selector** — native `<select>` dropdown cycles through Desks → Chairs → Monitors → Lighting → Plants → Extras
- **Smart hotspots** — floating "Add a Chair!", "Add Monitor!", etc. buttons appear contextually on the scene
- **Checkout panel** — multi-step modal: item review → rental form with validation → success confirmation
- **Floating cart** — always-visible mobile CTA showing live monthly total
- **Responsive** — works on mobile, tablet, and desktop

### Product Catalog

| Category | Items |
|---|---|
| Desks | Standing Desk Pro · L-Shape Corner · Minimal Oak |
| Chairs | ErgoMax Pro · Executive Leather · Scandi Minimal |
| Monitors | 27" 4K · 34" Ultrawide · 15.6" Portable |
| Lighting | LED Desk Lamp · Monitor Light Bar · Floor Lamp |
| Plants | Monstera · Snake Plant · Golden Pothos |
| Extras | Mechanical Keyboard · Ergonomic Mouse · Noise-Cancelling Headphones · Desk Mat · Laptop Stand · Cable Kit |

---

## Project Structure

```
src/
├── app/
│   ├── globals.css            # CSS variables, utility classes (.form-select, .btn-primary, etc.)
│   ├── layout.tsx
│   └── page.tsx               # Root page — composes all sections
├── components/
│   ├── Header.tsx
│   ├── CategorySelector.tsx   # Dropdown + product grid panel
│   ├── ProductCard.tsx        # Single selectable product tile
│   ├── WorkspacePreview.tsx   # SVG scene with live animations + hotspots
│   ├── RentCTA.tsx            # "Rent Your Setup!" call-to-action
│   ├── CheckoutPanel.tsx      # Multi-step checkout modal
│   ├── FloatingCart.tsx       # Mobile sticky cart button
│   ├── LifestyleZones.tsx     # Coming-soon lifestyle section
│   └── Footer.tsx
├── data/
│   └── products.ts            # All products + category definitions
├── store/
│   └── workspace.ts           # Zustand store (setup state, actions)
└── types/
    └── index.ts               # TypeScript interfaces
```

---

## Getting Started

```bash
npm install
npm run dev
# → http://localhost:3000
```

---

## Design Decisions

- **CSS variables** for the entire color system (`--color-primary`, `--color-border`, etc.) — easy theming
- **`.container-padded`** utility class ensures consistent max-width (1440px) and responsive horizontal padding across Header, Main, and Footer
- **Zustand** over Context API — no boilerplate, selector-based subscriptions prevent unnecessary re-renders
- **Native `<select>`** for category switching — accessible, consistent across platforms, styled via `.form-select` in `globals.css`
- **SVG workspace** — no image assets required; all furniture rendered as vector shapes that animate with Framer Motion

---

## Roadmap

- [ ] Drag & drop item positioning in the preview scene
- [ ] Rental duration tiers (weekly / monthly / quarterly pricing)
- [ ] Saved configurations via user accounts
- [ ] Real product photos from monis.rent inventory
- [ ] 3D view with React Three Fiber
