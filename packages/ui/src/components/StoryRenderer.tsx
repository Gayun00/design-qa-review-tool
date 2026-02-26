import { Component, type ReactNode } from 'react';

interface StoryRendererProps {
  component: React.ComponentType<Record<string, unknown>>;
  args: Record<string, unknown>;
  render?: (args: Record<string, unknown>) => ReactNode;
}

export function StoryRenderer({ component: Comp, args, render }: StoryRendererProps) {
  return (
    <ErrorBoundary>
      <div className="border border-gray-200 rounded-lg p-4 bg-white">
        {render ? render(args) : <Comp {...args} />}
      </div>
    </ErrorBoundary>
  );
}

interface ErrorBoundaryState {
  error: string | null;
}

class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(err: Error) {
    return { error: err.message };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="border border-red-200 rounded-lg p-4 bg-red-50 text-sm text-red-700">
          렌더링 에러: {this.state.error}
        </div>
      );
    }
    return this.props.children;
  }
}
