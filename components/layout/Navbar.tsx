'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, Database, Palette, History, Layout, Sparkles, FileText, Cpu } from 'lucide-react';
import { Badge } from '../ui/Button';

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Full Suite', icon: Sparkles },
    { href: '/workspace', label: 'Workspace', icon: Layout },
    { href: '/tools/prd', label: 'PRD Tool', icon: FileText },
    { href: '/tools/database', label: 'DB Tool', icon: Database },
    { href: '/tools/design-system', label: 'Design System', icon: Palette },
    { href: '/tools/tech-stack', label: 'Tech Stack', icon: Cpu },
    { href: '/history', label: 'History', icon: History },
  ];

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:border-indigo-400 transition-all">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-100 tracking-tight text-base font-mono">DevContext</span>
              <Badge variant="emerald">100% Free</Badge>
            </div>
            <p className="text-[10px] text-zinc-400 font-mono">Zero-AI-Key Architecture Engine</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-indigo-400 border border-zinc-700 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
