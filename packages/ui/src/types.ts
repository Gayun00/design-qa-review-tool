import type { CommentData } from '@design-qa/core';

export type ReviewStatus = CommentData['status'];

export type CommentsStore = Record<string, CommentData>;
