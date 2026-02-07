# Valentine's Proposal Website - Software Design

## Executive Summary

A romantic, interactive disco-themed webpage that presents a Valentine's proposal to Cecilia using the r3f-audio-visualizer engine. The experience combines emotional storytelling with real-time audio visualization synced to a Harry Styles concert theme.

## Architecture Overview

### High-Level Flow

```
Phase 1: Proposal Screen
         ↓ (Yes selected)
Phase 2: Audio-Visual Journey
         ├─ 0:00 - Audio starts, visualization begins
         ├─ 1:00 - Date reveal: "October 21, 2026"
         ├─ 1:30 - Location reveal: "New York: Madison Square Garden"
         ├─ 2:00 - Event reveal: "Harry Styles: TOGETHER, TOGETHER"
         └─ ∞    - Visualization cycles models every 30s
```

## Phase 1: Proposal Screen

### Design Requirements

**Visual Theme:**
- Disco aesthetic with romantic pink/purple color palette
- Disco ball animations and sparkling particle effects
- Responsive fullscreen layout

**Component: `ProposalScreen.tsx`**

```
ProposalScreen (container)
├── DiscoBackdrop (animated background)
│   ├── DiscoBall (3D spinning effect or CSS animation)
│   └── ParticleEffects (random sparkling particles)
├── ProposalContent (centered content)
│   ├── ProposalText ("Cecilia, will you be my valentine?")
│   ├── YesButton (grows on each failed "No" click)
│   └── NoButton (evades clicks with random positioning)
└── TransitionOverlay (fades to Phase 2 on "Yes")
```

### Interactive Button Behavior

**NoButton Logic:**
- On hover/click: Calculate random position within viewport
- Maintain min 300px buffer from YesButton (prevents overlap)
- Smooth animation transition to new position (CSS transition + React state)
- Persist position for visual feedback

**YesButton Growth:**
- Track failed click attempts on NoButton via Zustand store
- Scale increases: 1.0 → 1.1 → 1.25 → 1.4 (exponential growth)
- Background glow intensifies with each attempt
- On successful click: Play celebratory particle burst, fade to Phase 2

### State Management (Zustand)

```typescript
interface IProposalState {
  phase: 'proposal' | 'visual-journey' | 'complete';
  noButtonAttempts: number;
  yesButtonClicked: boolean;
}
```

## Phase 2: Audio-Visual Experience

### Audio Setup

**Harry Styles Track Integration:**
- File: `public/audio/hs.mp3` (pre-encoded, ~3 min duration)
- Audio source type: FILE_UPLOAD (reuse existing r3f-audio-visualizer infrastructure)
- Autoplay on phase transition with fade-in effect
- Web Audio API context created via `buildAudioContext()`

**Implementation Path:**
1. Leverage existing `FFTAnalyzer` from `app/src/lib/analyzers/fft.ts`
2. Hook audio element into Web Audio graph
3. Update Zustand state to trigger visualization mode switch

### Visualization System

**Model Cycling Strategy:**
- Implement `VisualizationCycler` scheduler in appState
- Every 30 seconds: dispatch mode change to randomly selected visualization
- Available models (reuse existing visualizers):
  1. Bar spectrum (FFT data → vertical bars)
  2. Circular waveform (radial frequency display)
  3. Particle system (frequency ranges → particle generation)
  4. 3D geometry deformation (audio → geometry morphing)

**Model Selection:**
```typescript
// Add to appState.ts
const VALENTINE_VISUALIZERS = [
  'spectrum-bars',
  'circular-waveform',
  'particle-burst',
  'geometric-morph',
];

// Cycle every 30s
setInterval(() => {
  const nextViz = VALENTINE_VISUALIZERS[
    Math.floor(Math.random() * VALENTINE_VISUALIZERS.length)
  ];
  setVisualizer(nextViz);
}, 30000);
```

**Visual Customization:**
- Color palette locked to romantic pink/purple spectrum
- Intensity normalized to 0-1 range (prevent overwhelming effects)
- Particle count capped (performance on lower-end devices)

## Phase 3: Timed Text Revelations

### Reveal System Architecture

**Component: `TimedReveals.tsx`**

```
TimedReveals (non-visual, effects controller)
├── useAudioPlayback() → current time (0:00 - 3:00)
├── useRevealTrigger(at: 60s) → triggers date reveal
├── useRevealTrigger(at: 90s) → triggers location reveal
└── useRevealTrigger(at: 120s) → triggers event reveal

RevealOverlay (fullscreen container, z-index above visualization)
├── DateReveal (fades in/out with glow)
├── LocationReveal (appears below date)
└── EventReveal (image + text, dramatic entrance)
```

