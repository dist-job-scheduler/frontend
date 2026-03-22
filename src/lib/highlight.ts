import { codeToHtml } from "shiki";

export type CodeLang =
  | "bash"
  | "curl"
  | "go"
  | "http"
  | "json"
  | "javascript"
  | "python"
  | "sql"
  | "typescript"
  | "text";

// Shiki language IDs for each CodeLang.
const LANG_MAP: Record<CodeLang, string> = {
  bash: "bash",
  curl: "bash",
  go: "go",
  http: "http",
  json: "json",
  javascript: "javascript",
  python: "python",
  sql: "sql",
  typescript: "typescript",
  text: "text",
};

/**
 * Returns syntax-highlighted HTML for a code string.
 * Call from server components only (async).
 */
export async function highlight(code: string, lang: CodeLang = "text"): Promise<string> {
  return codeToHtml(code, {
    lang: LANG_MAP[lang],
    theme: "github-dark-default",
  });
}
