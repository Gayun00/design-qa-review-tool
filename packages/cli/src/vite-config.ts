import { resolve, dirname } from 'node:path';
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import type { InlineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import type { QAConfig } from '@design-qa/core';
import { resolveConfig, readComments, writeComments } from '@design-qa/core';
import type { CommentsStore } from '@design-qa/core';

const require = createRequire(import.meta.url);

export interface ViteConfigOptions {
  mode: 'dev' | 'build';
}

export async function createViteConfig(
  cwd: string,
  qaConfig: QAConfig,
  options: ViteConfigOptions = { mode: 'dev' },
): Promise<InlineConfig> {
  const tsconfigPath = resolve(cwd, qaConfig.host.tsconfig);
  const hostAliases = parseTsConfigPaths(tsconfigPath, cwd);

  // config의 상대 경로를 절대 경로로 변환
  const resolved = resolveConfig(qaConfig, cwd);

  // @design-qa/ui 패키지의 index.html 위치를 root로 사용
  // createRequire를 사용하여 monorepo에서도 정확한 패키지 위치를 찾음
  const uiRoot = dirname(require.resolve('@design-qa/ui/package.json'));

  // 호스트 프로젝트의 글로벌 CSS 경로 (절대 경로로 변환)
  const hostGlobalCss = qaConfig.host.globalCss
    ? resolve(cwd, qaConfig.host.globalCss)
    : null;

  const plugins: Plugin[] = [
    ...react() as Plugin[],
    ...tailwindcss() as Plugin[],
    hostCssPlugin(hostGlobalCss),
    configPlugin(resolved, cwd, options.mode),
  ];

  // dev 모드에서만 코멘트 API 미들웨어 추가
  if (options.mode === 'dev') {
    plugins.push(commentsApiPlugin(cwd));
  }

  // 호스트 프로젝트의 tsconfig path alias를 resolveId 플러그인으로 처리
  // resolve.alias 대신 플러그인을 사용하는 이유:
  // Vite root 외부 파일(/@fs/)에서의 alias 해석이 더 안정적
  if (Object.keys(hostAliases).length > 0) {
    plugins.push(hostAliasPlugin(hostAliases));
  }

  return {
    root: uiRoot,
    plugins,
  };
}

/**
 * Virtual module plugin: QA config, cwd, mode를 UI에 주입한다.
 * UI에서 `import { config, cwd, mode } from 'virtual:design-qa-config'`로 사용.
 */
function configPlugin(
  resolved: QAConfig,
  cwd: string,
  mode: string,
): Plugin {
  const virtualId = 'virtual:design-qa-config';
  const resolvedVirtualId = '\0' + virtualId;

  return {
    name: 'design-qa-config',
    resolveId(id) {
      if (id === virtualId) return resolvedVirtualId;
    },
    load(id) {
      if (id === resolvedVirtualId) {
        return `
export const config = ${JSON.stringify(resolved)};
export const cwd = ${JSON.stringify(cwd)};
export const mode = ${JSON.stringify(mode)};
`;
      }
    },
  };
}

/**
 * Virtual module plugin: 호스트 프로젝트의 글로벌 CSS를 주입한다.
 * UI의 main.tsx에서 `import 'virtual:host-css'`로 import하면,
 * 이 플러그인이 호스트의 CSS 파일을 로드한다.
 */
function hostCssPlugin(cssPath: string | null): Plugin {
  const virtualId = 'virtual:host-css';
  const resolvedVirtualId = '\0' + virtualId;

  return {
    name: 'design-qa-host-css',
    resolveId(id) {
      if (id === virtualId) return resolvedVirtualId;
    },
    load(id) {
      if (id === resolvedVirtualId) {
        if (cssPath) {
          return `import '${cssPath}';`;
        }
        return '/* no host CSS configured */';
      }
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

/**
 * 호스트 프로젝트의 tsconfig path aliases를 resolveId 플러그인으로 처리한다.
 * resolve.alias 대신 사용하여 /@fs/ 경유 파일에서도 안정적으로 alias 해석.
 */
function hostAliasPlugin(aliases: Record<string, string>): Plugin {
  const extensions = ['.ts', '.tsx', '.js', '.jsx', ''];
  const indexFiles = extensions.map((ext) => `/index${ext}`);

  function tryResolve(base: string): string | null {
    // 직접 파일이 존재하는 경우 (확장자 포함)
    for (const ext of extensions) {
      const candidate = base + ext;
      try {
        const stat = statSync(candidate);
        if (stat.isFile()) return candidate;
      } catch { /* not found */ }
    }
    // 디렉토리인 경우 index 파일 탐색
    for (const idx of indexFiles) {
      const candidate = base + idx;
      try {
        const stat = statSync(candidate);
        if (stat.isFile()) return candidate;
      } catch { /* not found */ }
    }
    return null;
  }

  return {
    name: 'design-qa-host-alias',
    enforce: 'pre',
    resolveId(source) {
      for (const [prefix, target] of Object.entries(aliases)) {
        if (source.startsWith(prefix)) {
          const rest = source.slice(prefix.length);
          const base = resolve(target, rest);
          const found = tryResolve(base);
          if (found) return found;
        }
      }
    },
  };
}

/**
 * JSON 문자열에서 주석을 제거한다. 문자열 리터럴 내부의 // /* 는 건드리지 않는다.
 */
function stripJsonComments(raw: string): string {
  let result = '';
  let i = 0;
  while (i < raw.length) {
    // 문자열 리터럴
    if (raw[i] === '"') {
      let j = i + 1;
      while (j < raw.length && raw[j] !== '"') {
        if (raw[j] === '\\') j++; // escape
        j++;
      }
      result += raw.slice(i, j + 1);
      i = j + 1;
    }
    // 한 줄 주석
    else if (raw[i] === '/' && raw[i + 1] === '/') {
      let j = i + 2;
      while (j < raw.length && raw[j] !== '\n') j++;
      i = j;
    }
    // 여러 줄 주석
    else if (raw[i] === '/' && raw[i + 1] === '*') {
      let j = i + 2;
      while (j < raw.length - 1 && !(raw[j] === '*' && raw[j + 1] === '/')) j++;
      i = j + 2;
    }
    // 그 외
    else {
      result += raw[i];
      i++;
    }
  }
  return result;
}

function parseTsConfigPaths(
  tsconfigPath: string,
  cwd: string,
): Record<string, string> {
  try {
    const raw = readFileSync(tsconfigPath, 'utf-8');
    // strip JSON comments while respecting string literals
    const cleaned = stripJsonComments(raw);
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
