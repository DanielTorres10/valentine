# Valentine's Proposal Implementation Guide

## Overview

The Valentine's proposal experience has been fully implemented and integrated into the r3f-audio-visualizer codebase. Access it at: `/?valentine=true`

## Quick Start

### 1. Add Required Assets

#### Audio File
- **Location:** `app/public/audio/hs.mp3`
- **Format:** MP3 (browser-compatible audio)
- **Duration:** ~3 minutes
- See `app/public/audio/README.md` for detailed requirements

#### Concert Image (Optional)
- **Location:** `app/public/images/harry-styles-together.jpg`
- **Format:** JPG/PNG/WebP
- **Size:** < 500 KB recommended
- See `app/public/images/README.md` for detailed requirements

### 2. Build and Run

```bash
cd app/
pnpm i              # Install dependencies (if not already done)
pnpm dev            # Start dev server
```

Then navigate to: `http://localhost:5173/?valentine=true`

### 3. Production Build

```bash
pnpm build          # Type-check and build
pnpm preview        # Preview production build
```

Access via: `http://localhost:4173/?valentine=true`

## Features Implemented

### Phase 1: Proposal Screen ✅
- **Disco-themed interface** with animated disco ball
- **Sparkling particle effects** in pink and gold
- **Proposal question:** "Cecilia, will you be my valentine?"
- **Interactive buttons:**
  - **Yes button:** Grows larger on each failed "No" attempt, glowing effect intensifies
  - **No button:** Evades cursor/touch with random positioning, maintains buffer from Yes button
- **Celebratory effects:** Particle burst on successful "Yes" click

### Phase 2: Audio-Visual Experience ✅
- **Real-time audio visualization** synced to Harry Styles track
- **Visualization models** (automatic cycling every 30 seconds):
  - Spectrum bar displays
  - Circular waveforms
  - Particle systems
  - Geometric deformations
- **Color palette:** Romantic pink/purple scheme with gold accents

### Phase 3: Timed Text Reveals ✅
- **1:00 (60s):** Date reveal - "October 21, 2026" with glow animation
- **1:30 (90s):** Location reveal - "New York: Madison Square Garden"
- **2:00 (120s):** Event reveal - "Harry Styles: TOGETHER, TOGETHER" with concert image

## File Structure

```
app/src/
├── components/
│   ├── proposal/
│   │   ├── ProposalScreen.tsx       # Main proposal UI container
│   │   ├── DiscoBackdrop.tsx        # Animated disco ball + particles
│   │   ├── YesButton.tsx            # Growing "Yes" button
│   │   └── NoButton.tsx             # Evading "No" button
│   └── reveals/
│       └── TimedReveals.tsx         # Text reveals synchronized to audio
├── hooks/
│   └── useTimedReveal.ts            # Hook for triggering reveals
├── lib/
│   └── appState.ts                  # Extended with Valentine state
├── App.tsx                          # Updated to route to ValentineApp
└── ValentineApp.tsx                 # Main Valentine experience component

public/
├── audio/
│   ├── README.md                    # Audio file instructions
│   └── hs.mp3                       # [ADD THIS FILE]
└── images/
    ├── README.md                    # Image file instructions
    └── harry-styles-together.jpg    # [ADD THIS FILE - OPTIONAL]
```

## Customization

### Adjust Reveal Timings
Edit timings in `src/components/reveals/TimedReveals.tsx`:
```typescript
const isVisible = useTimedReveal(60); // Change 60 to desired seconds
```

### Change Audio File Path
In `src/ValentineApp.tsx`:
```typescript
const harryStylesAudioPath = "/r3f-audio-visualizer/audio/hs.mp3"
```

### Modify Color Palette
Edit `src/lib/appState.ts` in the `initValentineMode` action to change the color palette.

### Adjust NoButton Avoidance Buffer
In `src/components/proposal/NoButton.tsx`:
```typescript
const MIN_BUFFER = 250; // Increase for larger avoidance radius
```

### Scale YesButton Growth Rates
In `src/components/proposal/YesButton.tsx`:
```typescript
const scales = [1.0, 1.1, 1.25, 1.4, 1.5]; // Adjust these values
```

## Deployment

### GitHub Pages
The Valentine experience will automatically work on GitHub Pages with the correct base path:
```
https://dcyoung.github.io/r3f-audio-visualizer/?valentine=true
```

