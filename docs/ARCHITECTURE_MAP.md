# Component Architecture Map

## Application Flow

```
App.tsx (checks ?valentine=true)
  ├─ Yes: Render ValentineApp
  │       ↓
  │       ValentineApp.tsx
  │       ├─ Phase 1: proposal
  │       │   └─ ProposalScreen.tsx
  │       │       ├─ DiscoBackdrop.tsx (canvas animation)
  │       │       ├─ YesButton.tsx (grows on attempts)
  │       │       └─ NoButton.tsx (evades interaction)
  │       │
  │       ├─ Phase 2: visual-journey
  │       │   ├─ Visual3DCanvas (3D visualization)
  │       │   ├─ AudioAnalyzer (hidden, data extraction)
  │       │   └─ TimedReveals.tsx
  │       │       ├─ DateReveal (1:00)
  │       │       ├─ LocationReveal (1:30)
  │       │       └─ EventReveal (2:00)
  │       │
  │       └─ Phase 3: complete
  │           └─ Completion message
  │
  └─ No: Render original App
      └─ Standard r3f-audio-visualizer experience
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Valentine Experience                 │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ Phase 1: PROPOSAL                                        │
│                                                          │
│  User Interaction ──→ NoButton.tsx                       │
│                           ↓                              │
│                    Increment Attempts                    │
│                           ↓                              │
│                    Update Zustand State                  │
│                           ↓                              │
│                    YesButton Grows                       │
│                           ↓                              │
│                    User Clicks "Yes"                     │
│                           ↓                              │
│         ┌───────────────────────────────────┐            │
│         │ Set Phase: visual-journey         │            │
│         │ Set YesClicked: true              │            │
│         │ Initialize Audio Playback         │            │
│         └───────────────────────────────────┘            │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│ Phase 2: AUDIO-VISUAL JOURNEY                            │
│                                                          │
│  HTML5 Audio Element                                     │
│        ↓                                                 │
│  Web Audio Context                                       │
│        ├─→ FFTAnalyzer (frequency data)                  │
│        │        ↓                                        │
│        │   Visual3DCanvas (renders visualization)        │
│        │                                                 │
│        └─→ AudioTimeupdate                               │
│              ↓                                           │
│         updateAudioTime() → Zustand State                │
│              ↓                                           │
│         useTimedReveal Hook (monitors audioTime)         │
│              ├─ 60s  → DateReveal visible                │
│              ├─ 90s  → LocationReveal visible            │
│              └─ 120s → EventReveal visible               │
└──────────────────────────────────────────────────────────┘
                          ↓
┌──────────────────────────────────────────────────────────┐
│ Phase 3: COMPLETE                                        │
│                                                          │
│  Audio finished playing → Set Phase: complete           │
│  Display completion message                             │
└──────────────────────────────────────────────────────────┘
```

## State Management Architecture

```
Zustand Store (appState.ts)
│
├─ IAppState (existing)
│  ├─ user
│  ├─ visual
│  ├─ appearance
│  ├─ camera
│  ├─ mode
│  ├─ mappers
│  ├─ audio
│  ├─ analyzers
│  └─ actions (existing)
│
└─ IValentineState (NEW)
   ├─ currentPhase: "proposal" | "visual-journey" | "complete"
   ├─ noButtonAttempts: number
   ├─ yesButtonClicked: boolean
   ├─ audioTime: number
   ├─ isValentineMode: boolean
   │
   └─ Valentine Actions (NEW)
      ├─ setValentinePhase(phase)
      ├─ incrementNoAttempts()
      ├─ setYesClicked(boolean)
      ├─ updateAudioTime(number)
      └─ initValentineMode()

Selectors (NEW)
├─ useValentineState() → IValentineState
└─ useAppStateActions() → includes valentine actions
```

## Component Tree

