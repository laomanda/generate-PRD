'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, Wand2 } from 'lucide-react';
import { useWorkspaceStore } from '@/lib/store/useWorkspaceStore';
import { enhancePrompt } from '@/lib/utils/promptEnhancer';
import { Button, Card } from '../ui/Button';
import { useRouter } from 'next/navigation';

export function FreestyleForm() {
  const router = useRouter();
  const { config, setConfig, generateWorkspace } = useWorkspaceStore();
  const [prompt, setPrompt] = useState(config.rawPrompt || '');
  const [isPolishing, setIsPolishing] = useState(false);

  const handlePolish = () => {
    if (!prompt.trim()) return;
    setIsPolishing(true);
    setTimeout(() => {
      const { polishedPrompt, suggestedStack, suggestedFeatures } = enhancePrompt(prompt);
      setPrompt(polishedPrompt);
      setConfig({
        rawPrompt: polishedPrompt,
        techStack: suggestedStack,
        features: suggestedFeatures,
      });
      setIsPolishing(false);
    }, 200);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const { suggestedStack, suggestedFeatures, suggestedAppName } = enhancePrompt(prompt);
    
    setConfig({
      rawPrompt: prompt,
      projectName: suggestedAppName,
      description: prompt,
      features: suggestedFeatures,
      techStack: suggestedStack,
    });
    generateWorkspace();
    router.push('/workspace');
  };

  return (
    <Card className="border-indigo-500/20 bg-zinc-900/90 backdrop-blur">
      <form onSubmit={handleGenerate} className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono font-medium text-zinc-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            FREESTYLE BLUEPRINT PROMPT
          </label>
          <button
            type="button"
            onClick={handlePolish}
            disabled={!prompt.trim() || isPolishing}
            className="text-xs font-mono flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 disabled:opacity-40 transition-colors"
          >
            <Wand2 className="w-3.5 h-3.5" />
            {isPolishing ? 'Polishing...' : '✨ Smart Polish'}
          </button>
        </div>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Tuliskan ide aplikasi lu secara bebas... (Contoh: 'Bikin toko online sepatu dengan fitur pembayaran Stripe, stok barang, rekomendasi produk, dan review komentar...')"
          rows={5}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-indigo-500 transition-colors resize-none placeholder:text-zinc-600"
        />

        <div className="flex justify-end">
          <Button type="submit" size="md" className="gap-2">
            <span>Generate Full Architecture</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
}
