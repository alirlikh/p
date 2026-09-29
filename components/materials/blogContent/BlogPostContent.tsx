'use client';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Image from 'next/image';
import { FC } from 'react';

export interface BlogPostContentProps {
  content: string;
}

const BlogPostContent: FC<BlogPostContentProps> = ({ content }) => {
  return (
    <div className="prose prose-invert prose-purple max-w-none">
      <ReactMarkdown
        components={{
          // Headings
          h1: ({ children }: { children?: React.ReactNode }) => (
            <h1 className="text-4xl md:text-5xl font-bold mt-8 mb-4">{children}</h1>
          ),
          h2: ({ children }: { children?: React.ReactNode }) => (
            <h2 className="text-3xl md:text-4xl font-bold mt-8 mb-4 border-b border-gray-700 pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }: { children?: React.ReactNode }) => (
            <h3 className="text-2xl md:text-3xl font-bold mt-6 mb-3">{children}</h3>
          ),
          h4: ({ children }: { children?: React.ReactNode }) => (
            <h4 className="text-xl md:text-2xl font-bold mt-4 mb-2">{children}</h4>
          ),

          // Paragraphs
          p: ({ children }: { children?: React.ReactNode }) => (
            <p className="text-lg text-gray-300 leading-relaxed mb-4">{children}</p>
          ),

          // Links
          a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-300 hover:brightness-90 underline"
            >
              {children}
            </a>
          ),

          // Code blocks
          code: ({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode; [key: string]: unknown }) => {
            const match = /language-(\\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-lg my-4"
                {...(props as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
              >
                {String(children).replace(/\\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code
                className="bg-gray-800 text-purple-300 px-2 py-1 rounded text-sm font-mono"
                {...(props as any)} // eslint-disable-line @typescript-eslint/no-explicit-any
              >
                {children}
              </code>
            );
          },

          // Lists
          ul: ({ children }: { children?: React.ReactNode }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300">{children}</ul>
          ),
          ol: ({ children }: { children?: React.ReactNode }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-300">{children}</ol>
          ),
          li: ({ children }: { children?: React.ReactNode }) => <li className="ml-4">{children}</li>,

          // Blockquotes
          blockquote: ({ children }: { children?: React.ReactNode }) => (
            <blockquote className="border-l-4 border-purple-300 pl-4 italic my-4 text-gray-400">
              {children}
            </blockquote>
          ),

          // Tables
          table: ({ children }: { children?: React.ReactNode }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-gray-700">{children}</table>
            </div>
          ),
          thead: ({ children }: { children?: React.ReactNode }) => <thead className="bg-gray-800">{children}</thead>,
          tbody: ({ children }: { children?: React.ReactNode }) => <tbody>{children}</tbody>,
          tr: ({ children }: { children?: React.ReactNode }) => <tr className="border-b border-gray-700">{children}</tr>,
          th: ({ children }: { children?: React.ReactNode }) => (
            <th className="px-4 py-2 text-left font-bold text-purple-300">{children}</th>
          ),
          td: ({ children }: { children?: React.ReactNode }) => <td className="px-4 py-2 text-gray-300">{children}</td>,

          // Horizontal rule
          hr: () => <hr className="my-8 border-gray-700" />,

          // Images
          img: ({ src, alt }: { src?: string; alt?: string }) => {
            if (!src) return null;
            return (
              <div className="relative w-full h-96 my-6 rounded-lg overflow-hidden">
                <Image
                  src={src}
                  alt={alt || 'Blog image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default BlogPostContent;
