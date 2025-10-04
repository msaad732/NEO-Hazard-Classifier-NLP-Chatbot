# Planetary Defence Hub PWA - Design Guidelines

## I. Core Aesthetic Direction
**Target Aesthetic:** Funky, Cool, Retro-Futuristic, Meteor Universe - A vibrant, high-energy space command center from a '90s sci-fi film that feels professional but electric.

## II. Color Palette: Dark Mode / Neon Contrast

**Background (The Void):** Deep, inky black or very dark navy blue (#0A0A1F)

**Primary Accent (Data/Glow):** Electric Blue/Cyan (#00FFFF)
- Use for active states, data points, and primary interface outlines

**Secondary Accents:**
- Hot Magenta/Pink (#FF00FF) - warnings, key CTAs, secondary visualizations
- Meteor Yellow/Orange (#FFD700) - warnings, key CTAs, secondary visualizations

**Text:** Pure White (#FFFFFF) for main body text ensuring maximum readability against dark background

## III. Typography: Sleek & Technical

**Headlines/Titles:** Bold, futuristic, highly stylized sans-serif font (Centauri or similar) suggesting advanced technology

**Body Text/Data:** Clean, readable monospaced font (Inconsolata or Space Mono) for data readouts, code snippets, and chat responses - maintaining terminal/HUD aesthetic

## IV. Background Atmosphere: Animated, Non-Obtrusive Universe 🌌

**Critical Implementation:**
- Entire background features subtle, continuous, low-contrast animation on low z-index
- Elements: distant twinkling stars (low-opacity particles), slowly moving celestial bodies (planets/nebulas/meteors), very subtle parallax scrolling
- **CONSTRAINT:** Motion must be slow and overall contrast low - acts as ambient atmosphere, NOT visual distraction

## V. Readability Layer: The Planetary Hub Glass

**All content containers must:**
- Position above animated background layer
- Semi-transparent dark overlay: `rgba(0, 0, 0, 0.7)` or similar
- Use `backdrop-filter: blur(5px)` for Holographic/Glassmorphism effect
- Guarantee legibility while letting universe animation subtly show through

## VI. Required Animations & Interactions (Non-Negotiable)

### A. Custom Cursor Effect ☄️
- Replace default cursor with small, stylized comet/meteor icon (16x16px)
- Generate continuous, fading particle trail in Electric Blue/Cyan as cursor moves

### B. Custom Loading Button/Spinner 🔄
- Target: All primary CTA buttons ("Run Prediction," "Generate Report," "Simulate Impact")
- On click: Replace button text with animated rotating meteor with flaming orange/yellow tail

### C. General UI Interactivity
- **Neon Pulse:** Primary buttons/inputs exhibit subtle pulsating neon glow on hover/focus
- **Holographic Pop-up:** Data windows/modals appear with translucent fade-in/scanline effect

## VII. Component Styling

### A. Data Visualization Panels (Chart.js)
- **Aesthetic:** HUD/Glassmorphism look
- Semi-transparent blurred layer with sharply defined glowing borders (Electric Blue/Cyan)
- Chart lines/bars/markers use vibrant neon accent colors
- Gridlines: faint, thin, glowing - mirroring targeting system

### B. AI Chatbot Interface
- **Aesthetic:** Classic computer terminal/console output
- Container uses semi-transparent blurred layer for readability
- **AI Responses:** Electric Blue/Cyan accent color with smooth retro "typing" animation
- **User Input:** Blinking cursor, crisp glowing border when active

### C. Navigation
- Clean, minimal global header/persistent sidebar
- Semi-transparent overlay for visual consistency
- Active link highlighted with solid, high-contrast glow using primary accent color

## VIII. Layout Structure

**Desktop:**
- Full simulation/data dashboard with layered background and glassmorphic content containers
- Multiple data visualization panels arranged in grid layout
- Persistent AI chat interface (sidebar or bottom panel)

**Mobile/PWA:**
- Responsive stack layout maintaining retro-futuristic aesthetic
- Collapsible sections for data panels
- Full-screen chat mode option

## IX. Images
No hero images required - the animated cosmic background serves as the primary visual element. All content sits within glassmorphic containers above this animated layer.

## X. Key Features to Implement

1. **Asteroid Impact Simulator** - Interactive inputs with visual results
2. **Real-time Asteroid Tracking Dashboard** - NASA NeoWs API data with neon-styled cards
3. **Data Visualizations** - Impact probability, trajectory plots, size distribution charts
4. **AI Conversational Core** - Terminal-style chatbot with typing animations
5. **PWA Capabilities** - Manifest.json and service worker for offline use

**Visual Priority:** Every element must maintain the electric, high-energy command center aesthetic while ensuring professional functionality and optimal readability through the glassmorphic layer system.