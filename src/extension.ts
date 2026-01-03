import * as vscode from "vscode";
import {
  parseColor,
  formatRgba,
  formatHsla,
  rgbaToHex,
  anyColorPattern,
  ParsedColor,
  ColorFormat,
} from "./colorUtils";
import {
  lookupExactHex,
  findNearestColors,
  TailwindColor,
} from "./tailwindColors";

/**
 * Extension configuration
 */
interface ExtensionConfig {
  showColorPreview: boolean;
  showRgbValues: boolean;
  showHslValues: boolean;
  showOriginalFormat: boolean;
  showNearestMatch: boolean;
  nearestMatchCount: number;
  classPrefix: string;
  enabledLanguages: string[];
}

function getConfig(): ExtensionConfig {
  const config = vscode.workspace.getConfiguration("color2tailwind");
  return {
    showColorPreview: config.get<boolean>("showColorPreview", true),
    showRgbValues: config.get<boolean>("showRgbValues", true),
    showHslValues: config.get<boolean>("showHslValues", true),
    showOriginalFormat: config.get<boolean>("showOriginalFormat", true),
    showNearestMatch: config.get<boolean>("showNearestMatch", true),
    nearestMatchCount: config.get<number>("nearestMatchCount", 3),
    classPrefix: config.get<string>("classPrefix", ""),
    enabledLanguages: config.get<string[]>("enabledLanguages", [
      "javascript",
      "typescript",
      "javascriptreact",
      "typescriptreact",
      "html",
      "css",
      "scss",
      "less",
      "vue",
      "svelte",
      "astro",
      "json",
      "jsonc",
      "markdown",
      "php",
      "erb",
      "blade",
      "python",
    ]),
  };
}

/**
 * Format labels for color formats
 */
const formatLabels: Record<ColorFormat, string> = {
  hex: "HEX",
  "hex-alpha": "HEX (with alpha)",
  rgb: "RGB",
  rgba: "RGBA",
  hsl: "HSL",
  hsla: "HSLA",
  hwb: "HWB",
  lab: "LAB",
  lch: "LCH",
  oklch: "OKLCH",
  oklab: "OKLAB",
  named: "Named Color",
  unknown: "Unknown",
};

/**
 * Build class table for a Tailwind color
 */
function buildClassTable(color: TailwindColor, prefix: string): string {
  const classes = [
    ["Text", `${prefix}text-${color.className}`],
    ["Background", `${prefix}bg-${color.className}`],
    ["Border", `${prefix}border-${color.className}`],
    ["Ring", `${prefix}ring-${color.className}`],
    ["Divide", `${prefix}divide-${color.className}`],
    ["Shadow", `${prefix}shadow-${color.className}`],
  ];

  let table = "| Property | Class |\n|:---------|:------|\n";
  for (const [prop, cls] of classes) {
    table += `| ${prop} | \`${cls}\` |\n`;
  }
  return table;
}

/**
 * Build hover content for exact match
 */
function buildExactMatchContent(
  parsed: ParsedColor,
  matches: TailwindColor[],
  config: ExtensionConfig
): vscode.MarkdownString {
  const content = new vscode.MarkdownString();
  content.isTrusted = true;
  content.supportHtml = true;

  // Use only the first match to avoid any duplication
  const match = matches[0];
  const displayHex =
    parsed.hex.length <= 7 ? parsed.hex : parsed.hex.slice(0, 7);

  // Header
  if (config.showColorPreview) {
    content.appendMarkdown(
      `<span style="background-color:${displayHex};display:inline-block;width:48px;height:24px;border:1px solid #666;border-radius:4px;vertical-align:middle;margin-right:10px;"></span>`
    );
  }
  content.appendMarkdown(
    `**${parsed.hex.toUpperCase()}** · ✅ **${match.className}**\n\n`
  );

  // Single table
  content.appendMarkdown(buildClassTable(match, config.classPrefix));

  // Color values
  if (config.showRgbValues || config.showHslValues) {
    content.appendMarkdown(`\n`);
    if (config.showRgbValues) {
      content.appendMarkdown(`RGB: \`${formatRgba(parsed.rgba)}\` `);
    }
    if (config.showHslValues) {
      content.appendMarkdown(`HSL: \`${formatHsla(parsed.rgba)}\``);
    }
    content.appendMarkdown(`\n`);
  }

  return content;
}

/**
 * Build hover content for nearest match
 */
function buildNearestMatchContent(
  parsed: ParsedColor,
  nearestColors: Array<{ color: TailwindColor; distance: number }>,
  config: ExtensionConfig
): vscode.MarkdownString {
  const content = new vscode.MarkdownString();
  content.isTrusted = true;
  content.supportHtml = true;

  const displayHex =
    parsed.hex.length <= 7 ? parsed.hex : parsed.hex.slice(0, 7);

  // Header
  if (config.showColorPreview) {
    content.appendMarkdown(
      `<span style="background-color:${displayHex};display:inline-block;width:48px;height:24px;border:1px solid #666;border-radius:4px;vertical-align:middle;margin-right:10px;"></span>`
    );
  }
  content.appendMarkdown(`**${parsed.hex.toUpperCase()}** · 🎨 Custom\n\n`);

  // Arbitrary values
  content.appendMarkdown(
    `\`bg-[${parsed.hex}]\` · \`text-[${parsed.hex}]\` · \`border-[${parsed.hex}]\`\n\n`
  );

  // Nearest match (only closest one)
  if (config.showNearestMatch && nearestColors.length > 0) {
    const { color, distance } = nearestColors[0];
    const similarity = Math.max(0, Math.round(100 - distance));

    content.appendMarkdown(
      `**Nearest:** ${color.className} (${similarity}%)\n\n`
    );
    content.appendMarkdown(buildClassTable(color, config.classPrefix));
  }

  // Color values inline
  if (config.showRgbValues || config.showHslValues) {
    content.appendMarkdown(`\n`);
    if (config.showRgbValues) {
      content.appendMarkdown(`RGB: \`${formatRgba(parsed.rgba)}\` `);
    }
    if (config.showHslValues) {
      content.appendMarkdown(`HSL: \`${formatHsla(parsed.rgba)}\``);
    }
    content.appendMarkdown(`\n`);
  }

  return content;
}

