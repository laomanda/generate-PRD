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
  error: string | null;
  
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
      error: null,

      setConfig: (partial) =>
        set((state) => ({
          config: { ...state.config, ...partial },
        })),

      generateWorkspace: (overrideConfig?: ProjectConfig) => {
        const currentConfig = get().config;
        const configToUse = overrideConfig || currentConfig;
        const currentResult = get().result;

        // Calculate changed fields for partial regeneration
        const changedFields: (keyof ProjectConfig)[] = [];
        (Object.keys(configToUse) as (keyof ProjectConfig)[]).forEach((key) => {
          if (JSON.stringify(configToUse[key]) !== JSON.stringify(currentConfig[key])) {
            changedFields.push(key);
          }
        });

        try {
          const newResult = runDevContextEngine(configToUse, {
            previousFiles: currentResult?.files,
            changedFields,
          });

          set((state) => ({
            config: configToUse,
            result: newResult,
            selectedFile: newResult.files.find(f => f.filename === state.selectedFile?.filename) || newResult.files[0] || null,
            history: [newResult, ...state.history.filter(h => h.projectName !== newResult.projectName)].slice(0, 10),
            error: null,
          }));
        } catch (err: unknown) {
          const errorMsg = err instanceof Error ? err.message : String(err);
          console.error('[Workspace Engine Error]', errorMsg);
          set({ error: errorMsg });
        }
      },

      setSelectedFile: (file) => set({ selectedFile: file }),
      setViewMode: (viewMode) => set({ viewMode }),

      loadHistoryItem: (item) => set({
        result: item,
        selectedFile: item.files[0] || null,
        error: null,
      }),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'devcontext-workspace-storage',
      partialize: (state) => ({ history: state.history, config: state.config }),
    }
  )
);
