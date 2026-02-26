import { useState } from 'react';
import type { ReviewStatus, CommentsStore } from '../types.js';
import type { CommentData, Comment as QAComment } from '@design-qa/core';

interface CommentThreadProps {
  reviewName: string;
  storyName: string;
  comments: CommentsStore;
  onCommentsChange: (comments: CommentsStore) => void;
}

export function CommentThread({
  reviewName,
  storyName,
  comments,
  onCommentsChange,
}: CommentThreadProps) {
  const [draft, setDraft] = useState('');
  const [showInput, setShowInput] = useState(false);

  const key = `${reviewName}/${storyName}`;
  const data: CommentData = comments[key] ?? {
    status: 'pending',
    comments: [],
  };
  const status: ReviewStatus = data.status;
  const threadComments = data.comments;

  const update = (patch: Partial<CommentData>) => {
    const updated: CommentsStore = {
      ...comments,
      [key]: { ...data, ...patch },
    };
    onCommentsChange(updated);
  };

  const handleAccept = () => {
    update({ status: 'accepted' });
  };

  const handleAddComment = () => {
    if (!draft.trim()) return;
    const newComment: QAComment = {
      author: 'Reviewer',
      text: draft.trim(),
      timestamp: new Date().toISOString(),
    };
    update({
      status: 'comment',
      comments: [...threadComments, newComment],
    });
    setDraft('');
    setShowInput(false);
  };

  return (
    <div className="mt-3 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          onClick={handleAccept}
          className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
            status === 'accepted'
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-gray-100 text-gray-600 hover:bg-green-50 border border-gray-200'
          }`}
        >
          {status === 'accepted' ? 'Accepted' : 'Accept'}
        </button>
        <button
          onClick={() => setShowInput(!showInput)}
          className="px-3 py-1.5 text-xs rounded-md font-medium bg-gray-100 text-gray-600 hover:bg-yellow-50 border border-gray-200 transition-colors"
        >
          Comment
        </button>
        {status === 'comment' && (
          <span className="text-xs text-yellow-600">
            {threadComments.length}개 코멘트
          </span>
        )}
      </div>

      {threadComments.map((c, i) => (
        <div
          key={i}
          className="bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2 text-sm"
        >
          <p className="text-gray-800">{c.text}</p>
          <p className="text-xs text-gray-400 mt-1">
            {c.author} &middot;{' '}
            {new Date(c.timestamp).toLocaleString('ko-KR')}
          </p>
        </div>
      ))}

      {showInput && (
        <div className="flex gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
            placeholder="코멘트 입력..."
            className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-400"
          />
          <button
            onClick={handleAddComment}
            className="px-3 py-1.5 text-xs rounded-md font-medium bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            등록
          </button>
        </div>
      )}
    </div>
  );
}