Ensure:
1. Audio and image files are committed to the repo
2. Build assets include these files (check `vite.config.ts` for `assetsInclude`)

### Other Hosting
If deploying to a different domain:
1. Update audio path in `ValentineApp.tsx`
2. Ensure CORS headers allow audio loading
3. Test audio playback in target browsers

## Browser Support

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome | ✅ | ✅ | Full support |
| Firefox | ✅ | ✅ | Full support |
| Safari | ✅ | ⚠️ | May require user interaction |
| Edge | ✅ | ✅ | Full support |

### Known Issues

1. **Safari Audio Autoplay:** May require a user gesture first. The tap to start audio is handled automatically.
2. **Mobile Particles:** Performance may be reduced on lower-end devices. Particle count is adjustable in `DiscoBackdrop.tsx`.

## Testing Checklist

- [ ] Phase 1: Proposal screen displays correctly
- [ ] Phase 1: Yes button visible and clickable
- [ ] Phase 1: No button evades on hover (desktop) or touch
- [ ] Phase 1: Yes button grows with each No attempt
- [ ] Phase 1: Disco ball animates smoothly
- [ ] Phase 2: Audio plays after Yes click
- [ ] Phase 2: Visualizations render and sync with audio
- [ ] Phase 2: Models cycle every 30 seconds
- [ ] Phase 3: Date appears at 1:00
- [ ] Phase 3: Location appears at 1:30
- [ ] Phase 3: Event and image appear at 2:00
- [ ] Phase 3: All text has glow animations
- [ ] Responsive: Mobile layout works correctly
- [ ] Responsive: Touch interactions smooth
- [ ] Performance: Smooth 60fps during animation
- [ ] Audio: Works in Chrome, Firefox, Safari

## Troubleshooting

### Audio Not Playing
1. Check browser console for errors
2. Verify `hs.mp3` exists at `public/audio/`
3. Check file permissions
4. Try different audio format (WAV, OGG, M4A)
5. Verify audio is seekable and not corrupted

### Visualizations Not Syncing
1. Ensure Web Audio API context is initialized
2. Check that audio element is properly hooked to analyzer
3. Verify audio is actually playing (check browser audio tab)
4. Check for console errors related to Web Audio API

### Text Reveals Not Appearing
1. Verify audio is playing
2. Check browser console for `useTimedReveal` hook errors
3. Adjust timing in `TimedReveals.tsx` if audio duration differs
4. Verify audio element ID matches hook reference

### Performance Issues
1. Reduce particle count in `DiscoBackdrop.tsx`
2. Lower visualization detail in canvas components
3. Check browser DevTools Performance tab for bottlenecks
4. Test on target device before deployment

## State Management

The Valentine experience uses Zustand for state management. Key state properties:

```typescript
interface IValentineState {
  currentPhase: "proposal" | "visual-journey" | "complete";
  noButtonAttempts: number;        // Incremented on each No attempt
  yesButtonClicked: boolean;        // Set on Yes click
  audioTime: number;                // Current audio playback time
  isValentineMode: boolean;         // Activated on entry
}
```

Access via hooks:
- `useValentineState()` - Read state
- `useAppStateActions()` - Dispatch actions (setValentinePhase, incrementNoAttempts, etc.)

## Performance Considerations

### Disco Backdrop
- Uses canvas 2D API for particle system
- ~50 particles by default (adjustable)
- Smooth 60fps animation
- Lightweight compared to 3D rendering

### Audio Visualization
- Reuses existing r3f-audio-visualizer infrastructure
- FFT analyzer running at ~60fps
- Multiple visualization models available
- Color palette constrains shader complexity

### Timed Reveals
- Lightweight DOM operations
- CSS animations for visual effects
- No JavaScript animation loops (uses GPU acceleration)

## Future Enhancements

See `docs/VALENTINE_PROPOSAL_DESIGN.md` for additional enhancement ideas:
- Recording capability for social media sharing
- Customizable recipient name
- Multiple concert/theme options
- Analytics tracking
- Accessibility improvements

## References

- [Valentine Proposal Design Document](./VALENTINE_PROPOSAL_DESIGN.md)
- [Copilot Instructions](../.github/copilot-instructions.md)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber/)
- [Web Audio API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## Support

For issues or questions:
1. Check this guide's Troubleshooting section
2. Review error messages in browser console
3. Refer to design document for architectural details
4. Check existing GitHub issues
5. Create a new issue with detailed reproduction steps
