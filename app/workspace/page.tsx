'use client';

import React, { useEffect } from 'react';
import { useWorkspaceStore } from '@/lib/store/useWorkspaceStore';
import { FileTree } from '@/components/workspace/FileTree';
import { MarkdownViewer } from '@/components/workspace/MarkdownViewer';
import { MermaidDiagram } from '@/components/workspace/MermaidDiagram';
import { ExportBar } from '@/components/workspace/ExportBar';
import { Button } from '@/components/ui/Button';
import { Terminal, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function WorkspacePage() {
  const {
    result,
    selectedFile,
    viewMode,
    generateWorkspace,
    setSelectedFile,
    setViewMode,
  } = useWorkspaceStore();

  useEffect(() => {
    if (!result) {
      generateWorkspace();
    }
  }, [result, generateWorkspace]);

  if (!result || result.files.length === 0) {
    return (
      <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center space-y-4 font-mono">
        <Terminal className="w-12 h-12 text-zinc-600 animate-pulse" />
        <p className="text-zinc-400 text-xs">No active architecture workspace found.</p>
        <Link href="/">
          <Button size="sm" className="gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Blueprint</span>
          </Button>
        </Link>
      </div>
    );
  }

  const activeFile = selectedFile || result.files[0];

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-zinc-950 overflow-hidden">
      <ExportBar
        files={result.files}
        projectName={result.projectName}
        selectedFile={activeFile}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar File Tree Explorer */}
        <FileTree
          files={result.files}
          selectedFile={activeFile}
          onSelectFile={setSelectedFile}
        />

        {/* Content Viewer Panel */}
        <div className="flex-1 bg-zinc-950 flex flex-col overflow-hidden">
          {/* File Header Bar */}
          <div className="h-9 bg-zinc-900/50 border-b border-zinc-800 px-4 flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="text-indigo-400 font-semibold">{activeFile.filename}</span>
            <span className="text-[10px] text-zinc-500">{activeFile.content.length} bytes</span>
          </div>

          {/* View Modes */}
          <div className="flex-1 overflow-y-auto p-4">
            {viewMode === 'preview' && (
              <MarkdownViewer content={activeFile.content} />
            )}

            {viewMode === 'raw' && (
              <textarea
                value={activeFile.content}
                readOnly
                className="w-full h-full bg-zinc-950 font-mono text-xs text-zinc-300 p-4 border border-zinc-800 rounded-lg focus:outline-none resize-none"
              />
            )}

            {viewMode === 'mermaid' && (
              <div className="space-y-4">
                <p className="text-xs font-mono text-zinc-400">
                  Rendering Mermaid Diagram for <code className="text-indigo-400">{activeFile.filename}</code>
                </p>
                <MermaidDiagram
                  chart={
                    activeFile.content.includes('```mermaid')
                      ? activeFile.content.split('```mermaid')[1].split('```')[0].trim()
                      : `graph TD\n  Client["Client Browser"] --> Engine["DevContext Engine"]`
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
