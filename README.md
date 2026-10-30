# DPS Indirapuram (DPSI) Tech & Innovation Exhibition
### Photorealistic 3D Virtual Floor Plan & Anti-Cheat Live Voting Web Application

A photorealistic, architectural light-themed 3D Virtual Exhibition and Live Voting Web Application built with **Next.js (App Router)**, **Three.js**, **React Three Fiber (R3F)**, **Drei**, **Zustand**, **Framer Motion**, and a 4-layer **Anti-Cheat Voting Engine**.

🌐 **Live on Cloudflare:** [https://dpsiexibition.pages.dev](https://dpsiexibition.pages.dev)

---

## 🏛️ Photorealistic Light Architectural Design & 3D Engineering

1. **Floor Realism & Anti-Aliased Surface:**
   - Solid 3D Carrara white satin floor slabs with tuned PBR standard material (`roughness: 0.48`, `metalness: 0.2`) for a clean, noise-free architectural look without shadow acne or coplanar z-fighting.
2. **Cosmic Milky Way Skybox:**
   - High-fidelity, bilaterally smoothed equirectangular celestial skybox (`public/textures/milkyway_smooth.jpg` and `milkyway_mobile_smooth.jpg`) based on ESO astronomical panoramas, free of harsh particle noise.
3. **Daytime Natural Lighting:**
   - Sunlit warm directional light (`#fffcf5`, intensity 1.8) casting soft physical contact shadows with positive bias (`0.0004`) to eradicate zebra-pattern shadow artifacts.
   - Hemispheric sky bounce light and frosted glass skylight canopy with architectural space-frame trusses.
4. **Physical Exhibit Materials:**
   - Brushed titanium plinths, crystal acrylic display screens with light refraction, frosted glass backboards, and recessed ambient LED strips.
5. **Blueprint-Accurate Booth Layouts:**
   - **Show & Tell Area (ST01–ST08):** Set inside an angled pavilion structure (-18.38° / -0.3208 rad) with booths arranged in a single continuous row along the back wall, preserving an open 9.2m walkway.
   - **Main Concourse (P01–B07):** Dual horseshoe arrangement with wide aisles, directional orientations facing walkways, and student-to-project mappings synchronized with the official roster.
6. **Typography & UI:**
   - Headings: [**Outfit**](https://fonts.google.com/specimen/Outfit) — geometric, legible, and modern.
   - Technical badges & coordinates: [**Space Grotesk**](https://fonts.google.com/specimen/Space+Grotesk).
   - High-contrast charcoal text on luminous alabaster glass cards for crystal-clear readability.

---

## 📱 Mobile-First Accessibility & Navigation Features

- **Mobile 5 Full-Screen Drawer:** Smooth animated navigation drawer featuring quick category filters, real-time stats, and quick links.
- **Global Search Modal:** Instant fuzzy search across all 35 exhibits by student name, booth ID, category, or project description (`Cmd+K` / `Ctrl+K` or search button).
- **Floating Camera Controls:** Intuitive 3D zoom in (+), zoom out (-), and camera reset controls for effortless floor plan exploration on touch and desktop.
- **Mobile Bottom Action Dock:** Quick-touch tabs (`All`, `Z1: Show & Tell`, `Z2: 30-Pod`, `Z3: Robo`, `2D/3D`, `Ranks`, `Auth`).
- **Mobile Bottom Sheet:** Project detail drawer smoothly slides up from the bottom with drag-to-dismiss gesture and a thumb-accessible sticky voting button.
- **Enlarged Touch Targets:** Invisible cylindrical hit-boxes around 3D booths ensure effortless tapping on small mobile screens.
- **Optimized Mobile Performance:** DPR capped to 1.25x and dynamic texture switching to preserve battery and maintain a steady 60 FPS.
- **Safe Area Insets:** Full support for iPhone notch and home indicators (`pt-safe`, `pb-safe`, `viewportFit: 'cover'`).

---

## ☁️ Cloudflare Deployment & CI/CD

### 1. Live Deployment
The project is hosted on Cloudflare Pages:
- **Production URL:** [https://dpsiexibition.pages.dev](https://dpsiexibition.pages.dev)
- **Deployment Script:** `npm run deploy`

### 2. Automated CI/CD Pipelines (GitHub Actions)
The repository includes automated CI/CD workflows configured in `.github/workflows/`:

- **CI (`.github/workflows/ci.yml`):**
  - Triggers on: Pull Requests and pushes to `main`.
  - Runs ESLint validation, TypeScript typechecks (`tsc --noEmit`), and static Next.js production builds (`npm run build`).
  - Verifies that static export artifacts (`out/`) are generated without errors.
- **CD (`.github/workflows/cd.yml`):**
  - Triggers on: Push to `main` branch or manual trigger (`workflow_dispatch`).
  - Automatically compiles and deploys the static build directly to Cloudflare Pages (`dpsiexibition`).

#### Setting Up GitHub Secrets for Cloudflare CD:
To enable automated deployments from GitHub Actions, add these repository secrets (**Settings > Secrets and variables > Actions**):
- `CLOUDFLARE_API_TOKEN`: Cloudflare API token with `Cloudflare Pages: Edit` permissions.
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID (visible on Cloudflare Dashboard sidebar).

*(Optional)* Firebase build variables can also be provided as secrets: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, etc.

### 3. Attaching Custom Domain (`dpsiexibition.com`):
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
