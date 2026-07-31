# Planetary Defence Hub - Replit Configuration

## Overview

Neo-Sentinel is a Progressive Web App (PWA) planetary-defence console for browsing tracked near-Earth objects, modelling hypothetical impacts, classifying risk, and answering questions in plain language. The interface is styled as a scientific instrument: a cool graphite chassis, hairline rules instead of boxes, dense tabular numerals, and a single sodium-orange accent, with colour otherwise reserved for encoding data. See `design_guidelines.md` for the full system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, configured with custom aliases for cleaner imports
- Wouter for lightweight client-side routing (single page application with Home and NotFound routes)

**UI Component Strategy:**
- shadcn/ui component library (Radix UI primitives) for accessible, customizable base components
- Custom-styled components built on top of shadcn/ui to match the retro-futuristic theme
- Tailwind CSS for utility-first styling with extensive custom theme configuration

**Design System:**
- Single dark theme, page-wide, driven by HSL tokens in `client/src/index.css`
- One accent: sodium orange (`--primary`, `28 96% 55%`) for active state, primary CTA, focus ring
- Semantic risk ramp (`--status-nominal/elevated/high/critical`) used only to encode assessed state
- Fonts: Geist for interface text, Geist Mono for all numbers and identifiers, with tabular figures
- Flat `Panel` surfaces with hairline borders and tinted shadows; no glows
- Shape scale: 6px surfaces, 4px controls, 2px chips
- Ambient starfield backdrop that halts under `prefers-reduced-motion` and when the tab is hidden
- Every text pair verified against WCAG AA

**State Management:**
- React Query (TanStack Query) for server state management, data fetching, and caching
- Local component state with React hooks for UI interactions
- Form state managed via React Hook Form with Zod validation

**Key Custom Components:**
- `Panel` / `PanelHeader` / `Readout`: the surface and measurement primitives every view is built from
- `Starfield`: canvas backdrop, reduced-motion and visibility aware, star count scaled to viewport
- `RiskChip`: the only surface for the semantic risk ramp
- `AsteroidCard`, `AsteroidDashboard`: catalogue rows plus a summary strip and charts derived from the same data
- `ImpactSimulator`: slider-driven forward model with loading, empty, error, and result states
- `AIChat`: analyst chat with a cleaned-up typewriter that clears its interval on unmount
- `MLPredictor`: prediction form with full state coverage and recharts output
- `DataChart`: Chart.js wrapper that reads its colours from the design tokens
- `About`: capability summary and the published scaling relations the simulator evaluates

**Client Libraries:**
- `lib/impact.ts`: impact scaling after Collins, Melosh & Marcus (2005), validated against
  Chelyabinsk, Tunguska, and Barringer Crater
- `lib/format.ts`: shared number formatting so readouts agree on precision

**Performance:**
- Only the default tab is eager; the other four views are `React.lazy` code-split, keeping
  recharts out of the initial bundle (~165 kB gzip initial, down from ~314 kB)

### Backend Architecture

**Server Framework:**
- Express.js server with TypeScript
- Modular route registration pattern via `registerRoutes`
- Custom middleware for request logging with duration tracking
- Error handling middleware for consistent error responses

**Development Setup:**
- Vite middleware integration for HMR (Hot Module Replacement) in development
- Replit-specific plugins for runtime error overlays, dev banners, and cartographer integration
- Static file serving in production mode

**API Structure:**
- RESTful endpoints under `/api` prefix
- Earthquake data fetching from USGS GeoJSON feed
- Tsunami alert processing from earthquake events
- ML prediction endpoint for asteroid impact analysis

**Data Flow:**
- External API integration with USGS for real-time earthquake data
- In-memory storage abstraction via `IStorage` interface
- Periodic data fetching and caching for earthquake/tsunami information

### Data Storage Solutions

**Database Setup:**
- PostgreSQL database via Neon serverless (configured in drizzle.config.ts)
- Drizzle ORM for type-safe database queries and schema management
- Schema-first approach with Zod validation integration

**Schema Design:**
- Users table with UUID primary keys, username/password authentication
- Earthquake events and tsunami alerts stored in-memory (fetched from external APIs)
- ML prediction inputs validated via Zod schemas

**Migration Strategy:**
- Drizzle Kit for schema migrations
- Migration files stored in `/migrations` directory
- Push command available via `npm run db:push`

### Authentication and Authorization

**Current Implementation:**
- Basic user schema with username/password fields
- Session storage configured via connect-pg-simple (PostgreSQL session store)
- User creation and lookup methods in storage layer

**Security Considerations:**
- Password hashing should be implemented (not visible in current code)
- Session management configured but authentication middleware not shown
- HTTPS recommended for production deployment

### External Dependencies

**Third-Party Services:**
- **USGS Earthquake API**: Real-time earthquake data feed (GeoJSON format)
  - Endpoint: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`
  - Used for earthquake tracking and tsunami alert generation
  - No API key required (public service)

**Key Libraries:**
- **UI Components**: Radix UI primitives (@radix-ui/react-*) for accessible component foundations
- **Styling**: Tailwind CSS with PostCSS, class-variance-authority for component variants
- **Data Visualization**: Chart.js for rendering line, bar, and doughnut charts
- **Forms**: React Hook Form with Zod resolvers for validation
- **HTTP Client**: Native fetch API for external data fetching
- **Database**: Neon Serverless PostgreSQL, Drizzle ORM
- **Date Handling**: date-fns for date manipulation and formatting

**Font Dependencies:**
- Google Fonts: Geist (300-700) and Geist Mono (300-600)
- Loaded via preconnect and stylesheet links in HTML head

**Development Tools:**
- TypeScript for static type checking
- ESBuild for server bundle compilation
- Replit-specific plugins for enhanced development experience
- TSX for running TypeScript in development mode