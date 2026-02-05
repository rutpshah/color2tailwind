/**
 * Unit Tests for Migration Mode
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import {
  generateMigrationReport,
  formatMigrationReportMarkdown,
  createMigrationDiagnostics,
} from '../migrationMode';

suite('Migration Mode Tests', () => {
  test('generateMigrationReport - exact matches', async () => {
    const content = `
      .button {
        background: #ef4444;
        color: #3b82f6;
        border: #22c55e;
      }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const report = await generateMigrationReport(document);

    assert.ok(report.totalColors >= 3);
    assert.ok(report.exactMatches >= 3);
    assert.strictEqual(report.customColors, 0);
    assert.ok(report.suggestions.length >= 3);
  });

  test('generateMigrationReport - custom colors', async () => {
    const content = `
      .custom {
        background: #a1b2c3;
        color: rgb(123, 45, 67);
      }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const report = await generateMigrationReport(document);

    assert.strictEqual(report.totalColors, 2);
    assert.strictEqual(report.exactMatches, 0);
    assert.strictEqual(report.customColors, 2);
    assert.ok(report.suggestions.length === 2);
  });

  test('generateMigrationReport - mixed colors', async () => {
    const content = `
      .mixed {
        background: #ef4444;
        color: #a1b2c3;
        border: #3b82f6;
      }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const report = await generateMigrationReport(document);

    assert.ok(report.totalColors >= 2);
    assert.ok(report.exactMatches >= 2);
    assert.ok(report.customColors >= 1);
  });

  test('generateMigrationReport - suggestions have correct structure', async () => {
    const content = `
      .button { background: #ef4444; }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const report = await generateMigrationReport(document);

    assert.ok(report.suggestions.length > 0);
    
    const suggestion = report.suggestions[0];
    assert.ok(typeof suggestion.line === 'number');
    assert.ok(typeof suggestion.column === 'number');
    assert.ok(typeof suggestion.original === 'string');
    assert.ok(Array.isArray(suggestion.suggested));
    assert.ok(suggestion.suggested.length > 0);
    assert.ok(['exact', 'nearest', 'custom'].includes(suggestion.reason));
    assert.ok(suggestion.confidence >= 0 && suggestion.confidence <= 100);
  });

  test('generateMigrationReport - exact match suggestions', async () => {
    const content = `
      .button { background: #ef4444; }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const report = await generateMigrationReport(document);

    const exactSuggestion = report.suggestions.find(s => s.reason === 'exact');
    assert.ok(exactSuggestion);
    assert.strictEqual(exactSuggestion.confidence, 100);
    assert.ok(exactSuggestion.suggested.some(s => s.includes('bg-')));
    assert.ok(exactSuggestion.suggested.some(s => s.includes('text-')));
  });

  test('formatMigrationReportMarkdown - structure', async () => {
    const content = `
      .button { background: #ef4444; }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const report = await generateMigrationReport(document);
    const markdown = formatMigrationReportMarkdown(report);

    // Check markdown structure
    assert.ok(markdown.includes('# 🎨 Tailwind Migration Report'));
    assert.ok(markdown.includes('## Summary'));
    assert.ok(markdown.includes('Total Colors Found'));
    assert.ok(markdown.includes('Exact Matches'));
    assert.ok(markdown.includes('Custom Colors'));
    assert.ok(markdown.includes('Conversion Rate'));
  });

  test('formatMigrationReportMarkdown - suggestions sections', async () => {
    const content = `
      .exact { background: #ef4444; }
      .custom { color: #123456; }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const report = await generateMigrationReport(document);
    const markdown = formatMigrationReportMarkdown(report);

    assert.ok(markdown.includes('## 📋 Suggestions'));
    
    if (report.exactMatches > 0) {
      assert.ok(markdown.includes('### ✅ Exact Matches'));
    }
    
    // Check that we have some kind of color suggestions
    assert.ok(
      markdown.includes('Custom Color') || 
      markdown.includes('Near Match') || 
      markdown.includes('Exact Match')
    );
  });

  test('formatMigrationReportMarkdown - includes next steps', async () => {
    const content = `
      .button { background: #ef4444; }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const report = await generateMigrationReport(document);
    const markdown = formatMigrationReportMarkdown(report);

    assert.ok(markdown.includes('💡 **Next Steps:**'));
    assert.ok(markdown.includes('Review exact matches'));
    assert.ok(markdown.includes('Consider near matches'));
    assert.ok(markdown.includes('arbitrary values'));
  });

  test('createMigrationDiagnostics - creates diagnostics', async () => {
    const content = `
      .button { background: #ef4444; }
      .custom { color: #a1b2c3; }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const report = await generateMigrationReport(document);
    const diagnostics = createMigrationDiagnostics(document, report);

    assert.ok(diagnostics.length > 0);
    assert.strictEqual(diagnostics.length, report.suggestions.length);
  });

  test('createMigrationDiagnostics - diagnostic structure', async () => {
    const content = `
      .button { background: #ef4444; }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const report = await generateMigrationReport(document);
    const diagnostics = createMigrationDiagnostics(document, report);

    const diagnostic = diagnostics[0];
    assert.ok(diagnostic.range instanceof vscode.Range);
    assert.ok(typeof diagnostic.message === 'string');
    assert.ok(diagnostic.message.length > 0);
    assert.strictEqual(diagnostic.source, 'color2tailwind');
    assert.strictEqual(diagnostic.code, 'migration');
  });

  test('createMigrationDiagnostics - exact match severity', async () => {
    const content = `
      .button { background: #ef4444; }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const report = await generateMigrationReport(document);
    const diagnostics = createMigrationDiagnostics(document, report);

    const exactDiagnostic = diagnostics.find(d => 
      d.message.includes('Can be replaced')
    );
    
    if (exactDiagnostic) {
      assert.strictEqual(exactDiagnostic.severity, vscode.DiagnosticSeverity.Hint);
    }
  });

  test('generateMigrationReport - no colors', async () => {
    const content = `
      .button { padding: 1rem; margin: 2rem; }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const report = await generateMigrationReport(document);

    assert.strictEqual(report.totalColors, 0);
    assert.strictEqual(report.exactMatches, 0);
    assert.strictEqual(report.customColors, 0);
    assert.strictEqual(report.suggestions.length, 0);
  });

  test('generateMigrationReport - conversion rate calculation', async () => {
    const content = `
      .exact1 { background: #ef4444; }
      .exact2 { color: #3b82f6; }
      .custom { border: #a1b2c3; }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const report = await generateMigrationReport(document);
    const markdown = formatMigrationReportMarkdown(report);

    // With 2 exact and 1 custom, conversion rate should be ~66%
    const conversionRate = Math.round((report.exactMatches / report.totalColors) * 100);
    assert.ok(markdown.includes(`${conversionRate}%`));
  });

  test('generateMigrationReport - high confidence near matches', async () => {
    const content = `
      .similar { background: #ef4545; }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const report = await generateMigrationReport(document);

    const nearMatch = report.suggestions.find(s => s.reason === 'nearest');
    if (nearMatch) {
      assert.ok(nearMatch.confidence > 85);
    }
  });
});
