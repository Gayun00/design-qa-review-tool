export interface QAConfig {
  host: HostConfig;
  reviews: ReviewItem[];
}

export interface HostConfig {
  /** 호스트 프로젝트의 tailwind config 경로 (v3) 또는 생략 (v4) */
  tailwindConfig?: string;
  /** 호스트 프로젝트의 tsconfig 경로 */
  tsconfig: string;
  /** 호스트 프로젝트의 글로벌 CSS 경로 — @theme 등 Tailwind v4 토큰 포함 */
  globalCss?: string;
  /** 글로벌 decorator (선택) — 스토리북의 preview.tsx에 해당 */
  globalDecorator?: string;
}

export interface ReviewItem {
  /** 표시 이름 */
  name: string;
  /** 스토리 파일 경로 */
  storyPath: string;
  /** 사용할 스토리 이름 목록 (생략 시 전체) */
  stories?: string[];
  /** 피그마 링크 (선택) */
  figmaUrl?: string;
  /** 하위 컴포넌트 사용 정보 (선택) */
  childComponents?: ChildComponentUsage[];
}

export interface ChildComponentUsage {
  /** 하위 컴포넌트 이름 */
  name: string;
  /** 하위 컴포넌트 파일 경로 */
  componentPath: string;
  /** 스토리별 사용 정보 */
  usages: Usage[];
}

export interface Usage {
  /** 어느 스토리에서 사용하는지 */
  story: string;
  /** 전달되는 props */
  props: Record<string, unknown>;
  /** 부가 설명 (선택) */
  label?: string;
}

export interface CommentData {
  status: 'pending' | 'accepted' | 'comment';
  comments: Comment[];
}

export interface Comment {
  author: string;
  text: string;
  timestamp: string;
  resolved?: boolean;
}
