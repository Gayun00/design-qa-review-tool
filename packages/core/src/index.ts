export type {
  QAConfig,
  HostConfig,
  ReviewItem,
  ChildComponentUsage,
  Usage,
  CommentData,
  Comment,
} from './types.js';

export { loadConfig, resolveConfig } from './config.js';
export { readComments, writeComments } from './comments.js';
export type { CommentsStore } from './comments.js';
