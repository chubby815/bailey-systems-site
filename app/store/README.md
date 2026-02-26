# Bailey Systems AI - 3D Immersive Commerce Store

## Overview
**Bailey Systems AI** is a cutting-edge spatial commerce platform that reimagines e-commerce through immersive 3D environments. Built with React Three Fiber and Next.js 16, the store showcases AI agents and premium website templates in a high-end virtual gallery.

## Project Identity

**Name:** Bailey Systems AI (Bailey Production AI)  
**Type:** Immersive Spatial Commerce Store  
**Mission:** Transform digital product sales through cinematic 3D experiences that rival physical retail spaces.

---

## Current Feature Set

### ✨ 3D Gallery Architecture

**High-End Showroom**
- Photorealistic 3D environment powered by React Three Fiber
- Glossy black floor with metallic reflections (metalness: 0.9)
- Structured room with inverted box geometry for walls and ceiling
- OrbitControls for smooth camera navigation

**Dynamic Asset Mapping**
- **Left Counter:** 5 website template displays (`pic1.png` through `pic5.png`)
- **Right Counter:** 5 AI agent holographic pedestals
- Automatic positioning using `.map()` functions for consistent spacing
- Z-axis range: -3 to 7 (10 units of gallery space)

### 💡 Cinematic Lighting System

**Gallery Track Lights**
- **10 volumetric spotlights** (5 per side)
- Warm white color: `#FFF9E5` for luxury aesthetic
- Angle: 0.35 radians, Penumbra: 0.8 for soft edges
- Position: Y=4.5, perfectly aligned with each display

**Neon Green Counter Glows**
- **6 floor-level point lights** (3 per counter)
- Signature neon green: `#00ff41`
- Positioned at Y=-1.2 (floor level) for precise underglow
- Intensity: 25, Distance: 5 units, Decay: 2

**Counter Details**
- Black matte counters: `[2, 1, 15]` dimensions
- Single neon green accent strip on top edge
- 3 visible glow emitter spheres per counter

### 🤖 Featured AI Agents

The right-side pedestals showcase Bailey's autonomous AI workforce:

1. **Auto-Coder** - Autonomous software development agent
2. **Logo Architect** - Brand identity design AI
3. **Support** - Customer service automation
4. **Content** - Content generation and copywriting
5. **Financial** - Financial analysis and reporting

Each pedestal features:
- Holographic plane with green emissive glow
- Vertical light column effect
- Point light source for atmospheric lighting

### 🖼️ Website Template Gallery

The left-side displays showcase premium website templates:
- **5 vertical display planes** (1.8 x 2 units)
- High-resolution template screenshots
- Real-time texture mapping from `/public/` directory
- Optimized with React Suspense for lazy loading

---

## Technical Architecture

### Core Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.4 | App router, SSR, Turbopack |
| **React** | 19.2.3 | UI framework |
| **Three.js** | 0.182.0 | 3D rendering engine |
| **@react-three/fiber** | 9.5.0 | React renderer for Three.js |
| **@react-three/drei** | 10.7.7 | Helper components (OrbitControls, Html, useTexture) |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 3.4.14 | Utility-first styling |
| **Lucide React** | 0.474.0 | Icon system |

### Component Architecture

```
/app/store/
├── page.tsx          # Main 3D gallery entry point
├── layout.tsx        # Store layout wrapper
└── README.md         # This documentation

Key Components (in page.tsx):
├── TemplateBlock     # Website template display planes
├── AIAgentPedestal   # Holographic agent pedestals
├── Counter           # Gallery counter with neon accents
├── SafeGallerySpotLight  # Track lighting fixtures
└── StoreScene        # Main scene orchestrator
```

### File Structure

```
bailey-systems-ai/
├── app/
│   ├── store/
│   │   ├── page.tsx           # 3D Store implementation
│   │   ├── layout.tsx         # Layout wrapper
│   │   └── README.md          # Documentation
│   └── api/
│       └── checkout/
│           └── route.ts       # Stripe payment integration
├── public/
│   ├── pic1.png               # Template 1: Bento Layout
│   ├── pic2.png               # Template 2: E-Commerce
│   ├── pic3.png               # Template 3: SaaS Dashboard
│   ├── pic4.png               # Template 4: Portfolio
│   ├── pic5.png               # Template 5: Landing Page
│   └── [other assets]
└── package.json
```

