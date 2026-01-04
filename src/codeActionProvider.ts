import * as vscode from 'vscode';
import { parseColor, anyColorPattern } from './colorUtils';
import { lookupExactHex, findNearestColors } from './tailwindColors';

/**
 * Code Action Provider for quick copy actions
 */
export class ColorCodeActionProvider implements vscode.CodeActionProvider {
  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.CodeAction[] | undefined {
    const line = document.lineAt(range.start.line);
    const text = line.text;
    
    // Reset regex
    anyColorPattern.lastIndex = 0;
    
    let match: RegExpExecArray | null;
    const actions: vscode.CodeAction[] = [];
    
    while ((match = anyColorPattern.exec(text)) !== null) {
      const startPos = new vscode.Position(range.start.line, match.index);
      const endPos = new vscode.Position(range.start.line, match.index + match[0].length);
      const colorRange = new vscode.Range(startPos, endPos);
      
      // Check if cursor is on this color
      if (colorRange.contains(range.start)) {
        const colorString = match[0];
        const parsed = parseColor(colorString);
        
        if (!parsed || !parsed.isValid) {
          continue;
        }

        // Check for exact matches first
        const exactMatches = lookupExactHex(parsed.hex);
        
        if (exactMatches.length > 0) {
          // Exact match - show all Tailwind class variants
          const firstMatch = exactMatches[0];
          
          const prefixes = ['bg', 'text', 'border', 'ring', 'divide', 'shadow', 'outline', 'decoration', 'accent', 'caret', 'fill', 'stroke'];
          
          for (const prefix of prefixes) {
            const action = this.createCopyAction(
              `📋 ${prefix}-${firstMatch.className}`,
              `${prefix}-${firstMatch.className}`,
              vscode.CodeActionKind.QuickFix
            );
            actions.push(action);
          }
          
          // If there are multiple exact matches, show second option
          if (exactMatches.length > 1) {
            const secondMatch = exactMatches[1];
            const copyAltAction = this.createCopyAction(
              `📋 bg-${secondMatch.className} (alternative)`,
              `bg-${secondMatch.className}`,
              vscode.CodeActionKind.QuickFix
            );
            actions.push(copyAltAction);
          }
        } else {
          // No exact match - show arbitrary values for all prefixes
          
          const prefixes = ['bg', 'text', 'border', 'ring', 'divide', 'shadow', 'outline', 'decoration', 'accent', 'caret', 'fill', 'stroke'];
          
          for (const prefix of prefixes) {
            const action = this.createCopyAction(
              `📋 ${prefix}-[${parsed.hex}]`,
              `${prefix}-[${parsed.hex}]`,
              vscode.CodeActionKind.QuickFix
            );
            actions.push(action);
          }
          
          // Show nearest match as alternative
          const nearestColors = findNearestColors(parsed.rgba, 1, 100);
          if (nearestColors.length > 0) {
            const nearest = nearestColors[0];
            const similarity = Math.max(0, Math.round(100 - nearest.distance));
            
            const copyNearestAction = this.createCopyAction(
              `📋 bg-${nearest.color.className} (${similarity}% similar)`,
              `bg-${nearest.color.className}`,
              vscode.CodeActionKind.QuickFix
            );
            actions.push(copyNearestAction);
          }
        }
        
        break; // Only process the first matching color at cursor position
      }
    }
    
    return actions.length > 0 ? actions : undefined;
  }
  
  /**
   * Create a copy action
   */
  private createCopyAction(
    title: string,
    tailwindClass: string,
    kind: vscode.CodeActionKind
  ): vscode.CodeAction {
    const action = new vscode.CodeAction(title, kind);
    action.command = {
      command: 'color2tailwind.copyClass',
      title: 'Copy Tailwind Class',
      arguments: [tailwindClass]
    };
    return action;
  }
}
