import type { ReviewItem } from '@design-qa/core';
import type { CommentsStore } from '../types.js';

interface SidebarProps {
  reviews: ReviewItem[];
  selected: ReviewItem | null;
  onSelect: (review: ReviewItem) => void;
  acceptedCount: number;
  totalStories: number;
  comments: CommentsStore;
}

export function Sidebar({
  reviews,
  selected,
  onSelect,
  acceptedCount,
  totalStories,
  comments,
}: SidebarProps) {
  return (
    <aside className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200">
        <h1 className="text-sm font-semibold text-gray-900">
          Design QA Review
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          {acceptedCount}/{totalStories} accepted
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {reviews.map((review) => {
          const reviewStatus = getReviewStatus(review, comments);
          return (
            <button
              key={review.name}
              onClick={() => onSelect(review)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                selected?.name === review.name
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    reviewStatus === 'accepted'
                      ? 'bg-green-400'
                      : reviewStatus === 'comment'
                        ? 'bg-yellow-400'
                        : 'bg-gray-300'
                  }`}
                />
                {review.name}
              </span>
              {review.childComponents && review.childComponents.length > 0 && (
                <span className="ml-1 text-xs text-gray-400">
                  +{review.childComponents.length}
                </span>
              )}
            </button>
          );
        })}
        {reviews.length === 0 && (
          <p className="px-4 py-2 text-sm text-gray-400">
            리뷰 대상이 없습니다
          </p>
        )}
      </nav>
    </aside>
  );
}

function getReviewStatus(
  review: ReviewItem,
  comments: CommentsStore,
): 'pending' | 'accepted' | 'comment' {
  const stories = review.stories ?? ['Default'];
  let hasComment = false;
  let allAccepted = true;

  for (const story of stories) {
    const key = `${review.name}/${story}`;
    const data = comments[key];
    if (!data || data.status === 'pending') {
      allAccepted = false;
    } else if (data.status === 'comment') {
      hasComment = true;
      allAccepted = false;
    }
  }

  if (allAccepted && stories.length > 0) return 'accepted';
  if (hasComment) return 'comment';
  return 'pending';
}
