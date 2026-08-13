import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProjectConfig, GeneratorResult, GeneratedFile } from '../engine/types';
import { runDevContextEngine } from '../engine';

interface WorkspaceState {
  config: ProjectConfig;
  result: GeneratorResult | null;
  selectedFile: GeneratedFile | null;
  viewMode: 'preview' | 'raw' | 'mermaid' | 'inspector';
  history: GeneratorResult[];
  
  setConfig: (partial: Partial<ProjectConfig>) => void;
  generateWorkspace: (overrideConfig?: ProjectConfig) => void;
  setSelectedFile: (file: GeneratedFile | null) => void;
  setViewMode: (mode: 'preview' | 'raw' | 'mermaid' | 'inspector') => void;
  loadHistoryItem: (item: GeneratorResult) => void;
  clearHistory: () => void;
}

const DEFAULT_CONFIG: ProjectConfig = {
  projectName: 'DevContext Engine App',
  appType: 'saas',
  description: '100% Client-Side Architecture Generator for modern developer tools.',
  techStack: ['Next.js 14+ (App Router)', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
  features: ['Dual Input Mode (Freestyle & Wizard)', 'Interactive IDE Workspace', 'Client-Side ZIP Exporter'],
  dbEngine: 'PostgreSQL',
  designVibe: 'Modern IDE Dark (Zinc & Indigo)',
  rawPrompt: '',
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      config: DEFAULT_CONFIG,
      result: null,
      selectedFile: null,
      viewMode: 'preview',
      history: [],

      setConfig: (partial) =>
        set((state) => ({
          config: { ...state.config, ...partial },
        })),

      generateWorkspace: (overrideConfig?: ProjectConfig) => {
        const configToUse = overrideConfig || get().config;
        const newResult = runDevContextEngine(configToUse);
        set((state) => ({
          config: configToUse,
          result: newResult,
          selectedFile: newResult.files[0] || null,
          history: [newResult, ...state.history.filter(h => h.projectName !== newResult.projectName)].slice(0, 10),
        }));
      },

      setSelectedFile: (file) => set({ selectedFile: file }),
      setViewMode: (viewMode) => set({ viewMode }),

      loadHistoryItem: (item) => set({
        result: item,
        selectedFile: item.files[0] || null,
      }),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'devcontext-workspace-storage',
      partialize: (state) => ({ history: state.history, config: state.config }),
    }
  )
);
