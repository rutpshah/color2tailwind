/**
 * Color Utilities
 * Comprehensive color parsing and conversion for all CSS color formats
 */

/**
 * Normalized RGB color (0-255 range)
 */
export interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Normalized RGBA color
 */
export interface RGBA extends RGB {
  a: number;
}

/**
 * HSL color (h: 0-360, s: 0-100, l: 0-100)
 */
export interface HSL {
  h: number;
  s: number;
  l: number;
}

/**
 * HSLA color
 */
export interface HSLA extends HSL {
  a: number;
}

/**
 * HWB color (h: 0-360, w: 0-100, b: 0-100)
 */
export interface HWB {
  h: number;
  w: number;
  b: number;
}

/**
 * LAB color (CIE Lab)
 */
export interface LAB {
  l: number;
  a: number;
  b: number;
}

/**
 * LCH color (CIE LCH)
 */
export interface LCH {
  l: number;
  c: number;
  h: number;
}

/**
 * OKLCH color
 */
export interface OKLCH {
  l: number;
  c: number;
  h: number;
}

/**
 * OKLAB color
 */
export interface OKLAB {
  l: number;
  a: number;
  b: number;
}

/**
 * Parsed color result
 */
export interface ParsedColor {
  original: string;
  format: ColorFormat;
  rgba: RGBA;
  hex: string;
  isValid: boolean;
}

export type ColorFormat =
  | 'hex'
  | 'hex-alpha'
  | 'rgb'
  | 'rgba'
  | 'hsl'
  | 'hsla'
  | 'hwb'
  | 'lab'
  | 'lch'
  | 'oklch'
  | 'oklab'
  | 'named'
  | 'unknown';

/**
 * CSS Named Colors (CSS Level 4)
 */
const namedColors: Record<string, string> = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkgrey: '#a9a9a9',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkslategrey: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  grey: '#808080',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3',
  lightgreen: '#90ee90',
  lightgrey: '#d3d3d3',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightslategrey: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  slategrey: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32',
};

// ============================================
// REGEX PATTERNS
// ============================================

/**
 * Comprehensive regex patterns for all CSS color formats
 */
export const colorPatterns = {
  // Hex colors: #RGB, #RRGGBB, #RGBA, #RRGGBBAA
  hex: /#(?:([A-Fa-f0-9]{8})|([A-Fa-f0-9]{6})|([A-Fa-f0-9]{4})|([A-Fa-f0-9]{3}))\b/g,

  // RGB/RGBA: rgb(r, g, b) or rgba(r, g, b, a) - legacy and modern syntax
  rgb: /rgba?\(\s*(\d{1,3}%?)\s*[,\s]\s*(\d{1,3}%?)\s*[,\s]\s*(\d{1,3}%?)(?:\s*[,\/]\s*([\d.]+%?))?\s*\)/gi,

  // HSL/HSLA: hsl(h, s%, l%) or hsla(h, s%, l%, a)
  hsl: /hsla?\(\s*([\d.]+(?:deg|rad|grad|turn)?)\s*[,\s]\s*([\d.]+%)\s*[,\s]\s*([\d.]+%)(?:\s*[,\/]\s*([\d.]+%?))?\s*\)/gi,

  // HWB: hwb(h w% b% / a)
  hwb: /hwb\(\s*([\d.]+(?:deg|rad|grad|turn)?)\s+(\d{1,3}%)\s+(\d{1,3}%)(?:\s*\/\s*([\d.]+%?))?\s*\)/gi,

  // LAB: lab(l% a b / alpha)
  lab: /lab\(\s*([\d.]+%?)\s+([-\d.]+%?)\s+([-\d.]+%?)(?:\s*\/\s*([\d.]+%?))?\s*\)/gi,

  // LCH: lch(l% c h / alpha)
  lch: /lch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+(?:deg|rad|grad|turn)?)(?:\s*\/\s*([\d.]+%?))?\s*\)/gi,

  // OKLCH: oklch(l c h / alpha)
  oklch: /oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+(?:deg|rad|grad|turn)?)(?:\s*\/\s*([\d.]+%?))?\s*\)/gi,

  // OKLAB: oklab(l a b / alpha)
  oklab: /oklab\(\s*([\d.]+%?)\s+([-\d.]+%?)\s+([-\d.]+%?)(?:\s*\/\s*([\d.]+%?))?\s*\)/gi,

  // Named colors - will be checked separately
};

