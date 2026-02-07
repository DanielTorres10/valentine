# Valentine's Proposal - Quick Reference

## Launch Commands

```bash
# From repository root
cd app/

# Install dependencies (first time only)
pnpm i

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## Access URLs

```
Development:  http://localhost:5173/?valentine=true
Production:   http://localhost:4173/?valentine=true
GitHub Pages: https://dcyoung.github.io/r3f-audio-visualizer/?valentine=true
```

## Required Assets

### Audio File (REQUIRED)
```
Location: app/public/audio/hs.mp3
Format: MP3 (or any browser audio format)
Size: < 10 MB
Duration: ~3 minutes
```

### Concert Image (OPTIONAL)
```
Location: app/public/images/harry-styles-together.jpg
Format: JPG, PNG, or WebP
Size: < 500 KB
```

## Feature Overview

### Phase 1: Proposal
- Disco-themed background with animated disco ball
- Sparkling particle effects
- Interactive buttons:
  - **Yes:** Grows larger each time user tries "No"
  - **No:** Evades user interaction

### Phase 2: Audio Experience
- Real-time audio visualization synced to Harry Styles track
- Automatic visualization model cycling every 30 seconds
- Romantic pink/purple color scheme

### Phase 3: Reveals
| Time | Reveal |
|------|--------|
| 1:00 | October 21, 2026 |
| 1:30 | New York: Madison Square Garden |
| 2:00 | Harry Styles: TOGETHER, TOGETHER + image |

## Customization Quick Links

| Change | File | Line(s) |
|--------|------|---------|
| Audio file path | `src/ValentineApp.tsx` | 8 |
| Reveal timings | `src/components/reveals/TimedReveals.tsx` | 10, 22, 34 |
| NoButton buffer | `src/components/proposal/NoButton.tsx` | 16 |
| YesButton scales | `src/components/proposal/YesButton.tsx` | 19 |
| Color palette | `src/lib/appState.ts` | 290-295 |
| Disco particles | `src/components/proposal/DiscoBackdrop.tsx` | 33 |

## Troubleshooting

### Audio Not Playing
```bash
# Check file exists
ls app/public/audio/hs.mp3

# Check browser console for errors
# Chrome DevTools → Console tab
```

### Build Errors
```bash
# Clear cache and rebuild
rm -rf app/node_modules app/dist
pnpm i
pnpm build
```

### Performance Issues
- Reduce particles in `DiscoBackdrop.tsx` line 33
- Lower visualization detail (existing settings)
- Check DevTools Performance tab

## Key Files

```
Core Implementation:
├── src/ValentineApp.tsx                    # Main app entry
├── src/App.tsx                             # Router logic
├── src/lib/appState.ts                     # State management
│
Proposal Phase:
├── src/components/proposal/ProposalScreen.tsx
├── src/components/proposal/DiscoBackdrop.tsx
├── src/components/proposal/YesButton.tsx
├── src/components/proposal/NoButton.tsx
│
Reveals Phase:
├── src/hooks/useTimedReveal.ts
└── src/components/reveals/TimedReveals.tsx
```

## Documentation

```
Design:      docs/VALENTINE_PROPOSAL_DESIGN.md
Implementation: docs/VALENTINE_IMPLEMENTATION_GUIDE.md
Status:      docs/IMPLEMENTATION_COMPLETE.md
```

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Firefox | ✅ Full |
| Safari | ⚠️ Test |
| Edge | ✅ Full |

## State Management

```typescript
// Read state
const { currentPhase, noButtonAttempts, audioTime } = useValentineState();

// Dispatch actions
const { setValentinePhase, incrementNoAttempts, updateAudioTime } = 
  useAppStateActions();

// Phases: "proposal" → "visual-journey" → "complete"
```

## Development Workflow

1. **Start dev server:** `pnpm dev`
2. **Access app:** `http://localhost:5173/?valentine=true`
3. **Hot reload enabled:** Edit files and see changes instantly
4. **Console errors:** Check browser DevTools → Console
5. **Network tab:** Verify audio file loads correctly

## Performance Targets

- **Proposal screen:** 60 fps
- **Disco backdrop:** < 5% CPU
- **Audio visualization:** 50-60 fps
- **Text reveals:** GPU-accelerated (60 fps)
- **Overall:** Smooth on modern devices, 30+ fps on mobile

## Deployment Checklist

- [ ] Audio file (`hs.mp3`) in `public/audio/`
- [ ] Image file (`harry-styles-together.jpg`) in `public/images/` (optional)
- [ ] Type check: `pnpm typecheck`
- [ ] Build: `pnpm build`
- [ ] Test at `/?valentine=true`
- [ ] Push to repository
- [ ] Deploy to GitHub Pages / hosting

## Testing Scenarios

1. **Desktop - Click "Yes"** → Celebratory particles, fade to visual
2. **Desktop - Try "No"** → Button evades, Yes grows
3. **Mobile - Tap "Yes"** → Same as desktop
4. **Mobile - Tap "No"** → Same as desktop
5. **Audio sync** → Visualizations pulse with music
6. **Reveals** → Text appears at correct times
7. **Image display** → Concert poster appears at 2:00
8. **Completion** → Final message displayed after audio ends

## Support Resources

- **Audio API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- **React Hooks:** https://react.dev/reference/react/hooks
- **Zustand Docs:** https://github.com/pmnd/zustand
- **CSS Animations:** https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations

---

**Last Updated:** February 7, 2026  
**Status:** ✅ Ready for Use  
**Needs:** Harry Styles audio file (`hs.mp3`)
