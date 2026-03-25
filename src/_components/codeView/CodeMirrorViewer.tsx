"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { yaml } from "@codemirror/lang-yaml";
import { xml } from "@codemirror/lang-xml";
import { sql } from "@codemirror/lang-sql";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { php } from "@codemirror/lang-php";
import { rust } from "@codemirror/lang-rust";

import { FiCopy, FiCheck } from "react-icons/fi";

type Props = {
  code: string;
  fileName?: string;
};

type SupportedLang =
  | "javascript"
  | "typescript"
  | "python"
  | "html"
  | "css"
  | "json"
  | "markdown"
  | "yaml"
  | "xml"
  | "sql"
  | "java"
  | "cpp"
  | "php"
  | "rust"
  | "text";

/* ---------------- LANGUAGE DETECT ---------------- */
function detectLang(fileName: string, code: string): SupportedLang {
  const ext = fileName.split(".").pop()?.toLowerCase();

  if (ext === "js" || ext === "jsx") return "javascript";
  if (ext === "ts" || ext === "tsx") return "typescript";
  if (ext === "py") return "python";
  if (ext === "html") return "html";
  if (ext === "css") return "css";
  if (ext === "json") return "json";
  if (ext === "md" || ext === "markdown" || ext === "mdx") return "markdown";
  if (ext === "yml" || ext === "yaml") return "yaml";
  if (ext === "xml" || ext === "svg") return "xml";
  if (ext === "sql") return "sql";
  if (ext === "java") return "java";
  if (
    ext === "cpp" ||
    ext === "cc" ||
    ext === "cxx" ||
    ext === "c" ||
    ext === "h" ||
    ext === "hpp"
  ) {
    return "cpp";
  }
  if (ext === "php" || ext === "phtml") return "php";
  if (ext === "rs") return "rust";

  // fallback detection
  if (code.includes("import asyncio") || code.includes("def ")) return "python";
  if (code.includes("const ") || code.includes("=>")) return "javascript";
  if (code.includes("SELECT ") || code.includes("INSERT INTO")) return "sql";
  if (code.includes("# ") || code.includes("## ")) return "markdown";
  if (code.includes("<html") || code.includes("</")) return "html";

  return "text";
}

/* ---------------- AUTO FILE NAME ---------------- */
function generateFileName(lang: string): string {
  switch (lang) {
    case "python":
      return "main.py";
    case "javascript":
      return "app.js";
    case "typescript":
      return "app.ts";
    case "html":
      return "index.html";
    case "css":
      return "styles.css";
    case "json":
      return "data.json";
    case "markdown":
      return "README.md";
    case "yaml":
      return "config.yaml";
    case "xml":
      return "document.xml";
    case "sql":
      return "query.sql";
    case "java":
      return "Main.java";
    case "cpp":
      return "main.cpp";
    case "php":
      return "index.php";
    case "rust":
      return "main.rs";
    default:
      return "file.txt";
  }
}

/* ---------------- EXTENSIONS ---------------- */
function getExtension(lang: string) {
  switch (lang) {
    case "javascript":
      return javascript({ jsx: true });
    case "typescript":
      return javascript({ typescript: true, jsx: true });
    case "python":
      return python();
    case "html":
      return html();
    case "css":
      return css();
    case "json":
      return json();
    case "markdown":
      return markdown();
    case "yaml":
      return yaml();
    case "xml":
      return xml();
    case "sql":
      return sql();
    case "java":
      return java();
    case "cpp":
      return cpp();
    case "php":
      return php();
    case "rust":
      return rust();
    default:
      return [];
  }
}

/* ---------------- COMPONENT ---------------- */
export default function CodeMirrorViewer({ code, fileName }: Props) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const copyResetRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lang = useMemo(() => {
    return detectLang(fileName || "", code);
  }, [fileName, code]);

  const finalFileName = useMemo(() => {
    return fileName || generateFileName(lang);
  }, [fileName, lang]);

  const extensions = useMemo(() => {
    const ext = getExtension(lang);
    return Array.isArray(ext) ? ext : [ext];
  }, [lang]);

  const codeStats = useMemo(() => {
    const lines = code.length ? code.split(/\r?\n/).length : 0;
    const chars = code.length;
    return { lines, chars };
  }, [code]);

  useEffect(() => {
    return () => {
      if (copyResetRef.current) {
        clearTimeout(copyResetRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    if (copyResetRef.current) {
      clearTimeout(copyResetRef.current);
      copyResetRef.current = null;
    }

    try {
      await navigator.clipboard.writeText(code);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }

    copyResetRef.current = setTimeout(() => {
      setCopyState("idle");
    }, 1600);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-(--border-dark) bg-[#1e1e1e] shadow-[0_10px_35px_rgba(0,0,0,0.22)]">
      <div className="flex items-center justify-between border-b border-(--border-dark) bg-[#2a2a2a] px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-3 text-sm text-[#d4d4d4]">
          <div className="flex shrink-0 gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
          </div>

          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate font-medium text-[#ededed]">
              {finalFileName}
            </span>
            <span className="rounded-md border border-[#3f3f46] bg-[#1f1f1f] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9ca3af]">
              {lang}
            </span>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md border border-[#4b5563] bg-[#374151] px-3 py-1.5 text-xs font-medium text-[#e5e7eb] transition-colors hover:bg-[#4b5563]"
          aria-live="polite"
          aria-label="Copy code snippet"
        >
          {copyState === "copied" ? (
            <FiCheck size={12} />
          ) : (
            <FiCopy size={12} />
          )}
          {copyState === "copied"
            ? "Copied"
            : copyState === "error"
              ? "Copy failed"
              : "Copy"}
        </button>
      </div>

      <CodeMirror
        value={code || "// No code to display"}
        height="400px"
        theme={vscodeDark}
        extensions={extensions}
        editable={false}
        className="text-sm"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          highlightActiveLineGutter: true,
          foldGutter: true,
        }}
      />

      <div className="flex items-center justify-end gap-3 border-t border-(--border-dark) bg-[#252526] px-4 py-2 text-[11px] text-[#9ca3af]">
        <span>{codeStats.lines} lines</span>
        <span>{codeStats.chars} chars</span>
      </div>
    </div>
  );
}
