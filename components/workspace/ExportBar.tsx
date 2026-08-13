'use client';

import React, { useState } from 'react';
import { Download, Copy, Check, Eye, Code, Network } from 'lucide-react';
import { exportFilesToZip } from '@/lib/utils/zipExporter';
import { GeneratedFile } from '@/lib/engine/types';

interface ExportBarProps {
  files: GeneratedFile[];
  projectName: string;
  selectedFile: GeneratedFile | null;
  viewMode: 'preview' | 'raw' | 'mermaid' | 'inspector';
  onViewModeChange: (mode: 'preview' | 'raw' | 'mermaid' | 'inspector') => void;
}

export function ExportBar({
  files,
  projectName,
  selectedFile,
  viewMode,
  onViewModeChange,
}: ExportBarProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleCopy = async () => {
    if (!selectedFile) return;
    await navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportZip = async () => {
    setExporting(true);
    const docMap: Record<string, string> = {};
    files.forEach(f => { docMap[f.filename] = f.content; });

    // Validate Quality Gate before ZIP export
    const { analyzeProjectConfig } = await import('@/lib/core/analyzer');
    const { qualityGatePipeline } = await import('@/lib/core/pipeline/qualityGate');
    const { projectModel } = analyzeProjectConfig({
      projectName,
      description: projectName,
      appType: 'custom',
      techStack: ['TypeScript'],
      features: [],
      dbEngine: 'PostgreSQL',
      designVibe: 'Modern IDE Dark (Zinc & Indigo)',
    });
    const gateReport = qualityGatePipeline.runQualityGate(projectModel, docMap);

    if (!gateReport.passed) {
      alert(`[Export Blocked] Document bundle failed Quality Gate validation:\n\n${gateReport.errors.join('\n')}`);
      setExporting(false);
      return;
    }

    const filename = `${projectName.toLowerCase().replace(/\s+/g, '-')}-blueprint.zip`;
    await exportFilesToZip(files, filename);
    setExporting(false);
  };

  return (
    <div className="h-12 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between text-xs font-mono select-none">
      <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
        <button
          onClick={() => onViewModeChange('preview')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
            viewMode === 'preview' ? 'bg-zinc-800 text-indigo-400 font-medium' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live Preview</span>
        </button>

        <button
          onClick={() => onViewModeChange('raw')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
            viewMode === 'raw' ? 'bg-zinc-800 text-indigo-400 font-medium' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Raw Editor</span>
        </button>

        <button
          onClick={() => onViewModeChange('mermaid')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
            viewMode === 'mermaid' ? 'bg-zinc-800 text-indigo-400 font-medium' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          <span>Mermaid ERD</span>
        </button>

        <button
          onClick={() => onViewModeChange('inspector')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors ${
            viewMode === 'inspector' ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/50 font-medium' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <span className="text-xs">🧠</span>
          <span>Intelligence Inspector</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          disabled={!selectedFile}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-300 hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
          <span>{copied ? 'Copied!' : 'Copy Code'}</span>
        </button>

        <button
          onClick={handleExportZip}
          disabled={exporting || files.length === 0}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md transition-all active:scale-95 disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{exporting ? 'Zipping...' : 'Export ZIP'}</span>
        </button>
      </div>
    </div>
  );
}
