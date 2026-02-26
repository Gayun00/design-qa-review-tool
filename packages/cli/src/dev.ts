import { createServer } from 'vite';
import { createViteConfig } from './vite-config.js';
import { loadConfig } from '@design-qa/core';

export interface DevOptions {
  port: number;
}

export async function dev(cwd: string, options: DevOptions) {
  const qaConfig = await loadConfig(cwd);
  const viteConfig = await createViteConfig(cwd, qaConfig);

  const server = await createServer({
    ...viteConfig,
    server: {
      port: options.port,
      open: true,
    },
  });

  await server.listen();

  console.log(`\n  Design QA dev server running at:`);
  console.log(`  http://localhost:${options.port}\n`);
}
