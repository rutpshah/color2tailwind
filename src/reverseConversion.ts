/**
 * Reverse Conversion - Convert Tailwind classes back to color values
 */

import { tailwindColors, TailwindColor } from './tailwindColors';

export interface ReverseConversionResult {
  color: TailwindColor;
  properties: string[];
}

/**
 * Pattern to match Tailwind color classes
 * Matches: bg-red-500, text-blue-600, border-[#ff0000], etc.
 */
export const tailwindClassPattern = new RegExp(
  [
    // Standard Tailwind classes with prefixes
    /\b(bg|text|border|ring|divide|shadow|outline|decoration|accent|caret|fill|stroke|placeholder|from|via|to)-/,
    // Followed by color name and shade OR arbitrary value
    /(?:([a-z]+)-(\d+)|(\[[^\]]+\]))/,
  ]
    .map((r) => r.source)
    .join(''),
  'g'
);

/**
 * Extract Tailwind class name from a full class string
 * Example: "bg-red-500" -> "red-500"
 */
function extractClassName(fullClass: string): string | null {
  const match = fullClass.match(
    /^(?:bg|text|border|ring|divide|shadow|outline|decoration|accent|caret|fill|stroke|placeholder|from|via|to)-(.+)$/
  );
  return match ? match[1] : null;
}

/**
 * Extract property prefix from a Tailwind class
 * Example: "bg-red-500" -> "bg"
 */
function extractProperty(fullClass: string): string | null {
  const match = fullClass.match(
    /^(bg|text|border|ring|divide|shadow|outline|decoration|accent|caret|fill|stroke|placeholder|from|via|to)-/
  );
  return match ? match[1] : null;
}

/**
 * Parse arbitrary value from Tailwind class
 * Example: "bg-[#ff0000]" -> "#ff0000"
 */
function parseArbitraryValue(className: string): string | null {
  const match = className.match(/\[([^\]]+)\]/);
  return match ? match[1] : null;
}

/**
 * Look up Tailwind class and return color info
 */
export function lookupTailwindClass(className: string): ReverseConversionResult | null {
  const extracted = extractClassName(className);
  if (!extracted) {
    return null;
  }

  // Check for arbitrary value
  const arbitraryValue = parseArbitraryValue(extracted);
  if (arbitraryValue) {
    return {
      color: {
        hex: arbitraryValue,
        className: `[${arbitraryValue}]`,
        colorName: 'Custom',
        shade: '',
        rgb: { r: 0, g: 0, b: 0 }, // Would need proper parsing
      },
      properties: [extractProperty(className) || 'unknown'],
    };
  }

  // Look up in Tailwind colors
  const color = tailwindColors.find((c) => c.className === extracted);
  if (!color) {
    return null;
  }

  return {
    color,
    properties: [extractProperty(className) || 'unknown'],
  };
}

/**
 * Find all Tailwind color classes in a text string
 */
export function findTailwindClassesInText(text: string): Array<{
  match: string;
  start: number;
  end: number;
  result: ReverseConversionResult | null;
}> {
  const results: Array<{
    match: string;
    start: number;
    end: number;
    result: ReverseConversionResult | null;
  }> = [];

  // Reset regex
  tailwindClassPattern.lastIndex = 0;

  let match: RegExpExecArray | null;
  while ((match = tailwindClassPattern.exec(text)) !== null) {
    const fullMatch = match[0];
    const result = lookupTailwindClass(fullMatch);

    results.push({
      match: fullMatch,
      start: match.index,
      end: match.index + fullMatch.length,
      result,
    });
  }

  return results;
}

/**
 * Convert property prefix to descriptive name
 */
export function getPropertyName(prefix: string): string {
  const propertyNames: Record<string, string> = {
    bg: 'Background',
    text: 'Text',
    border: 'Border',
    ring: 'Ring',
    divide: 'Divide',
    shadow: 'Shadow',
    outline: 'Outline',
    decoration: 'Text Decoration',
    accent: 'Accent',
    caret: 'Caret',
    fill: 'Fill',
    stroke: 'Stroke',
    placeholder: 'Placeholder',
    from: 'Gradient From',
    via: 'Gradient Via',
    to: 'Gradient To',
  };

  return propertyNames[prefix] || prefix;
}
