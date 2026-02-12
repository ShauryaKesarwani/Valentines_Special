# Valentine's Site Blueprint

## 1. Visual Identity
- **Palette:** #FFF1F2 (Base), #FB7185 (Dots), #000000 (Borders/Shadows).
- **Fonts:** System Bold / Bangers (Manga style).
- **Global CSS:** `.manga-dots { background-image: radial-gradient(#fb7185 1.5px, transparent 1.5px); background-size: 24px 24px; }`

## 2. Component Logic Checklist
- [ ] **Consent:** Absolute positioning logic for the "No" button.
- [ ] **Wrapped:** Framer Motion `AnimatePresence` for smooth slide transitions.
- [ ] **Dopamine:** State array to store "spawned" polaroids so they stay on screen as a pile.
- [ ] **Gacha:** Pity counter logic `if (pullCount === 10) return UR_CARD`.
- [ ] **Wanted:** CSS-only Wanted poster layout using `flex-col` and thick borders.

## 3. Data to Personalize (Edit in `data.js`)
- `wrappedSlides`: Array of strings/numbers.
- `dopaminePool`: Array of `{ image: string, text: string }`.
- `gachaPulls`: Array of 9 "trash" items and 1 UR object.
- `wantedPoster`: Image URL and Bounty text.
