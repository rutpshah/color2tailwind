import * as vscode from "vscode";
import {
  parseColor,
  formatRgba,
  formatHsla,
  anyColorPattern,
  ParsedColor,
  ColorFormat,
} from "./colorUtils";
import {
  lookupExactHex,
  findNearestColors,
  TailwindColor,
} from "./tailwindColors";
import { ColorCodeActionProvider } from "./codeActionProvider";
import {
  findTailwindClassesInText,
  getPropertyName,
} from "./reverseConversion";
import {
  findAllColorsInDocument,
  findColorsInSelection,
  buildBatchConversionItems,
  generateBatchSummary,
} from "./batchConversion";
import {
  generateMigrationReport,
  formatMigrationReportMarkdown,
  createMigrationDiagnostics,
  applyAutomaticReplacements,
  type MigrationReport,
} from "./migrationMode";

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
 * Build hover content for reverse conversion (Tailwind class to color)
 */
function buildReverseConversionContent(
  result: { color: TailwindColor; properties: string[] },
  config: ExtensionConfig,
): vscode.MarkdownString {
  const content = new vscode.MarkdownString();
  content.isTrusted = true;
  content.supportHtml = true;

  const { color, properties } = result;

  // Color preview
  if (config.showColorPreview) {
    content.appendMarkdown(
      `<span style="background-color:${color.hex};display:inline-block;width:60px;height:30px;border:1px solid #666;border-radius:4px;vertical-align:middle;margin-right:12px;"></span>`,
    );
  }

  content.appendMarkdown(`**${color.hex.toUpperCase()}**\n\n`);

  if (color.colorName !== "Custom") {
    content.appendMarkdown(`**${color.colorName}** palette`);
    if (color.shade) {
      content.appendMarkdown(`, shade **${color.shade}**`);
    }
    content.appendMarkdown(`\n\n`);
  } else {
    content.appendMarkdown(`**Custom Color** (Arbitrary Value)\n\n`);
  }

  content.appendMarkdown(`---\n\n`);
  content.appendMarkdown(`### 🔄 Reverse Conversion\n\n`);
  content.appendMarkdown(
    `**Property:** ${properties.map((p) => getPropertyName(p)).join(", ")}\n\n`,
  );

  // Color values
  if (color.colorName !== "Custom") {
    appendColorValuesFromRgb(content, color.rgb, config);
  }

  return content;
}

/**
 * Append color values from RGB
 */
function appendColorValuesFromRgb(
  content: vscode.MarkdownString,
  rgb: { r: number; g: number; b: number },
  config: ExtensionConfig,
): void {
  if (!config.showRgbValues && !config.showHslValues) return;

  content.appendMarkdown(`---\n\n`);
  content.appendMarkdown(`**Color Values**\n\n`);

  if (config.showRgbValues) {
    content.appendMarkdown(`RGB: \`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\`\n\n`);
  }

  if (config.showHslValues) {
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    content.appendMarkdown(`HSL: \`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)\`\n\n`);
  }
}

/**
 * RGB to HSL helper
 */
