/**
 * Migration Mode - Scan entire files and suggest Tailwind replacements
 */

import * as vscode from 'vscode';
import { ColorMatch, findAllColorsInDocument } from './batchConversion';
import { parseColor } from './colorUtils';
import { lookupExactHex, findNearestColors } from './tailwindColors';

export interface MigrationReport {
  totalColors: number;
  exactMatches: number;
  customColors: number;
  suggestions: MigrationSuggestion[];
}

export interface MigrationSuggestion {
  line: number;
  column: number;
  original: string;
  suggested: string[];
  reason: 'exact' | 'nearest' | 'custom';
  confidence: number; // 0-100
}

/**
 * Generate migration report for a document
 */
export async function generateMigrationReport(
  document: vscode.TextDocument
): Promise<MigrationReport> {
  const colors = findAllColorsInDocument(document);
  const suggestions: MigrationSuggestion[] = [];

  let exactMatches = 0;
  let customColors = 0;

  for (const color of colors) {
    const line = color.range.start.line;
    const column = color.range.start.character;

    if (color.exactMatches.length > 0) {
      // Exact match found
      exactMatches++;
      const match = color.exactMatches[0];
      
      suggestions.push({
        line,
        column,
        original: color.original,
        suggested: [
          `bg-${match.className}`,
          `text-${match.className}`,
          `border-${match.className}`,
        ],
        reason: 'exact',
        confidence: 100,
      });
    } else if (color.nearestMatches.length > 0) {
      // Custom color with nearest suggestions
      customColors++;
      const nearest = color.nearestMatches[0];
      const confidence = Math.max(0, Math.round(100 - nearest.distance));

      suggestions.push({
        line,
        column,
        original: color.original,
        suggested: [
          `bg-[${color.parsed.hex}]`,
          `bg-${nearest.color.className}`,
        ],
        reason: confidence > 85 ? 'nearest' : 'custom',
        confidence,
      });
    }
  }

  return {
    totalColors: colors.length,
    exactMatches,
    customColors,
    suggestions,
  };
}

/**
 * Format migration report as markdown
 */
export function formatMigrationReportMarkdown(report: MigrationReport): string {
  let markdown = `# 🎨 Tailwind Migration Report\n\n`;
  markdown += `## Summary\n\n`;
  markdown += `- **Total Colors Found:** ${report.totalColors}\n`;
  markdown += `- **Exact Matches:** ${report.exactMatches}\n`;
  markdown += `- **Custom Colors:** ${report.customColors}\n`;
  markdown += `- **Conversion Rate:** ${report.totalColors > 0 ? Math.round((report.exactMatches / report.totalColors) * 100) : 0}%\n\n`;

  if (report.suggestions.length > 0) {
    markdown += `## 📋 Suggestions\n\n`;

    // Group by reason
    const exactSuggestions = report.suggestions.filter((s) => s.reason === 'exact');
    const nearestSuggestions = report.suggestions.filter((s) => s.reason === 'nearest');
    const customSuggestions = report.suggestions.filter((s) => s.reason === 'custom');

    if (exactSuggestions.length > 0) {
      markdown += `### ✅ Exact Matches (${exactSuggestions.length})\n\n`;
      markdown += `| Line | Original | Suggested Classes |\n`;
      markdown += `|------|----------|-------------------|\n`;
      
      for (const suggestion of exactSuggestions.slice(0, 10)) {
        markdown += `| ${suggestion.line + 1} | \`${suggestion.original}\` | `;
        markdown += suggestion.suggested.map(s => `\`${s}\``).join(', ');
        markdown += ` |\n`;
      }
      
      if (exactSuggestions.length > 10) {
        markdown += `\n*...and ${exactSuggestions.length - 10} more*\n`;
      }
      markdown += `\n`;
    }

    if (nearestSuggestions.length > 0) {
      markdown += `### 🎯 Near Matches (${nearestSuggestions.length})\n\n`;
      markdown += `| Line | Original | Suggested | Confidence |\n`;
      markdown += `|------|----------|-----------|------------|\n`;
      
      for (const suggestion of nearestSuggestions.slice(0, 10)) {
        markdown += `| ${suggestion.line + 1} | \`${suggestion.original}\` | `;
        markdown += `\`${suggestion.suggested[1]}\` | ${suggestion.confidence}% |\n`;
      }
      
      if (nearestSuggestions.length > 10) {
        markdown += `\n*...and ${nearestSuggestions.length - 10} more*\n`;
      }
      markdown += `\n`;
    }

    if (customSuggestions.length > 0) {
      markdown += `### 🎨 Custom Colors (${customSuggestions.length})\n\n`;
      markdown += `These colors don't have close Tailwind matches. Use arbitrary values:\n\n`;
      markdown += `| Line | Original | Arbitrary Value |\n`;
      markdown += `|------|----------|----------------|\n`;
      
      for (const suggestion of customSuggestions.slice(0, 10)) {
        markdown += `| ${suggestion.line + 1} | \`${suggestion.original}\` | `;
        markdown += `\`${suggestion.suggested[0]}\` |\n`;
      }
      
      if (customSuggestions.length > 10) {
        markdown += `\n*...and ${customSuggestions.length - 10} more*\n`;
      }
      markdown += `\n`;
    }
  }

  markdown += `\n---\n\n`;
  markdown += `💡 **Next Steps:**\n`;
  markdown += `1. Review exact matches and replace with Tailwind classes\n`;
  markdown += `2. Consider near matches based on confidence levels\n`;
  markdown += `3. Use arbitrary values for custom colors: \`bg-[#hex]\`\n`;
  markdown += `4. Update your design system to use Tailwind's palette where possible\n`;

  return markdown;
}

