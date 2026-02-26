import type { QAConfig, CommentData } from '@design-qa/core';

declare global {
  const __DESIGN_QA_CONFIG__: QAConfig;
  const __DESIGN_QA_CWD__: string;
  const __DESIGN_QA_MODE__: 'dev' | 'build';
}

export type ReviewStatus = CommentData['status'];

export type CommentsStore = Record<string, CommentData>;
