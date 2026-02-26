import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import type { QAConfig, ReviewItem, ChildComponentUsage } from './types.js';

export async function loadConfig(cwd: string): Promise<QAConfig> {
  const configPath = resolve(cwd, 'design-qa.config.ts');
  const configUrl = pathToFileURL(configPath).href;

  try {
    const mod = await import(configUrl);
    return mod.default as QAConfig;
  } catch {
    throw new Error(
      `design-qa.config.ts를 찾을 수 없습니다. "npx design-qa init"을 먼저 실행하세요.`,
    );
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
