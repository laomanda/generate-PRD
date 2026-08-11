'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Card } from '../ui/Button';

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Why does DevContext Engine require zero AI API keys?',
      a: 'DevContext Engine uses a pure TypeScript rule-based assembler engine built into your browser. It formats structured architecture templates in milliseconds without sending any request to external LLM endpoints.',
    },
    {
      q: 'Is my project idea safe and private?',
      a: 'Yes! 100% of the computation happens client-side within your browser runtime. No data or prompts are transmitted to any server.',
    },
    {
      q: 'How do I use the generated files in Cursor or Claude?',
      a: 'Click "Export ZIP" to download all 8 documentation files directly into your project root folder. Place `.cursorrules` in your project root so Cursor automatically adheres to your architecture decisions.',
    },
    {
      q: 'Can I customize the generated schemas and tech stacks?',
      a: 'Absolutey. You can use the interactive Raw Editor mode in the Workspace dashboard to tweak any file before exporting.',
    },
  ];

  return (
    <section className="py-16 max-w-3xl mx-auto space-y-6 font-mono">
      <div className="flex items-center justify-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
        <HelpCircle className="w-4 h-4" />
        <span>FREQUENTLY ASKED QUESTIONS</span>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <Card key={idx} className="p-4 bg-zinc-950 border-zinc-800">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left text-xs font-semibold text-zinc-100 hover:text-indigo-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
              </button>

              {isOpen && (
                <p className="mt-3 text-xs text-zinc-400 font-sans leading-relaxed pt-2 border-t border-zinc-900">
                  {faq.a}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
