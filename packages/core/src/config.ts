import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import type { QAConfig } from './types.js';

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
