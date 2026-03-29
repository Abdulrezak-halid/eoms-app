/**
 * @file: CMarkdown.tsx
 * @author: H.Alper Tuna <halpertuna@gmail.com>
 * Date: 31.03.2025
 * Last Modified Date: 31.03.2025
 * Last Modified By: H.Alper Tuna <halpertuna@gmail.com>
 */
import { PropsWithChildren } from "react";
import Markdown from "react-markdown";

export function CMarkdown({ value }: { value: string }) {
  return (
    <div className="space-y-4">
      <Markdown
        components={{
          h1: CMHeader1,
          h2: CMHeader2,
          h3: CMHeader3,
          p: CMParagraph,
          b: CMBold,
          strong: CMBold,
          code: CMCode,
          hr: CMHorizontalRule,
          blockquote: CMBlockQuote,
          ol: CMOrderedList,
          ul: CMUnorderedList,
          li: CMListItem,
        }}
      >
        {value}
      </Markdown>
    </div>
  );
}

function CMHeader1({ children }: PropsWithChildren) {
  return <div className="text-2xl font-bold">{children}</div>;
}
function CMHeader2({ children }: PropsWithChildren) {
  return <div className="text-xl font-bold">{children}</div>;
}
function CMHeader3({ children }: PropsWithChildren) {
  return <div className="text-lg font-bold">{children}</div>;
}
function CMParagraph({ children }: PropsWithChildren) {
  return <div>{children}</div>;
}
function CMBold({ children }: PropsWithChildren) {
  return (
    <span className="font-bold text-gray-900 dark:text-white">{children}</span>
  );
}
function CMCode({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  if (className?.includes("language-")) {
    return (
      <pre className="bg-white dark:bg-gray-800 p-3 rounded-sm overflow-auto">
        {children}
      </pre>
    );
  }
  return (
    <span className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded-sm">
      {children}
    </span>
  );
}
function CMHorizontalRule() {
  return (
    <div className="border-b-2 border-gray-200 dark:border-gray-600 my-8!" />
  );
}
function CMBlockQuote({ children }: PropsWithChildren) {
  return (
    <div className="border-l-4 rounded-l-sm border-gray-300 dark:border-gray-500 text-gray-500 dark:text-gray-400 pl-3 py-2">
      {children}
    </div>
  );
}
function CMOrderedList({ children }: PropsWithChildren) {
  return <ol className="space-y-4 *:list-decimal *:ml-8">{children}</ol>;
}
function CMUnorderedList({ children }: PropsWithChildren) {
  return <ul className="space-y-4 *:list-disc *:ml-8">{children}</ul>;
}
function CMListItem({ children }: PropsWithChildren) {
  return <li className="space-y-4">{children}</li>;
}
