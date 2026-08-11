'use client';

import React, { useState } from 'react';
import { Palette, Copy, Check, Play } from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui/Button';
import { generateDesignSystem } from '@/lib/engine/generators/designGenerator';

export default function DesignSystemToolPage() {
  const [vibe, setVibe] = useState('Modern IDE Dark (Zinc & Indigo)');
  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState(() =>
    generateDesignSystem({
      projectName: 'Design System Micro-Tool Spec',
      appType: 'saas',
      description: 'Standalone Design System Tool',
      techStack: ['Tailwind CSS'],
      features: [],
      dbEngine: 'PostgreSQL',
      designVibe: 'Modern IDE Dark (Zinc & Indigo)',
    })
  );

  const handleGenerate = () => {
    const nextContent = generateDesignSystem({
      projectName: 'Design System Micro-Tool Spec',
      appType: 'saas',
      description: 'Standalone Design System Tool',
      techStack: ['Tailwind CSS'],
      features: [],
      dbEngine: 'PostgreSQL',
      designVibe: vibe,
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
          <Badge variant="emerald">Tailwind Tokens</Badge>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-zinc-100 flex items-center gap-3">
          <Palette className="w-8 h-8 text-indigo-400" />
          <span>Design System & Color Tokens Tool</span>
        </h1>
        <p className="text-xs text-zinc-400 font-sans">
          Standalone generator for DESIGN_SYSTEM.md guidelines, token palettes, and reusable UI snippets.
        </p>
      </div>

      <Card className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs text-zinc-400 font-bold whitespace-nowrap">Design Vibe:</label>
          <select
            value={vibe}
            onChange={(e) => setVibe(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
          >
            <option value="Modern IDE Dark (Zinc & Indigo)">Modern IDE Dark (Zinc & Indigo)</option>
            <option value="Cyberpunk Neon (Slate & Cyan)">Cyberpunk Neon (Slate & Cyan)</option>
            <option value="Clean Studio Light">Clean Studio Light</option>
          </select>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button onClick={handleGenerate} size="sm" className="gap-2">
            <Play className="w-3.5 h-3.5" />
            <span>Generate Tokens</span>
          </Button>

          <Button onClick={handleCopy} variant="secondary" size="sm" className="gap-2">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </Button>
        </div>
      </Card>

      <Card className="space-y-3">
        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Generated Design Specification</h3>
        <textarea
          value={content}
          readOnly
          className="w-full h-[450px] bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-300 font-mono resize-none focus:outline-none"
        />
      </Card>
    </div>
  );
}