### Reveal Timing & Animation

| Reveal | Trigger Time | Animation | Duration | Content |
|--------|--------------|-----------|----------|---------|
| Date | 1:00 | Fade-in + glow pulse | 2 sec entrance, ~5 sec display | "October 21, 2026" |
| Location | 1:30 | Fade-in (cascade below date) | 2 sec entrance, ~5 sec display | "New York: Madison Square Garden" |
| Event | 2:00 | Slow dramatic fade + scale (1.0 → 1.05) | 3 sec entrance, ~10 sec display | "Harry Styles: TOGETHER, TOGETHER" + screenshot |

**Implementation:**

```typescript
// hooks/useTimedReveal.ts
export const useTimedReveal = (triggerTime: number) => {
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const checkTime = () => {
      const currentTime = audioRef.current?.currentTime ?? 0;
      if (currentTime >= triggerTime && !isVisible) {
        setIsVisible(true);
      }
    };

    const interval = setInterval(checkTime, 100);
    return () => clearInterval(interval);
  }, [triggerTime, isVisible]);

  return isVisible;
};
```

### Visual Design for Reveals

**DateReveal Component:**
```css
/* Fade-in with glow */
@keyframes glowPulse {
  0%, 100% { text-shadow: 0 0 10px rgba(255, 105, 180, 0.6); }
  50% { text-shadow: 0 0 20px rgba(255, 105, 180, 1); }
}

.date-reveal {
  font-size: 3.5rem;
  color: #ff69b4;
  animation: glowPulse 1.5s ease-in-out infinite;
}
```

**EventReveal Component:**
```css
@keyframes dramaticFade {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}

.event-reveal {
  animation: dramaticFade 3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

## Integration with r3f-audio-visualizer

### Project Structure

```
r3f-audio-visualizer-dev/app/src/
├── components/
│   ├── proposal/                    [NEW]
│   │   ├── ProposalScreen.tsx
│   │   ├── DiscoBackdrop.tsx
│   │   ├── NoButton.tsx
│   │   └── YesButton.tsx
│   ├── reveals/                     [NEW]
│   │   ├── TimedReveals.tsx
│   │   ├── DateReveal.tsx
│   │   ├── LocationReveal.tsx
│   │   └── EventReveal.tsx
│   └── [existing components...]
├── lib/
│   ├── appState.ts                  [MODIFY]
│   ├── hooks/
│   │   ├── useTimedReveal.ts        [NEW]
│   │   └── [existing hooks...]
│   └── [existing lib files...]
├── App.tsx                          [MODIFY]
├── ValentineApp.tsx                 [NEW - main entry point]
└── [existing app structure...]

public/
└── audio/
    └── hs.mp3                       [NEW - Harry Styles track]
public/images/
    └── harry-styles-together.jpg    [NEW - concert screenshot]
```

### State Management Extension

**Add to `appState.ts`:**

```typescript
interface IValentineState {
  currentPhase: 'proposal' | 'visual-journey' | 'complete';
  noButtonAttempts: number;
  yesButtonClicked: boolean;
  visualizationModel: TVisualId;
  currentAudioTime: number;
}

