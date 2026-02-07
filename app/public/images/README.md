# Concert Images

## Harry Styles Concert Poster/Screenshot

Place the concert promotional image here:

**Filename:** `harry-styles-together.jpg`

### Location
This file should be placed at:
```
app/public/images/harry-styles-together.jpg
```

### Format Requirements
- **Format:** JPG, PNG, or WebP
- **Dimensions:** 400-800px wide (aspect ratio: 2:3 or similar portrait orientation)
- **File Size:** < 500 KB recommended for fast loading
- **Quality:** 72-96 DPI is sufficient for web

### Image Content
The image should be a promotional or concert poster for "Harry Styles: TOGETHER, TOGETHER" at Madison Square Garden. This will be displayed at the climactic moment during the audio visualization (approximately 2:00 into the track).

### Usage
The image URL is passed to the `TimedReveals` component in `ValentineApp.tsx`:
```typescript
<TimedReveals imageUrl="/r3f-audio-visualizer/images/harry-styles-together.jpg" />
```

### Styling
The image will automatically be:
- Centered on the screen
- Rounded with shadow effects
- Responsive (max-width adjusts for mobile)
- Glowing with romantic colors (gold, pink, purple)

### Optional: Fallback
If you don't have an image, you can:
1. Remove the image file and the image display will be skipped
2. Comment out the image display in the `EventReveal` component
3. Use a solid color background instead

The text reveal will still appear even without the image.
