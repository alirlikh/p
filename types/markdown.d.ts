declare module 'react-markdown' {
  export interface ReactMarkdownProps {
    children: string;
    components?: Record<string, React.ComponentType<any>>; // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  export default function ReactMarkdown(props: ReactMarkdownProps): JSX.Element;
}

declare module 'react-syntax-highlighter' {
  export const Prism: any;
}

declare module 'react-syntax-highlighter/dist/cjs/styles/prism' {
  export const vscDarkPlus: unknown;
}
