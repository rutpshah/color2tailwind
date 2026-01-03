/**
 * Tailwind CSS v3 Default Color Palette
 * With support for exact and nearest color matching
 */

import { RGBA } from './colorUtils';

export interface TailwindColor {
  hex: string;
  className: string;
  colorName: string;
  shade: string;
  rgb: { r: number; g: number; b: number };
}

/**
 * All Tailwind CSS v3 default colors
 */
export const tailwindColors: TailwindColor[] = [
  // SLATE
  { hex: '#f8fafc', className: 'slate-50', colorName: 'Slate', shade: '50', rgb: { r: 248, g: 250, b: 252 } },
  { hex: '#f1f5f9', className: 'slate-100', colorName: 'Slate', shade: '100', rgb: { r: 241, g: 245, b: 249 } },
  { hex: '#e2e8f0', className: 'slate-200', colorName: 'Slate', shade: '200', rgb: { r: 226, g: 232, b: 240 } },
  { hex: '#cbd5e1', className: 'slate-300', colorName: 'Slate', shade: '300', rgb: { r: 203, g: 213, b: 225 } },
  { hex: '#94a3b8', className: 'slate-400', colorName: 'Slate', shade: '400', rgb: { r: 148, g: 163, b: 184 } },
  { hex: '#64748b', className: 'slate-500', colorName: 'Slate', shade: '500', rgb: { r: 100, g: 116, b: 139 } },
  { hex: '#475569', className: 'slate-600', colorName: 'Slate', shade: '600', rgb: { r: 71, g: 85, b: 105 } },
  { hex: '#334155', className: 'slate-700', colorName: 'Slate', shade: '700', rgb: { r: 51, g: 65, b: 85 } },
  { hex: '#1e293b', className: 'slate-800', colorName: 'Slate', shade: '800', rgb: { r: 30, g: 41, b: 59 } },
  { hex: '#0f172a', className: 'slate-900', colorName: 'Slate', shade: '900', rgb: { r: 15, g: 23, b: 42 } },
  { hex: '#020617', className: 'slate-950', colorName: 'Slate', shade: '950', rgb: { r: 2, g: 6, b: 23 } },

  // GRAY
  { hex: '#f9fafb', className: 'gray-50', colorName: 'Gray', shade: '50', rgb: { r: 249, g: 250, b: 251 } },
  { hex: '#f3f4f6', className: 'gray-100', colorName: 'Gray', shade: '100', rgb: { r: 243, g: 244, b: 246 } },
  { hex: '#e5e7eb', className: 'gray-200', colorName: 'Gray', shade: '200', rgb: { r: 229, g: 231, b: 235 } },
  { hex: '#d1d5db', className: 'gray-300', colorName: 'Gray', shade: '300', rgb: { r: 209, g: 213, b: 219 } },
  { hex: '#9ca3af', className: 'gray-400', colorName: 'Gray', shade: '400', rgb: { r: 156, g: 163, b: 175 } },
  { hex: '#6b7280', className: 'gray-500', colorName: 'Gray', shade: '500', rgb: { r: 107, g: 114, b: 128 } },
  { hex: '#4b5563', className: 'gray-600', colorName: 'Gray', shade: '600', rgb: { r: 75, g: 85, b: 99 } },
  { hex: '#374151', className: 'gray-700', colorName: 'Gray', shade: '700', rgb: { r: 55, g: 65, b: 81 } },
  { hex: '#1f2937', className: 'gray-800', colorName: 'Gray', shade: '800', rgb: { r: 31, g: 41, b: 55 } },
  { hex: '#111827', className: 'gray-900', colorName: 'Gray', shade: '900', rgb: { r: 17, g: 24, b: 39 } },
  { hex: '#030712', className: 'gray-950', colorName: 'Gray', shade: '950', rgb: { r: 3, g: 7, b: 18 } },

  // ZINC
  { hex: '#fafafa', className: 'zinc-50', colorName: 'Zinc', shade: '50', rgb: { r: 250, g: 250, b: 250 } },
  { hex: '#f4f4f5', className: 'zinc-100', colorName: 'Zinc', shade: '100', rgb: { r: 244, g: 244, b: 245 } },
  { hex: '#e4e4e7', className: 'zinc-200', colorName: 'Zinc', shade: '200', rgb: { r: 228, g: 228, b: 231 } },
  { hex: '#d4d4d8', className: 'zinc-300', colorName: 'Zinc', shade: '300', rgb: { r: 212, g: 212, b: 216 } },
  { hex: '#a1a1aa', className: 'zinc-400', colorName: 'Zinc', shade: '400', rgb: { r: 161, g: 161, b: 170 } },
  { hex: '#71717a', className: 'zinc-500', colorName: 'Zinc', shade: '500', rgb: { r: 113, g: 113, b: 122 } },
  { hex: '#52525b', className: 'zinc-600', colorName: 'Zinc', shade: '600', rgb: { r: 82, g: 82, b: 91 } },
  { hex: '#3f3f46', className: 'zinc-700', colorName: 'Zinc', shade: '700', rgb: { r: 63, g: 63, b: 70 } },
  { hex: '#27272a', className: 'zinc-800', colorName: 'Zinc', shade: '800', rgb: { r: 39, g: 39, b: 42 } },
  { hex: '#18181b', className: 'zinc-900', colorName: 'Zinc', shade: '900', rgb: { r: 24, g: 24, b: 27 } },
  { hex: '#09090b', className: 'zinc-950', colorName: 'Zinc', shade: '950', rgb: { r: 9, g: 9, b: 11 } },

  // NEUTRAL
  { hex: '#fafafa', className: 'neutral-50', colorName: 'Neutral', shade: '50', rgb: { r: 250, g: 250, b: 250 } },
  { hex: '#f5f5f5', className: 'neutral-100', colorName: 'Neutral', shade: '100', rgb: { r: 245, g: 245, b: 245 } },
  { hex: '#e5e5e5', className: 'neutral-200', colorName: 'Neutral', shade: '200', rgb: { r: 229, g: 229, b: 229 } },
  { hex: '#d4d4d4', className: 'neutral-300', colorName: 'Neutral', shade: '300', rgb: { r: 212, g: 212, b: 212 } },
  { hex: '#a3a3a3', className: 'neutral-400', colorName: 'Neutral', shade: '400', rgb: { r: 163, g: 163, b: 163 } },
  { hex: '#737373', className: 'neutral-500', colorName: 'Neutral', shade: '500', rgb: { r: 115, g: 115, b: 115 } },
  { hex: '#525252', className: 'neutral-600', colorName: 'Neutral', shade: '600', rgb: { r: 82, g: 82, b: 82 } },
  { hex: '#404040', className: 'neutral-700', colorName: 'Neutral', shade: '700', rgb: { r: 64, g: 64, b: 64 } },
  { hex: '#262626', className: 'neutral-800', colorName: 'Neutral', shade: '800', rgb: { r: 38, g: 38, b: 38 } },
  { hex: '#171717', className: 'neutral-900', colorName: 'Neutral', shade: '900', rgb: { r: 23, g: 23, b: 23 } },
  { hex: '#0a0a0a', className: 'neutral-950', colorName: 'Neutral', shade: '950', rgb: { r: 10, g: 10, b: 10 } },

  // STONE
  { hex: '#fafaf9', className: 'stone-50', colorName: 'Stone', shade: '50', rgb: { r: 250, g: 250, b: 249 } },
  { hex: '#f5f5f4', className: 'stone-100', colorName: 'Stone', shade: '100', rgb: { r: 245, g: 245, b: 244 } },
  { hex: '#e7e5e4', className: 'stone-200', colorName: 'Stone', shade: '200', rgb: { r: 231, g: 229, b: 228 } },
  { hex: '#d6d3d1', className: 'stone-300', colorName: 'Stone', shade: '300', rgb: { r: 214, g: 211, b: 209 } },
  { hex: '#a8a29e', className: 'stone-400', colorName: 'Stone', shade: '400', rgb: { r: 168, g: 162, b: 158 } },
  { hex: '#78716c', className: 'stone-500', colorName: 'Stone', shade: '500', rgb: { r: 120, g: 113, b: 108 } },
  { hex: '#57534e', className: 'stone-600', colorName: 'Stone', shade: '600', rgb: { r: 87, g: 83, b: 78 } },
  { hex: '#44403c', className: 'stone-700', colorName: 'Stone', shade: '700', rgb: { r: 68, g: 64, b: 60 } },
  { hex: '#292524', className: 'stone-800', colorName: 'Stone', shade: '800', rgb: { r: 41, g: 37, b: 36 } },
  { hex: '#1c1917', className: 'stone-900', colorName: 'Stone', shade: '900', rgb: { r: 28, g: 25, b: 23 } },
  { hex: '#0c0a09', className: 'stone-950', colorName: 'Stone', shade: '950', rgb: { r: 12, g: 10, b: 9 } },

  // RED
  { hex: '#fef2f2', className: 'red-50', colorName: 'Red', shade: '50', rgb: { r: 254, g: 242, b: 242 } },
  { hex: '#fee2e2', className: 'red-100', colorName: 'Red', shade: '100', rgb: { r: 254, g: 226, b: 226 } },
  { hex: '#fecaca', className: 'red-200', colorName: 'Red', shade: '200', rgb: { r: 254, g: 202, b: 202 } },
  { hex: '#fca5a5', className: 'red-300', colorName: 'Red', shade: '300', rgb: { r: 252, g: 165, b: 165 } },
  { hex: '#f87171', className: 'red-400', colorName: 'Red', shade: '400', rgb: { r: 248, g: 113, b: 113 } },
  { hex: '#ef4444', className: 'red-500', colorName: 'Red', shade: '500', rgb: { r: 239, g: 68, b: 68 } },
  { hex: '#dc2626', className: 'red-600', colorName: 'Red', shade: '600', rgb: { r: 220, g: 38, b: 38 } },
  { hex: '#b91c1c', className: 'red-700', colorName: 'Red', shade: '700', rgb: { r: 185, g: 28, b: 28 } },
  { hex: '#991b1b', className: 'red-800', colorName: 'Red', shade: '800', rgb: { r: 153, g: 27, b: 27 } },
  { hex: '#7f1d1d', className: 'red-900', colorName: 'Red', shade: '900', rgb: { r: 127, g: 29, b: 29 } },
  { hex: '#450a0a', className: 'red-950', colorName: 'Red', shade: '950', rgb: { r: 69, g: 10, b: 10 } },

  // ORANGE
  { hex: '#fff7ed', className: 'orange-50', colorName: 'Orange', shade: '50', rgb: { r: 255, g: 247, b: 237 } },
  { hex: '#ffedd5', className: 'orange-100', colorName: 'Orange', shade: '100', rgb: { r: 255, g: 237, b: 213 } },
  { hex: '#fed7aa', className: 'orange-200', colorName: 'Orange', shade: '200', rgb: { r: 254, g: 215, b: 170 } },
  { hex: '#fdba74', className: 'orange-300', colorName: 'Orange', shade: '300', rgb: { r: 253, g: 186, b: 116 } },
  { hex: '#fb923c', className: 'orange-400', colorName: 'Orange', shade: '400', rgb: { r: 251, g: 146, b: 60 } },
  { hex: '#f97316', className: 'orange-500', colorName: 'Orange', shade: '500', rgb: { r: 249, g: 115, b: 22 } },
  { hex: '#ea580c', className: 'orange-600', colorName: 'Orange', shade: '600', rgb: { r: 234, g: 88, b: 12 } },
  { hex: '#c2410c', className: 'orange-700', colorName: 'Orange', shade: '700', rgb: { r: 194, g: 65, b: 12 } },
  { hex: '#9a3412', className: 'orange-800', colorName: 'Orange', shade: '800', rgb: { r: 154, g: 52, b: 18 } },
  { hex: '#7c2d12', className: 'orange-900', colorName: 'Orange', shade: '900', rgb: { r: 124, g: 45, b: 18 } },
  { hex: '#431407', className: 'orange-950', colorName: 'Orange', shade: '950', rgb: { r: 67, g: 20, b: 7 } },

  // AMBER
  { hex: '#fffbeb', className: 'amber-50', colorName: 'Amber', shade: '50', rgb: { r: 255, g: 251, b: 235 } },
  { hex: '#fef3c7', className: 'amber-100', colorName: 'Amber', shade: '100', rgb: { r: 254, g: 243, b: 199 } },
  { hex: '#fde68a', className: 'amber-200', colorName: 'Amber', shade: '200', rgb: { r: 253, g: 230, b: 138 } },
  { hex: '#fcd34d', className: 'amber-300', colorName: 'Amber', shade: '300', rgb: { r: 252, g: 211, b: 77 } },
  { hex: '#fbbf24', className: 'amber-400', colorName: 'Amber', shade: '400', rgb: { r: 251, g: 191, b: 36 } },
  { hex: '#f59e0b', className: 'amber-500', colorName: 'Amber', shade: '500', rgb: { r: 245, g: 158, b: 11 } },
  { hex: '#d97706', className: 'amber-600', colorName: 'Amber', shade: '600', rgb: { r: 217, g: 119, b: 6 } },
  { hex: '#b45309', className: 'amber-700', colorName: 'Amber', shade: '700', rgb: { r: 180, g: 83, b: 9 } },
  { hex: '#92400e', className: 'amber-800', colorName: 'Amber', shade: '800', rgb: { r: 146, g: 64, b: 14 } },
  { hex: '#78350f', className: 'amber-900', colorName: 'Amber', shade: '900', rgb: { r: 120, g: 53, b: 15 } },
  { hex: '#451a03', className: 'amber-950', colorName: 'Amber', shade: '950', rgb: { r: 69, g: 26, b: 3 } },

  // YELLOW
  { hex: '#fefce8', className: 'yellow-50', colorName: 'Yellow', shade: '50', rgb: { r: 254, g: 252, b: 232 } },
  { hex: '#fef9c3', className: 'yellow-100', colorName: 'Yellow', shade: '100', rgb: { r: 254, g: 249, b: 195 } },
  { hex: '#fef08a', className: 'yellow-200', colorName: 'Yellow', shade: '200', rgb: { r: 254, g: 240, b: 138 } },
  { hex: '#fde047', className: 'yellow-300', colorName: 'Yellow', shade: '300', rgb: { r: 253, g: 224, b: 71 } },
  { hex: '#facc15', className: 'yellow-400', colorName: 'Yellow', shade: '400', rgb: { r: 250, g: 204, b: 21 } },
  { hex: '#eab308', className: 'yellow-500', colorName: 'Yellow', shade: '500', rgb: { r: 234, g: 179, b: 8 } },
  { hex: '#ca8a04', className: 'yellow-600', colorName: 'Yellow', shade: '600', rgb: { r: 202, g: 138, b: 4 } },
  { hex: '#a16207', className: 'yellow-700', colorName: 'Yellow', shade: '700', rgb: { r: 161, g: 98, b: 7 } },
  { hex: '#854d0e', className: 'yellow-800', colorName: 'Yellow', shade: '800', rgb: { r: 133, g: 77, b: 14 } },
  { hex: '#713f12', className: 'yellow-900', colorName: 'Yellow', shade: '900', rgb: { r: 113, g: 63, b: 18 } },
  { hex: '#422006', className: 'yellow-950', colorName: 'Yellow', shade: '950', rgb: { r: 66, g: 32, b: 6 } },

  // LIME
  { hex: '#f7fee7', className: 'lime-50', colorName: 'Lime', shade: '50', rgb: { r: 247, g: 254, b: 231 } },
  { hex: '#ecfccb', className: 'lime-100', colorName: 'Lime', shade: '100', rgb: { r: 236, g: 252, b: 203 } },
  { hex: '#d9f99d', className: 'lime-200', colorName: 'Lime', shade: '200', rgb: { r: 217, g: 249, b: 157 } },
  { hex: '#bef264', className: 'lime-300', colorName: 'Lime', shade: '300', rgb: { r: 190, g: 242, b: 100 } },
  { hex: '#a3e635', className: 'lime-400', colorName: 'Lime', shade: '400', rgb: { r: 163, g: 230, b: 53 } },
  { hex: '#84cc16', className: 'lime-500', colorName: 'Lime', shade: '500', rgb: { r: 132, g: 204, b: 22 } },
  { hex: '#65a30d', className: 'lime-600', colorName: 'Lime', shade: '600', rgb: { r: 101, g: 163, b: 13 } },
  { hex: '#4d7c0f', className: 'lime-700', colorName: 'Lime', shade: '700', rgb: { r: 77, g: 124, b: 15 } },
  { hex: '#3f6212', className: 'lime-800', colorName: 'Lime', shade: '800', rgb: { r: 63, g: 98, b: 18 } },
  { hex: '#365314', className: 'lime-900', colorName: 'Lime', shade: '900', rgb: { r: 54, g: 83, b: 20 } },
  { hex: '#1a2e05', className: 'lime-950', colorName: 'Lime', shade: '950', rgb: { r: 26, g: 46, b: 5 } },

  // GREEN
  { hex: '#f0fdf4', className: 'green-50', colorName: 'Green', shade: '50', rgb: { r: 240, g: 253, b: 244 } },
  { hex: '#dcfce7', className: 'green-100', colorName: 'Green', shade: '100', rgb: { r: 220, g: 252, b: 231 } },
  { hex: '#bbf7d0', className: 'green-200', colorName: 'Green', shade: '200', rgb: { r: 187, g: 247, b: 208 } },
  { hex: '#86efac', className: 'green-300', colorName: 'Green', shade: '300', rgb: { r: 134, g: 239, b: 172 } },
  { hex: '#4ade80', className: 'green-400', colorName: 'Green', shade: '400', rgb: { r: 74, g: 222, b: 128 } },
  { hex: '#22c55e', className: 'green-500', colorName: 'Green', shade: '500', rgb: { r: 34, g: 197, b: 94 } },
  { hex: '#16a34a', className: 'green-600', colorName: 'Green', shade: '600', rgb: { r: 22, g: 163, b: 74 } },
  { hex: '#15803d', className: 'green-700', colorName: 'Green', shade: '700', rgb: { r: 21, g: 128, b: 61 } },
  { hex: '#166534', className: 'green-800', colorName: 'Green', shade: '800', rgb: { r: 22, g: 101, b: 52 } },
  { hex: '#14532d', className: 'green-900', colorName: 'Green', shade: '900', rgb: { r: 20, g: 83, b: 45 } },
  { hex: '#052e16', className: 'green-950', colorName: 'Green', shade: '950', rgb: { r: 5, g: 46, b: 22 } },

  // EMERALD
  { hex: '#ecfdf5', className: 'emerald-50', colorName: 'Emerald', shade: '50', rgb: { r: 236, g: 253, b: 245 } },
  { hex: '#d1fae5', className: 'emerald-100', colorName: 'Emerald', shade: '100', rgb: { r: 209, g: 250, b: 229 } },
  { hex: '#a7f3d0', className: 'emerald-200', colorName: 'Emerald', shade: '200', rgb: { r: 167, g: 243, b: 208 } },
  { hex: '#6ee7b7', className: 'emerald-300', colorName: 'Emerald', shade: '300', rgb: { r: 110, g: 231, b: 183 } },
  { hex: '#34d399', className: 'emerald-400', colorName: 'Emerald', shade: '400', rgb: { r: 52, g: 211, b: 153 } },
  { hex: '#10b981', className: 'emerald-500', colorName: 'Emerald', shade: '500', rgb: { r: 16, g: 185, b: 129 } },
  { hex: '#059669', className: 'emerald-600', colorName: 'Emerald', shade: '600', rgb: { r: 5, g: 150, b: 105 } },
  { hex: '#047857', className: 'emerald-700', colorName: 'Emerald', shade: '700', rgb: { r: 4, g: 120, b: 87 } },
  { hex: '#065f46', className: 'emerald-800', colorName: 'Emerald', shade: '800', rgb: { r: 6, g: 95, b: 70 } },
  { hex: '#064e3b', className: 'emerald-900', colorName: 'Emerald', shade: '900', rgb: { r: 6, g: 78, b: 59 } },
  { hex: '#022c22', className: 'emerald-950', colorName: 'Emerald', shade: '950', rgb: { r: 2, g: 44, b: 34 } },

  // TEAL
  { hex: '#f0fdfa', className: 'teal-50', colorName: 'Teal', shade: '50', rgb: { r: 240, g: 253, b: 250 } },
  { hex: '#ccfbf1', className: 'teal-100', colorName: 'Teal', shade: '100', rgb: { r: 204, g: 251, b: 241 } },
  { hex: '#99f6e4', className: 'teal-200', colorName: 'Teal', shade: '200', rgb: { r: 153, g: 246, b: 228 } },
  { hex: '#5eead4', className: 'teal-300', colorName: 'Teal', shade: '300', rgb: { r: 94, g: 234, b: 212 } },
  { hex: '#2dd4bf', className: 'teal-400', colorName: 'Teal', shade: '400', rgb: { r: 45, g: 212, b: 191 } },
  { hex: '#14b8a6', className: 'teal-500', colorName: 'Teal', shade: '500', rgb: { r: 20, g: 184, b: 166 } },
  { hex: '#0d9488', className: 'teal-600', colorName: 'Teal', shade: '600', rgb: { r: 13, g: 148, b: 136 } },
  { hex: '#0f766e', className: 'teal-700', colorName: 'Teal', shade: '700', rgb: { r: 15, g: 118, b: 110 } },
  { hex: '#115e59', className: 'teal-800', colorName: 'Teal', shade: '800', rgb: { r: 17, g: 94, b: 89 } },
  { hex: '#134e4a', className: 'teal-900', colorName: 'Teal', shade: '900', rgb: { r: 19, g: 78, b: 74 } },
  { hex: '#042f2e', className: 'teal-950', colorName: 'Teal', shade: '950', rgb: { r: 4, g: 47, b: 46 } },

  // CYAN
  { hex: '#ecfeff', className: 'cyan-50', colorName: 'Cyan', shade: '50', rgb: { r: 236, g: 254, b: 255 } },
  { hex: '#cffafe', className: 'cyan-100', colorName: 'Cyan', shade: '100', rgb: { r: 207, g: 250, b: 254 } },
  { hex: '#a5f3fc', className: 'cyan-200', colorName: 'Cyan', shade: '200', rgb: { r: 165, g: 243, b: 252 } },
  { hex: '#67e8f9', className: 'cyan-300', colorName: 'Cyan', shade: '300', rgb: { r: 103, g: 232, b: 249 } },
  { hex: '#22d3ee', className: 'cyan-400', colorName: 'Cyan', shade: '400', rgb: { r: 34, g: 211, b: 238 } },
  { hex: '#06b6d4', className: 'cyan-500', colorName: 'Cyan', shade: '500', rgb: { r: 6, g: 182, b: 212 } },
  { hex: '#0891b2', className: 'cyan-600', colorName: 'Cyan', shade: '600', rgb: { r: 8, g: 145, b: 178 } },
  { hex: '#0e7490', className: 'cyan-700', colorName: 'Cyan', shade: '700', rgb: { r: 14, g: 116, b: 144 } },
  { hex: '#155e75', className: 'cyan-800', colorName: 'Cyan', shade: '800', rgb: { r: 21, g: 94, b: 117 } },
  { hex: '#164e63', className: 'cyan-900', colorName: 'Cyan', shade: '900', rgb: { r: 22, g: 78, b: 99 } },
  { hex: '#083344', className: 'cyan-950', colorName: 'Cyan', shade: '950', rgb: { r: 8, g: 51, b: 68 } },

  // SKY
  { hex: '#f0f9ff', className: 'sky-50', colorName: 'Sky', shade: '50', rgb: { r: 240, g: 249, b: 255 } },
  { hex: '#e0f2fe', className: 'sky-100', colorName: 'Sky', shade: '100', rgb: { r: 224, g: 242, b: 254 } },
  { hex: '#bae6fd', className: 'sky-200', colorName: 'Sky', shade: '200', rgb: { r: 186, g: 230, b: 253 } },
  { hex: '#7dd3fc', className: 'sky-300', colorName: 'Sky', shade: '300', rgb: { r: 125, g: 211, b: 252 } },
  { hex: '#38bdf8', className: 'sky-400', colorName: 'Sky', shade: '400', rgb: { r: 56, g: 189, b: 248 } },
  { hex: '#0ea5e9', className: 'sky-500', colorName: 'Sky', shade: '500', rgb: { r: 14, g: 165, b: 233 } },
  { hex: '#0284c7', className: 'sky-600', colorName: 'Sky', shade: '600', rgb: { r: 2, g: 132, b: 199 } },
  { hex: '#0369a1', className: 'sky-700', colorName: 'Sky', shade: '700', rgb: { r: 3, g: 105, b: 161 } },
  { hex: '#075985', className: 'sky-800', colorName: 'Sky', shade: '800', rgb: { r: 7, g: 89, b: 133 } },
  { hex: '#0c4a6e', className: 'sky-900', colorName: 'Sky', shade: '900', rgb: { r: 12, g: 74, b: 110 } },
  { hex: '#082f49', className: 'sky-950', colorName: 'Sky', shade: '950', rgb: { r: 8, g: 47, b: 73 } },

  // BLUE
  { hex: '#eff6ff', className: 'blue-50', colorName: 'Blue', shade: '50', rgb: { r: 239, g: 246, b: 255 } },
  { hex: '#dbeafe', className: 'blue-100', colorName: 'Blue', shade: '100', rgb: { r: 219, g: 234, b: 254 } },
  { hex: '#bfdbfe', className: 'blue-200', colorName: 'Blue', shade: '200', rgb: { r: 191, g: 219, b: 254 } },
  { hex: '#93c5fd', className: 'blue-300', colorName: 'Blue', shade: '300', rgb: { r: 147, g: 197, b: 253 } },
  { hex: '#60a5fa', className: 'blue-400', colorName: 'Blue', shade: '400', rgb: { r: 96, g: 165, b: 250 } },
  { hex: '#3b82f6', className: 'blue-500', colorName: 'Blue', shade: '500', rgb: { r: 59, g: 130, b: 246 } },
  { hex: '#2563eb', className: 'blue-600', colorName: 'Blue', shade: '600', rgb: { r: 37, g: 99, b: 235 } },
  { hex: '#1d4ed8', className: 'blue-700', colorName: 'Blue', shade: '700', rgb: { r: 29, g: 78, b: 216 } },
  { hex: '#1e40af', className: 'blue-800', colorName: 'Blue', shade: '800', rgb: { r: 30, g: 64, b: 175 } },
  { hex: '#1e3a8a', className: 'blue-900', colorName: 'Blue', shade: '900', rgb: { r: 30, g: 58, b: 138 } },
  { hex: '#172554', className: 'blue-950', colorName: 'Blue', shade: '950', rgb: { r: 23, g: 37, b: 84 } },

  // INDIGO
  { hex: '#eef2ff', className: 'indigo-50', colorName: 'Indigo', shade: '50', rgb: { r: 238, g: 242, b: 255 } },
  { hex: '#e0e7ff', className: 'indigo-100', colorName: 'Indigo', shade: '100', rgb: { r: 224, g: 231, b: 255 } },
  { hex: '#c7d2fe', className: 'indigo-200', colorName: 'Indigo', shade: '200', rgb: { r: 199, g: 210, b: 254 } },
  { hex: '#a5b4fc', className: 'indigo-300', colorName: 'Indigo', shade: '300', rgb: { r: 165, g: 180, b: 252 } },
  { hex: '#818cf8', className: 'indigo-400', colorName: 'Indigo', shade: '400', rgb: { r: 129, g: 140, b: 248 } },
  { hex: '#6366f1', className: 'indigo-500', colorName: 'Indigo', shade: '500', rgb: { r: 99, g: 102, b: 241 } },
  { hex: '#4f46e5', className: 'indigo-600', colorName: 'Indigo', shade: '600', rgb: { r: 79, g: 70, b: 229 } },
  { hex: '#4338ca', className: 'indigo-700', colorName: 'Indigo', shade: '700', rgb: { r: 67, g: 56, b: 202 } },
  { hex: '#3730a3', className: 'indigo-800', colorName: 'Indigo', shade: '800', rgb: { r: 55, g: 48, b: 163 } },
  { hex: '#312e81', className: 'indigo-900', colorName: 'Indigo', shade: '900', rgb: { r: 49, g: 46, b: 129 } },
  { hex: '#1e1b4b', className: 'indigo-950', colorName: 'Indigo', shade: '950', rgb: { r: 30, g: 27, b: 75 } },

  // VIOLET
  { hex: '#f5f3ff', className: 'violet-50', colorName: 'Violet', shade: '50', rgb: { r: 245, g: 243, b: 255 } },
  { hex: '#ede9fe', className: 'violet-100', colorName: 'Violet', shade: '100', rgb: { r: 237, g: 233, b: 254 } },
  { hex: '#ddd6fe', className: 'violet-200', colorName: 'Violet', shade: '200', rgb: { r: 221, g: 214, b: 254 } },
  { hex: '#c4b5fd', className: 'violet-300', colorName: 'Violet', shade: '300', rgb: { r: 196, g: 181, b: 253 } },
  { hex: '#a78bfa', className: 'violet-400', colorName: 'Violet', shade: '400', rgb: { r: 167, g: 139, b: 250 } },
  { hex: '#8b5cf6', className: 'violet-500', colorName: 'Violet', shade: '500', rgb: { r: 139, g: 92, b: 246 } },
  { hex: '#7c3aed', className: 'violet-600', colorName: 'Violet', shade: '600', rgb: { r: 124, g: 58, b: 237 } },
  { hex: '#6d28d9', className: 'violet-700', colorName: 'Violet', shade: '700', rgb: { r: 109, g: 40, b: 217 } },
  { hex: '#5b21b6', className: 'violet-800', colorName: 'Violet', shade: '800', rgb: { r: 91, g: 33, b: 182 } },
  { hex: '#4c1d95', className: 'violet-900', colorName: 'Violet', shade: '900', rgb: { r: 76, g: 29, b: 149 } },
  { hex: '#2e1065', className: 'violet-950', colorName: 'Violet', shade: '950', rgb: { r: 46, g: 16, b: 101 } },

  // PURPLE
  { hex: '#faf5ff', className: 'purple-50', colorName: 'Purple', shade: '50', rgb: { r: 250, g: 245, b: 255 } },
  { hex: '#f3e8ff', className: 'purple-100', colorName: 'Purple', shade: '100', rgb: { r: 243, g: 232, b: 255 } },
  { hex: '#e9d5ff', className: 'purple-200', colorName: 'Purple', shade: '200', rgb: { r: 233, g: 213, b: 255 } },
  { hex: '#d8b4fe', className: 'purple-300', colorName: 'Purple', shade: '300', rgb: { r: 216, g: 180, b: 254 } },
  { hex: '#c084fc', className: 'purple-400', colorName: 'Purple', shade: '400', rgb: { r: 192, g: 132, b: 252 } },
  { hex: '#a855f7', className: 'purple-500', colorName: 'Purple', shade: '500', rgb: { r: 168, g: 85, b: 247 } },
  { hex: '#9333ea', className: 'purple-600', colorName: 'Purple', shade: '600', rgb: { r: 147, g: 51, b: 234 } },
  { hex: '#7e22ce', className: 'purple-700', colorName: 'Purple', shade: '700', rgb: { r: 126, g: 34, b: 206 } },
  { hex: '#6b21a8', className: 'purple-800', colorName: 'Purple', shade: '800', rgb: { r: 107, g: 33, b: 168 } },
  { hex: '#581c87', className: 'purple-900', colorName: 'Purple', shade: '900', rgb: { r: 88, g: 28, b: 135 } },
  { hex: '#3b0764', className: 'purple-950', colorName: 'Purple', shade: '950', rgb: { r: 59, g: 7, b: 100 } },

  // FUCHSIA
  { hex: '#fdf4ff', className: 'fuchsia-50', colorName: 'Fuchsia', shade: '50', rgb: { r: 253, g: 244, b: 255 } },
  { hex: '#fae8ff', className: 'fuchsia-100', colorName: 'Fuchsia', shade: '100', rgb: { r: 250, g: 232, b: 255 } },
  { hex: '#f5d0fe', className: 'fuchsia-200', colorName: 'Fuchsia', shade: '200', rgb: { r: 245, g: 208, b: 254 } },
  { hex: '#f0abfc', className: 'fuchsia-300', colorName: 'Fuchsia', shade: '300', rgb: { r: 240, g: 171, b: 252 } },
  { hex: '#e879f9', className: 'fuchsia-400', colorName: 'Fuchsia', shade: '400', rgb: { r: 232, g: 121, b: 249 } },
  { hex: '#d946ef', className: 'fuchsia-500', colorName: 'Fuchsia', shade: '500', rgb: { r: 217, g: 70, b: 239 } },
  { hex: '#c026d3', className: 'fuchsia-600', colorName: 'Fuchsia', shade: '600', rgb: { r: 192, g: 38, b: 211 } },
  { hex: '#a21caf', className: 'fuchsia-700', colorName: 'Fuchsia', shade: '700', rgb: { r: 162, g: 28, b: 175 } },
  { hex: '#86198f', className: 'fuchsia-800', colorName: 'Fuchsia', shade: '800', rgb: { r: 134, g: 25, b: 143 } },
  { hex: '#701a75', className: 'fuchsia-900', colorName: 'Fuchsia', shade: '900', rgb: { r: 112, g: 26, b: 117 } },
  { hex: '#4a044e', className: 'fuchsia-950', colorName: 'Fuchsia', shade: '950', rgb: { r: 74, g: 4, b: 78 } },

  // PINK
  { hex: '#fdf2f8', className: 'pink-50', colorName: 'Pink', shade: '50', rgb: { r: 253, g: 242, b: 248 } },
  { hex: '#fce7f3', className: 'pink-100', colorName: 'Pink', shade: '100', rgb: { r: 252, g: 231, b: 243 } },
  { hex: '#fbcfe8', className: 'pink-200', colorName: 'Pink', shade: '200', rgb: { r: 251, g: 207, b: 232 } },
  { hex: '#f9a8d4', className: 'pink-300', colorName: 'Pink', shade: '300', rgb: { r: 249, g: 168, b: 212 } },
  { hex: '#f472b6', className: 'pink-400', colorName: 'Pink', shade: '400', rgb: { r: 244, g: 114, b: 182 } },
  { hex: '#ec4899', className: 'pink-500', colorName: 'Pink', shade: '500', rgb: { r: 236, g: 72, b: 153 } },
  { hex: '#db2777', className: 'pink-600', colorName: 'Pink', shade: '600', rgb: { r: 219, g: 39, b: 119 } },
  { hex: '#be185d', className: 'pink-700', colorName: 'Pink', shade: '700', rgb: { r: 190, g: 24, b: 93 } },
  { hex: '#9d174d', className: 'pink-800', colorName: 'Pink', shade: '800', rgb: { r: 157, g: 23, b: 77 } },
  { hex: '#831843', className: 'pink-900', colorName: 'Pink', shade: '900', rgb: { r: 131, g: 24, b: 67 } },
  { hex: '#500724', className: 'pink-950', colorName: 'Pink', shade: '950', rgb: { r: 80, g: 7, b: 36 } },

  // ROSE
  { hex: '#fff1f2', className: 'rose-50', colorName: 'Rose', shade: '50', rgb: { r: 255, g: 241, b: 242 } },
  { hex: '#ffe4e6', className: 'rose-100', colorName: 'Rose', shade: '100', rgb: { r: 255, g: 228, b: 230 } },
  { hex: '#fecdd3', className: 'rose-200', colorName: 'Rose', shade: '200', rgb: { r: 254, g: 205, b: 211 } },
  { hex: '#fda4af', className: 'rose-300', colorName: 'Rose', shade: '300', rgb: { r: 253, g: 164, b: 175 } },
  { hex: '#fb7185', className: 'rose-400', colorName: 'Rose', shade: '400', rgb: { r: 251, g: 113, b: 133 } },
  { hex: '#f43f5e', className: 'rose-500', colorName: 'Rose', shade: '500', rgb: { r: 244, g: 63, b: 94 } },
  { hex: '#e11d48', className: 'rose-600', colorName: 'Rose', shade: '600', rgb: { r: 225, g: 29, b: 72 } },
  { hex: '#be123c', className: 'rose-700', colorName: 'Rose', shade: '700', rgb: { r: 190, g: 18, b: 60 } },
  { hex: '#9f1239', className: 'rose-800', colorName: 'Rose', shade: '800', rgb: { r: 159, g: 18, b: 57 } },
  { hex: '#881337', className: 'rose-900', colorName: 'Rose', shade: '900', rgb: { r: 136, g: 19, b: 55 } },
  { hex: '#4c0519', className: 'rose-950', colorName: 'Rose', shade: '950', rgb: { r: 76, g: 5, b: 25 } },

  // SPECIAL
  { hex: '#ffffff', className: 'white', colorName: 'White', shade: '', rgb: { r: 255, g: 255, b: 255 } },
  { hex: '#000000', className: 'black', colorName: 'Black', shade: '', rgb: { r: 0, g: 0, b: 0 } },
];

