#!/usr/bin/env node

import { Command } from 'commander';
import { init } from '../src/init.js';
import { dev } from '../src/dev.js';
import { build } from '../src/build.js';

const program = new Command();

program
  .name('design-qa')
  .description('Design QA Review Tool')
  .version('0.1.0');

program
  .command('init')
  .description('프로젝트 초기화 — config 파일 생성 및 설정 감지')
  .action(async () => {
    await init(process.cwd());
  });

program
  .command('dev')
  .description('개발 서버 실행')
  .option('-p, --port <port>', '포트 번호', '6007')
  .action(async (opts) => {
    await dev(process.cwd(), { port: Number(opts.port) });
  });

program
  .command('build')
  .description('정적 빌드 생성')
  .option('-o, --outDir <dir>', '출력 디렉토리', 'design-qa-dist')
  .action(async (opts) => {
    await build(process.cwd(), { outDir: opts.outDir });
  });

program.parse();
