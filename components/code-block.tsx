"use client";

import { isValidElement, useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

type PreProps = React.HTMLAttributes<HTMLPreElement> & {
  "data-language"?: string;
};

const ARABIC = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/u;

function textOf(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement(node)) {
    return textOf((node.props as { children?: ReactNode }).children);
  }
  return "";
}

/**
 * The block's direction follows the code's own first strong character
 * (the Unicode bidi paragraph rule), never the page's: an Arabic prompt
 * sample reads RTL even inside an English post, while real code stays
 * LTR inside the Arabic one.
 */
function isRtlCode(children: ReactNode): boolean {
  for (const ch of textOf(children)) {
    if (!/\p{L}/u.test(ch)) continue;
    return ARABIC.test(ch);
  }
  return false;
}

/**
 * The clipboard text is rebuilt from the `[data-line]` rows — NOT from
 * innerText: line numbers are CSS counters on `::before`, and some
 * engines fold generated content into innerText (the numbers would land
 * in the clipboard).
 */
function codeText(root: HTMLElement): string {
  const code = root.querySelector("code");
  if (!code) return root.innerText;
  const lines = code.querySelectorAll("[data-line]");
  if (lines.length === 0) return code.textContent ?? "";
  return Array.from(lines)
    .map((line) => (line.textContent ?? "").replace(/\s+$/, ""))
    .join("\n");
}

/**
 * Wraps every highlighted `<pre>` in a shell with a header strip: language
 * chip, copy button, and a divider above the code (line numbers ride CSS
 * counters in blog.css). Shell/bar use logical properties and flex
 * auto-flip; the code's direction is content-driven (isRtlCode).
 */
export function CodeBlock({
  copyLabel,
  copiedLabel,
  children,
  ...rest
}: PreProps & { copyLabel: string; copiedLabel: string }) {
  const shellRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const language = rest["data-language"];
  const dir = isRtlCode(children) ? "rtl" : "ltr";

  async function onCopy() {
    const text = codeText(shellRef.current ?? document.body);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard denied — the code stays selectable as the fallback */
    }
  }

  return (
    <div className="code-shell" ref={shellRef} dir={dir}>
      <div className="code-shell__bar">
        <span className="code-shell__lang" aria-hidden="true">
          {language ?? ""}
        </span>
        <button
          type="button"
          className="code-shell__copy"
          onClick={onCopy}
          data-copied={copied || undefined}
        >
          {copied ? (
            <Check size={13} strokeWidth={1.8} aria-hidden="true" />
          ) : (
            <Copy size={13} strokeWidth={1.5} aria-hidden="true" />
          )}
          <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
        </button>
      </div>
      <pre {...rest}>{children}</pre>
    </div>
  );
}
