import { useState, useEffect, useCallback, useRef } from 'react';
import type { ReviewItem } from '@design-qa/core';
import { Sidebar } from './components/Sidebar.js';
import { ReviewPanel } from './components/ReviewPanel.js';
import { fetchComments, saveComments } from './api/comments.js';
import type { CommentsStore } from './types.js';

const config = __DESIGN_QA_CONFIG__;

export function App() {
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(
    config.reviews[0] ?? null,
  );
  const [comments, setComments] = useState<CommentsStore>({});
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // 초기 로드: 저장된 코멘트 복원
  useEffect(() => {
    fetchComments().then(setComments).catch(console.error);
  }, []);

  // 코멘트 변경 시 debounce 저장
  const handleCommentsChange = useCallback((updated: CommentsStore) => {
    setComments(updated);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveComments(updated).catch(console.error);
    }, 500);
  }, []);

  // accepted 카운트 계산
  const totalStories = config.reviews.reduce((sum, r) => {
    // stories가 지정된 경우 그 개수, 아니면 일단 1로 카운트 (실제로는 로드 후에야 알 수 있음)
    return sum + (r.stories?.length ?? 1);
  }, 0);
  const acceptedCount = Object.values(comments).filter(
    (c) => c.status === 'accepted',
  ).length;

  return (
    <div className="flex h-screen">
      <Sidebar
        reviews={config.reviews}
        selected={selectedReview}
        onSelect={setSelectedReview}
        acceptedCount={acceptedCount}
        totalStories={totalStories}
        comments={comments}
      />
      <main className="flex-1 overflow-y-auto">
        {selectedReview ? (
          <ReviewPanel
            review={selectedReview}
            comments={comments}
            onCommentsChange={handleCommentsChange}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            리뷰 대상을 선택하세요
          </div>
        )}
      </main>
    </div>
  );
}
