import { useEffect, useState } from 'react';
import type { ChildComponentUsage } from '@design-qa/core';
import { PropsDisplay } from './PropsDisplay.js';
import { StoryRenderer } from './StoryRenderer.js';

interface ChildComponentPanelProps {
  childComponent: ChildComponentUsage;
  storyName: string;
}

export function ChildComponentPanel({
  childComponent,
  storyName,
}: ChildComponentPanelProps) {
  const [Comp, setComp] = useState<React.ComponentType<
    Record<string, unknown>
  > | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    import(/* @vite-ignore */ childComponent.componentPath)
      .then((mod) => {
        const component = mod.default ?? mod[childComponent.name];
        if (component) {
          setComp(() => component);
        } else {
          setLoadError(
            `"${childComponent.name}" export를 찾을 수 없습니다.`,
          );
        }
      })
      .catch((err) => setLoadError(String(err)));
  }, [childComponent.componentPath, childComponent.name]);

  const usages = childComponent.usages.filter((u) => u.story === storyName);
  if (usages.length === 0) return null;

  return (
    <div className="mt-4 ml-4 border-l-2 border-gray-200 pl-4">
      <h4 className="text-sm font-medium text-gray-600 mb-2">
        &#9656; {childComponent.name}
      </h4>

      {loadError && (
        <p className="text-sm text-red-600">{loadError}</p>
      )}

      {usages.map((usage, i) => (
        <div key={i} className="mb-3">
          {usage.label && (
            <p className="text-xs text-gray-400 mb-1">{usage.label}</p>
          )}
          <PropsDisplay
            componentName={childComponent.name}
            props={usage.props}
          />
          {Comp && (
            <div className="mt-2">
              <StoryRenderer component={Comp} args={usage.props} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