function rgbToHsl(
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } {
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
 * Build hover content for exact match
 */
function buildExactMatchContent(
  parsed: ParsedColor,
  matches: TailwindColor[],
  config: ExtensionConfig,
): vscode.MarkdownString {
  const content = new vscode.MarkdownString();
  content.isTrusted = true;
  content.supportHtml = true;

  // Color preview
  if (config.showColorPreview) {
    const displayHex =
      parsed.hex.length <= 7 ? parsed.hex : parsed.hex.slice(0, 7);
    content.appendMarkdown(
      `<span style="background-color:${displayHex};display:inline-block;width:60px;height:30px;border:1px solid #666;border-radius:4px;vertical-align:middle;margin-right:12px;"></span>`,
    );
  }

  content.appendMarkdown(`**${parsed.hex.toUpperCase()}**\n\n`);

  // Original format info
  if (config.showOriginalFormat && parsed.format !== "hex") {
    content.appendMarkdown(
      `*Detected: ${formatLabels[parsed.format]}* — \`${parsed.original}\`\n\n`,
    );
  }

  content.appendMarkdown(`---\n\n`);
  content.appendMarkdown(`### ✅ Tailwind CSS Match\n\n`);

  // Show all matching classes
  matches.forEach((match, index) => {
    if (matches.length > 1) {
      content.appendMarkdown(
        `**Option ${index + 1}: ${match.colorName} ${match.shade}**\n\n`,
      );
    } else if (match.shade) {
      content.appendMarkdown(
        `**${match.colorName}** palette, shade **${match.shade}**\n\n`,
      );
    } else {
      content.appendMarkdown(`**${match.colorName}**\n\n`);
    }
    content.appendMarkdown(buildClassTable(match, config.classPrefix));
    if (index < matches.length - 1) content.appendMarkdown("\n");
  });

  // Color values
  appendColorValues(content, parsed, config);

  return content;
}

/**
 * Build hover content for nearest match
 */
function buildNearestMatchContent(
  parsed: ParsedColor,
  nearestColors: Array<{ color: TailwindColor; distance: number }>,
  config: ExtensionConfig,
): vscode.MarkdownString {
  const content = new vscode.MarkdownString();
  content.isTrusted = true;
  content.supportHtml = true;

  // Color preview
  if (config.showColorPreview) {
    const displayHex =
      parsed.hex.length <= 7 ? parsed.hex : parsed.hex.slice(0, 7);
    content.appendMarkdown(
      `<span style="background-color:${displayHex};display:inline-block;width:60px;height:30px;border:1px solid #666;border-radius:4px;vertical-align:middle;margin-right:12px;"></span>`,
    );
  }

  content.appendMarkdown(`**${parsed.hex.toUpperCase()}**\n\n`);

  // Original format info
  if (config.showOriginalFormat && parsed.format !== "hex") {
    content.appendMarkdown(
      `*Detected: ${formatLabels[parsed.format]}* — \`${parsed.original}\`\n\n`,
    );
  }

  content.appendMarkdown(`---\n\n`);

  // Arbitrary value suggestion
  content.appendMarkdown(`### 🎨 Custom Color\n\n`);
  content.appendMarkdown(`**Arbitrary values:**\n\n`);
  content.appendMarkdown(`| Property | Class |\n|:---------|:------|\n`);
  content.appendMarkdown(
    `| Text | \`${config.classPrefix}text-[${parsed.hex}]\` |\n`,
  );
  content.appendMarkdown(
    `| Background | \`${config.classPrefix}bg-[${parsed.hex}]\` |\n`,
  );
  content.appendMarkdown(
    `| Border | \`${config.classPrefix}border-[${parsed.hex}]\` |\n\n`,
  );

  // Nearest matches
  if (config.showNearestMatch && nearestColors.length > 0) {
    content.appendMarkdown(`---\n\n`);
    content.appendMarkdown(`### 🔍 Nearest Tailwind Colors\n\n`);

    nearestColors.forEach((item, index) => {
      const { color, distance } = item;
      const similarity = Math.max(0, Math.round(100 - distance));

      content.appendMarkdown(
        `<span style="background-color:${color.hex};display:inline-block;width:16px;height:16px;border:1px solid #666;border-radius:2px;vertical-align:middle;margin-right:6px;"></span>`,
      );
      content.appendMarkdown(
        `**${color.className}** — ${similarity}% similar *(ΔE: ${distance})*\n\n`,
      );

      if (index === 0) {
        // Show full table for closest match
        content.appendMarkdown(buildClassTable(color, config.classPrefix));
        content.appendMarkdown("\n");
      }
    });
  }

  // Color values
  appendColorValues(content, parsed, config);

  return content;
}

/**
 * Append color value information
 */
function appendColorValues(
  content: vscode.MarkdownString,
  parsed: ParsedColor,
  config: ExtensionConfig,
): void {
  if (!config.showRgbValues && !config.showHslValues) return;

  content.appendMarkdown(`---\n\n`);
  content.appendMarkdown(`**Color Values**\n\n`);

  if (config.showRgbValues) {
    content.appendMarkdown(`RGB: \`${formatRgba(parsed.rgba)}\`\n\n`);
  }

  if (config.showHslValues) {
    content.appendMarkdown(`HSL: \`${formatHsla(parsed.rgba)}\`\n\n`);
  }

  if (parsed.rgba.a < 1) {
    content.appendMarkdown(
      `Alpha: \`${(parsed.rgba.a * 100).toFixed(0)}%\`\n\n`,
    );
  }
}

/**
 * Create hover provider
 */
function createHoverProvider(): vscode.HoverProvider {
  return {
    provideHover(document, position, _token) {
      const config = getConfig();

      // Get line text and find color at position
      const line = document.lineAt(position.line).text;

      // First, check for Tailwind classes (reverse conversion)
      const tailwindMatches = findTailwindClassesInText(line);
      for (const twMatch of tailwindMatches) {
        if (
          position.character >= twMatch.start &&
          position.character <= twMatch.end
        ) {
          if (twMatch.result) {
            const range = new vscode.Range(
              position.line,
              twMatch.start,
              position.line,
              twMatch.end,
            );
            return new vscode.Hover(
              buildReverseConversionContent(twMatch.result, config),
              range,
            );
          }
        }
      }

      // Then check for regular color values (forward conversion)
      anyColorPattern.lastIndex = 0;
      let match: RegExpExecArray | null;

      while ((match = anyColorPattern.exec(line)) !== null) {
        const start = match.index;
        const end = start + match[0].length;

        // Check if position is within this match
        if (position.character >= start && position.character <= end) {
          const colorString = match[0];
          const parsed = parseColor(colorString);

          if (!parsed || !parsed.isValid) continue;

          const range = new vscode.Range(
            position.line,
            start,
            position.line,
            end,
          );

          // Check for exact match
          const exactMatches = lookupExactHex(parsed.hex);

          if (exactMatches.length > 0) {
            return new vscode.Hover(
              buildExactMatchContent(parsed, exactMatches, config),
              range,
            );
          }

          // Find nearest matches
          const nearestColors = findNearestColors(
            parsed.rgba,
            config.nearestMatchCount,
            100,
          );

          return new vscode.Hover(
            buildNearestMatchContent(parsed, nearestColors, config),
            range,
          );
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
 * Command: Batch convert colors
 */
async function batchConvertColorsCommand(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("No active editor");
    return;
  }

  const document = editor.document;
  const selection = editor.selection;

  // Determine scope
  const scope = await vscode.window.showQuickPick(
    [
      { label: "$(file) Entire Document", value: "document" },
      { label: "$(selection) Selected Text", value: "selection" },
    ],
    { placeHolder: "Select scope for batch conversion" },
  );

  if (!scope) {
    return;
  }

  // Find colors based on scope
  const colors =
    scope.value === "document"
      ? findAllColorsInDocument(document)
      : findColorsInSelection(document, selection);

  if (colors.length === 0) {
    vscode.window.showInformationMessage(
      "No colors found in the selected scope",
    );
    return;
  }

  // Ask for property prefix
  const propertyPrefix = await vscode.window.showQuickPick(
    [
      { label: "bg", description: "Background color" },
      { label: "text", description: "Text color" },
      { label: "border", description: "Border color" },
      { label: "ring", description: "Ring color" },
    ],
    { placeHolder: "Select property type for conversion" },
  );

  if (!propertyPrefix) {
    return;
  }

  // Build quick pick items
  const items = buildBatchConversionItems(colors, propertyPrefix.label);
  const summary = generateBatchSummary(colors);

  // Show quick pick with multi-select
  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: `${summary} - Select colors to convert`,
    canPickMany: true,
  });

  if (!selected || selected.length === 0) {
    return;
  }

  // Copy all selected classes to clipboard
  const classes = selected.map((item) => item.tailwindClass).join(" ");
  await vscode.env.clipboard.writeText(classes);

  vscode.window.showInformationMessage(
    `✅ Copied ${selected.length} Tailwind class${selected.length !== 1 ? "es" : ""} to clipboard`,
  );
}

/**
 * Command: Migration mode - scan and convert entire file
 */
async function migrationModeCommand(): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage("No active editor");
    return;
  }

  const document = editor.document;

  // Show progress
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Analyzing colors for Tailwind migration...",
      cancellable: false,
    },
    async () => {
      const report = await generateMigrationReport(document);

      if (report.totalColors === 0) {
        vscode.window.showInformationMessage(
          "No colors found in this document",
        );
        return;
      }

      // Ask user what to do
      const action = await vscode.window.showQuickPick(
        [
          {
            label: "$(file-text) View Full Report",
            description: `${report.totalColors} colors analyzed`,
            value: "report",
          },
          {
            label: "$(replace-all) Auto-Replace Exact Matches",
            description: `${report.exactMatches} exact match${report.exactMatches !== 1 ? "es" : ""} found`,
            value: "replace",
            disabled: report.exactMatches === 0,
          },
          {
            label: "$(warning) Show Inline Suggestions",
            description: "Display diagnostics in editor",
            value: "diagnostics",
          },
        ].filter((item) => !item.disabled),
        { placeHolder: "Choose an action" },
      );

      if (!action) {
        return;
      }

      const actionValue = (action as any).value;

      switch (actionValue) {
        case "report":
          await showMigrationReport(report);
          break;

        case "replace":
          await performAutoReplacement(document, report);
          break;

        case "diagnostics":
          await showMigrationDiagnostics(document, report);
          break;
      }
    },
  );
}

