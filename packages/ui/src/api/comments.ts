import type { CommentsStore } from '../types.js';

const STORAGE_KEY = 'design-qa-comments';

export async function fetchComments(): Promise<CommentsStore> {
  if (__DESIGN_QA_MODE__ === 'dev') {
    const res = await fetch('/api/comments');
    return res.json();
  }
  // build mode: localStorage fallback
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

export async function saveComments(data: CommentsStore): Promise<void> {
  if (__DESIGN_QA_MODE__ === 'dev') {
    await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return;
  }
  // build mode: localStorage fallback
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
