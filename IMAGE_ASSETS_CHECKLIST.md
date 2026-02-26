# 🖼️ IMAGE ASSET CHECKLIST FOR 3D STORE

## Required Template Images

Upload these **8 template screenshots** to your `/public/` directory:

```
📁 /public/
  ├── ✅ vee.png (already exists - clerk fallback)
  ├── ✅ placeholder.jpg (already exists - frame fallback)
  │
  ├── ❌ template 1.jpg     (BENTO TEMPLATE - $1,499)
  ├── ❌ template 2.jpg     (E-COMMERCE PRO - $2,499)
  ├── ❌ tem 3.webp         (SAAS DASHBOARD - $1,999)
  ├── ❌ tem4.jpg           (PORTFOLIO SITE - $799)
  ├── ❌ tem5.jpg           (BLOG CMS - $999)
  ├── ❌ tem6.webp          (BOOKING SYSTEM - $1,499)
  ├── ❌ tem7.jfif          (LANDING PAGE PRO - $699)
  └── ❌ tem8.jpg           (ADMIN PANEL - $1,799)
```

## Optional Enhancement
```
📁 /public/
  └── ❌ veejs.jpg          (Vee clerk image - currently falls back to vee.png)
```

## 📸 Image Guidelines

### Recommended Specs:
- **Format**: JPG, WEBP, or PNG
- **Dimensions**: 1920x1080 or 2560x1440 (16:9 ratio)
- **File Size**: < 500KB per image (optimized for web)
- **Content**: Full-page screenshots of template designs

### What to Capture:
1. **Homepage Screenshot**: Full landing page view
2. **Hero Section**: Above-the-fold content visible
3. **Key Features**: Show main UI components and layouts
4. **Clean Background**: Remove browser chrome, bookmarks, etc.

## 🎨 Style Recommendations

For best visual appeal in the 3D frames:
- Use **high contrast** designs
- Show **real content** (not lorem ipsum if possible)
- Include **modern UI elements** (buttons, cards, navigation)
- Capture **desktop view** (mobile responsive not needed for preview)

## ⚡ Quick Setup Command

After adding images to `/public/`, verify they load:

```bash
# Navigate to public directory
cd c:\Users\lilia\OneDrive\Documents\Bailey-systems-AI\bailey-systems-ai\public

# List all template files
dir template*.* /B
dir tem*.* /B
```

Expected output:
```
template 1.jpg
template 2.jpg
tem 3.webp
tem4.jpg
tem5.jpg
tem6.webp
tem7.jfif
tem8.jpg
```

## 🔄 Fallback System

**Don't have template images yet?**
- The store will automatically use `/placeholder.jpg` for missing templates
- Frames will display a dark gray color instead of the template texture
- Store remains fully functional - you can add images later

## 🧪 Testing Image Loading

After adding images, check browser console for texture loading:
1. Navigate to `http://localhost:3000/store`
2. Open DevTools Console (F12)
3. Look for any "Texture loading error" messages
4. Verify all 8 frames display their respective templates

## 📦 Image Compression Tools

Before uploading, compress images for optimal performance:
- **TinyPNG**: https://tinypng.com/ (PNG/WEBP)
- **JPEGmini**: https://www.jpegmini.com/ (JPG)
- **Squoosh**: https://squoosh.app/ (all formats)

Target: **< 300KB per image** for fast 3D scene loading.

## ✅ Completion Checklist

Once all images are uploaded, update this file:

- [ ] `template 1.jpg` uploaded (BENTO TEMPLATE)
- [ ] `template 2.jpg` uploaded (E-COMMERCE PRO)
- [ ] `tem 3.webp` uploaded (SAAS DASHBOARD)
- [ ] `tem4.jpg` uploaded (PORTFOLIO SITE)
- [ ] `tem5.jpg` uploaded (BLOG CMS)
- [ ] `tem6.webp` uploaded (BOOKING SYSTEM)
- [ ] `tem7.jfif` uploaded (LANDING PAGE PRO)
- [ ] `tem8.jpg` uploaded (ADMIN PANEL)
- [ ] All textures load without console errors
- [ ] Frames display correct template previews in 3D store

---

**Next Step After Images:**
Configure Stripe Price IDs in `/app/api/checkout/route.ts`
