'use client';

import React, { useState } from 'react';
import { Upload, FileCode, CheckCircle2 } from 'lucide-react';
import { useWorkspaceStore } from '@/lib/store/useWorkspaceStore';
import { Card } from '../ui/Button';

export function ContextLoader() {
  const { setConfig } = useWorkspaceStore();
  const [loadedFileName, setLoadedFileName] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (file.name.includes('package.json')) {
        try {
          const json = JSON.parse(text);
          const deps = Object.keys(json.dependencies || {});
          setConfig({
            techStack: [...deps.slice(0, 5)],
            projectName: json.name || 'Imported Project',
          });
        } catch (err) {
          console.error('Failed to parse package.json', err);
        }
      } else if (file.name.includes('.sql')) {
        setConfig({
          dbEngine: 'PostgreSQL SQL Schema',
          description: `Imported schema definition: ${file.name}`,
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card className="border-dashed border-zinc-700 bg-zinc-950/50 hover:border-indigo-500/50 transition-colors">
      <label className="flex flex-col items-center justify-center cursor-pointer py-6 text-center">
        <Upload className="w-8 h-8 text-zinc-500 mb-2" />
        <div className="text-xs font-mono text-zinc-300 font-semibold mb-1">
          CONTEXT LOADER DROPZONE
        </div>
        <p className="text-[11px] font-mono text-zinc-400 mb-3 max-w-sm">
          Upload <code className="text-indigo-400">package.json</code> or <code className="text-indigo-400">schema.sql</code> to auto-detect tech stack & schema
        </p>

        {loadedFileName ? (
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-md border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
            <span>Loaded: {loadedFileName}</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900 px-3 py-1.5 rounded-md border border-zinc-800 hover:text-zinc-200">
            <FileCode className="w-4 h-4 text-indigo-400" />
            <span>Browse File</span>
          </div>
        )}

        <input
          type="file"
          accept=".json,.sql"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
    </Card>
  );
}
