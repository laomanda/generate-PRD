'use client';

import React from 'react';
import { FileText, Code, CheckSquare, Folder } from 'lucide-react';
import { GeneratedFile } from '@/lib/engine/types';

interface FileTreeProps {
  files: GeneratedFile[];
  selectedFile: GeneratedFile | null;
  onSelectFile: (file: GeneratedFile) => void;
}

export function FileTree({ files, selectedFile, onSelectFile }: FileTreeProps) {
  const getIcon = (filename: string) => {
    if (filename.endsWith('.md')) return <FileText className="w-3.5 h-3.5 text-indigo-400" />;
    if (filename.endsWith('.sql')) return <Code className="w-3.5 h-3.5 text-emerald-400" />;
    if (filename.includes('rules')) return <CheckSquare className="w-3.5 h-3.5 text-yellow-400" />;
    return <FileText className="w-3.5 h-3.5 text-zinc-400" />;
  };

  return (
    <div className="w-64 bg-zinc-900 border-r border-zinc-800 h-full flex flex-col font-mono text-xs select-none">
      <div className="p-3 border-b border-zinc-800 flex items-center justify-between text-zinc-400 font-semibold tracking-wider text-[10px] uppercase">
        <div className="flex items-center gap-1.5">
          <Folder className="w-3.5 h-3.5 text-indigo-400" />
          <span>Project Workspace</span>
        </div>
        <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
          {files.length} files
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {files.map((file) => {
          const isSelected = selectedFile?.filename === file.filename;
          return (
            <button
              key={file.filename}
              onClick={() => onSelectFile(file)}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-left transition-colors ${
                isSelected
                  ? 'bg-zinc-800 text-indigo-400 font-medium border-l-2 border-indigo-500'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              {getIcon(file.filename)}
              <span className="truncate">{file.filename}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
