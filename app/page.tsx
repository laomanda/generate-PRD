'use client';

import React, { useState } from 'react';
import { FreestyleForm } from '@/components/generator/FreestyleForm';
import { WizardForm } from '@/components/generator/WizardForm';
import { ContextLoader } from '@/components/generator/ContextLoader';
import { ProblemSolution } from '@/components/landing/ProblemSolution';
import { BundleShowcase } from '@/components/landing/BundleShowcase';
import { FaqSection } from '@/components/landing/FaqSection';
import { Sparkles, Sliders, Cpu } from 'lucide-react';
import { Badge } from '@/components/ui/Button';

export default function HomePage() {
  const [tab, setTab] = useState<'freestyle' | 'wizard'>('freestyle');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2">
          <Badge variant="emerald">
            <Cpu className="w-3 h-3 mr-1 inline" /> Pure Client-Side Engine
          </Badge>
        </div>
        <h1 className="text-3xl sm:text-5xl font-mono font-extrabold text-zinc-50 tracking-tight leading-tight">
          DevContext Engine
        </h1>
        <p className="text-sm sm:text-base font-sans text-zinc-400">
          Generate complete 8-file architecture documentation suites, Mermaid ERDs, and Cursor agent rules in &lt;0.01s with zero API key exposure.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="bg-zinc-900 p-1 rounded-xl border border-zinc-800 flex gap-1 font-mono text-xs">
            <button
              onClick={() => setTab('freestyle')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                tab === 'freestyle'
                  ? 'bg-indigo-600 text-white font-semibold shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Freestyle Prompt</span>
            </button>
            <button
              onClick={() => setTab('wizard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                tab === 'wizard'
                  ? 'bg-indigo-600 text-white font-semibold shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Guided Wizard</span>
            </button>
          </div>
        </div>

        {/* Generator Form View */}
        {tab === 'freestyle' ? <FreestyleForm /> : <WizardForm />}

        {/* Context Loader Dropzone */}
        <div className="mt-6">
          <ContextLoader />
        </div>
      </div>

      {/* Landing Showcase Sections */}
      <ProblemSolution />
      <BundleShowcase />
      <FaqSection />
    </div>
  );
}