### Type Safety

All components use strict TypeScript interfaces:

```typescript
type Vector3 = [number, number, number];

interface TemplateBlockProps {
  position: Vector3;
  imagePath: string;
}

interface AIAgentPedestalProps {
  position: Vector3;
}

interface CounterProps {
  position: Vector3;
  side: "left" | "right";
}
```

---

## Asset Management

### Template Images

**Location:** `/public/pic1.png` through `/public/pic5.png`

**Specifications:**
- Format: PNG (recommended for transparency support)
- Aspect Ratio: 9:10 (portrait)
- Recommended Resolution: 1080x1200px minimum
- Color Space: sRGB

**Current Templates:**
1. `pic1.png` - Bento Template
2. `pic2.png` - E-Commerce Pro
3. `pic3.png` - SaaS Dashboard
4. `pic4.png` - Portfolio Site
5. `pic5.png` - Landing Page Pro

### Adding New Templates

To add or replace templates:

1. Add image files to `/public/` directory
2. Update the mapping in `page.tsx`:
```tsx
const itemPositions: number[] = [-3, -0.5, 2, 4.5, 7];

{itemPositions.map((z, i) => (
  <TemplateBlock
    key={`template-${i}`}
    position={[-7.5, 2.2, z]}
    imagePath={`/pic${i + 1}.png`}  // Update filename here
  />
))}
```

---

## Gallery Configuration

### Lighting Adjustments

**Modify Gallery Spotlights:**
```tsx
<SafeGallerySpotLight
  position={[-7.5, 4.5, z]}
  rotation={[Math.PI / 4, 0, 0]}  // Adjust angle here
/>
```

**Modify Floor Glow Intensity:**
```tsx
<pointLight 
  position={[0, -1.2, -4]} 
  intensity={25}           // Adjust brightness (0-100)
  color="#00ff41" 
  distance={5}             // Adjust spread radius
  decay={2} 
/>
```

### Camera Settings

**Modify Starting Position:**
```tsx
<Canvas
  camera={{ 
    position: [0, 2, 11],  // [x, y, z] coordinates
    fov: 60                 // Field of view (30-120)
  }}
>
```

**Modify Navigation Limits:**
```tsx
<OrbitControls
  makeDefault
  target={[0, 1.8, 0]}     // Camera focus point
  minDistance={3}          // Minimum zoom distance
  maxDistance={15}         // Maximum zoom distance
/>
```

### Gallery Dimensions

**Modify Counter Size:**
```tsx
<Counter position={[-7.5, 0, 2]} side="left" />

// Inside Counter component:
<boxGeometry args={[2, 1, 15]} />  // [width, height, depth]
```

**Modify Item Positions:**
```tsx
const itemPositions: number[] = [-3, -0.5, 2, 4.5, 7];
// Add or remove Z-coordinates to change item count and spacing
```

---

## Performance Optimizations

### Current Implementations

✅ **Suspense Boundaries** - Async texture loading  
✅ **Shadow Optimization** - Selective `castShadow` on key objects  
✅ **Mapped Components** - DRY code with `.map()` functions  
✅ **Type Safety** - Zero `any` types for better tree-shaking  
✅ **HTML Overlays** - Crash-safe text rendering with `<Html>`  

### Recommended Settings

**High Performance:**
```tsx
<Canvas
  shadows={false}  // Disable shadows for FPS boost
  gl={{ 
    antialias: false,
    powerPreference: "high-performance"
  }}
>
```

**Visual Quality:**
```tsx
<Canvas
  shadows
  gl={{ 
    antialias: true,
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 1.2
  }}
>
```

---

## Browser Compatibility

**Tested & Supported:**
- ✅ Chrome 120+ (Recommended)
- ✅ Firefox 121+
- ✅ Safari 17.2+
- ✅ Edge 120+

**Minimum Requirements:**
- WebGL 2.0 support
- 4GB RAM
- Dedicated GPU recommended

**Mobile:**
- iOS Safari 16.4+
- Chrome for Android 120+
- Performance may vary on lower-end devices

---

## Development

### Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Server runs at:
# http://localhost:3000
# or http://localhost:3001 (if 3000 is in use)
```

### Building for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

### Environment Variables

Create `.env.local` for Stripe integration:

```env
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

---

## Troubleshooting

### Issue: Black screen / Store won't load

**Solutions:**
1. Check browser console for WebGL errors
2. Verify image files exist in `/public/` directory
3. Clear browser cache and hard refresh (Ctrl+Shift+R)
4. Try a different browser (Chrome recommended)

### Issue: Images not displaying

**Solutions:**
1. Verify file paths match exactly (case-sensitive)
2. Check that images are in `/public/` root directory
3. Ensure images are valid PNG/JPG files
4. Check browser console for 404 errors

### Issue: Poor performance / low FPS

**Solutions:**
1. Reduce shadow quality or disable shadows
2. Lower canvas resolution with `dpr` prop
3. Check GPU acceleration is enabled in browser
4. Close other GPU-intensive applications

### Issue: Navigation feels sluggish

**Solutions:**
1. Adjust `OrbitControls` damping:
```tsx
<OrbitControls enableDamping dampingFactor={0.05} />
```
2. Reduce particle/light count
3. Check for memory leaks in browser dev tools

---

## Future Roadmap

### Phase 1: E-Commerce Integration
- ✨ **Stripe Checkout** - Fully integrated payment processing
- 🛒 **Product Details Modal** - Click-to-view expanded info
- 💳 **Shopping Cart** - Multi-item checkout support
- 📧 **Order Confirmation** - Automated email receipts

### Phase 2: Enhanced Interactions
- 🎯 **Raycasting** - Clickable product hotspots
- 🎬 **GSAP Animations** - Camera zoom transitions on product select
- 🔊 **Spatial Audio** - Ambient soundscape and UI feedback
- 📱 **Mobile Optimization** - Touch joystick controls

### Phase 3: Multimodal AI Integration
- 🤖 **Bailey Agent (Robot Dog)** - Live coding demonstrations
- 💬 **Voice Commerce** - Natural language product search
- 🎥 **WebRTC Video** - Real-time agent interactions
- 🧠 **Personalization** - AI-driven product recommendations

### Phase 4: Advanced Features
- 🌐 **Multi-Store** - Multiple themed gallery environments
- 🎨 **Customization** - User-configurable lighting and layouts
- 📊 **Analytics** - Heatmaps and engagement metrics
- 🔗 **Social Sharing** - 3D scene snapshot generation

---

## API Integration

### Stripe Checkout (Planned)

**Endpoint:** `/api/checkout`

**Request:**
```json
{
  "priceId": "price_template_1",
  "productName": "Bento Template"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

**Update Price Mapping:**

Edit `/app/api/checkout/route.ts`:
```typescript
const PRICE_MAP: Record<string, string> = {
  'price_template_1': 'price_1234567890',  // Replace with Stripe Price IDs
  'price_template_2': 'price_1234567891',
  // ... etc
};
```

---

## Contributing

### Code Style

- **TypeScript** - Strict mode, no `any` types
- **Components** - Functional components with typed props
- **Formatting** - 2-space indentation, semicolons
- **Comments** - JSDoc for complex functions

### Adding New Features

1. Create feature branch: `git checkout -b feature/your-feature`
2. Implement with TypeScript interfaces
3. Test across browsers (Chrome, Firefox, Safari)
4. Update this README with new documentation
5. Submit pull request with clear description

---

## Support & Contact

For technical support or customization inquiries:
- **Website:** [Bailey Systems AI](#)
- **Consulting:** `/consulting` route
- **GitHub Issues:** Report bugs and feature requests

---

## License

**Proprietary** - Bailey Systems AI  
All rights reserved. Unauthorized reproduction or distribution prohibited.

---

## Changelog

### v1.0.0 (Current)
- ✅ Initial 3D gallery implementation
- ✅ 5 website templates + 5 AI agent pedestals
- ✅ Volumetric lighting system (10 spotlights + 6 floor glows)
- ✅ TypeScript type safety (100% typed)
- ✅ React Suspense texture loading
- ✅ OrbitControls navigation
- ✅ HTML overlay branding

### v0.9.0 (Previous)
- Initial prototype with 8 frames and PointerLockControls (deprecated)

---

**Built with ❤️ by Bailey Systems AI**
