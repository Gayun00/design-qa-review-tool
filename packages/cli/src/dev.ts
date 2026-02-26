import { createServer } from 'vite';
import { createViteConfig } from './vite-config.js';
import { loadConfig } from '@design-qa/core';

export interface DevOptions {
  port: number;
}

export async function dev(cwd: string, options: DevOptions) {
  const qaConfig = await loadConfig(cwd);
  const viteConfig = await createViteConfig(cwd, qaConfig, { mode: 'dev' });

  const server = await createServer({
    ...viteConfig,
    server: {
      port: options.port,
      fs: {
        // 호스트 프로젝트 파일에 접근 허용 (root가 packages/ui/ 밖에 있으므로)
        allow: [cwd, viteConfig.root as string],
      },
    },
  });

  await server.listen();

  console.log(`\n  Design QA dev server running at:`);
  console.log(`  http://localhost:${options.port}\n`);
}