/**
 * Combined pattern for detecting any color
 */
export const anyColorPattern = new RegExp(
  [
    // Hex
    /#(?:[A-Fa-f0-9]{8}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{3})\b/,
    // RGB/RGBA
    /rgba?\(\s*\d{1,3}%?\s*[,\s]\s*\d{1,3}%?\s*[,\s]\s*\d{1,3}%?(?:\s*[,\/]\s*[\d.]+%?)?\s*\)/,
    // HSL/HSLA
    /hsla?\(\s*[\d.]+(?:deg|rad|grad|turn)?\s*[,\s]\s*[\d.]+%\s*[,\s]\s*[\d.]+%(?:\s*[,\/]\s*[\d.]+%?)?\s*\)/,
    // HWB
    /hwb\(\s*[\d.]+(?:deg|rad|grad|turn)?\s+\d{1,3}%\s+\d{1,3}%(?:\s*\/\s*[\d.]+%?)?\s*\)/,
    // LAB
    /lab\(\s*[\d.]+%?\s+[-\d.]+%?\s+[-\d.]+%?(?:\s*\/\s*[\d.]+%?)?\s*\)/,
    // LCH
    /lch\(\s*[\d.]+%?\s+[\d.]+%?\s+[\d.]+(?:deg|rad|grad|turn)?(?:\s*\/\s*[\d.]+%?)?\s*\)/,
    // OKLCH
    /oklch\(\s*[\d.]+%?\s+[\d.]+%?\s+[\d.]+(?:deg|rad|grad|turn)?(?:\s*\/\s*[\d.]+%?)?\s*\)/,
    // OKLAB
    /oklab\(\s*[\d.]+%?\s+[-\d.]+%?\s+[-\d.]+%?(?:\s*\/\s*[\d.]+%?)?\s*\)/,
    // Named colors (common ones for quick matching)
    /\b(red|blue|green|yellow|orange|purple|pink|cyan|magenta|white|black|gray|grey|transparent)\b/,
  ]
    .map((r) => r.source)
    .join('|'),
  'gi'
);

// ============================================
// PARSING FUNCTIONS
// ============================================

/**
 * Parse angle value to degrees
 */
function parseAngle(value: string): number {
  const num = parseFloat(value);
  if (value.endsWith('rad')) {
    return (num * 180) / Math.PI;
  }
  if (value.endsWith('grad')) {
    return (num * 360) / 400;
  }
  if (value.endsWith('turn')) {
    return num * 360;
  }
  return num; // degrees or no unit
}

/**
 * Parse percentage or number value
 */
function parsePercentOrNumber(value: string, max: number = 100): number {
  if (value.endsWith('%')) {
    return (parseFloat(value) / 100) * max;
  }
  return parseFloat(value);
}

/**
 * Parse alpha value (percentage or decimal)
 */
function parseAlpha(value: string | undefined): number {
  if (!value) {
    return 1;
  }
  if (value.endsWith('%')) {
    return parseFloat(value) / 100;
  }
  return parseFloat(value);
}

/**
 * Expand 3 or 4 digit hex to 6 or 8 digits
 */
