import { useState } from 'react';
import type { ReviewItem } from '@design-qa/core';
import { Sidebar } from './components/Sidebar.js';
import { ReviewPanel } from './components/ReviewPanel.js';

const config = __DESIGN_QA_CONFIG__;

export function App() {
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(
    config.reviews[0] ?? null,
  );

  return (
    <div className="flex h-screen">
      <Sidebar
        reviews={config.reviews}
        selected={selectedReview}
        onSelect={setSelectedReview}
      />
      <main className="flex-1 overflow-y-auto">
        {selectedReview ? (
          <ReviewPanel review={selectedReview} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            리뷰 대상을 선택하세요
          </div>
        )}
      </main>
    </div>
  );
}