// Build lookup map
const hexLookupMap = new Map<string, TailwindColor[]>();
tailwindColors.forEach((color) => {
  const key = color.hex.toLowerCase();
  const existing = hexLookupMap.get(key) || [];
  existing.push(color);
  hexLookupMap.set(key, existing);
});

/**
 * Look up exact hex match
 */
export function lookupExactHex(hex: string): TailwindColor[] {
  const normalized = hex.toLowerCase().startsWith('#') ? hex.toLowerCase() : `#${hex.toLowerCase()}`;
  return hexLookupMap.get(normalized) || [];
}

/**
 * Convert RGB to LAB color space for perceptual color difference
 */
function rgbToLab(r: number, g: number, b: number): { l: number; a: number; b: number } {
  // RGB to XYZ
  let rLinear = r / 255;
  let gLinear = g / 255;
  let bLinear = b / 255;

  rLinear = rLinear > 0.04045 ? Math.pow((rLinear + 0.055) / 1.055, 2.4) : rLinear / 12.92;
  gLinear = gLinear > 0.04045 ? Math.pow((gLinear + 0.055) / 1.055, 2.4) : gLinear / 12.92;
  bLinear = bLinear > 0.04045 ? Math.pow((bLinear + 0.055) / 1.055, 2.4) : bLinear / 12.92;

  rLinear *= 100;
  gLinear *= 100;
  bLinear *= 100;

  const x = rLinear * 0.4124564 + gLinear * 0.3575761 + bLinear * 0.1804375;
  const y = rLinear * 0.2126729 + gLinear * 0.7151522 + bLinear * 0.072175;
  const z = rLinear * 0.0193339 + gLinear * 0.1191920 + bLinear * 0.9503041;

  // XYZ to LAB (D65 illuminant)
  let xr = x / 95.047;
  let yr = y / 100.0;
  let zr = z / 108.883;

  xr = xr > 0.008856 ? Math.pow(xr, 1 / 3) : 7.787 * xr + 16 / 116;
  yr = yr > 0.008856 ? Math.pow(yr, 1 / 3) : 7.787 * yr + 16 / 116;
  zr = zr > 0.008856 ? Math.pow(zr, 1 / 3) : 7.787 * zr + 16 / 116;

  return {
    l: 116 * yr - 16,
    a: 500 * (xr - yr),
    b: 200 * (yr - zr),
  };
}

