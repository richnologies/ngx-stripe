import { defineConfig } from 'vitest/config';

// The ng add schematic runs in Node inside the Angular CLI, not in the browser: its tests use
// Angular's SchematicTestRunner in a Node environment, apart from the library's jsdom suite.
export default defineConfig({
  test: {
    root: import.meta.dirname,
    environment: 'node',
    include: ['**/*.spec.ts'],
    testTimeout: 30_000
  }
});
