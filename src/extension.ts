import * as vscode from 'vscode';
import { parseColor, formatRgba, formatHsla, rgbaToHex, anyColorPattern, ParsedColor, ColorFormat } from './colorUtils';
import { lookupExactHex, findNearestColors, TailwindColor } from './tailwindColors';
import { ColorCodeActionProvider } from './codeActionProvider';

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
  const config = vscode.workspace.getConfiguration('color2tailwind');
  return {
    showColorPreview: config.get<boolean>('showColorPreview', true),
    showRgbValues: config.get<boolean>('showRgbValues', true),
    showHslValues: config.get<boolean>('showHslValues', true),
    showOriginalFormat: config.get<boolean>('showOriginalFormat', true),
    showNearestMatch: config.get<boolean>('showNearestMatch', true),
    nearestMatchCount: config.get<number>('nearestMatchCount', 3),
    classPrefix: config.get<string>('classPrefix', ''),
    enabledLanguages: config.get<string[]>('enabledLanguages', [
      'javascript', 'typescript', 'javascriptreact', 'typescriptreact',
      'html', 'css', 'scss', 'less', 'vue', 'svelte', 'astro',
      'json', 'jsonc', 'markdown', 'php', 'erb', 'blade', 'python',
    ]),
  };
}

/**
 * Format labels for color formats
 */
const formatLabels: Record<ColorFormat, string> = {
  'hex': 'HEX',
  'hex-alpha': 'HEX (with alpha)',
  'rgb': 'RGB',
  'rgba': 'RGBA',
  'hsl': 'HSL',
  'hsla': 'HSLA',
  'hwb': 'HWB',
  'lab': 'LAB',
  'lch': 'LCH',
  'oklch': 'OKLCH',
  'oklab': 'OKLAB',
  'named': 'Named Color',
  'unknown': 'Unknown',
};

/**
 * Build class table for a Tailwind color
 */
