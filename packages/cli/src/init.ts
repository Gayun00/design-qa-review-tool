import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

export async function init(cwd: string) {
  console.log('Design QA 초기화 중...\n');

  // 1. 프로젝트 설정 감지
  const tailwindConfig = detectFile(cwd, [
    'tailwind.config.ts',
    'tailwind.config.js',
    'tailwind.config.mjs',
  ]);
  const tsconfig = detectFile(cwd, ['tsconfig.json']);
  const globalDecorator = detectFile(cwd, [
    '.storybook/preview.tsx',
    '.storybook/preview.ts',
    '.storybook/preview.jsx',
    '.storybook/preview.js',
  ]);

  if (tailwindConfig) {
    console.log(`  tailwind config 감지: ${tailwindConfig}`);
  }
  if (tsconfig) {
    console.log(`  tsconfig 감지: ${tsconfig}`);
  }
  if (globalDecorator) {
    console.log(`  storybook preview 감지: ${globalDecorator}`);
  }

  // 2. config 파일 생성
  const configPath = resolve(cwd, 'design-qa.config.ts');
  if (existsSync(configPath)) {
    console.log('\n  design-qa.config.ts가 이미 존재합니다. 건너뜁니다.');
  } else {
    const configContent = generateConfig({
      tailwindConfig: tailwindConfig ?? './tailwind.config.ts',
      tsconfig: tsconfig ?? './tsconfig.json',
      globalDecorator,
    });
    writeFileSync(configPath, configContent, 'utf-8');
    console.log('\n  design-qa.config.ts 생성 완료');
  }

  // 3. .design-qa 디렉토리 + comments.json 생성
  const qaDir = resolve(cwd, '.design-qa');
  if (!existsSync(qaDir)) {
    mkdirSync(qaDir, { recursive: true });
  }
  const commentsPath = join(qaDir, 'comments.json');
  if (!existsSync(commentsPath)) {
    writeFileSync(commentsPath, '{}', 'utf-8');
    console.log('  .design-qa/comments.json 생성 완료');
  }

  console.log('\n초기화 완료! design-qa.config.ts에 리뷰 대상을 등록하세요.');
}

function detectFile(cwd: string, candidates: string[]): string | null {
  for (const candidate of candidates) {
    if (existsSync(resolve(cwd, candidate))) {
      return `./${candidate}`;
    }
  }
  return null;
}

function generateConfig(opts: {
  tailwindConfig: string;
  tsconfig: string;
  globalDecorator: string | null;
}): string {
  const globalDecoratorLine = opts.globalDecorator
    ? `\n    globalDecorator: '${opts.globalDecorator}',`
    : '';

  return `import type { QAConfig } from '@design-qa/core';

const config: QAConfig = {
  host: {
    tailwindConfig: '${opts.tailwindConfig}',
    tsconfig: '${opts.tsconfig}',${globalDecoratorLine}
  },
  reviews: [
    // 에이전트가 알려주거나, 직접 추가
    // {
    //   name: 'ComponentName',
    //   storyPath: './src/components/ComponentName/ComponentName.stories.tsx',
    // },
  ],
};

export default config;
`;
}
