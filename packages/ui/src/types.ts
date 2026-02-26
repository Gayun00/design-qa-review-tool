import type { QAConfig, CommentData } from '@design-qa/core';

declare global {
  const __DESIGN_QA_CONFIG__: QAConfig;
  const __DESIGN_QA_CWD__: string;
}

export type ReviewStatus = CommentData['status'];
