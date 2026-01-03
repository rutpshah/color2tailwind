# Changelog

All notable changes to the "color2tailwind" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-03

### Added

- 🎨 **Universal color support** - Parse and convert all CSS color formats:

  - Hex: `#rgb`, `#rrggbb`, `#rrggbbaa`
  - RGB/RGBA: `rgb(r, g, b)`, `rgba(r, g, b, a)`
  - HSL/HSLA: `hsl(h, s%, l%)`, `hsla(h, s%, l%, a)`
  - HWB: `hwb(h w% b%)`
  - LAB: `lab(l% a b)`
  - LCH: `lch(l% c h)`
  - OKLCH: `oklch(l c h)`
  - OKLAB: `oklab(l a b)`
  - Named colors: 147 CSS named colors

- ✅ **Exact matching** - Instant detection of Tailwind palette colors

- 🔍 **Nearest color matching** - Delta E (CIE76) perceptual color distance algorithm finds the closest Tailwind colors when no exact match exists

- 📋 **Quick convert command** - Select a color and copy Tailwind class to clipboard

- ⚙️ **Configurable settings**:

  - Toggle color preview swatch
  - Show/hide RGB and HSL values
  - Display detected color format
  - Customize number of nearest matches
  - Set class prefix (e.g., `tw-`)
  - Configure enabled languages

- 🌐 **Multi-language support** - Works in JavaScript, TypeScript, React, Vue, Svelte, Astro, HTML, CSS, SCSS, Less, JSON, Markdown, PHP, Blade, ERB, and Python

### Technical

- Full Tailwind CSS v3 color palette (242 colors)
- LAB color space conversion for accurate color matching
- Comprehensive regex patterns for modern CSS color syntax
