'use client';

import React, { useState } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { MermaidDiagram } from './MermaidDiagram';
import {
  FileText,
  AlertTriangle,
  Info,
  CheckCircle2,
  Copy,
  Check,
  Code2,
  CheckSquare,
  Square,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface MarkdownViewerProps {
  content: string;
}

/**
 * Code Block Component with Copy Button & Mermaid Inline Rendering
 */
function CodeBlock({ className, children }: { className?: string; children?: React.ReactNode }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const codeString = String(children).replace(/\n$/, '');

  // Render Mermaid diagrams directly inside the document preview!
  if (language === 'mermaid') {
    return (
      <div className="my-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-indigo-400 bg-zinc-900 border border-zinc-800 rounded-t-lg px-4 py-2 border-b-0">
          <span className="flex items-center gap-2 font-bold">
            <Code2 className="w-4 h-4 text-indigo-400" />
            DIAGRAM PREVIEW (Mermaid.js)
          </span>
        </div>
        <MermaidDiagram chart={codeString} />
      </div>
    );
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-5 rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-xl font-mono text-xs">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between bg-zinc-900/90 border-b border-zinc-800 px-4 py-2 text-zinc-400">
        <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
          <Code2 className="w-3.5 h-3.5" />
          {language || 'text'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors bg-zinc-800/60 hover:bg-zinc-800 px-2 py-1 rounded border border-zinc-700/50"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-indigo-400" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto bg-zinc-950 text-zinc-300 leading-relaxed font-mono">
        <pre className="m-0 p-0 whitespace-pre">{codeString}</pre>
      </div>
    </div>
  );
}

/**
 * Callout / Alert Blockquote Component
 * Parses GitHub-style alert callouts: > [!NOTE], > [!WARNING], > [!CAUTION], > [!IMPORTANT], > [!TIP]
 */
function CustomBlockquote({ children }: { children?: React.ReactNode }) {
  const childrenArray = React.Children.toArray(children);
  const textContent = childrenArray.map(c => (typeof c === 'string' ? c : '')).join('');

  if (textContent.includes('[!CAUTION]') || textContent.includes('[!WARNING]')) {
    return (
      <div className="my-5 p-4 rounded-xl border-l-4 border-red-500 bg-red-950/20 text-red-200 shadow-lg font-mono text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="space-y-1">{children}</div>
      </div>
    );
  }

  if (textContent.includes('[!IMPORTANT]') || textContent.includes('[!NOTE]')) {
    return (
      <div className="my-5 p-4 rounded-xl border-l-4 border-indigo-500 bg-indigo-950/20 text-indigo-200 shadow-lg font-mono text-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">{children}</div>
      </div>
    );
  }

  if (textContent.includes('[!TIP]')) {
    return (
      <div className="my-5 p-4 rounded-xl border-l-4 border-emerald-500 bg-emerald-950/20 text-emerald-200 shadow-lg font-mono text-xs flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">{children}</div>
      </div>
    );
  }

  return (
    <blockquote className="my-5 p-4 rounded-r-xl border-l-4 border-zinc-700 bg-zinc-900/60 text-zinc-300 italic text-xs font-mono shadow-md">
      {children}
    </blockquote>
  );
}

/**
 * Checklist item or regular list item renderer
 */
function ListItem({ children }: { children?: React.ReactNode }) {
  const childrenArray = React.Children.toArray(children);
  const firstChild = childrenArray[0];

  // Check if item contains checkbox syntax
  if (typeof firstChild === 'string') {
    if (firstChild.startsWith('[ ] ')) {
      return (
        <li className="flex items-start gap-2 my-1.5 text-xs text-zinc-300 font-mono">
          <Square className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
          <span>{firstChild.replace('[ ] ', '')}</span>
          {childrenArray.slice(1)}
        </li>
      );
    }
    if (firstChild.startsWith('[x] ') || firstChild.startsWith('[X] ')) {
      return (
        <li className="flex items-start gap-2 my-1.5 text-xs text-emerald-300 font-mono">
          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span className="line-through text-zinc-400">{firstChild.replace(/\[[xX]\] /, '')}</span>
          {childrenArray.slice(1)}
        </li>
      );
    }
  }

  return (
    <li className="flex items-start gap-2 my-1.5 text-xs text-zinc-300 font-mono">
      <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
      <div>{children}</div>
    </li>
  );
}

/**
 * Rich, High-Density IDE-Style Markdown Viewer
 */
export function MarkdownViewer({ content }: MarkdownViewerProps) {
  const customComponents: Components = {
    // H1: Document Hero Banner Card
    h1: ({ children }) => (
      <div className="my-6 p-6 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400" />
        <div className="flex items-center gap-3 mb-2">
          <FileText className="w-7 h-7 text-indigo-400" />
          <h1 className="text-xl sm:text-2xl font-extrabold font-mono text-zinc-50 tracking-tight">
            {children}
          </h1>
        </div>
      </div>
    ),

    // H2: Major Section Heading
    h2: ({ children }) => (
      <div className="mt-8 mb-4 pb-2 border-b border-zinc-800/80 flex items-center gap-2">
        <div className="w-2 h-5 bg-indigo-500 rounded-full" />
        <h2 className="text-base sm:text-lg font-bold font-mono text-zinc-100 tracking-tight">
          {children}
        </h2>
      </div>
    ),

    // H3: Subsection Heading
    h3: ({ children }) => (
      <h3 className="mt-6 mb-3 text-xs sm:text-sm font-bold font-mono text-indigo-400 uppercase tracking-wider flex items-center gap-2">
        <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
        {children}
      </h3>
    ),

    // Paragraphs
    p: ({ children }) => (
      <p className="my-3 text-xs sm:text-sm font-sans text-zinc-300 leading-relaxed">
        {children}
      </p>
    ),

    // Code blocks & inline code
    code: ({ className, children }) => {
      const isBlock = className || String(children).includes('\n');
      if (isBlock) {
        return <CodeBlock className={className}>{children}</CodeBlock>;
      }
      return (
        <code className="bg-zinc-900 border border-zinc-800 text-indigo-300 font-mono text-[11px] px-1.5 py-0.5 rounded shadow-sm">
          {children}
        </code>
      );
    },

    // Blockquotes & Callouts
    blockquote: ({ children }) => <CustomBlockquote>{children}</CustomBlockquote>,

    // Modern High-Density Data Tables
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/80 shadow-xl">
        <table className="w-full text-left border-collapse font-mono text-xs">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-zinc-900/90 border-b border-zinc-800 text-indigo-300 font-bold uppercase tracking-wider text-[11px]">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
        {children}
      </tbody>
    ),
    tr: ({ children }) => (
      <tr className="hover:bg-zinc-800/40 transition-colors">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="px-4 py-3 text-left font-bold text-indigo-300">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2.5 text-zinc-300">
        {children}
      </td>
    ),

    // Lists
    ul: ({ children }) => <ul className="my-3 space-y-1 pl-1 font-mono">{children}</ul>,
    ol: ({ children }) => <ol className="my-3 space-y-1 pl-1 font-mono list-decimal list-inside">{children}</ol>,
    li: ({ children }) => <ListItem>{children}</ListItem>,

    // Horizontal Rule
    hr: () => (
      <hr className="border-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent my-8" />
    ),

    // Strong & Emphasis
    strong: ({ children }) => <strong className="text-zinc-100 font-bold">{children}</strong>,
    em: ({ children }) => <em className="text-indigo-300 italic">{children}</em>,

    // Links
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 font-medium transition-colors"
      >
        {children}
      </a>
    ),
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 font-sans selection:bg-indigo-600 selection:text-white">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={customComponents}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
