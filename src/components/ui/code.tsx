"use client";

import { useTheme } from "next-themes";
import { Prism as SyntaxHighlighter, type SyntaxHighlighterProps } from "react-syntax-highlighter";
import { vscDarkPlus, vs } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Skeleton } from "./skeleton";

export default function Code(props: SyntaxHighlighterProps) {
  const { resolvedTheme } = useTheme();

  const style = (() => {
    switch (resolvedTheme) {
      case "light":
        return vs;

      case "dark":
      default:
        return vscDarkPlus;
    }
  })();

  return <SyntaxHighlighter language="typescript" style={style} showLineNumbers {...props} />;
}

export function CodeLoading() {
  return <Skeleton className="mt-1.5 h-40 w-full rounded-2xl" />;
}
