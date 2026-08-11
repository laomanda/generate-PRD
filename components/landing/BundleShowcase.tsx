import { FileText, Code, CheckSquare, Layers, Database, Palette, Terminal, ShieldAlert } from 'lucide-react';
import { Card } from '../ui/Button';

export function BundleShowcase() {
  const blueprintFiles = [
    { name: 'PRD.md', icon: FileText, desc: 'Product Requirements, Target Personas & Scope' },
    { name: 'ARCHITECTURE.md', icon: Layers, desc: 'High-Level Diagrams & Component Topologies' },
    { name: 'DATABASE.md', icon: Database, desc: 'Mermaid ERD Diagrams & SQL DDL Specs' },
    { name: 'DESIGN_SYSTEM.md', icon: Palette, desc: 'Tailwind Color Tokens & Component Styling' },
    { name: '.cursorrules', icon: CheckSquare, desc: 'AI Coding Agent Guardrails & Conventions' },
    { name: 'README.md', icon: Terminal, desc: 'Project Overview & Setup Documentation' },
    { name: 'MEGA_PROMPT.txt', icon: Code, desc: 'Master Context Prompt for LLMs & Chat Tools' },
    { name: 'TESTING.md', icon: ShieldAlert, desc: 'Unit, Integration & E2E Testing Suite Strategy' },
  ];

  return (
    <section className="py-16 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl font-mono font-bold text-zinc-100">
          The 8-File Architecture Bundle
        </h2>
        <p className="text-xs text-zinc-400 font-mono">
          DevContext Engine generates the standard 8-document suite required for modern AI-assisted engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {blueprintFiles.map((file) => {
          const Icon = file.icon;
          return (
            <Card key={file.name} className="bg-zinc-950 border-zinc-800 hover:border-indigo-500/50 transition-all group">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-indigo-400 group-hover:border-indigo-500/40">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-mono text-xs font-bold text-zinc-100">{file.name}</span>
              </div>
              <p className="text-[11px] font-sans text-zinc-400 leading-relaxed">{file.desc}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
