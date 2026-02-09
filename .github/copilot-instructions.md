# Copilot Instructions for r3f-audio-visualizer

## Project Overview

**r3f-audio-visualizer** is an interactive audio visualization engine built with React, Three.js, and React Three Fiber. It features multiple visualization modes driven by audio input from various sources (microphone, screen share, file upload, SoundCloud), with customizable rendering pipelines and real-time data analysis.

The project is split into two main parts:
- **`app/`** - React frontend with Vite build system, 3D canvas rendering, audio analysis, and UI controls
- **`api/`** - Express.js proxy for SoundCloud API authentication and CORS handling

## Architecture & Data Flows

### Core Application Modes
Defined in [app/src/lib/applicationModes.ts](app/src/lib/applicationModes.ts):
- **Audio modes** (`AUDIO`, `AUDIO_SCOPE`): Analyzes live audio input
- **Procedural modes** (`WAVE_FORM`, `NOISE`, `PARTICLE_NOISE`): Generate deterministic visuals

The application mode determines which analyzer and canvas component are rendered in [app/src/App.tsx](app/src/App.tsx).

### Audio Input Pipeline
1. **Audio sources** ([app/src/components/audio/](app/src/components/audio/)) - abstracts different input types (microphone, file, SoundCloud, screen share)
2. **Analyzers** ([app/src/lib/analyzers/](app/src/lib/analyzers/)) - FFT and Scope analyzers extract frequency/waveform data
3. **Data mappers** ([app/src/lib/mappers/](app/src/lib/mappers/)) - transform analyzer output into visual parameters:
   - `coordinateMappers/` - map audio data to 3D positions
   - `motionMappers/` - apply motion/animation logic (e.g., curl noise)
   - `textureMappers/` - drive material properties
   - `valueTracker/` - track energy metrics for palette/color changes

### Global State Management
[app/src/lib/appState.ts](app/src/lib/appState.ts) uses **Zustand** for centralized state:
- Camera settings (`mode`, `autoOrbitAfterSleepMs`)
- Audio settings (volume, source type, analyzer settings)
- Appearance (palette, colors, UI visibility)
- Visualizer selection

Access with hooks: `useAppStateActions()`, `useMode()`, `useAudio()`, etc.

### Canvas Rendering
Two canvas components in [app/src/components/canvas/](app/src/components/canvas/):
- **Visual3D** - main 3D renderer using React Three Fiber
- **AudioScope** - oscilloscope-style waveform display

Both use **Drei** utilities for post-processing and camera controls.

## Build & Development Workflows

### App (Frontend)
```bash
cd app/
pnpm i              # Install dependencies
pnpm dev            # Start Vite dev server (localhost:5173)
pnpm build          # Type-check + build for production
pnpm typecheck      # Run tsc without emitting
pnpm lint           # Run ESLint
pnpm format:fix     # Format code with Prettier
```

Key build config in [app/vite.config.ts](app/vite.config.ts):
- Path alias: `@` → `src/`
- Base path: `/r3f-audio-visualizer/` (GitHub Pages)
- Asset includes: `.glb` files

### API (Backend)
```bash
cd api/
npm run dev         # Start Express proxy server
npm run build       # TypeScript compilation
npm run lint        # ESLint check
```

API runs on port 3000 by default. Requires `.env` file for SoundCloud token configuration.

## Project-Specific Patterns

### Exhaustive Union Types
The codebase uses TypeScript discriminated unions extensively. Always exhaust all cases in switch statements - the compiler will enforce this:
```typescript
const getCanvasComponent = (mode: TApplicationMode) => {
  switch (mode) {
    case APPLICATION_MODE.AUDIO_SCOPE:
      return <AudioScopeCanvas />;
    // All cases must be covered or `satisfies never` at end
    default:
      return mode satisfies never;
  }
};
```

### Mapper Pattern
Audio data flows through a pluggable mapper system. Each mapper type:
- Transforms one data domain to another
- Maintains internal state if needed
- Used by visualization components to parameterize rendering

When adding new visualization logic, create new mapper classes in the appropriate subdirectory.

### Component Organization by Responsibility
- **`analyzers/`** - UI controls for audio analysis settings
- **`audio/`** - Audio source selection and stream management
- **`canvas/`** - Three.js/Fiber rendering logic
- **`controls/`** - Top-level UI panels and settings
- **`ui/`** - Reusable UI components (dialogs, sliders, buttons)
- **`visualizers/`** - Visual effect implementations

### UI Framework
Uses **shadcn/ui** (Radix UI + Tailwind CSS):
- Components in [app/src/components/ui/](app/src/components/ui/)
- Tailwind configuration in [app/tailwind.config.js](app/tailwind.config.js)
- Class utilities: `clsx`, `cn`, `class-variance-authority`

## Critical Integration Points

### SoundCloud Integration
- API proxy required: runs at `localhost:3000/proxy`
- SoundCloud token fetched server-side in [api/src/soundcloud.ts](api/src/soundcloud.ts)
- Client communicates through proxy to avoid CORS issues
- Authentication context in [app/src/context/soundcloud.tsx](app/src/context/soundcloud.tsx)

### Web Audio API
- Centralized setup in [app/src/components/audio/sourceControls/common.ts](app/src/components/audio/sourceControls/common.ts)
- Creates `AudioContext` and `HTMLAudioElement` instances
- Analyzers hook into the Web Audio graph for real-time data

### ThreeJS Post-Processing
Uses `@react-three/postprocessing` for effects. Check shader integration in canvas components.

## Code Style & Conventions

- **TypeScript strict mode** enabled - all types must be explicit
- **No implicit `any`** - use proper typing or generics
- **Exhaustive type checking** - switch/if statements must handle all cases
- **Filename convention**: Components use `.tsx`, utilities use `.ts`
- **Naming**: React components PascalCase, hooks start with `use`, types start with `T`
- **Formatting**: Prettier + ESLint auto-formatting on save recommended

## External Dependencies to Know

- **react-three-fiber** - React reconciler for Three.js
- **@react-three/drei** - Helper components (camera controls, post-processing)
- **zustand** - Lightweight state management (used over Redux/Context for this project)
- **@tanstack/react-query** - Data fetching for SoundCloud tracks
- **zod** - Runtime schema validation
- **tailwind + shadcn/ui** - Styling system

## Debugging Tips

1. **Audio stream issues**: Check browser console for `getUserMedia` or stream permission errors
2. **3D rendering black**: Verify camera position in `appState` and lighting setup in canvas components
3. **State updates not triggering renders**: Check Zustand store subscriptions - ensure components use the correct hooks
4. **Type errors on mode switching**: Ensure all APPLICATION_MODE values are handled in switch statements
