import { resolve, dirname } from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { InlineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import type { QAConfig } from '@design-qa/core';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function createViteConfig(
  cwd: string,
  qaConfig: QAConfig,
): Promise<InlineConfig> {
  const hostAliases = parseTsConfigPaths(
    resolve(cwd, qaConfig.host.tsconfig),
    cwd,
  );

  // @design-qa/ui 패키지의 index.html 위치를 root로 사용
  const uiRoot = resolve(__dirname, '../../ui');

  return {
    root: uiRoot,
    plugins: [react()],
    resolve: {
      alias: {
        ...hostAliases,
      },
    },
    define: {
      __DESIGN_QA_CONFIG__: JSON.stringify(qaConfig),
      __DESIGN_QA_CWD__: JSON.stringify(cwd),
    },
  };
}

function parseTsConfigPaths(
  tsconfigPath: string,
  cwd: string,
): Record<string, string> {
  try {
    const raw = readFileSync(tsconfigPath, 'utf-8');
    // strip JSON comments
    const cleaned = raw.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
    const tsconfig = JSON.parse(cleaned);
    const paths = tsconfig.compilerOptions?.paths;
    if (!paths) return {};

    const baseUrl = tsconfig.compilerOptions?.baseUrl ?? '.';
    const baseDir = resolve(dirname(tsconfigPath), baseUrl);

    const aliases: Record<string, string> = {};
    for (const [key, targets] of Object.entries(paths)) {
      const target = (targets as string[])[0];
      if (!target) continue;

      // '@/*' → '@/' , './src/*' → './src/'
      const aliasKey = key.replace(/\/\*$/, '/');
      const aliasTarget = resolve(baseDir, target.replace(/\/\*$/, '/'));
      aliases[aliasKey] = aliasTarget;
    }

    return aliases;
  } catch {
    return {};
  }
}
