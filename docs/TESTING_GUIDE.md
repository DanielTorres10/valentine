# Quick Start - Testing the Audio Fix

## What Changed?

**Before:** File upload audio wasn't connected to 3D visualization  
**After:** File upload now uses the same SoundCloud pattern, so audio syncs with 3D model

---

## How to Test

### Step 1: Start Development Server

```bash
cd app
npm run dev
```

You should see:
```
  VITE v7.3.1  ready in 123 ms

  ➜  Local:   http://localhost:5173/
```

### Step 2: Open Browser

Navigate to: `http://localhost:5173/`

### Step 3: Test Audio Source Selection

1. Click **"Audio Source"** tab in control panel
2. Change dropdown from "MICROPHONE" → **"FILE_UPLOAD"**

Expected: File input appears below the dropdown

### Step 4: Upload an Audio File

1. Click the **file input field**
2. Select an MP3 or WAV file from your computer

Expected outcomes:
- ✅ Audio starts playing immediately
- ✅ 3D model deforms/responds to audio
- ✅ No console errors

### Step 5: Monitor Console

Open DevTools Console (F12) and look for:

**Good signs (should see):**
```
[FileUpload] File selected: song.mp3
[FileAudioPlayer] Now playing: song.mp3
Playing audiofile
Building audio...
Building audioCtx...
```

**Bad signs (errors):**
```
[FileUpload] No audio element found
[FileAudioPlayer] Auto-play prevented
Error creating FFTAnalyzer
already connected
```

---

## Expected Behavior

### What Should Happen

```
You select file
    ↓ (1ms)
Audio starts playing
    ↓ (immediately)
3D model responds to audio beats/rhythm
    ↓ (continuous)
Frequency data drives visualization
    ↓ (in real-time)
Model deforms with bass, treble changes
```

### Visual Indicators

- **Audio playing**: Browser plays sound ✅
- **3D responding**: Geometry moves with beat ✅
- **No lag**: Instant response to audio ✅
- **Smooth animation**: No stuttering ✅

---

## Troubleshooting

### Problem: Audio plays but model doesn't respond

**Check 1: Is AudioAnalyzer rendering?**
```javascript
// In console
document.querySelector("audio")
// Should return: <audio crossorigin="anonymous"></audio>
```

**Check 2: Is FFTAnalyzer connected?**
```javascript
// In console, look for errors:
// "Error creating FFTAnalyzer"
// "already connected"
```

**Solution:** Refresh page, check console for errors

### Problem: Audio doesn't play at all

**Check 1: File input appears?**
- If no: Audio Source dropdown might not be set to FILE_UPLOAD
- If yes: Continue to Check 2

**Check 2: Browser permissions?**
- Some browsers block auto-play
- Try clicking somewhere on the page first

**Check 3: File format?**
- Supported: MP3, WAV, OGG, M4A
- Try a different file

**Solution:** Check console logs, try different file

### Problem: "Auto-play prevented" error

**This is expected!** Some browsers block auto-play without user interaction.

**Solution for iOS:** Click the file input, click again on the "Play Audio" button that appears

**Solution for Chrome/Firefox:** Try clicking on the page first

---

## Comparing with SoundCloud (Reference)

To verify the fix works the same as SoundCloud:

1. Switch to SoundCloud source in Audio Source dropdown
2. Search for a track (requires internet)
3. Play a track
4. Observe: 3D model responds ✅

Now switch back to File Upload:
- Should have identical behavior ✅
- Same real-time response ✅
- Same visualization sync ✅

---

## Files You Can Check

If you want to understand the changes:

1. **[AUDIO_ANALYSIS_ARCHITECTURE.md](AUDIO_ANALYSIS_ARCHITECTURE.md)** - Why old approach failed
2. **[VISUAL_ARCHITECTURE.md](VISUAL_ARCHITECTURE.md)** - How new approach works with diagrams
3. **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What was changed and why

### Key Files Modified

```
app/src/
├── main.tsx (Added FileUploadContextProvider)
├── context/
│   └── fileUpload.tsx (NEW - manages selected file)
├── components/
│   ├── audio/
│   │   ├── audioSource.tsx (Updated to render FileAudioPlayer)
│   │   └── sourceControls/
│   │       └── file.tsx (Renamed to FileAudioPlayer, now watches context)
│   └── controls/
│       └── audioSource/
│           └── fileUpload.tsx (Simplified - just sets context)
```

---

## Expected Console Output (Clean Run)

```
Building audio...
Building audioCtx...
Attempting to unlock AudioContext
[FileUpload] File selected: my-song.mp3
[FileAudioPlayer] Now playing: my-song.mp3
No need to unlock AudioContext
Playing audiofile
[File] Audio file loaded: blob:http://localhost:5173/...
[File] Audio can play
```

---

## Quick Verification Checklist

```
✓ File input appears when FILE_UPLOAD source selected
✓ Can select audio file from computer
✓ Audio plays immediately after selection
✓ No errors in console
✓ 3D model responds to audio
✓ Response is real-time (not delayed)
✓ Works with different file formats
✓ Works consistently on refresh
```

All ✓? **Success!** Audio fix is working.

---

## Next Steps

If everything works:

1. **Test with Valentine mode** - audio should sync there too
2. **Test with different audio files** - try various formats
3. **Test on mobile** - iOS needs play button click
4. **Test volume changes** - adjust in controls

If issues remain:

1. Check browser console (F12 → Console tab)
2. Look for red errors or orange warnings
3. Screenshot the errors
4. Share with developer

---

## Architecture Summary (TL;DR)

**Old way (broken):**
```
File selected → DOM query for audio → set src → play
              ❌ Finds wrong element or none
              ❌ FFTAnalyzer not listening
              ❌ No visualization
```

**New way (working):**
```
File selected → FileUploadContext updated → FileAudioPlayer effect fires
             → Receives correct audio element from analyzer
             → Sets src → plays
             → FFTAnalyzer already connected ✅
             → Visualization responds ✅
```

Same pattern as SoundCloud = proven, reliable architecture.
