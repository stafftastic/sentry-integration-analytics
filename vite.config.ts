import { resolve } from 'path';

import { type UserConfig, defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  const config: UserConfig = {
    plugins: [dts()],
  };

  if (isBuild) {
    config.build = {
      lib: {
        entry: resolve(__dirname, './src/index.ts'),
        name: '@stafftastic/sentry-integration-analytics',
        formats: ['es'],
        fileName: (format) => `sentry-integration-analytics.${format}.js`,
      },
    };
  }

  return config;
});
