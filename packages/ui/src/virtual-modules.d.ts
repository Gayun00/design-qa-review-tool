declare module 'virtual:design-qa-config' {
  import type { QAConfig } from '@design-qa/core';
  export const config: QAConfig;
  export const cwd: string;
  export const mode: 'dev' | 'build';
}

declare module 'virtual:host-css' {
  // CSS side-effect import
}