// Actions
setPhase(phase: IValentineState['currentPhase']) → void;
incrementNoAttempts() → void;
setYesClicked() → boolean;
updateAudioTime(time: number) → void;
```

### Component Lifecycle

**ValentineApp.tsx Entry Point:**

```typescript
const ValentineApp = () => {
  const { currentPhase } = useAppState();

  return (
    <main className="h-[100dvh] w-[100dvw] bg-black overflow-hidden">
      {currentPhase === 'proposal' && <ProposalScreen />}
      
      {currentPhase === 'visual-journey' && (
        <>
          <Visual3DCanvas />
          <TimedReveals />
          <AudioPlayer src="/audio/hs.mp3" />
        </>
      )}
    </main>
  );
};
```

## Styling & Theme

### Color Palette

```typescript
// tailwind.config.js extension
const valentineTheme = {
  colors: {
    'disco-pink': '#FF1493',
    'romantic-pink': '#FF69B4',
    'soft-purple': '#D8BFD8',
    'deep-purple': '#9932CC',
    'accent-gold': '#FFD700',
  }
};
```

### Responsive Considerations

- **Mobile (< 640px):** Reduced particle count, larger tap targets for buttons
- **Tablet (640-1024px):** Standard experience
- **Desktop (> 1024px):** Enhanced particle effects, larger visualizations

## Performance Optimization

### Critical Paths

1. **Phase Transition (Proposal → Visual Journey):**
   - Preload `hs.mp3` during Phase 1
   - Initialize Web Audio context on user interaction (due to browser autoplay policies)
   - Lazy-load visualization models

2. **Visualization Cycling:**
   - Use RAF (requestAnimationFrame) for smooth transitions between models
   - Debounce model changes to prevent flickering
   - Cap shader complexity for lower-end devices

3. **Timed Reveals:**
   - Use audio element's `timeupdate` event (more reliable than setInterval)
   - Memoize reveal components to prevent unnecessary re-renders

### Browser Constraints

- **Autoplay Audio:** Must be user-initiated; Phase 1 → "Yes" click triggers playback
- **Web Audio API:** Requires HTTPS or localhost; test thoroughly
- **Canvas Rendering:** Monitor FPS; consider adaptive quality scaling if drops below 30fps

## Development Workflow

### Phase 1: Setup & Proposal Screen
```bash
# Create components and state management
- Extend appState.ts with Valentine state
- Build ProposalScreen + subcomponents
- Implement NoButton avoidance logic
- Add disco animations (CSS + particle system)
```

### Phase 2: Audio Integration
```bash
# Wire audio and visualization system
- Add hs.mp3 to public/audio/
- Hook FFTAnalyzer into audio playback
- Implement visualization cycling logic
- Test audio sync across browser vendors
```

### Phase 3: Timed Reveals
```bash
# Add narrative elements
- Build TimedReveals scheduling system
- Create reveal components with animations
- Add concert screenshot to public/images/
- Fine-tune timing to match audio peaks
```

### Phase 4: Polish & Testing
```bash
# QA and optimization
- Test on mobile devices
- Verify Web Audio API behavior in Firefox, Safari, Chrome
- Performance profiling (DevTools → Performance tab)
- Cross-browser animation smoothness
```

## Testing Strategy

### Manual Testing Checklist

- [ ] Phase 1: NoButton avoids cursor/touch with smooth animation
- [ ] Phase 1: YesButton grows progressively
- [ ] Phase 2: Audio plays on "Yes" click
- [ ] Phase 2: Visualizations sync with audio frequency data
- [ ] Phase 2: Models cycle every 30 seconds
- [ ] Phase 3: Date reveal appears at 1:00 with glow effect
- [ ] Phase 3: Location reveal appears at 1:30 cascaded below date
- [ ] Phase 3: Event reveal appears at 2:00 with image
- [ ] Responsive: All elements visible on mobile (no overflow)
- [ ] Responsive: Button interaction smooth on touch devices
- [ ] Audio: Works in Chrome, Firefox, Safari (test on macOS)
- [ ] Performance: 60fps maintained during visualization cycling

### Browser Compatibility

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | Latest | ✓ | Full support |
| Firefox | Latest | ⚠️ | Verify Web Audio API styling |
| Safari | Latest | ⚠️ | Test autoplay + audio context |
| Mobile Safari | iOS 15+ | ⚠️ | Limited autoplay; require tap |
| Chrome Mobile | Latest | ✓ | Full support |

## Future Enhancements

1. **Recording Capability:** Allow sharing video of proposal experience to social media
2. **Customization:** Input field to dynamically set proposal recipient name
3. **Multiple Themes:** Offer different concert/artist options
4. **Analytics:** Track completion rates and user interactions
5. **Accessibility:** Add captions/transcripts for audio, ARIA labels for buttons

## Dependencies & Build Impact

### New Dependencies Required
- None (leverages existing r3f-audio-visualizer stack)

### Existing Dependencies Used
- `zustand` - state management
- `@react-three/fiber` + `three` - 3D visualization
- `@react-three/drei` - camera/animation utilities
- `tailwindcss` - styling
- `clsx` - conditional class names

### Build Output Impact
- Audio file `hs.mp3` (~5-8 MB) will increase bundle size
- Mitigate via lazy-loading or streaming strategy

## Deployment Notes

### GitHub Pages (Current Setup)
- Ensure `public/audio/hs.mp3` is committed to repo
- Verify asset paths use `/r3f-audio-visualizer/` base path
- Test production build with `pnpm build && pnpm preview`

### Alternative: CDN for Audio
```typescript
// Load audio from CDN to reduce repo size
const AUDIO_URL = 'https://cdn.example.com/hs.mp3';
```

## References & Resources

- [r3f Audio Visualizer Copilot Instructions](./.github/copilot-instructions.md)
- [Zustand Store Setup](./app/src/lib/appState.ts)
- [Web Audio API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber/)