function buildClassTable(color: TailwindColor, prefix: string): string {
  const classes = [
    ['Text', `${prefix}text-${color.className}`],
    ['Background', `${prefix}bg-${color.className}`],
    ['Border', `${prefix}border-${color.className}`],
    ['Ring', `${prefix}ring-${color.className}`],
    ['Divide', `${prefix}divide-${color.className}`],
    ['Shadow', `${prefix}shadow-${color.className}`],
  ];

  let table = '| Property | Class |\n|:---------|:------|\n';
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

  // Color preview
  if (config.showColorPreview) {
    const displayHex = parsed.hex.length <= 7 ? parsed.hex : parsed.hex.slice(0, 7);
    content.appendMarkdown(
      `<span style="background-color:${displayHex};display:inline-block;width:60px;height:30px;border:1px solid #666;border-radius:4px;vertical-align:middle;margin-right:12px;"></span>`
    );
  }

  content.appendMarkdown(`**${parsed.hex.toUpperCase()}**\n\n`);

  // Original format info
  if (config.showOriginalFormat && parsed.format !== 'hex') {
    content.appendMarkdown(`*Detected: ${formatLabels[parsed.format]}* — \`${parsed.original}\`\n\n`);
  }

  content.appendMarkdown(`---\n\n`);
  content.appendMarkdown(`### ✅ Tailwind CSS Match\n\n`);

  // Show all matching classes
  matches.forEach((match, index) => {
    if (matches.length > 1) {
      content.appendMarkdown(`**Option ${index + 1}: ${match.colorName} ${match.shade}**\n\n`);
    } else if (match.shade) {
      content.appendMarkdown(`**${match.colorName}** palette, shade **${match.shade}**\n\n`);
    } else {
      content.appendMarkdown(`**${match.colorName}**\n\n`);
    }
    content.appendMarkdown(buildClassTable(match, config.classPrefix));
    if (index < matches.length - 1) content.appendMarkdown('\n');
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
  config: ExtensionConfig
): vscode.MarkdownString {
  const content = new vscode.MarkdownString();
  content.isTrusted = true;
  content.supportHtml = true;

  // Color preview
  if (config.showColorPreview) {
    const displayHex = parsed.hex.length <= 7 ? parsed.hex : parsed.hex.slice(0, 7);
    content.appendMarkdown(
      `<span style="background-color:${displayHex};display:inline-block;width:60px;height:30px;border:1px solid #666;border-radius:4px;vertical-align:middle;margin-right:12px;"></span>`
    );
  }

  content.appendMarkdown(`**${parsed.hex.toUpperCase()}**\n\n`);

  // Original format info
  if (config.showOriginalFormat && parsed.format !== 'hex') {
    content.appendMarkdown(`*Detected: ${formatLabels[parsed.format]}* — \`${parsed.original}\`\n\n`);
  }

  content.appendMarkdown(`---\n\n`);

  // Arbitrary value suggestion
  content.appendMarkdown(`### 🎨 Custom Color\n\n`);
  content.appendMarkdown(`**Arbitrary values:**\n\n`);
  content.appendMarkdown(`| Property | Class |\n|:---------|:------|\n`);
  content.appendMarkdown(`| Text | \`${config.classPrefix}text-[${parsed.hex}]\` |\n`);
  content.appendMarkdown(`| Background | \`${config.classPrefix}bg-[${parsed.hex}]\` |\n`);
  content.appendMarkdown(`| Border | \`${config.classPrefix}border-[${parsed.hex}]\` |\n\n`);

  // Nearest matches
  if (config.showNearestMatch && nearestColors.length > 0) {
    content.appendMarkdown(`---\n\n`);
    content.appendMarkdown(`### 🔍 Nearest Tailwind Colors\n\n`);

    nearestColors.forEach((item, index) => {
      const { color, distance } = item;
      const similarity = Math.max(0, Math.round(100 - distance));
      
      content.appendMarkdown(
        `<span style="background-color:${color.hex};display:inline-block;width:16px;height:16px;border:1px solid #666;border-radius:2px;vertical-align:middle;margin-right:6px;"></span>`
      );
      content.appendMarkdown(
        `**${color.className}** — ${similarity}% similar *(ΔE: ${distance})*\n\n`
      );

      if (index === 0) {
        // Show full table for closest match
        content.appendMarkdown(buildClassTable(color, config.classPrefix));
        content.appendMarkdown('\n');
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
  config: ExtensionConfig
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
    content.appendMarkdown(`Alpha: \`${(parsed.rgba.a * 100).toFixed(0)}%\`\n\n`);
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
      
      // Reset regex and find matches
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
            position.line, start,
            position.line, end
          );

          // Check for exact match
          const exactMatches = lookupExactHex(parsed.hex);
          
          if (exactMatches.length > 0) {
            return new vscode.Hover(
              buildExactMatchContent(parsed, exactMatches, config),
              range
            );
          }

          // Find nearest matches
          const nearestColors = findNearestColors(
            parsed.rgba,
            config.nearestMatchCount,
            100
          );

          return new vscode.Hover(
            buildNearestMatchContent(parsed, nearestColors, config),
            range
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
    vscode.window.showWarningMessage('No active editor');
    return;
  }

  const selection = editor.selection;
  const text = editor.document.getText(selection);

  if (!text) {
    vscode.window.showWarningMessage('Please select a color value');
    return;
  }

  const parsed = parseColor(text.trim());
  if (!parsed) {
    vscode.window.showWarningMessage('Selected text is not a valid color');
    return;
  }

  const config = getConfig();
  const exactMatches = lookupExactHex(parsed.hex);
  
  const items: vscode.QuickPickItem[] = [];

  if (exactMatches.length > 0) {
    // Exact matches
    for (const match of exactMatches) {
      for (const prop of ['bg', 'text', 'border', 'ring']) {
        items.push({
          label: `${config.classPrefix}${prop}-${match.className}`,
          description: `${match.colorName} ${match.shade} (exact)`.trim(),
        });
      }
    }
  } else {
    // Arbitrary values first
    for (const prop of ['bg', 'text', 'border', 'ring']) {
      items.push({
        label: `${config.classPrefix}${prop}-[${parsed.hex}]`,
        description: 'Arbitrary value',
      });
    }

    // Then nearest matches
    const nearest = findNearestColors(parsed.rgba, 2);
    for (const { color, distance } of nearest) {
      const similarity = Math.max(0, Math.round(100 - distance));
      for (const prop of ['bg', 'text']) {
        items.push({
          label: `${config.classPrefix}${prop}-${color.className}`,
          description: `${color.colorName} ${color.shade} (${similarity}% similar)`.trim(),
        });
      }
    }
  }

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select a Tailwind class to copy',
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
  console.log('color2tailwind activated');

  const config = getConfig();

  // Register hover provider
  const hoverProvider = vscode.languages.registerHoverProvider(
    config.enabledLanguages.map((lang) => ({ language: lang })),
    createHoverProvider()
  );

  // Register code action provider for quick copy
  const codeActionProvider = vscode.languages.registerCodeActionsProvider(
    config.enabledLanguages.map((lang) => ({ language: lang })),
    new ColorCodeActionProvider(),
    {
      providedCodeActionKinds: [vscode.CodeActionKind.QuickFix]
    }
  );

  // Register copy command
  const copyCommand = vscode.commands.registerCommand(
    'color2tailwind.copyClass',
    async (tailwindClass: string) => {
      await vscode.env.clipboard.writeText(tailwindClass);
      vscode.window.showInformationMessage(`✅ Copied: ${tailwindClass}`);
    }
  );

  // Register convert command
  const convertCommand = vscode.commands.registerCommand(
    'color2tailwind.convertToTailwind',
    convertToTailwindCommand
  );

  context.subscriptions.push(hoverProvider, codeActionProvider, copyCommand, convertCommand);
}

export function deactivate(): void {
  console.log('color2tailwind deactivated');
}
