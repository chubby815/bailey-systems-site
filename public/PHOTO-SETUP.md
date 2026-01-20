# Profile Photo Setup Instructions

## ACTION REQUIRED: Add Profile Photo

The website is configured to display a profile photo in the hero section. You need to add the image file manually.

### Step 1: Prepare Your Photo

1. Choose a professional photo (headshot or upper body)
2. Recommended dimensions: **600px wide × 700px tall** (vertical/portrait orientation)
3. Format: JPG or PNG
4. File size: Keep under 500KB for optimal performance

### Step 2: Save the Photo

1. Name the file: `profile-photo.jpg`
2. Place it in: `/bailey-systems-ai/public/`
3. Full path should be: `/bailey-systems-ai/public/profile-photo.jpg`

### Step 3: Verify

After adding the photo:
1. Refresh your browser
2. The photo should appear in the hero section with:
   - Bold 4px black border
   - Offset shadow (8px)
   - Rectangular frame (not circular)

### Current Configuration

- **Image path:** `/profile-photo.jpg`
- **Alt text:** "Javier Sandoval - Software Engineer"
- **Styling:** Neo-brutalist (black border, offset shadow, white background)
- **Responsive:** Scales appropriately on mobile devices

### Troubleshooting

If the image doesn't appear:
- Check the filename exactly matches: `profile-photo.jpg` (lowercase, hyphen, .jpg extension)
- Ensure it's in the `/public/` folder (not in a subfolder)
- Hard refresh your browser (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)
- Check browser console for any errors

### Alternative Filename

If you prefer a different filename:
1. Update line 51 in `/components/Hero.tsx`
2. Change `src="/profile-photo.jpg"` to your chosen filename
3. Make sure the file is still in `/public/`
