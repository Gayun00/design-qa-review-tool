import { useState } from 'react';
import type { ReviewStatus } from '../types.js';

interface CommentThreadProps {
  reviewName: string;
  storyName: string;
}

interface LocalComment {
  author: string;
  text: string;
  timestamp: string;
}

export function CommentThread({ reviewName, storyName }: CommentThreadProps) {
  const [status, setStatus] = useState<ReviewStatus>('pending');
  const [comments, setComments] = useState<LocalComment[]>([]);
  const [draft, setDraft] = useState('');
  const [showInput, setShowInput] = useState(false);

  const key = `${reviewName}/${storyName}`;

  const handleAccept = () => {
    setStatus('accepted');
    console.log(`[Design QA] Accepted: ${key}`);
  };

  const handleAddComment = () => {
    if (!draft.trim()) return;
    const newComment: LocalComment = {
      author: 'Reviewer',
      text: draft.trim(),
      timestamp: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
    setStatus('comment');
    setDraft('');
    setShowInput(false);
    console.log(`[Design QA] Comment on ${key}: ${newComment.text}`);
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
            {comments.length}개 코멘트
          </span>
        )}
      </div>

      {comments.map((c, i) => (
        <div
          key={i}
          className="bg-yellow-50 border border-yellow-200 rounded-md px-3 py-2 text-sm"
        >
          <p className="text-gray-800">{c.text}</p>
          <p className="text-xs text-gray-400 mt-1">
            {c.author} &middot; {new Date(c.timestamp).toLocaleString('ko-KR')}
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