```
ValentineApp
├── audio[ref] ←─ Hidden HTML5 audio element
│                (controls playback & provides time tracking)
│
├── Phase 1: Proposal
│   └─ ProposalScreen
│       ├─ DiscoBackdrop
│       │   └─ Canvas (animation loop)
│       │       ├─ Particle system (sparkles)
│       │       ├─ Disco ball (rotating)
│       │       └─ Light rays (animation)
│       ├─ YesButton
│       │   └─ Grows based on noButtonAttempts
│       │       └─ Particle burst on click
│       └─ NoButton
│           └─ Evades based on mouse/touch position
│
├── Phase 2: Visual Journey
│   ├─ Visual3DCanvas
│   │   ├─ Three.js Scene
│   │   ├─ Visualizer Components (cycling models)
│   │   ├─ Camera Controls
│   │   └─ Post-processing effects
│   │
│   ├─ AudioAnalyzer (hidden)
│   │   ├─ FFTAnalyzer
│   │   └─ Web Audio Graph
│   │
│   └─ TimedReveals
│       ├─ DateReveal (useTimedReveal @ 60s)
│       ├─ LocationReveal (useTimedReveal @ 90s)
│       └─ EventReveal (useTimedReveal @ 120s)
│
└─ Phase 3: Complete
    └─ Static message overlay
```

## Event Flow - No Button Interaction

```
User Action (hover or touch)
        ↓
NoButton onMouseEnter / onTouchStart
        ↓
getRandomPosition()
├─ Generate random X, Y within viewport
├─ Check distance from YesButton center
├─ Ensure > 250px buffer
└─ Retry if too close (max 20 attempts)
        ↓
setPosition(newX, newY)
├─ Update React state
├─ Trigger re-render
└─ CSS transforms to new position
        ↓
incrementNoAttempts()
├─ Dispatch to Zustand store
├─ Increment noButtonAttempts counter
└─ Trigger YesButton re-render
        ↓
YesButton receives new props
├─ Calculate getScale() based on attempts
├─ Calculate getGlowIntensity()
├─ Update transform & box-shadow
└─ Display new visual state
```

## Event Flow - Yes Button Click

```
User Action (click)
        ↓
YesButton onClick
├─ setYesClicked(true) → Zustand
├─ setValentinePhase('visual-journey') → Zustand
└─ triggerCelebration()
        ↓
Celebratory Effects
├─ Create 30 particles at button center
├─ Animate particles outward (velocity + angle)
├─ Fade opacity over 60 frames
└─ Remove DOM elements
        ↓
ValentineApp handleProposalComplete()
├─ Play audio element
│   └─ Triggers Web Audio API context
├─ Zustand subscription detects phase change
├─ Re-render: ProposalScreen → Visual3DCanvas
└─ Audio analysis begins
        ↓
Visual3DCanvas Renders
├─ Initialize Three.js scene
├─ Apply audio visualization
└─ Begin animation loop
        ↓
Audio timeupdate Event
├─ Every 100ms check current time
├─ Call updateAudioTime(time) → Zustand
└─ TimedReveals hook monitors state
        ↓
At 60s: DateReveal appears
At 90s: LocationReveal appears
At 120s: EventReveal appears
```

## Hook Dependencies

```
ProposalScreen
├─ useAppStateActions()
│   └─ setValentinePhase, setYesClicked, incrementNoAttempts
│
├─ YesButton
│   ├─ useValentineState() → noButtonAttempts
│   └─ useAppStateActions()
│       └─ setYesClicked, setValentinePhase, incrementNoAttempts
│
└─ NoButton
    └─ useAppStateActions()
        └─ incrementNoAttempts

ValentineApp
├─ useValentineState() → currentPhase, audioTime
├─ useAppStateActions() → all actions
└─ useRef(audio)

TimedReveals Components
├─ useTimedReveal(triggerTime) → isVisible
└─ Monitors: document.getElementById('valentine-audio').currentTime

useTimedReveal
└─ useEffect with setInterval
    └─ Polls audio element time every 100ms
```