/**
 * Create diagnostic collection for migration mode
 */
export function createMigrationDiagnostics(
  document: vscode.TextDocument,
  report: MigrationReport
): vscode.Diagnostic[] {
  const diagnostics: vscode.Diagnostic[] = [];

  for (const suggestion of report.suggestions) {
    const line = document.lineAt(suggestion.line);
    const startChar = line.text.indexOf(suggestion.original);
    
    if (startChar === -1) {
      continue;
    }

    const range = new vscode.Range(
      new vscode.Position(suggestion.line, startChar),
      new vscode.Position(suggestion.line, startChar + suggestion.original.length)
    );

    let message = '';
    let severity = vscode.DiagnosticSeverity.Information;

    if (suggestion.reason === 'exact') {
      message = `Can be replaced with Tailwind class: ${suggestion.suggested[0]}`;
      severity = vscode.DiagnosticSeverity.Hint;
    } else if (suggestion.reason === 'nearest') {
      message = `Consider using ${suggestion.suggested[1]} (${suggestion.confidence}% similar)`;
      severity = vscode.DiagnosticSeverity.Information;
    } else {
      message = `Custom color - use arbitrary value: ${suggestion.suggested[0]}`;
      severity = vscode.DiagnosticSeverity.Information;
    }

    const diagnostic = new vscode.Diagnostic(range, message, severity);
    diagnostic.source = 'color2tailwind';
    diagnostic.code = 'migration';
    
    diagnostics.push(diagnostic);
  }

  return diagnostics;
}

/**
 * Apply automatic replacements for exact matches
 */
export async function applyAutomaticReplacements(
  document: vscode.TextDocument,
  report: MigrationReport,
  propertyPrefix: string = 'bg'
): Promise<number> {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document !== document) {
    return 0;
  }

  const exactSuggestions = report.suggestions.filter((s) => s.reason === 'exact');
  if (exactSuggestions.length === 0) {
    return 0;
  }

  const edit = new vscode.WorkspaceEdit();
  let replacementCount = 0;

  for (const suggestion of exactSuggestions) {
    const line = document.lineAt(suggestion.line);
    const startChar = line.text.indexOf(suggestion.original);
    
    if (startChar === -1) {
      continue;
    }

    const range = new vscode.Range(
      new vscode.Position(suggestion.line, startChar),
      new vscode.Position(suggestion.line, startChar + suggestion.original.length)
    );

    // Use the first suggested class with the specified property prefix
    const tailwindClass = suggestion.suggested[0].replace(/^[a-z]+-/, `${propertyPrefix}-`);
    
    edit.replace(document.uri, range, tailwindClass);
    replacementCount++;
  }

  const success = await vscode.workspace.applyEdit(edit);
  return success ? replacementCount : 0;
}
