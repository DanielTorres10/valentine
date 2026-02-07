# Audio Files

## Harry Styles Track

Place the Harry Styles audio file here:

**Filename:** `hs.mp3`

### Location
This file should be placed at:
```
app/public/audio/hs.mp3
```

### Format Requirements
- **Format:** MP3 (or any browser-compatible audio format)
- **Duration:** Approximately 3 minutes
- **Bitrate:** 128-320 kbps recommended
- **Sample Rate:** 44.1 kHz or 48 kHz

### Usage
The audio file is automatically loaded and played when the user clicks "Yes" on the proposal screen at:
```
/?valentine=true
```

### Implementation Notes
- The audio path is configurable in `src/ValentineApp.tsx`
- The audio element is analyzed in real-time for frequency data
- The visualization syncs with the audio playback

### Timing Markers
The audio track should have the following key moments for text reveals:
- **1:00 (60s)** - Date reveal: "October 21, 2026"
- **1:30 (90s)** - Location reveal: "New York: Madison Square Garden"
- **2:00 (120s)** - Event reveal: "Harry Styles: TOGETHER, TOGETHER"

You can adjust these timings in `src/components/reveals/TimedReveals.tsx` if needed.