/**
 * Show migration report in a new document
 */
async function showMigrationReport(report: MigrationReport): Promise<void> {
  const markdown = formatMigrationReportMarkdown(report);
  const doc = await vscode.workspace.openTextDocument({
    content: markdown,
    language: "markdown",
  });
  await vscode.window.showTextDocument(doc);
}

/**
 * Perform automatic replacement for exact matches
 */
async function performAutoReplacement(
  document: vscode.TextDocument,
  report: MigrationReport,
): Promise<void> {
  const propertyPrefix = await vscode.window.showQuickPick(
    [
      { label: "bg", description: "Background color" },
      { label: "text", description: "Text color" },
      { label: "border", description: "Border color" },
    ],
    { placeHolder: "Select property type for replacement" },
  );

  if (!propertyPrefix) {
    return;
  }

  const count = await applyAutomaticReplacements(
    document,
    report,
    propertyPrefix.label,
  );

  if (count > 0) {
    vscode.window.showInformationMessage(
      `✅ Replaced ${count} color${count !== 1 ? "s" : ""} with Tailwind classes`,
    );
  } else {
    vscode.window.showWarningMessage("No replacements were made");
  }
}

/**
 * Show migration diagnostics in the editor
 */
const migrationDiagnostics = vscode.languages.createDiagnosticCollection(
  "color2tailwind-migration",
);

