import { resolve, dirname } from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { InlineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import type { QAConfig } from '@design-qa/core';
import { resolveConfig, readComments, writeComments } from '@design-qa/core';
import type { CommentsStore } from '@design-qa/core';

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface ViteConfigOptions {
  mode: 'dev' | 'build';
}

export async function createViteConfig(
  cwd: string,
  qaConfig: QAConfig,
  options: ViteConfigOptions = { mode: 'dev' },
): Promise<InlineConfig> {
  const hostAliases = parseTsConfigPaths(
    resolve(cwd, qaConfig.host.tsconfig),
    cwd,
  );

  // config의 상대 경로를 절대 경로로 변환
  const resolved = resolveConfig(qaConfig, cwd);

  // @design-qa/ui 패키지의 index.html 위치를 root로 사용
  const uiRoot = resolve(__dirname, '../../ui');

  const plugins: Plugin[] = [
    ...react() as Plugin[],
    ...tailwindcss() as Plugin[],
  ];

  // dev 모드에서만 코멘트 API 미들웨어 추가
  if (options.mode === 'dev') {
    plugins.push(commentsApiPlugin(cwd));
  }

  return {
    root: uiRoot,
    plugins,
    resolve: {
      alias: {
        ...hostAliases,
      },
    },
    define: {
      __DESIGN_QA_CONFIG__: JSON.stringify(resolved),
      __DESIGN_QA_CWD__: JSON.stringify(cwd),
      __DESIGN_QA_MODE__: JSON.stringify(options.mode),
    },
  };
}

/**
 * Vite dev server 미들웨어: /api/comments 엔드포인트
 * GET  /api/comments → 전체 코멘트 반환
 * POST /api/comments → 코멘트 저장
 */
function commentsApiPlugin(cwd: string): Plugin {
  return {
    name: 'design-qa-comments-api',
    configureServer(server) {
      server.middlewares.use('/api/comments', (req, res) => {
        res.setHeader('Content-Type', 'application/json');

        if (req.method === 'GET') {
          const data = readComments(cwd);
          res.end(JSON.stringify(data));
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const incoming = JSON.parse(body) as CommentsStore;
              writeComments(cwd, incoming);
              res.end(JSON.stringify({ ok: true }));
            } catch {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
          return;
        }

        res.statusCode = 405;
        res.end(JSON.stringify({ error: 'Method not allowed' }));
      });
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
