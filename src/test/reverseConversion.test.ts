/**
 * Unit Tests for Reverse Conversion
 */

import * as assert from 'assert';
import {
  lookupTailwindClass,
  findTailwindClassesInText,
  getPropertyName,
} from '../reverseConversion';

suite('Reverse Conversion Tests', () => {
  test('lookupTailwindClass - exact match', () => {
    const result = lookupTailwindClass('bg-red-500');
    
    assert.ok(result);
    assert.strictEqual(result.color.hex, '#ef4444');
    assert.strictEqual(result.color.className, 'red-500');
    assert.strictEqual(result.color.colorName, 'Red');
    assert.strictEqual(result.color.shade, '500');
    assert.deepStrictEqual(result.properties, ['bg']);
  });

  test('lookupTailwindClass - text color', () => {
    const result = lookupTailwindClass('text-blue-600');
    
    assert.ok(result);
    assert.strictEqual(result.color.className, 'blue-600');
    assert.deepStrictEqual(result.properties, ['text']);
  });

  test('lookupTailwindClass - border color', () => {
    const result = lookupTailwindClass('border-green-400');
    
    assert.ok(result);
    assert.strictEqual(result.color.className, 'green-400');
    assert.deepStrictEqual(result.properties, ['border']);
  });

  test('lookupTailwindClass - arbitrary value', () => {
    const result = lookupTailwindClass('bg-[#ff0000]');
    
    assert.ok(result);
    assert.strictEqual(result.color.hex, '#ff0000');
    assert.strictEqual(result.color.colorName, 'Custom');
    assert.deepStrictEqual(result.properties, ['bg']);
  });

  test('lookupTailwindClass - invalid class', () => {
    const result = lookupTailwindClass('bg-invalid-500');
    
    assert.strictEqual(result, null);
  });

  test('lookupTailwindClass - not a tailwind class', () => {
    const result = lookupTailwindClass('some-other-class');
    
    assert.strictEqual(result, null);
  });

  test('findTailwindClassesInText - single class', () => {
    const text = 'class="bg-red-500 p-4"';
    const results = findTailwindClassesInText(text);
    
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].match, 'bg-red-500');
    assert.ok(results[0].result);
    assert.strictEqual(results[0].result.color.className, 'red-500');
  });

  test('findTailwindClassesInText - multiple classes', () => {
    const text = 'class="bg-red-500 text-blue-600 border-green-400"';
    const results = findTailwindClassesInText(text);
    
    assert.strictEqual(results.length, 3);
    assert.strictEqual(results[0].match, 'bg-red-500');
    assert.strictEqual(results[1].match, 'text-blue-600');
    assert.strictEqual(results[2].match, 'border-green-400');
  });

  test('findTailwindClassesInText - arbitrary values', () => {
    const text = 'class="bg-[#ff0000] text-[#00ff00]"';
    const results = findTailwindClassesInText(text);
    
    assert.strictEqual(results.length, 2);
    assert.strictEqual(results[0].match, 'bg-[#ff0000]');
    assert.strictEqual(results[1].match, 'text-[#00ff00]');
  });

  test('findTailwindClassesInText - no matches', () => {
    const text = 'class="p-4 m-2 flex"';
    const results = findTailwindClassesInText(text);
    
    assert.strictEqual(results.length, 0);
  });

  test('getPropertyName - bg', () => {
    assert.strictEqual(getPropertyName('bg'), 'Background');
  });

  test('getPropertyName - text', () => {
    assert.strictEqual(getPropertyName('text'), 'Text');
  });

  test('getPropertyName - border', () => {
    assert.strictEqual(getPropertyName('border'), 'Border');
  });

  test('getPropertyName - ring', () => {
    assert.strictEqual(getPropertyName('ring'), 'Ring');
  });

  test('getPropertyName - unknown', () => {
    assert.strictEqual(getPropertyName('unknown'), 'unknown');
  });

  test('findTailwindClassesInText - mixed with non-color classes', () => {
    const text = 'class="flex items-center bg-red-500 p-4 text-white hover:bg-red-600"';
    const results = findTailwindClassesInText(text);
    
    // Should find bg-red-500, text-white, and bg-red-600
    assert.ok(results.length >= 2); // At least bg-red-500 and bg-red-600
  });

  test('lookupTailwindClass - gradient colors', () => {
    const result = lookupTailwindClass('from-purple-500');
    
    assert.ok(result);
    assert.strictEqual(result.color.className, 'purple-500');
    assert.deepStrictEqual(result.properties, ['from']);
  });

  test('lookupTailwindClass - ring color', () => {
    const result = lookupTailwindClass('ring-blue-400');
    
    assert.ok(result);
    assert.strictEqual(result.color.className, 'blue-400');
    assert.deepStrictEqual(result.properties, ['ring']);
  });

  test('lookupTailwindClass - stroke and fill', () => {
    const strokeResult = lookupTailwindClass('stroke-red-500');
    const fillResult = lookupTailwindClass('fill-blue-500');
    
    assert.ok(strokeResult);
    assert.ok(fillResult);
    assert.deepStrictEqual(strokeResult.properties, ['stroke']);
    assert.deepStrictEqual(fillResult.properties, ['fill']);
  });
});
