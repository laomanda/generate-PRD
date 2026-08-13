'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { History, Trash2, ExternalLink, Calendar, FileText } from 'lucide-react';
import { useWorkspaceStore } from '@/lib/store/useWorkspaceStore';
import { Card, Button, Badge } from '@/components/ui/Button';
import { GeneratorResult } from '@/lib/engine/types';

export default function HistoryPage() {
  const router = useRouter();
  const { history, loadHistoryItem, clearHistory } = useWorkspaceStore();

  const handleSelect = (item: GeneratorResult) => {
    loadHistoryItem(item);
    router.push('/workspace');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8 font-mono">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="indigo">LOCALSTORAGE CACHE</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 flex items-center gap-3">
            <History className="w-7 h-7 text-indigo-400" />
            <span>Project Blueprint History</span>
          </h1>
          <p className="text-xs text-zinc-400 font-sans">
            Automatically saved project architecture history stored locally in your browser.
          </p>
        </div>

        {history.length > 0 && (
          <Button onClick={clearHistory} variant="outline" size="sm" className="gap-2 border-red-900/50 text-red-400 hover:bg-red-950/30">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <Card className="text-center py-12 space-y-3">
          <History className="w-10 h-10 text-zinc-600 mx-auto" />
          <p className="text-xs text-zinc-400">No project blueprints found in local history.</p>
          <Button onClick={() => router.push('/')} size="sm">
            Generate New Blueprint
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {history.map((item, idx) => (
            <Card key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900 border-zinc-800 hover:border-indigo-500/40 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-zinc-100">{item.projectName}</span>
                  <Badge variant="zinc">{item.files.length} Files</Badge>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-indigo-400" />
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-emerald-400" />
                    {item.files[0]?.filename}
                  </span>
                </div>
              </div>

              <Button onClick={() => handleSelect(item)} size="sm" className="gap-2 w-full sm:w-auto">
                <span>Load into Workspace</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
