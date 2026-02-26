import { useEffect, useState } from 'react';
import type { ReviewItem } from '@design-qa/core';
import { StoryRenderer } from './StoryRenderer.js';
import { ChildComponentPanel } from './ChildComponentPanel.js';
import { CommentThread } from './CommentThread.js';
import type { CommentsStore } from '../types.js';

interface ReviewPanelProps {
  review: ReviewItem;
  comments: CommentsStore;
  onCommentsChange: (comments: CommentsStore) => void;
}

export interface StoryEntry {
  name: string;
  component: React.ComponentType<Record<string, unknown>>;
  args: Record<string, unknown>;
  render?: (args: Record<string, unknown>) => React.ReactNode;
}

export function ReviewPanel({ review, comments, onCommentsChange }: ReviewPanelProps) {
  const [stories, setStories] = useState<StoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    loadStories(review)
      .then(setStories)
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, [review.storyPath]);

  return (
    <div className="max-w-4xl mx-auto px-8 py-6">
      <header className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{review.name}</h2>
        {review.figmaUrl && (
          <a
            href={review.figmaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            Figma &#8599;
          </a>
        )}
      </header>

      {loading && (
        <p className="text-gray-400 text-sm">스토리 로딩 중...</p>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          스토리 로딩 실패: {error}
        </div>
      )}

      {!loading &&
        !error &&
        stories.map((story) => (
          <section key={story.name} className="mb-10">
            <h3 className="text-sm font-medium text-gray-500 mb-3 border-b border-gray-200 pb-2">
              Story: &ldquo;{story.name}&rdquo;
            </h3>

            <StoryRenderer
              component={story.component}
              args={story.args}
              render={story.render}
            />

            {/* 하위 컴포넌트 패널 */}
            {review.childComponents
              ?.filter((child) =>
                child.usages.some((u) => u.story === story.name),
              )
              .map((child) => (
                <ChildComponentPanel
                  key={`${story.name}-${child.name}`}
                  childComponent={child}
                  storyName={story.name}
                />
              ))}

            <CommentThread
              reviewName={review.name}
              storyName={story.name}
              comments={comments}
              onCommentsChange={onCommentsChange}
            />
          </section>
        ))}
    </div>
  );
}

async function loadStories(review: ReviewItem): Promise<StoryEntry[]> {
  const mod = await import(/* @vite-ignore */ review.storyPath);
  const meta = mod.default;

  if (!meta?.component) {
    throw new Error(
      `스토리 파일에 default export (meta.component)가 없습니다: ${review.storyPath}`,
    );
  }

  const component = meta.component;
  const entries: StoryEntry[] = [];

  for (const [key, value] of Object.entries(mod)) {
    if (key === 'default') continue;
    if (review.stories && !review.stories.includes(key)) continue;

    const story = value as {
      args?: Record<string, unknown>;
      render?: (args: Record<string, unknown>) => React.ReactNode;
    };
    entries.push({
      name: key,
      component,
      args: story.args ?? {},
      render: story.render,
    });
  }

  return entries;
}
