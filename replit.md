# Planetary Defence Hub - Replit Configuration

## Overview

The Planetary Defence Hub is a Progressive Web App (PWA) designed as a retro-futuristic space command center for monitoring asteroid impacts, tracking earthquakes and tsunamis, and providing AI-powered planetary defense analysis. The application features a highly stylized "funky, cool, retro-futuristic" aesthetic inspired by 90s sci-fi films, with animated cosmic backgrounds, custom cursors, glassmorphic UI panels, and neon accents.

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
- Dark mode with deep space aesthetic (inky black backgrounds)
- Neon accent colors: Electric Blue/Cyan (#00FFFF), Hot Magenta/Pink (#FF00FF), Meteor Yellow/Orange (#FFD700)
- Custom fonts: Oxanium for headlines (futuristic), Space Mono for monospaced data displays
- Glassmorphism effect using backdrop-blur and semi-transparent overlays for content containers
- Animated cosmic background with stars, planets, and celestial bodies on low z-index
- Custom cursor implementation with particle trail effects
- Custom loading spinner (rotating meteor with flame tail)

**State Management:**
- React Query (TanStack Query) for server state management, data fetching, and caching
- Local component state with React hooks for UI interactions
- Form state managed via React Hook Form with Zod validation

**Key Custom Components:**
- `CosmicBackground`: Canvas-based animated space background with particles and celestial objects
- `CustomCursor`: Canvas-rendered comet cursor with fading particle trail
- `GlassmorphicPanel`: Reusable container with glassmorphism effects for content areas
- `AsteroidCard`, `AsteroidDashboard`: Display and search asteroid tracking data
- `ImpactSimulator`: Interactive tool with sliders for simulating asteroid impact scenarios
- `AIChat`: Chat interface with typing animation for AI-powered analysis
- `MLPredictor`: Machine learning prediction interface with form validation and visualization
- `DataChart`: Chart.js wrapper for data visualizations (line, bar, doughnut charts)

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
- Google Fonts: Oxanium (200-800 weights) and Space Mono (regular/bold, normal/italic)
- Loaded via preconnect and stylesheet links in HTML head

**Development Tools:**
- TypeScript for static type checking
- ESBuild for server bundle compilation
- Replit-specific plugins for enhanced development experience
- TSX for running TypeScript in development mode