export function expandHex(hex: string): string {
  if (hex.length === 4) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  if (hex.length === 5) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}${hex[4]}${hex[4]}`;
  }
  return hex;
}

/**
 * Parse hex color to RGBA
 */
function parseHex(hex: string): RGBA | null {
  const expanded = expandHex(hex);
  let r: number, g: number, b: number, a: number = 1;

  if (expanded.length === 7) {
    r = parseInt(expanded.slice(1, 3), 16);
    g = parseInt(expanded.slice(3, 5), 16);
    b = parseInt(expanded.slice(5, 7), 16);
  } else if (expanded.length === 9) {
    r = parseInt(expanded.slice(1, 3), 16);
    g = parseInt(expanded.slice(3, 5), 16);
    b = parseInt(expanded.slice(5, 7), 16);
    a = parseInt(expanded.slice(7, 9), 16) / 255;
  } else {
    return null;
  }

  return { r, g, b, a };
}

/**
 * Parse RGB/RGBA string to RGBA
 */
function parseRgb(match: RegExpMatchArray): RGBA | null {
  const [, r, g, b, a] = match;

  return {
    r: parsePercentOrNumber(r, 255),
    g: parsePercentOrNumber(g, 255),
    b: parsePercentOrNumber(b, 255),
    a: parseAlpha(a),
  };
}

/**
 * Convert HSL to RGB
 */
function hslToRgb(h: number, s: number, l: number): RGB {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;

  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Parse HSL/HSLA string to RGBA
 */
function parseHsl(match: RegExpMatchArray): RGBA | null {
  const [, h, s, l, a] = match;

  const hDeg = parseAngle(h);
  const sPct = parseFloat(s);
  const lPct = parseFloat(l);

  const rgb = hslToRgb(hDeg, sPct, lPct);

  return {
    ...rgb,
    a: parseAlpha(a),
  };
}

/**
 * Convert HWB to RGB
 */
function hwbToRgb(h: number, w: number, b: number): RGB {
  w = w / 100;
  b = b / 100;

  if (w + b >= 1) {
    const gray = Math.round((w / (w + b)) * 255);
    return { r: gray, g: gray, b: gray };
  }

  const rgb = hslToRgb(h, 100, 50);
  const factor = 1 - w - b;

  return {
    r: Math.round(rgb.r * factor + w * 255),
    g: Math.round(rgb.g * factor + w * 255),
    b: Math.round(rgb.b * factor + b * 255),
  };
}

/**
 * Parse HWB string to RGBA
 */
function parseHwb(match: RegExpMatchArray): RGBA | null {
  const [, h, w, b, a] = match;

  const hDeg = parseAngle(h);
  const wPct = parseFloat(w);
  const bPct = parseFloat(b);

  const rgb = hwbToRgb(hDeg, wPct, bPct);

  return {
    ...rgb,
    a: parseAlpha(a),
  };
}

/**
 * Convert LAB to XYZ
 */
function labToXyz(l: number, a: number, b: number): { x: number; y: number; z: number } {
  const fy = (l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const delta = 6 / 29;
  const delta3 = delta * delta * delta;

  const xr = fx > delta ? fx * fx * fx : (fx - 16 / 116) * 3 * delta * delta;
  const yr = l > 8 ? fy * fy * fy : l / (24389 / 27);
  const zr = fz > delta ? fz * fz * fz : (fz - 16 / 116) * 3 * delta * delta;

  // D65 illuminant
  return {
    x: xr * 95.047,
    y: yr * 100.0,
    z: zr * 108.883,
  };
}

/**
 * Convert XYZ to RGB (sRGB)
 */
function xyzToRgb(x: number, y: number, z: number): RGB {
  x /= 100;
  y /= 100;
  z /= 100;

  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let b = x * 0.0557 + y * -0.204 + z * 1.057;

  // Gamma correction
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

  return {
    r: Math.round(Math.max(0, Math.min(255, r * 255))),
    g: Math.round(Math.max(0, Math.min(255, g * 255))),
    b: Math.round(Math.max(0, Math.min(255, b * 255))),
  };
}

/**
 * Convert LAB to RGB
 */
function labToRgb(l: number, a: number, b: number): RGB {
  const xyz = labToXyz(l, a, b);
  return xyzToRgb(xyz.x, xyz.y, xyz.z);
}

/**
 * Parse LAB string to RGBA
 */
function parseLab(match: RegExpMatchArray): RGBA | null {
  const [, l, a, b, alpha] = match;

  const lVal = parsePercentOrNumber(l, 100);
  const aVal = a.endsWith('%') ? (parseFloat(a) / 100) * 125 : parseFloat(a);
  const bVal = b.endsWith('%') ? (parseFloat(b) / 100) * 125 : parseFloat(b);

  const rgb = labToRgb(lVal, aVal, bVal);

  return {
    ...rgb,
    a: parseAlpha(alpha),
  };
}

/**
 * Convert LCH to LAB
 */
function lchToLab(l: number, c: number, h: number): LAB {
  const hRad = (h * Math.PI) / 180;
  return {
    l,
    a: c * Math.cos(hRad),
    b: c * Math.sin(hRad),
  };
}

/**
 * Parse LCH string to RGBA
 */
function parseLch(match: RegExpMatchArray): RGBA | null {
  const [, l, c, h, alpha] = match;

  const lVal = parsePercentOrNumber(l, 100);
  const cVal = parsePercentOrNumber(c, 150);
  const hVal = parseAngle(h);

  const lab = lchToLab(lVal, cVal, hVal);
  const rgb = labToRgb(lab.l, lab.a, lab.b);

  return {
    ...rgb,
    a: parseAlpha(alpha),
  };
}

/**
 * Convert OKLAB to linear sRGB
 */
function oklabToLinearSrgb(l: number, a: number, b: number): RGB {
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  let r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let bVal = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  // Convert from linear sRGB to sRGB
  const toSrgb = (c: number) => {
    if (c <= 0.0031308) {
      return c * 12.92;
    }
    return 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  };

  return {
    r: Math.round(Math.max(0, Math.min(255, toSrgb(r) * 255))),
    g: Math.round(Math.max(0, Math.min(255, toSrgb(g) * 255))),
    b: Math.round(Math.max(0, Math.min(255, toSrgb(bVal) * 255))),
  };
}

/**
 * Parse OKLAB string to RGBA
 */
function parseOklab(match: RegExpMatchArray): RGBA | null {
  const [, l, a, b, alpha] = match;

  const lVal = parsePercentOrNumber(l, 1);
  const aVal = a.endsWith('%') ? (parseFloat(a) / 100) * 0.4 : parseFloat(a);
  const bVal = b.endsWith('%') ? (parseFloat(b) / 100) * 0.4 : parseFloat(b);

  const rgb = oklabToLinearSrgb(lVal, aVal, bVal);

  return {
    ...rgb,
    a: parseAlpha(alpha),
  };
}

/**
 * Convert OKLCH to OKLAB
 */
function oklchToOklab(l: number, c: number, h: number): OKLAB {
  const hRad = (h * Math.PI) / 180;
  return {
    l,
    a: c * Math.cos(hRad),
    b: c * Math.sin(hRad),
  };
}

/**
 * Parse OKLCH string to RGBA
 */
function parseOklch(match: RegExpMatchArray): RGBA | null {
  const [, l, c, h, alpha] = match;

  const lVal = parsePercentOrNumber(l, 1);
  const cVal = parsePercentOrNumber(c, 0.4);
  const hVal = parseAngle(h);

  const oklab = oklchToOklab(lVal, cVal, hVal);
  const rgb = oklabToLinearSrgb(oklab.l, oklab.a, oklab.b);

  return {
    ...rgb,
    a: parseAlpha(alpha),
  };
}

/**
 * Parse named color to RGBA
 */
function parseNamedColor(name: string): RGBA | null {
  const hex = namedColors[name.toLowerCase()];
  if (!hex) {
    return null;
  }
  return parseHex(hex);
}

// ============================================
// MAIN PARSING FUNCTION
// ============================================

/**
 * Parse any CSS color string to a normalized format
 */
export function parseColor(colorString: string): ParsedColor | null {
  const trimmed = colorString.trim().toLowerCase();

  // Check for named colors first
  if (namedColors[trimmed]) {
    const rgba = parseNamedColor(trimmed);
    if (rgba) {
      return {
        original: colorString,
        format: 'named',
        rgba,
        hex: rgbaToHex(rgba),
        isValid: true,
      };
    }
  }

  // Hex colors
  const hexMatch = trimmed.match(/^#(?:([A-Fa-f0-9]{8})|([A-Fa-f0-9]{6})|([A-Fa-f0-9]{4})|([A-Fa-f0-9]{3}))$/i);
  if (hexMatch) {
    const rgba = parseHex(trimmed);
    if (rgba) {
      const format: ColorFormat = trimmed.length === 5 || trimmed.length === 9 ? 'hex-alpha' : 'hex';
      return {
        original: colorString,
        format,
        rgba,
        hex: rgbaToHex(rgba),
        isValid: true,
      };
    }
  }

  // RGB/RGBA
  const rgbMatch = trimmed.match(/^rgba?\(\s*(\d{1,3}%?)\s*[,\s]\s*(\d{1,3}%?)\s*[,\s]\s*(\d{1,3}%?)(?:\s*[,\/]\s*([\d.]+%?))?\s*\)$/i);
  if (rgbMatch) {
    const rgba = parseRgb(rgbMatch);
    if (rgba) {
      return {
        original: colorString,
        format: rgbMatch[4] ? 'rgba' : 'rgb',
        rgba,
        hex: rgbaToHex(rgba),
        isValid: true,
      };
    }
  }

  // HSL/HSLA
  const hslMatch = trimmed.match(/^hsla?\(\s*([\d.]+(?:deg|rad|grad|turn)?)\s*[,\s]\s*([\d.]+%)\s*[,\s]\s*([\d.]+%)(?:\s*[,\/]\s*([\d.]+%?))?\s*\)$/i);
  if (hslMatch) {
    const rgba = parseHsl(hslMatch);
    if (rgba) {
      return {
        original: colorString,
        format: hslMatch[4] ? 'hsla' : 'hsl',
        rgba,
        hex: rgbaToHex(rgba),
        isValid: true,
      };
    }
  }

  // HWB
  const hwbMatch = trimmed.match(/^hwb\(\s*([\d.]+(?:deg|rad|grad|turn)?)\s+(\d{1,3}%)\s+(\d{1,3}%)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i);
  if (hwbMatch) {
    const rgba = parseHwb(hwbMatch);
    if (rgba) {
      return {
        original: colorString,
        format: 'hwb',
        rgba,
        hex: rgbaToHex(rgba),
        isValid: true,
      };
    }
  }

  // LAB
  const labMatch = trimmed.match(/^lab\(\s*([\d.]+%?)\s+([-\d.]+%?)\s+([-\d.]+%?)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i);
  if (labMatch) {
    const rgba = parseLab(labMatch);
    if (rgba) {
      return {
        original: colorString,
        format: 'lab',
        rgba,
        hex: rgbaToHex(rgba),
        isValid: true,
      };
    }
  }

  // LCH
  const lchMatch = trimmed.match(/^lch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+(?:deg|rad|grad|turn)?)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i);
  if (lchMatch) {
    const rgba = parseLch(lchMatch);
    if (rgba) {
      return {
        original: colorString,
        format: 'lch',
        rgba,
        hex: rgbaToHex(rgba),
        isValid: true,
      };
    }
  }

  // OKLCH
  const oklchMatch = trimmed.match(/^oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+(?:deg|rad|grad|turn)?)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i);
  if (oklchMatch) {
    const rgba = parseOklch(oklchMatch);
    if (rgba) {
      return {
        original: colorString,
        format: 'oklch',
        rgba,
        hex: rgbaToHex(rgba),
        isValid: true,
      };
    }
  }

  // OKLAB
  const oklabMatch = trimmed.match(/^oklab\(\s*([\d.]+%?)\s+([-\d.]+%?)\s+([-\d.]+%?)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i);
  if (oklabMatch) {
    const rgba = parseOklab(oklabMatch);
    if (rgba) {
      return {
        original: colorString,
        format: 'oklab',
        rgba,
        hex: rgbaToHex(rgba),
        isValid: true,
      };
    }
  }

  return null;
}

// ============================================
// CONVERSION FUNCTIONS
// ============================================

/**
 * Convert RGBA to hex string
 */
export function rgbaToHex(rgba: RGBA): string {
  const r = Math.round(rgba.r).toString(16).padStart(2, '0');
  const g = Math.round(rgba.g).toString(16).padStart(2, '0');
  const b = Math.round(rgba.b).toString(16).padStart(2, '0');

  if (rgba.a < 1) {
    const a = Math.round(rgba.a * 255)
      .toString(16)
      .padStart(2, '0');
    return `#${r}${g}${b}${a}`;
  }

  return `#${r}${g}${b}`;
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l: Math.round(l * 100) };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h: number;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    case b:
      h = ((r - g) / d + 4) / 6;
      break;
    default:
      h = 0;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Format RGBA as CSS rgb/rgba string
 */
export function formatRgba(rgba: RGBA): string {
  if (rgba.a < 1) {
    return `rgba(${Math.round(rgba.r)}, ${Math.round(rgba.g)}, ${Math.round(rgba.b)}, ${rgba.a.toFixed(2)})`;
  }
  return `rgb(${Math.round(rgba.r)}, ${Math.round(rgba.g)}, ${Math.round(rgba.b)})`;
}

/**
 * Format as CSS hsl/hsla string
 */
export function formatHsla(rgba: RGBA): string {
  const hsl = rgbToHsl(rgba.r, rgba.g, rgba.b);
  if (rgba.a < 1) {
    return `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${rgba.a.toFixed(2)})`;
  }
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

/**
 * Check if a string is a named color
 */
export function isNamedColor(name: string): boolean {
  return name.toLowerCase() in namedColors;
}

/**
 * Get all named colors
 */
export function getNamedColors(): Record<string, string> {
  return { ...namedColors };
}
