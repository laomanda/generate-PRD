'use client';

import React, { useState } from 'react';
import { FileText, Copy, Check, Play } from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui/Button';
import { generatePRD } from '@/lib/engine/generators/prdGenerator';
import { AppType } from '@/lib/engine/types';

export default function PrdToolPage() {
  const [appType, setAppType] = useState<AppType>('saas');
  const [projectName, setProjectName] = useState('Product Specification Blueprint');
  const [description, setDescription] = useState('Comprehensive Product Requirement Document');
  const [copied, setCopied] = useState(false);
  
  const [content, setContent] = useState(() =>
    generatePRD({
      projectName: 'Product Specification Blueprint',
      appType: 'saas',
      description: 'Comprehensive Product Requirement Document',
      techStack: ['Next.js 14+ (App Router)', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
      features: ['Authentication & Authorization', 'User Profile Management', 'Role-Based Access (RBAC)'],
      dbEngine: 'PostgreSQL',
      designVibe: 'Modern IDE Dark (Zinc & Indigo)',
    })
  );

  const handleGenerate = () => {
    const nextContent = generatePRD({
      projectName,
      appType,
      description: `${projectName} - ${description}`,
      techStack: ['Next.js 14+ (App Router)', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
      features: [],
      dbEngine: 'PostgreSQL',
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
          <Badge variant="emerald">14-Point PRD Standard</Badge>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold text-zinc-100 flex items-center gap-3">
          <FileText className="w-8 h-8 text-indigo-400" />
          <span>Product Requirement Document (PRD) Generator</span>
        </h1>
        <p className="text-xs text-zinc-400 font-sans">
          Standalone generator for 14-point working PRD specifications (Why → Who → What → How → Done When → KPI).
        </p>
      </div>

      <Card className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1">Project Name:</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Website Sekolah 1, Kasir Restoran, Rental Mobil..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-1">Application Type:</label>
            <select
              value={appType}
              onChange={(e) => setAppType(e.target.value as AppType)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="saas">SaaS Multi-Tenant Platform</option>
              <option value="e-commerce">E-Commerce Storefront</option>
              <option value="dashboard">Analytics Dashboard</option>
              <option value="mobile">Mobile Backend API</option>
              <option value="api">Developer API Platform</option>
              <option value="custom">Custom Web Solution</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-400 mb-1">Project Description / Purpose:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description or keywords (e.g. guru, siswa, kelas, nilai, absensi...)"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 justify-end pt-2">
          <Button onClick={handleGenerate} size="sm" className="gap-2">
            <Play className="w-3.5 h-3.5" />
            <span>Generate 14-Point PRD</span>
          </Button>

          <Button onClick={handleCopy} variant="secondary" size="sm" className="gap-2">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-indigo-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </Button>
        </div>
      </Card>

      <Card className="space-y-3">
        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Generated 14-Point PRD Document</h3>
        <textarea
          value={content}
          readOnly
          className="w-full h-[550px] bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-300 font-mono resize-none focus:outline-none"
        />
      </Card>
    </div>
  );
}
