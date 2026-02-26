import type { ReviewItem } from '@design-qa/core';

interface SidebarProps {
  reviews: ReviewItem[];
  selected: ReviewItem | null;
  onSelect: (review: ReviewItem) => void;
}

export function Sidebar({ reviews, selected, onSelect }: SidebarProps) {
  return (
    <aside className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200">
        <h1 className="text-sm font-semibold text-gray-900">
          Design QA Review
        </h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {reviews.map((review) => (
          <button
            key={review.name}
            onClick={() => onSelect(review)}
            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
              selected?.name === review.name
                ? 'bg-blue-50 text-blue-700 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {review.name}
            {review.childComponents && review.childComponents.length > 0 && (
              <span className="ml-1 text-xs text-gray-400">
                +{review.childComponents.length}
              </span>
            )}
          </button>
        ))}
        {reviews.length === 0 && (
          <p className="px-4 py-2 text-sm text-gray-400">
            리뷰 대상이 없습니다
          </p>
        )}
      </nav>
    </aside>
  );
}