// Cache to prevent duplicate hovers
let lastHoverKey = "";
let lastHoverResult: vscode.Hover | null = null;

/**
 * Create hover provider
 */
function createHoverProvider(): vscode.HoverProvider {
  return {
    provideHover(document, position, _token) {
      const config = getConfig();

      // Get line text and find color at position
      const line = document.lineAt(position.line).text;

      // Create a fresh regex for each call (avoid global state issues)
      const colorRegex = new RegExp(anyColorPattern.source, "gi");
      let match: RegExpExecArray | null;

      while ((match = colorRegex.exec(line)) !== null) {
        const start = match.index;
        const end = start + match[0].length;

        // Check if position is within this match
        if (position.character >= start && position.character < end) {
          const colorString = match[0];

          // Create cache key
          const cacheKey = `${document.uri.toString()}:${
            position.line
          }:${start}:${colorString}`;

          // Return cached result if same position
          if (cacheKey === lastHoverKey && lastHoverResult) {
            return lastHoverResult;
          }

          const parsed = parseColor(colorString);

          if (!parsed || !parsed.isValid) continue;

          const range = new vscode.Range(
            position.line,
            start,
            position.line,
            end
          );

          let hover: vscode.Hover;

          // Check for exact match
          const exactMatches = lookupExactHex(parsed.hex);

          if (exactMatches.length > 0) {
            hover = new vscode.Hover(
              buildExactMatchContent(parsed, exactMatches, config),
              range
            );
          } else {
            // Find nearest matches
            const nearestColors = findNearestColors(
              parsed.rgba,
              config.nearestMatchCount,
              100
            );

            hover = new vscode.Hover(
              buildNearestMatchContent(parsed, nearestColors, config),
              range
            );
          }

          // Cache the result
          lastHoverKey = cacheKey;
          lastHoverResult = hover;

          return hover;
        }
      }

      return null;
    },
  };
}

/**
 * Command: Convert color to Tailwind
 */
async function convertToTailwindCommand(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("No active editor");
    return;
  }

  const selection = editor.selection;
  const text = editor.document.getText(selection);

  if (!text) {
    vscode.window.showWarningMessage("Please select a color value");
    return;
  }

  const parsed = parseColor(text.trim());
  if (!parsed) {
    vscode.window.showWarningMessage("Selected text is not a valid color");
    return;
  }

  const config = getConfig();
  const exactMatches = lookupExactHex(parsed.hex);

  const items: vscode.QuickPickItem[] = [];

  if (exactMatches.length > 0) {
    // Exact matches
    for (const match of exactMatches) {
      for (const prop of ["bg", "text", "border", "ring"]) {
        items.push({
          label: `${config.classPrefix}${prop}-${match.className}`,
          description: `${match.colorName} ${match.shade} (exact)`.trim(),
        });
      }
    }
  } else {
    // Arbitrary values first
    for (const prop of ["bg", "text", "border", "ring"]) {
      items.push({
        label: `${config.classPrefix}${prop}-[${parsed.hex}]`,
        description: "Arbitrary value",
      });
    }

    // Then nearest matches
    const nearest = findNearestColors(parsed.rgba, 2);
    for (const { color, distance } of nearest) {
      const similarity = Math.max(0, Math.round(100 - distance));
      for (const prop of ["bg", "text"]) {
        items.push({
          label: `${config.classPrefix}${prop}-${color.className}`,
          description:
            `${color.colorName} ${color.shade} (${similarity}% similar)`.trim(),
        });
      }
    }
  }

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: "Select a Tailwind class to copy",
  });

  if (selected) {
    await vscode.env.clipboard.writeText(selected.label);
    vscode.window.showInformationMessage(`Copied: ${selected.label}`);
  }
}

/**
 * Activate extension
 */
export function activate(context: vscode.ExtensionContext): void {
  console.log("color2tailwind activated");

  // Disable VS Code's built-in color decorators to prevent duplicate hovers
  const config = vscode.workspace.getConfiguration("editor");
  if (config.get("colorDecorators") === true) {
    config
      .update("colorDecorators", false, vscode.ConfigurationTarget.Global)
      .then(() => {
        console.log(
          "color2tailwind: Disabled editor.colorDecorators to prevent duplicate hovers"
        );
      });
  }

  const extConfig = getConfig();

  // Register hover provider
  const hoverProvider = vscode.languages.registerHoverProvider(
    extConfig.enabledLanguages.map((lang) => ({ language: lang })),
    createHoverProvider()
  );

  // Register command
  const convertCommand = vscode.commands.registerCommand(
    "color2tailwind.convertToTailwind",
    convertToTailwindCommand
  );

  context.subscriptions.push(hoverProvider, convertCommand);
}

export function deactivate(): void {
  // Re-enable color decorators when extension is disabled
  const config = vscode.workspace.getConfiguration("editor");
  config
    .update("colorDecorators", true, vscode.ConfigurationTarget.Global)
    .then(() => {
      console.log("color2tailwind: Re-enabled editor.colorDecorators");
    });
  console.log("color2tailwind deactivated");
}
