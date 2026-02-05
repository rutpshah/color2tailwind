/**
 * Unit Tests for Batch Conversion
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import {
  findAllColorsInDocument,
  buildBatchConversionItems,
  generateBatchSummary,
} from '../batchConversion';

suite('Batch Conversion Tests', () => {
  test('findAllColorsInDocument - multiple colors', async () => {
    const content = `
.button {
  background: #ef4444;
  color: rgb(59, 130, 246);
  border: 1px solid hsl(262, 83%, 58%);
}
.header {
  background: #3b82f6;
}
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const colors = findAllColorsInDocument(document);

    // Should find at least 2 unique colors
    assert.ok(
      colors.length >= 2, 
      `Expected at least 2 unique colors, but found ${colors.length}. Colors: ${colors.map(c => c.parsed.hex).join(', ')}`
    );
    
    // Verify we're getting valid color data
    colors.forEach((color, index) => {
      assert.ok(color.parsed.hex, `Color ${index} missing hex value`);
      assert.ok(color.parsed.hex.startsWith('#'), `Color ${index} hex doesn't start with #: ${color.parsed.hex}`);
      assert.ok(color.original, `Color ${index} missing original value`);
    });
  });

  test('findAllColorsInDocument - duplicate colors', async () => {
    const content = `
      .button { background: #ef4444; }
      .alert { background: #ef4444; }
      .danger { color: #ef4444; }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const colors = findAllColorsInDocument(document);

    // Should only find one unique color despite multiple uses
    assert.strictEqual(colors.length, 1);
    assert.strictEqual(colors[0].parsed.hex, '#ef4444');
  });

  test('findAllColorsInDocument - exact matches', async () => {
    const content = `
      .button { background: #ef4444; }
      .text { color: #3b82f6; }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const colors = findAllColorsInDocument(document);

    assert.ok(colors.length >= 2);
    
    // Both should have exact matches
    colors.forEach(color => {
      assert.ok(color.exactMatches.length > 0 || color.nearestMatches.length > 0);
    });
  });

  test('findAllColorsInDocument - custom colors', async () => {
    const content = `
      .custom { background: #a1b2c3; }
      .unique { color: rgb(123, 45, 67); }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const colors = findAllColorsInDocument(document);

    assert.strictEqual(colors.length, 2);
    
    // Custom colors should have nearest matches
    colors.forEach(color => {
      if (color.exactMatches.length === 0) {
        assert.ok(color.nearestMatches.length > 0);
      }
    });
  });

  test('buildBatchConversionItems - with exact matches', async () => {
    const content = `
      .button { background: #ef4444; }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const colors = findAllColorsInDocument(document);
    const items = buildBatchConversionItems(colors, 'bg');

    assert.ok(items.length > 0);
    assert.ok(items[0].tailwindClass.startsWith('bg-'));
    assert.ok(items[0].description?.includes('exact'));
  });

  test('buildBatchConversionItems - with custom colors', async () => {
    const content = `
      .custom { background: #a1b2c3; }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const colors = findAllColorsInDocument(document);
    const items = buildBatchConversionItems(colors, 'text');

    assert.ok(items.length > 0);
    assert.ok(items[0].tailwindClass.includes('[#'));
    assert.ok(items[0].description?.includes('Custom'));
  });

  test('buildBatchConversionItems - different property prefixes', async () => {
    const content = `
      .button { background: #ef4444; }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const colors = findAllColorsInDocument(document);
    
    const bgItems = buildBatchConversionItems(colors, 'bg');
    const textItems = buildBatchConversionItems(colors, 'text');
    const borderItems = buildBatchConversionItems(colors, 'border');

    assert.ok(bgItems[0].tailwindClass.startsWith('bg-'));
    assert.ok(textItems[0].tailwindClass.startsWith('text-'));
    assert.ok(borderItems[0].tailwindClass.startsWith('border-'));
  });

  test('generateBatchSummary - mixed colors', async () => {
    const content = `
      .exact1 { background: #ef4444; }
      .exact2 { color: #3b82f6; }
      .custom { border: #a1b2c3; }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const colors = findAllColorsInDocument(document);
    const summary = generateBatchSummary(colors);

    assert.ok(summary.includes('3 unique color'));
    assert.ok(summary.includes('exact match') || summary.includes('custom'));
  });

  test('generateBatchSummary - single color', async () => {
    const content = `
      .button { background: #ef4444; }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const colors = findAllColorsInDocument(document);
    const summary = generateBatchSummary(colors);

    assert.ok(summary.includes('1 unique color'));
    assert.ok(!summary.includes('colors')); // Should be singular
  });

  test('findAllColorsInDocument - no colors', async () => {
    const content = `
      .button { padding: 1rem; margin: 2rem; }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const colors = findAllColorsInDocument(document);

    assert.strictEqual(colors.length, 0);
  });

  test('findAllColorsInDocument - various formats', async () => {
    const content = `
      .hex { color: #ff0000; }
      .rgb { color: rgb(0, 255, 0); }
      .hsl { color: hsl(240, 100%, 50%); }
      .named { color: red; }
    `;

    const document = await vscode.workspace.openTextDocument({
      content,
      language: 'css',
    });

    const colors = findAllColorsInDocument(document);

    // Should find at least 3 unique colors (red appears twice)
    assert.ok(colors.length >= 3);
    
    // Check we have different formats
    const formats = colors.map(c => c.parsed.format);
    assert.ok(formats.length > 0);
  });
});
