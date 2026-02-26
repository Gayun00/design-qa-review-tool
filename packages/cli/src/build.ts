import { build as viteBuild } from 'vite';
import { resolve } from 'node:path';
import { createViteConfig } from './vite-config.js';
import { loadConfig } from '@design-qa/core';

export interface BuildOptions {
  outDir: string;
}

export async function build(cwd: string, options: BuildOptions) {
  const qaConfig = await loadConfig(cwd);
  const viteConfig = await createViteConfig(cwd, qaConfig, { mode: 'build' });

  console.log('Design QA 정적 빌드 중...\n');

  await viteBuild({
    ...viteConfig,
    build: {
      outDir: resolve(cwd, options.outDir),
      emptyOutDir: true,
    },
  });

  console.log(`\n빌드 완료! ${options.outDir}/ 디렉토리를 배포하세요.`);
}
