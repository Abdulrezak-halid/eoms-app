import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import php from "highlight.js/lib/languages/php";
import python from "highlight.js/lib/languages/python";
import ts from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import "highlight.js/styles/night-owl.min.css";
import { useMemo } from "react";

import { classNames } from "../utils/classNames";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("php", php);
hljs.registerLanguage("python", python);
hljs.registerLanguage("typescript", ts);
hljs.registerLanguage("xml", xml);

export type ISyntaxHighligterLanguage =
  | "bash"
  | "php"
  | "python"
  | "typescript"
  | "xml";

interface IProps {
  code: string;
  language: ISyntaxHighligterLanguage;
  // TODO not supported
  hideLineNumbers?: boolean;
  className?: string;
  wrap?: boolean;
}

export function CSyntaxHighlighter({
  code,
  language,
  className,
  wrap,
}: IProps) {
  const highlightedCodeRaw = useMemo(
    () => ({
      __html: hljs.highlight(code.trim(), {
        language,
      }).value,
    }),
    [code, language],
  );

  return (
    <div
      className={classNames(
        "rounded-md bg-gray-800 dark:bg-gray-900 text-gray-300 px-3 py-2 overflow-auto",
        className,
      )}
    >
      <pre>
        <code
          className={classNames(wrap && "text-wrap")}
          dangerouslySetInnerHTML={highlightedCodeRaw}
        />
      </pre>
    </div>
  );
}
