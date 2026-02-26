import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import type { CommentData } from './types.js';

export type CommentsStore = Record<string, CommentData>;

function getCommentsPath(cwd: string): string {
  return resolve(cwd, '.design-qa', 'comments.json');
}

export function readComments(cwd: string): CommentsStore {
  const filePath = getCommentsPath(cwd);
  if (!existsSync(filePath)) {
    return {};
  }
  try {
    const raw = readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as CommentsStore;
  } catch {
    return {};
  }
}

export function writeComments(cwd: string, data: CommentsStore): void {
  const filePath = getCommentsPath(cwd);
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