/**
 * Calculate Delta E (CIE76) color difference
 */
function deltaE(rgb1: { r: number; g: number; b: number }, rgb2: { r: number; g: number; b: number }): number {
  const lab1 = rgbToLab(rgb1.r, rgb1.g, rgb1.b);
  const lab2 = rgbToLab(rgb2.r, rgb2.g, rgb2.b);

  return Math.sqrt(
    Math.pow(lab2.l - lab1.l, 2) + Math.pow(lab2.a - lab1.a, 2) + Math.pow(lab2.b - lab1.b, 2)
  );
}

/**
 * Find nearest Tailwind color
 */
export function findNearestColor(
  rgba: RGBA,
  maxDistance: number = 50
): { color: TailwindColor; distance: number } | null {
  let nearestColor: TailwindColor | null = null;
  let nearestDistance = Infinity;

  const targetRgb = { r: Math.round(rgba.r), g: Math.round(rgba.g), b: Math.round(rgba.b) };

  for (const color of tailwindColors) {
    const distance = deltaE(targetRgb, color.rgb);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestColor = color;
    }
  }

  if (nearestColor && nearestDistance <= maxDistance) {
    return { color: nearestColor, distance: Math.round(nearestDistance * 100) / 100 };
  }

  return null;
}

/**
 * Find top N nearest Tailwind colors
 */
export function findNearestColors(
  rgba: RGBA,
  count: number = 3,
  maxDistance: number = 100
): Array<{ color: TailwindColor; distance: number }> {
  const targetRgb = { r: Math.round(rgba.r), g: Math.round(rgba.g), b: Math.round(rgba.b) };

  const distances: Array<{ color: TailwindColor; distance: number }> = [];

  for (const color of tailwindColors) {
    const distance = deltaE(targetRgb, color.rgb);
    if (distance <= maxDistance) {
      distances.push({ color, distance: Math.round(distance * 100) / 100 });
    }
  }

  distances.sort((a, b) => a.distance - b.distance);
  return distances.slice(0, count);
}

/**
 * Check if a color is an exact Tailwind match
 */
export function isExactMatch(rgba: RGBA): boolean {
  const hex = `#${Math.round(rgba.r).toString(16).padStart(2, '0')}${Math.round(rgba.g).toString(16).padStart(2, '0')}${Math.round(rgba.b).toString(16).padStart(2, '0')}`.toLowerCase();
  return hexLookupMap.has(hex);
}
