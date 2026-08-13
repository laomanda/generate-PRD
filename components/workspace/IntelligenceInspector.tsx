'use client';

import React from 'react';
import { useWorkspaceStore } from '@/lib/store/useWorkspaceStore';
import { analyzeProjectConfig } from '@/lib/core/analyzer';
import { Brain, ShieldAlert, Cpu, CheckCircle2, FileText, Lock } from 'lucide-react';
import { Card, Badge } from '@/components/ui/Button';

export function IntelligenceInspector() {
  const { config } = useWorkspaceStore();
  const { projectModel, auditTrail } = analyzeProjectConfig(config);
  const { signals, domain, techStack } = projectModel;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 font-mono text-xs text-zinc-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="indigo">KNOWLEDGE ENGINE AUDIT</Badge>
            <Badge variant="emerald">100% Deterministic (No AI Key Required)</Badge>
          </div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            <span>Project Intelligence Audit & Rule Trail</span>
          </h2>
          <p className="text-[11px] text-zinc-400 font-sans">
            Explainable audit trail showing WHY rules fired, context signals, and knowledge relationships for <span className="text-indigo-300 font-bold">{projectModel.projectName}</span>.
          </p>
        </div>
      </div>

      {/* Context Signals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="p-4 bg-zinc-900/80 border-zinc-800 space-y-1">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Data Sensitivity
          </div>
          <div className="text-xl font-bold text-zinc-100">{signals.dataSensitivityScore} / 10</div>
          <div className="text-[10px] text-zinc-400 font-sans">
            {signals.dataSensitivityScore >= 7 ? 'High privacy / HIPAA requirements' : 'Standard data protection level'}
          </div>
        </Card>

        <Card className="p-4 bg-zinc-900/80 border-zinc-800 space-y-1">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-indigo-400" /> Risk Level
          </div>
          <div className="text-xl font-bold text-indigo-400 uppercase">{signals.riskLevel}</div>
          <div className="text-[10px] text-zinc-400 font-sans">Calculated domain vulnerability tier</div>
        </Card>

        <Card className="p-4 bg-zinc-900/80 border-zinc-800 space-y-1">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" /> Auth Pattern
          </div>
          <div className="text-sm font-bold text-emerald-300 uppercase truncate">{signals.authComplexity}</div>
          <div className="text-[10px] text-zinc-400 font-sans">Derived authentication architecture</div>
        </Card>

        <Card className="p-4 bg-zinc-900/80 border-zinc-800 space-y-1">
          <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-cyan-400" /> Domain Blueprint
          </div>
          <div className="text-sm font-bold text-cyan-300 truncate">{domain.domainName}</div>
          <div className="text-[10px] text-zinc-400 font-sans">{domain.primaryEntityNames.length} primary entities mapped</div>
        </Card>
      </div>

      {/* Fired Rules Audit Trail */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Fired Declarative Rules & Inferred Rationale ({auditTrail.length})
        </h3>

        {auditTrail.length === 0 ? (
          <Card className="p-6 text-center text-zinc-500">
            No custom security/financial rules fired. System operating under standard baseline architecture.
          </Card>
        ) : (
          <div className="space-y-2.5">
            {auditTrail.map((trail) => (
              <Card key={trail.factId} className="p-4 border-indigo-500/30 bg-zinc-900/90 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-300 text-xs">{trail.headline}</span>
                  <div className="flex items-center gap-2">
                    <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded text-[10px] uppercase">{trail.category}</span>
                    <span className="bg-emerald-950 border border-emerald-800 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                      {Math.round(trail.confidence * 100)}% Confidence
                    </span>
                  </div>
                </div>
                <p className="text-xs text-zinc-300 font-sans">{trail.reasoning}</p>
                <div className="text-[10px] text-zinc-500 pt-1 flex items-center gap-2">
                  <span>Affected Documents:</span>
                  {trail.affectedDocuments.map((doc) => (
                    <code key={doc} className="bg-zinc-950 text-indigo-400 px-1.5 py-0.5 rounded border border-zinc-800">
                      {doc}
                    </code>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Active Knowledge Entities */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
          Active Knowledge Base Entities & Stack Rationale
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {techStack.map((tech) => (
            <Card key={tech.name} className="p-3 bg-zinc-950 border-zinc-800 space-y-1">
              <div className="font-bold text-zinc-200">{tech.name}</div>
              <div className="text-[11px] text-zinc-400 font-sans">{tech.purpose}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
