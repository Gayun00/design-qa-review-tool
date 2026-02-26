import { pathToFileURL } from 'node:url';
import { resolve, dirname, join } from 'node:path';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import type { QAConfig, ReviewItem, ChildComponentUsage } from './types.js';

export async function loadConfig(cwd: string): Promise<QAConfig> {
  const configPath = resolve(cwd, 'design-qa.config.ts');

  if (!existsSync(configPath)) {
    throw new Error(
      `design-qa.config.ts를 찾을 수 없습니다. "npx design-qa init"을 먼저 실행하세요.`,
    );
  }

  // esbuild로 .ts → .mjs 변환 후 dynamic import
  // esbuild는 Vite의 의존성이므로 별도 설치 불필요
  const { build } = await import('esbuild');
  const tmpPath = join(dirname(configPath), '.design-qa.config.tmp.mjs');

  try {
    await build({
      entryPoints: [configPath],
      outfile: tmpPath,
      bundle: false,
      format: 'esm',
      platform: 'node',
      // type import는 제거됨
      logLevel: 'silent',
    });

    const tmpUrl = pathToFileURL(tmpPath).href;
    const mod = await import(tmpUrl);
    return mod.default as QAConfig;
  } finally {
    // 임시 파일 정리
    try {
      unlinkSync(tmpPath);
    } catch {
      // ignore cleanup errors
    }
  }
}

/**
 * config의 상대 경로를 cwd 기준 절대 경로로 변환한다.
 * Vite가 dynamic import로 스토리/컴포넌트 파일을 resolve하려면 절대 경로가 필요.
 */
export function resolveConfig(config: QAConfig, cwd: string): QAConfig {
  return {
    ...config,
    reviews: config.reviews.map((review): ReviewItem => ({
      ...review,
      storyPath: resolve(cwd, review.storyPath),
      childComponents: review.childComponents?.map(
        (child): ChildComponentUsage => ({
          ...child,
          componentPath: resolve(cwd, child.componentPath),
        }),
      ),
    })),
  };
}
