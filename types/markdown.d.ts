declare module 'react-markdown' {
  import { ReactNode } from 'react';

  export interface ReactMarkdownProps {
    children: string;
    components?: Record<string, any>;
  }

  export default function ReactMarkdown(props: ReactMarkdownProps): JSX.Element;
}

declare module 'react-syntax-highlighter' {
  export const Prism: any;
}

declare module 'react-syntax-highlighter/dist/cjs/styles/prism' {
  export const vscDarkPlus: any;
}
