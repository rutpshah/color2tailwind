# color2tailwind

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/RutShah.color2tailwind?style=flat-square&label=VS%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=RutShah.color2tailwind)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/RutShah.color2tailwind?style=flat-square)](https://marketplace.visualstudio.com/items?itemName=RutShah.color2tailwind)
[![License](https://img.shields.io/github/license/rutpshah/color2tailwind?style=flat-square)](LICENSE)

> **Convert any CSS color to Tailwind CSS classes** — just hover!

Supports **all modern CSS color formats**: hex, rgb, hsl, hwb, lab, lch, oklch, oklab, and 147 named colors.

![Demo](images/demo.png)

---

## ✨ Features

### 🎨 Universal Color Support

Hover over **any CSS color** to instantly see Tailwind equivalents:

```css
/* All of these work! */
.button {
  color: #ef4444; /* Hex */
  background: rgb(59, 130, 246); /* RGB */
  border-color: hsl(262, 83%, 58%); /* HSL */
  box-shadow: 0 0 0 3px oklch(0.7 0.15 200); /* OKLCH */
  outline-color: lab(54% 81 70); /* LAB */
}
```

| Format       | Examples                                     | Status |
| :----------- | :------------------------------------------- | :----: |
| Hex          | `#f00`, `#ef4444`, `#ef444480`               |   ✅   |
| RGB / RGBA   | `rgb(239, 68, 68)`, `rgba(239, 68, 68, 0.5)` |   ✅   |
| HSL / HSLA   | `hsl(0, 84%, 60%)`, `hsl(0 84% 60% / 50%)`   |   ✅   |
| HWB          | `hwb(0 0% 6%)`, `hwb(200 20% 10% / 0.8)`     |   ✅   |
| LAB          | `lab(54% 81 70)`                             |   ✅   |
| LCH          | `lch(54% 107 40)`                            |   ✅   |
| OKLCH        | `oklch(0.63 0.26 29)`                        |   ✅   |
| OKLAB        | `oklab(0.63 0.22 0.13)`                      |   ✅   |
| Named Colors | `red`, `rebeccapurple`, `coral` (147 colors) |   ✅   |

---

### 🎯 Smart Color Matching

#### Exact Match

When your color matches Tailwind's palette exactly:

```
✅ Tailwind CSS Match

Red palette, shade 500

| Property   | Class           |
|:-----------|:----------------|
| Text       | text-red-500    |
| Background | bg-red-500      |
| Border     | border-red-500  |
| Ring       | ring-red-500    |
| Divide     | divide-red-500  |
| Shadow     | shadow-red-500  |
```

#### Nearest Match

For custom colors, find the closest Tailwind alternatives:

```
🎨 Custom Color

Arbitrary values:
| Property   | Class              |
|:-----------|:-------------------|
| Text       | text-[#3fb8c4]     |
| Background | bg-[#3fb8c4]       |
| Border     | border-[#3fb8c4]   |

🔍 Nearest Tailwind Colors

■ cyan-500 — 89% similar (ΔE: 11.2)
■ teal-400 — 85% similar (ΔE: 15.4)
■ sky-500 — 82% similar (ΔE: 18.1)
```

---

### 📋 Quick Convert Command

1. Select any color in your code
2. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Run **"Convert Color to Tailwind Class"**
4. Pick a class → copied to clipboard!

---

## 🚀 Installation

### From VS Code Marketplace

1. Open **Extensions** (`Ctrl+Shift+X` / `Cmd+Shift+X`)
2. Search **"Color to Tailwind CSS"**
3. Click **Install**

### From VSIX

```bash
code --install-extension color2tailwind-1.0.0.vsix
```

---

## ⚙️ Configuration

| Setting                             | Default | Description                                  |
| :---------------------------------- | :------ | :------------------------------------------- |
| `color2tailwind.showColorPreview`   | `true`  | Show color swatch in hover                   |
| `color2tailwind.showRgbValues`      | `true`  | Display RGB values                           |
| `color2tailwind.showHslValues`      | `true`  | Display HSL values                           |
| `color2tailwind.showOriginalFormat` | `true`  | Show detected format (oklch, lab, etc.)      |
| `color2tailwind.showNearestMatch`   | `true`  | Show nearest Tailwind colors for non-matches |
| `color2tailwind.nearestMatchCount`  | `3`     | Number of nearest colors to display          |
| `color2tailwind.classPrefix`        | `""`    | Prefix for classes (e.g., `tw-`)             |
| `color2tailwind.enabledLanguages`   | `[...]` | Languages where extension is active          |

### Example: Custom Prefix

```json
{
  "color2tailwind.classPrefix": "tw-"
}
```

Result: `tw-bg-red-500` instead of `bg-red-500`

---

## 🎯 Supported Languages

JavaScript, TypeScript, React (JSX/TSX), Vue, Svelte, Astro, HTML, CSS, SCSS, Less, JSON, Markdown, PHP, Blade, ERB, Python

---

## 🧪 Color Science

This extension uses professional color science for accurate matching:

- **Delta E (CIE76)** — Perceptual color difference algorithm
- **LAB Color Space** — Device-independent color representation
- **CSS Color Level 4** — Full spec compliance for modern formats

---

## 🎨 Tailwind Palette

Includes the complete **Tailwind CSS v3** default color palette:

**Grays:** slate, gray, zinc, neutral, stone  
**Colors:** red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose  
**Special:** black, white

Each color includes shades: **50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950**

**Total: 242 colors**

---

## 🛠️ Development

```bash
# Clone
git clone https://github.com/rutpshah/color2tailwind.git
cd color2tailwind

# Install & build
npm install
npm run compile

# Debug in VS Code
# Press F5 to launch Extension Development Host
```

### Project Structure

```
color2tailwind/
├── src/
│   ├── colorUtils.ts      # Universal color parser
│   ├── tailwindColors.ts  # Palette + Delta E matching
│   └── extension.ts       # VS Code integration
├── images/
│   └── icon.png
├── package.json
└── README.md
```

---

## 📝 Changelog

### 1.0.0

- 🎨 Support for all CSS color formats (hex, rgb, hsl, hwb, lab, lch, oklch, oklab)
- 🏷️ 147 named CSS colors
- 🔍 Perceptual nearest-color matching using Delta E
- 📦 Complete Tailwind v3 palette (242 colors)
- ⚡ Hover provider for instant conversion
- 📋 Quick convert command with clipboard support

---

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

MIT © [Rut Shah](https://github.com/rutpshah)

---

## 💜 Support

- ⭐ **Star** this repo on [GitHub](https://github.com/rutpshah/color2tailwind)
- 📝 **Review** on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=RutShah.color2tailwind)
- 🐛 **Report issues** on [GitHub Issues](https://github.com/rutpshah/color2tailwind/issues)

---

**Made with ❤️ for the Tailwind CSS community**
