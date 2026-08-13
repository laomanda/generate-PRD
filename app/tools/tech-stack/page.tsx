'use client';

import React, { useState } from 'react';
import { Cpu, Copy, Check, Play } from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui/Button';
import { generateTechStack } from '@/lib/engine/generators/techStackGenerator';

export default function TechStackToolPage() {
  const [dbEngine, setDbEngine] = useState('PostgreSQL');
  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState(() =>
    generateTechStack({
      projectName: 'Tech Stack Micro-Tool Spec',
      appType: 'saas',
      description: 'Standalone Tech Stack Specification',
      techStack: [
        'Next.js 14+ (App Router)',
        'React 19',
        'TypeScript',
        'Tailwind CSS',
        'Zustand',
        'Lucide React',
        'Mermaid.js',
        'JSZip & FileSaver',
        'React Hook Form & Zod',
      ],
      features: [],
      dbEngine: 'PostgreSQL',
      designVibe: 'Modern IDE Dark (Zinc & Indigo)',
    })
  );

  const handleGenerate = () => {
    const nextContent = generateTechStack({
      projectName: 'Tech Stack Micro-Tool Spec',
      appType: 'saas',
      description: 'Standalone Tech Stack Specification',
      techStack: [
        'Next.js 14+ (App Router)',
        'React 19',
        'TypeScript',
        'Tailwind CSS',
        'Zustand',
        'Lucide React',
        'Mermaid.js',
        'JSZip & FileSaver',
        'React Hook Form & Zod',
      ],
      features: [],
      dbEngine,
      designVibe: 'Modern IDE Dark (Zinc & Indigo)',
    });
    setContent(nextContent);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8 font-mono">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge variant="indigo">MICRO-TOOL</Badge>
          <Badge variant="emerald">17-Section Tech Stack</Badge>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-zinc-100 flex items-center gap-3">
          <Cpu className="w-8 h-8 text-indigo-400" />
          <span>Tech Stack & Library Specification Generator</span>
        </h1>
        <p className="text-xs text-zinc-400 font-sans">
          Standalone generator for 17-section technology specifications, package purposes, version bounds, & technical rationales.
        </p>
      </div>

      <Card className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs text-zinc-400 font-bold whitespace-nowrap">Primary Database Engine:</label>
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
            <span>Generate 17-Section Stack</span>
          </Button>

          <Button onClick={handleCopy} variant="secondary" size="sm" className="gap-2">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </Button>
        </div>
      </Card>

      <Card className="space-y-3">
        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Generated 17-Section Tech Stack Document</h3>
        <textarea
          value={content}
          readOnly
          className="w-full h-[550px] bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-300 font-mono resize-none focus:outline-none"
        />
      </Card>
    </div>
  );
}
