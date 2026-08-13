'use client';

import React, { useState } from 'react';
import { Database, Copy, Check, Play } from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui/Button';
import { generateDatabase } from '@/lib/engine/generators/dbGenerator';
import { MermaidDiagram } from '@/components/workspace/MermaidDiagram';

export function DatabaseToolPage() {
  const [dbEngine, setDbEngine] = useState('PostgreSQL');
  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState(() =>
    generateDatabase({
      projectName: 'Database Micro-Tool Spec',
      appType: 'saas',
      description: 'Standalone Database Tool',
      techStack: ['PostgreSQL'],
      features: [],
      dbEngine: 'PostgreSQL',
      designVibe: 'Default',
    })
  );

  const handleGenerate = () => {
    const nextContent = generateDatabase({
      projectName: 'Database Micro-Tool Spec',
      appType: 'saas',
      description: 'Standalone Database Tool',
      techStack: [dbEngine],
      features: [],
      dbEngine,
      designVibe: 'Default',
    });
    setContent(nextContent);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mermaidChart = content.includes('```mermaid')
    ? content.split('```mermaid')[1].split('```')[0].trim()
    : 'erDiagram\n  USERS ||--o{ PROJECTS : creates';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8 font-mono">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="indigo">MICRO-TOOL</Badge>
          <Badge variant="emerald">0.01s Latency</Badge>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-zinc-100 flex items-center gap-3">
          <Database className="w-8 h-8 text-indigo-400" />
          <span>Database Schema & ERD Generator</span>
        </h1>
        <p className="text-xs text-zinc-400 font-sans">
          Standalone generator for DATABASE.md schemas, ERDs, and SQL DDL blueprints.
        </p>
      </div>

      <Card className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs text-zinc-400 font-bold whitespace-nowrap">Engine Dialect:</label>
          <select
            value={dbEngine}
            onChange={(e) => setDbEngine(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
          >
            <option value="PostgreSQL">PostgreSQL</option>
            <option value="MySQL">MySQL</option>
            <option value="SQLite">SQLite</option>
            <option value="MongoDB">MongoDB</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button onClick={handleGenerate} size="sm" className="gap-2">
            <Play className="w-3.5 h-3.5" />
            <span>Generate ERD & SQL</span>
          </Button>

          <Button onClick={handleCopy} variant="secondary" size="sm" className="gap-2">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="space-y-3">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Generated Markdown & DDL</h3>
          <textarea
            value={content}
            readOnly
            className="w-full h-[400px] bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs text-zinc-300 font-mono resize-none focus:outline-none"
          />
        </Card>

        <Card className="space-y-3">
          <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Live Mermaid ERD Diagram</h3>
          <MermaidDiagram chart={mermaidChart} />
        </Card>
      </div>
    </div>
  );
}

export default DatabaseToolPage;
