# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16.2.3 portfolio website for Alireza Jalili, a frontend developer. The project uses the App Router, React 19, TypeScript, Tailwind CSS 4, and Framer Motion for animations.

## Development Commands

### Running the Application
- `npm run dev` - Start development server on http://localhost:3000
- `npm run build` - Create production build
- `npm start` - Run production build locally

### Type Checking & Linting
- `npm run typecheck` - Generate Next.js types and run TypeScript type checking (must run before committing)
- `npm run typegen` - Generate Next.js route types only
- `npm run lint` - Run ESLint

### Analysis & Performance
- `npm run analyze` - Analyze bundle using Next.js experimental analyzer with Turbopack
- `npm run analyze:snapshot` - Create a snapshot of the analysis in `analyze-before-refactor/`

### Version Management
- `npm run release` - Create a new release using standard-version
- `npm run release:patch` - Bump patch version (0.0.x)
- `npm run release:minor` - Bump minor version (0.x.0)
- `npm run release:major` - Bump major version (x.0.0)

### Pre-commit Hooks
The project uses Husky to run `npm run lint` and `npm run typecheck` before each commit. Both must pass for the commit to succeed.

## Architecture

### Directory Structure

- **`app/`** - Next.js App Router pages and API routes
  - `page.tsx` - Home page with landing banner, experience slider, routine banner, and technologies sections
  - `experience/`, `education/`, `project/` - Feature-specific pages
  - `api/` - API route handlers for fetching data (experience, education, project, technology)
  - `layout.tsx` - Root layout with metadata, Header, Footer, and GoTop components
  - `globals.css` - Global styles with Tailwind directives
  
- **`components/`** - React components organized by type
  - `materials/` - Atomic/reusable UI components (buttons, cards, icons, links, loaders, sliders, lists)
  - `templates/` - Page-level composite components that assemble materials into sections (landing banner, experience slider, technologies section, page views)

- **`data/`** - Data management layer
  - `static/` - Static data exports (education, experience, project, technology)
  - `server/` - Server-side data fetching functions (getEducation, getExperience, getProject, getTechnologies)
  - `index.ts` - Re-exports all static data

- **`utils/`** - Utility functions and helpers

- **`public/`** - Static assets served at root

- **`assets/`** - Project-specific assets

### Component Architecture

The project follows a two-tier component architecture:
1. **Materials** (`components/materials/`) - Small, reusable UI primitives (buttons, cards, icons, links)
2. **Templates** (`components/templates/`) - Larger composed sections that use materials (page banners, sliders, feature sections)

### Data Flow

Data is managed through a layered approach:
- Static data defined in `data/static/*.ts`
- Server functions in `data/server/get*.ts` fetch and transform data
- API routes in `app/api/*/route.ts` expose data via HTTP endpoints
- Components consume data either through direct imports or API calls

### Styling

- **Tailwind CSS 4** with `@tailwindcss/postcss`
- Custom font: Raleway (loaded via `next/font/google`)
- Global styles in `app/globals.css`
- Responsive breakpoints: mobile-first with `sm:` prefix

### Animations

Framer Motion is used for animations throughout the project. It's included in `optimizePackageImports` in `next.config.ts` for better performance.

## Configuration

### TypeScript
- Path alias: `@/*` maps to project root
- Target: ES2017
- Strict mode enabled
- Incremental compilation enabled

### Next.js Configuration
- **Turbopack**: Enabled with root path set to `__dirname` to prevent duplicate `json.lock` file errors
- **Optimized Imports**: `framer-motion` and `swiper` are optimized via `experimental.optimizePackageImports`

### Environment Variables
Required variables (defined in `.env`):
- `NEXT_PUBLIC_DOWNLOAD_URL` - Public download URL
- `NEXT_PUBLIC_HOST`, `NEXT_PUBLIC_HOSTNAME` - Public host configuration
- `NEXT_PUBLIC_API_BASE_URL` - API base URL for data fetching
- `HOSTNAME`, `PORT`, `HOST` - Server configuration

### ESLint
Uses Next.js recommended configs:
- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`

Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

### Prettier
The project has Prettier configuration file (`.prettierrc.mjs`) but it's currently commented out. It includes custom import ordering rules when active.

## Working with This Project

### Adding New Pages
1. Create a new directory in `app/` with a `page.tsx`
2. Add corresponding API route in `app/api/` if data fetching is needed
3. Create data files in `data/static/` and `data/server/`
4. Build page-specific template components in `components/templates/`

### Adding Components
- Place reusable UI elements in `components/materials/`
- Place section-level components in `components/templates/`
- Use kebab-case for directory names, PascalCase for component files

### Type Safety
- Always run `npm run typecheck` before committing
- Next.js generates route types automatically via `typegen`
- Use the `@/` path alias for imports

### Bundle Analysis
When refactoring for performance:
1. Run `npm run analyze:snapshot` to save current state
2. Make changes
3. Run `npm run analyze` to compare against snapshot in `analyze-before-refactor/`

## Known Issues & Workarounds

### Duplicate json.lock File Error
The `turbopack.root` setting in `next.config.ts` resolves duplicate `json.lock` file errors. Alternative: use `outputFileTracingRoot: __dirname`.

## Git Workflow

- **Main branch**: `main`
- **Development branch**: `develop`
- Commits must pass lint and typecheck via pre-commit hooks
- Use standard-version for releases (follows Conventional Commits)
