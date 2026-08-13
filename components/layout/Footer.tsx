import { Terminal, Shield, Cpu } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-8 text-zinc-400 text-xs font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span>DevContext Engine &copy; {new Date().getFullYear()}</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">Pure TypeScript Rule Engine</span>
        </div>

        <div className="flex items-center gap-6 text-zinc-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Shield className="w-3.5 h-3.5" />
            <span>0% API Key Exposure</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Browser Native</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
