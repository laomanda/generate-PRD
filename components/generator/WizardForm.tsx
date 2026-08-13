'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspaceStore } from '@/lib/store/useWorkspaceStore';
import { TECH_STACKS, DESIGN_THEMES, DB_PRESETS, AppType } from '@/lib/engine';
import { FEATURE_MODULE_LIST } from '@/lib/engine/dictionaries/featureModules';
import { Button, Card } from '../ui/Button';
import { Layers, Database, Palette, Cpu, Play, Boxes, FileText } from 'lucide-react';

export function WizardForm() {
  const router = useRouter();
  const { config, setConfig, generateWorkspace } = useWorkspaceStore();

  const handleToggleStack = (stackName: string) => {
    const current = config.techStack || [];
    const next = current.includes(stackName)
      ? current.filter((s) => s !== stackName)
      : [...current, stackName];
    setConfig({ techStack: next });
  };

  const handleToggleFeature = (featureName: string) => {
    const current = config.features || [];
    const next = current.includes(featureName)
      ? current.filter((f) => f !== featureName)
      : [...current, featureName];
    setConfig({ features: next });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateWorkspace(config);
    router.push('/workspace');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* STEP 1: PROJECT IDENTITY */}
      <Card>
        <h3 className="text-xs font-mono text-indigo-400 font-bold mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4" /> 1. PROJECT IDENTITY
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Project Name</label>
            <input
              type="text"
              value={config.projectName}
              onChange={(e) => setConfig({ projectName: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-1">Application Type</label>
            <select
              value={config.appType}
              onChange={(e) => setConfig({ appType: e.target.value as AppType })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="saas">SaaS Platform</option>
              <option value="e-commerce">E-Commerce</option>
              <option value="dashboard">Analytics Dashboard</option>
              <option value="mobile">Mobile Backend</option>
              <option value="api">REST / GraphQL API</option>
              <option value="custom">Custom Application</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-xs font-mono text-zinc-400 mb-1">
            <FileText className="w-3.5 h-3.5 inline mr-1" />
            Project Description
          </label>
          <textarea
            value={config.description}
            onChange={(e) => setConfig({ description: e.target.value })}
            placeholder="Describe your project in detail — the engine will use this to compose unique documentation..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-300 focus:outline-none focus:border-indigo-500 h-20 resize-none"
          />
        </div>
      </Card>

      {/* STEP 2: FEATURE MODULE SELECTOR ⭐ (NEW) */}
      <Card>
        <h3 className="text-xs font-mono text-indigo-400 font-bold mb-2 flex items-center gap-2">
          <Boxes className="w-4 h-4" /> 2. FEATURE MODULES
        </h3>
        <p className="text-[10px] font-sans text-zinc-500 mb-4">
          Select the features your project needs. Each module adds specific database tables, requirements, user flows, and API endpoints to your documentation.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {FEATURE_MODULE_LIST.map((featureName) => {
            const isSelected = config.features.includes(featureName);
            return (
              <button
                type="button"
                key={featureName}
                onClick={() => handleToggleFeature(featureName)}
                className={`p-2.5 rounded-lg border text-left text-xs font-mono transition-all ${
                  isSelected
                    ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="font-semibold text-[11px] leading-tight">{featureName}</div>
              </button>
            );
          })}
        </div>
        {config.features.length > 0 && (
          <div className="mt-3 text-[10px] font-mono text-zinc-500">
            <span className="text-indigo-400 font-bold">{config.features.length}</span> module(s) selected — engine will compose unique output from these modules.
          </div>
        )}
      </Card>

      {/* STEP 3: TECH STACK SELECTION */}
      <Card>
        <h3 className="text-xs font-mono text-indigo-400 font-bold mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4" /> 3. TECH STACK SELECTION
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {TECH_STACKS.map((tech) => {
            const isSelected = config.techStack.includes(tech.name);
            return (
              <button
                type="button"
                key={tech.id}
                onClick={() => handleToggleStack(tech.name)}
                className={`p-2.5 rounded-lg border text-left text-xs font-mono transition-all ${
                  isSelected
                    ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                }`}
              >
                <div className="font-semibold">{tech.name}</div>
                <div className="text-[10px] text-zinc-500 line-clamp-1">{tech.description}</div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* STEP 4: DATABASE & DESIGN */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-mono text-indigo-400 font-bold mb-3 flex items-center gap-2">
              <Database className="w-4 h-4" /> 4. DATABASE ENGINE
            </h3>
            <select
              value={config.dbEngine}
              onChange={(e) => setConfig({ dbEngine: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-indigo-500"
            >
              {DB_PRESETS.map((db) => (
                <option key={db.id} value={db.name}>
                  {db.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="text-xs font-mono text-indigo-400 font-bold mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4" /> 5. DESIGN VIBE
            </h3>
            <select
              value={config.designVibe}
              onChange={(e) => setConfig({ designVibe: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-indigo-500"
            >
              {DESIGN_THEMES.map((theme) => (
                <option key={theme.id} value={theme.name}>
                  {theme.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" className="gap-2">
          <Play className="w-4 h-4" />
          <span>Build Architecture Suite</span>
        </Button>
      </div>
    </form>
  );
}
