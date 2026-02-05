/**
 * Test Suite Index
 */

import * as path from "path";
import Mocha from "mocha";

export async function run(): Promise<void> {
  // Create the mocha test
  const mocha = new Mocha({
    ui: "tdd",
    color: true,
    timeout: 10000,
  });

  const testsRoot = path.resolve(__dirname, "..");

  // Import glob dynamically to handle different versions
  let files: string[] = [];

  try {
    // Try new glob API (v10+)
    const { glob } = await import("glob");
    files = await glob("**/**.test.js", { cwd: testsRoot });
  } catch (err) {
    // Fallback to old glob API or manual file discovery
    console.log("Using fallback file discovery");
    const fs = await import("fs");
    const findTests = (dir: string): string[] => {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      let testFiles: string[] = [];

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          testFiles = testFiles.concat(findTests(fullPath));
        } else if (entry.name.endsWith(".test.js")) {
          testFiles.push(path.relative(testsRoot, fullPath));
        }
      }

      return testFiles;
    };

    files = findTests(testsRoot);
  }

  // Add files to the test suite
  files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)));

  return new Promise((resolve, reject) => {
    try {
      // Run the mocha test
      mocha.run((failures) => {
        if (failures > 0) {
          reject(new Error(`${failures} tests failed.`));
        } else {
          resolve();
        }
      });
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
}