async function showMigrationDiagnostics(
  document: vscode.TextDocument,
  report: MigrationReport,
): Promise<void> {
  const diagnostics = createMigrationDiagnostics(document, report);
  migrationDiagnostics.set(document.uri, diagnostics);

  vscode.window.showInformationMessage(
    `📊 Showing ${diagnostics.length} migration suggestion${diagnostics.length !== 1 ? "s" : ""} in the editor`,
  );
}

/**
 * Activate extension
 */
export function activate(context: vscode.ExtensionContext): void {
  console.log("color2tailwind activated");

  const config = getConfig();

  // Register hover provider
  const hoverProvider = vscode.languages.registerHoverProvider(
    config.enabledLanguages.map((lang) => ({ language: lang })),
    createHoverProvider(),
  );

  // Register code action provider for quick copy
  const codeActionProvider = vscode.languages.registerCodeActionsProvider(
    config.enabledLanguages.map((lang) => ({ language: lang })),
    new ColorCodeActionProvider(),
    {
      providedCodeActionKinds: [vscode.CodeActionKind.QuickFix],
    },
  );

  // Register copy command
  const copyCommand = vscode.commands.registerCommand(
    "color2tailwind.copyClass",
    async (tailwindClass: string) => {
      await vscode.env.clipboard.writeText(tailwindClass);
      vscode.window.showInformationMessage(`✅ Copied: ${tailwindClass}`);
    },
  );

  // Register convert command
  const convertCommand = vscode.commands.registerCommand(
    "color2tailwind.convertToTailwind",
    convertToTailwindCommand,
  );

  // Register batch convert command
  const batchConvertCommand = vscode.commands.registerCommand(
    "color2tailwind.batchConvert",
    batchConvertColorsCommand,
  );

  // Register migration mode command
  const migrationCommand = vscode.commands.registerCommand(
    "color2tailwind.migrationMode",
    migrationModeCommand,
  );

  context.subscriptions.push(
    hoverProvider,
    codeActionProvider,
    copyCommand,
    convertCommand,
    batchConvertCommand,
    migrationCommand,
    migrationDiagnostics,
  );
}

export function deactivate(): void {
  console.log("color2tailwind deactivated");
}