## CSS Animation Pipeline

```
DiscoBackdrop
├─ requestAnimationFrame loop
├─ Canvas 2D rendering (CPU)
└─ Particle updates every frame

ProposalScreen
├─ Text: CSS pulse animation (@keyframes)
├─ Emoji spinners: CSS rotate animation (@keyframes)
└─ GPU-accelerated (transform, opacity)

YesButton
├─ Scale transform (CSS transition)
├─ Box-shadow glow (CSS box-shadow)
├─ Pulse animation (@keyframes)
└─ GPU-accelerated

TimedReveals
├─ Fade-in opacity (CSS transition)
├─ Scale transform (CSS transition + @keyframes)
├─ Text-shadow glow (@keyframes)
└─ GPU-accelerated

Visual3DCanvas
├─ Three.js WebGL rendering
├─ Shader-based effects
└─ GPU-accelerated (native WebGL)
```

## File Organization

```
src/
├── components/
│   ├── proposal/                    ← NEW: Phase 1 components
│   │   ├── ProposalScreen.tsx
│   │   ├── DiscoBackdrop.tsx
│   │   ├── YesButton.tsx
│   │   └── NoButton.tsx
│   ├── reveals/                     ← NEW: Phase 3 components
│   │   └── TimedReveals.tsx
│   ├── canvas/                      ← EXISTING: Phase 2 visual
│   ├── analyzers/                   ← EXISTING: Audio analysis
│   └── controls/                    ← EXISTING: UI panels
│
├── hooks/
│   ├── useTimedReveal.ts            ← NEW: Reveal trigger hook
│   └── [existing hooks]
│
├── lib/
│   ├── appState.ts                  ← MODIFIED: Added Valentine state
│   ├── applicationModes.ts          ← EXISTING: App mode definitions
│   ├── analyzers/                   ← EXISTING: Audio analysis
│   └── mappers/                     ← EXISTING: Data transformation
│
├── App.tsx                          ← MODIFIED: Added routing logic
└── ValentineApp.tsx                 ← NEW: Main Valentine app

public/
├── audio/
│   ├── README.md                    ← NEW: Audio file instructions
│   └── hs.mp3                       ← USER ADDS: Harry Styles track
│
└── images/
    ├── README.md                    ← NEW: Image file instructions
    └── harry-styles-together.jpg    ← USER ADDS (optional): Concert image

docs/
├── VALENTINE_PROPOSAL_DESIGN.md              ← Architectural design
├── VALENTINE_IMPLEMENTATION_GUIDE.md         ← How to use
├── IMPLEMENTATION_COMPLETE.md                ← Status & summary
└── QUICK_REFERENCE.md                        ← Commands & links
```

## Browser API Dependencies

```
ValentineApp
├── HTMLAudioElement
│   └── Web Audio API
│       ├── AudioContext
│       ├── analyser.fft()
│       └── Frequency data
│
DiscoBackdrop
├── Canvas 2D API
│   ├── ctx.beginPath()
│   ├── ctx.arc()
│   ├── ctx.fillStyle
│   └── requestAnimationFrame
│
NoButton / YesButton
├── Event API
│   ├── onMouseEnter
│   ├── onClick
│   └── onTouchStart
│
├── DOM API
│   ├── getBoundingClientRect()
│   └── Math.random()
│
Visual3DCanvas
├── Three.js
├── WebGL
└── Shader system

TimedReveals
├── HTMLAudioElement (time tracking)
└── CSS Animations (GPU-accelerated)
```

---

This architecture ensures:
- ✅ Clear separation of concerns (Proposal / Audio / Reveals)
- ✅ Unidirectional data flow (Events → State → UI)
- ✅ Reusable hooks (`useTimedReveal`, `useValentineState`)
- ✅ Performance optimization (GPU acceleration, canvas rendering)
- ✅ Scalability (easy to add more reveals, visualizations, etc.)
- ✅ Backward compatibility (existing app unaffected)
