import { AlertTriangle, CheckCircle, Zap, Shield, Lock } from 'lucide-react';
import { Card, Badge } from '../ui/Button';

export function ProblemSolution() {
  return (
    <section className="py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <Badge variant="indigo">WHY DEVCONTEXT ENGINE?</Badge>
        <h2 className="text-2xl sm:text-3xl font-mono font-bold text-zinc-100 tracking-tight">
          Eliminate AI Hallucinations With Instant Context
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 font-sans">
          AI coding tools produce sloppy code when provided vague prompts. DevContext Engine builds production-ready architecture specs locally in &lt;0.01 seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-red-900/30 bg-red-950/10">
          <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold mb-4">
            <AlertTriangle className="w-4 h-4" />
            <span>THE OLD SLOPPY WAY</span>
          </div>
          <ul className="space-y-3 text-xs font-mono text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✕</span>
              <span>Generic LLM generators requiring expensive API keys</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✕</span>
              <span>AI coding agents guessing folder structure & database schema</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 font-bold">✕</span>
              <span>Conflicting code conventions causing hours of debugging</span>
            </li>
          </ul>
        </Card>

        <Card className="border-emerald-900/30 bg-emerald-950/10">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold mb-4">
            <CheckCircle className="w-4 h-4" />
            <span>THE DEVCONTEXT ENGINE WAY</span>
          </div>
          <ul className="space-y-3 text-xs font-mono text-zinc-300">
            <li className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Client-Side Pure TypeScript Rule Engine (&lt;0.01s latency)</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero external AI API key costs & zero server payload logs</span>
            </li>
            <li className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>8 standardized markdown files ready for Cursor, Windsurf, & Claude</span>
            </li>
          </ul>
        </Card>
      </div>
    </section>
  );
}
