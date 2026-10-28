# DPS Indirapuram (DPSI) Tech & Innovation Exhibition
### Photorealistic 3D Virtual Floor Plan & Anti-Cheat Live Voting Web Application

A photorealistic, architectural light-themed 3D Virtual Exhibition and Live Voting Web Application built with **Next.js (App Router)**, **Three.js**, **React Three Fiber (R3F)**, **Drei**, **Zustand**, **Framer Motion**, and a 4-layer **Anti-Cheat Voting Engine**.

🌐 **Live on Cloudflare:** [https://dpsiexibition.pages.dev](https://dpsiexibition.pages.dev)

---

## 🏛️ Photorealistic Light Architectural Design

1. **Floor Realism:**
   - Polished Carrara white marble / showroom epoxy floor using `<MeshReflectorMaterial />` reflecting daylight, exhibits, and soft spotlights.
2. **Daytime Natural Lighting:**
   - Sunlit warm directional light (`#fffcf5`, intensity 1.8) casting soft physical contact shadows (`<ContactShadows />`).
   - Hemispheric sky bounce light and frosted glass skylight canopy with architectural space-frame trusses.
3. **Physical Exhibit Materials:**
   - Brushed titanium plinths, crystal acrylic display screens with light refraction, frosted glass backboards, and recessed ambient LED strips.
4. **Typography & UI:**
   - Headings: [**Outfit**](https://fonts.google.com/specimen/Outfit) — geometric, legible, and modern.
   - Technical badges & coordinates: [**Space Grotesk**](https://fonts.google.com/specimen/Space+Grotesk).
   - High-contrast charcoal text on luminous alabaster glass cards for crystal-clear readability.

---

## 📱 Mobile-First Accessibility Features

- **Mobile Bottom Action Dock:** Quick-touch tabs (`All`, `Z1: Show & Tell`, `Z2: 30-Pod`, `Z3: Robo`, `2D/3D`, `Ranks`, `Auth`).
- **Mobile Bottom Sheet:** Project detail drawer smoothly slides up from the bottom with drag-to-dismiss gesture and a thumb-accessible sticky voting button.
- **Enlarged Touch Targets:** Invisible cylindrical hit-boxes around 3D booths ensure effortless tapping on small mobile screens.
- **Optimized Mobile Performance:** DPR capped to 1.25x and reflection resolution tuned to 512 to preserve battery and maintain a steady 60 FPS.
- **Safe Area Insets:** Full support for iPhone notch and home indicators (`pt-safe`, `pb-safe`, `viewportFit: 'cover'`).

---

## ☁️ Cloudflare Deployment & Custom Domain

### 1. Live Deployment
The project is hosted on Cloudflare Pages:
- **Production URL:** [https://dpsiexibition.pages.dev](https://dpsiexibition.pages.dev)
- **Deployment Script:** `npm run deploy`

### 2. Attaching Custom Domain (`dpsiexibition.com`):
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com).
2. Go to **Workers & Pages** -> **`dpsiexibition`**.
3. Navigate to the **Custom domains** tab and click **Set up a custom domain**.
4. Enter your domain (e.g., `dpsiexibition.com` or `dpsiexibition.in`).
5. Cloudflare automatically provisions free SSL/TLS and connects your domain to `https://dpsiexibition.pages.dev`.

---

## 🚀 Local Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Run local development server
npm run dev

# Build and export static assets
npm run build

# Deploy to Cloudflare Pages
npm run deploy
```
