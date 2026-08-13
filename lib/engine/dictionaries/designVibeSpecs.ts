export interface ColorToken {
  name: string;
  hex: string;
  tailwind: string;
  usage: string;
}

export interface DesignVibeSpec {
  name: string;
  concept: string;
  direction: string;
  fontFamily: { ui: string; code: string };
  colors: ColorToken[];
  spacingScale: { name: string; px: string; tailwind: string }[];
  borderRadius: { name: string; px: string; tailwind: string }[];
  buttonStates: {
    primary: string;
    secondary: string;
    outline: string;
    danger: string;
  };
  responsiveGrid: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  tailwindMapping: { token: string; class: string }[];
}

export const DESIGN_VIBE_SPECS: Record<string, DesignVibeSpec> = {
  'Modern IDE Dark (Zinc & Indigo)': {
    name: 'Modern IDE Dark (Zinc & Indigo)',
    concept: 'VS Code & Developer Tool Studio Aesthetic. Crisp borders, dark zinc surface backgrounds, and electric indigo brand accents.',
    direction: 'Professional, clean, high-density, trustworthy, dark-mode first.',
    fontFamily: {
      ui: 'Inter, Plus Jakarta Sans, system-ui, sans-serif',
      code: 'JetBrains Mono, Fira Code, monospace',
    },
    colors: [
      { name: 'bg-app', hex: '#09090B', tailwind: 'bg-zinc-950', usage: 'Primary App Background' },
      { name: 'bg-surface', hex: '#18181B', tailwind: 'bg-zinc-900', usage: 'Cards, Modals, Sidebars, File Tree Containers' },
      { name: 'bg-element', hex: '#27272A', tailwind: 'bg-zinc-800', usage: 'Active Tabs, Input Backgrounds, Hover Surfaces' },
      { name: 'border-main', hex: '#27272A', tailwind: 'border-zinc-800', usage: 'Structural Panel Dividers & Borders' },
      { name: 'text-primary', hex: '#FAFAFA', tailwind: 'text-zinc-50', usage: 'Headings, Active Labels, & Core Text' },
      { name: 'text-muted', hex: '#A1A1AA', tailwind: 'text-zinc-400', usage: 'Subtitles, Secondary Labels, & Descriptions' },
      { name: 'accent-brand', hex: '#6366F1', tailwind: 'bg-indigo-600', usage: 'Primary CTA Buttons & Active State Highlights' },
      { name: 'accent-green', hex: '#10B981', tailwind: 'bg-emerald-500', usage: 'Success Badges & Status Indicators' },
      { name: 'accent-red', hex: '#EF4444', tailwind: 'bg-red-500', usage: 'Destructive Actions & Danger Buttons' },
    ],
    spacingScale: [
      { name: '4px', px: '4px', tailwind: 'p-1 / gap-1' },
      { name: '8px', px: '8px', tailwind: 'p-2 / gap-2' },
      { name: '12px', px: '12px', tailwind: 'p-3 / gap-3' },
      { name: '16px', px: '16px', tailwind: 'p-4 / gap-4' },
      { name: '24px', px: '24px', tailwind: 'p-6 / gap-6' },
      { name: '32px', px: '32px', tailwind: 'p-8 / gap-8' },
    ],
    borderRadius: [
      { name: 'sm', px: '4px', tailwind: 'rounded-sm' },
      { name: 'md', px: '6px', tailwind: 'rounded-md' },
      { name: 'lg', px: '8px', tailwind: 'rounded-lg' },
      { name: 'xl', px: '12px', tailwind: 'rounded-xl' },
      { name: 'full', px: '9999px', tailwind: 'rounded-full' },
    ],
    buttonStates: {
      primary: 'bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg px-4 py-2.5 transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed',
      secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-lg px-4 py-2 transition-all active:scale-95',
      outline: 'bg-transparent border border-zinc-700 hover:bg-zinc-800 text-zinc-300 rounded-lg px-4 py-2 transition-all',
      danger: 'bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg px-4 py-2 transition-all active:scale-95',
    },
    responsiveGrid: {
      mobile: 'Grid 1 Column, Padding 16px, Collapsible Drawer Menu',
      tablet: 'Grid 2 Columns, Padding 24px, Sidebar Toggleable',
      desktop: 'Grid 12 Columns (Max-Width 1280px / 1536px), Padding 32px, Fixed Explorer Sidebar',
    },
    tailwindMapping: [
      { token: 'App Background', class: 'bg-zinc-950' },
      { token: 'Card Surface', class: 'bg-zinc-900 border border-zinc-800' },
      { token: 'Primary CTA Button', class: 'bg-indigo-600 hover:bg-indigo-500 text-white' },
      { token: 'Text Main Heading', class: 'text-zinc-50 font-bold' },
      { token: 'Text Subtitle', class: 'text-zinc-400 font-sans' },
      { token: 'Code Block Container', class: 'bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300' },
    ],
  },

  'Cyberpunk Neon (Slate & Cyan)': {
    name: 'Cyberpunk Neon (Slate & Cyan)',
    concept: 'Futuristic high-contrast dark theme featuring deep slate surfaces and luminous electric cyan glows.',
    direction: 'Edgy, vibrant, high-contrast, futuristic.',
    fontFamily: {
      ui: 'Inter, system-ui, sans-serif',
      code: 'Fira Code, monospace',
    },
    colors: [
      { name: 'bg-app', hex: '#0F172A', tailwind: 'bg-slate-950', usage: 'Deep Slate Background' },
      { name: 'bg-surface', hex: '#1E293B', tailwind: 'bg-slate-900', usage: 'Surface Card Containers' },
      { name: 'bg-element', hex: '#334155', tailwind: 'bg-slate-800', usage: 'Interactive Input & Tab Surfaces' },
      { name: 'border-main', hex: '#334155', tailwind: 'border-slate-800', usage: 'Panel Borders & Lines' },
      { name: 'text-primary', hex: '#F8FAFC', tailwind: 'text-slate-50', usage: 'Primary Text & Titles' },
      { name: 'text-muted', hex: '#94A3B8', tailwind: 'text-slate-400', usage: 'Secondary Descriptions' },
      { name: 'accent-brand', hex: '#06B6D4', tailwind: 'bg-cyan-500', usage: 'Electric Cyan Primary Buttons' },
      { name: 'accent-green', hex: '#10B981', tailwind: 'bg-emerald-500', usage: 'Status Indicators' },
      { name: 'accent-red', hex: '#F43F5E', tailwind: 'bg-rose-500', usage: 'Danger & Warning Signals' },
    ],
    spacingScale: [
      { name: '4px', px: '4px', tailwind: 'p-1 / gap-1' },
      { name: '8px', px: '8px', tailwind: 'p-2 / gap-2' },
      { name: '16px', px: '16px', tailwind: 'p-4 / gap-4' },
      { name: '24px', px: '24px', tailwind: 'p-6 / gap-6' },
    ],
    borderRadius: [
      { name: 'md', px: '6px', tailwind: 'rounded-md' },
      { name: 'lg', px: '8px', tailwind: 'rounded-lg' },
      { name: 'full', px: '9999px', tailwind: 'rounded-full' },
    ],
    buttonStates: {
      primary: 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg px-4 py-2.5 transition-all shadow-lg shadow-cyan-500/25 active:scale-95',
      secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg px-4 py-2 transition-all',
      outline: 'bg-transparent border border-cyan-500/50 text-cyan-400 hover:bg-cyan-950/40 rounded-lg px-4 py-2 transition-all',
      danger: 'bg-rose-600 hover:bg-rose-500 text-white font-medium rounded-lg px-4 py-2 transition-all',
    },
    responsiveGrid: {
      mobile: 'Grid 1 Column, Padding 16px',
      tablet: 'Grid 2 Columns, Padding 24px',
      desktop: 'Grid 12 Columns (Max-Width 1280px), Padding 32px',
    },
    tailwindMapping: [
      { token: 'App Background', class: 'bg-slate-950' },
      { token: 'Card Surface', class: 'bg-slate-900 border border-slate-800' },
      { token: 'Primary CTA Button', class: 'bg-cyan-500 text-slate-950 font-bold' },
      { token: 'Text Main Heading', class: 'text-slate-50 font-bold' },
    ],
  },

  'Clean Studio Light': {
    name: 'Clean Studio Light',
    concept: 'Minimalist light theme with neutral gray surfaces, crisp subtle borders, and deep blue brand accents.',
    direction: 'Clean, spacious, highly legible, professional.',
    fontFamily: {
      ui: 'Inter, system-ui, sans-serif',
      code: 'JetBrains Mono, monospace',
    },
    colors: [
      { name: 'bg-app', hex: '#FAFAFA', tailwind: 'bg-neutral-50', usage: 'Clean Light Background' },
      { name: 'bg-surface', hex: '#FFFFFF', tailwind: 'bg-white', usage: 'Primary White Card Surface' },
      { name: 'bg-element', hex: '#F5F5F5', tailwind: 'bg-neutral-100', usage: 'Input & Active Tab Backgrounds' },
      { name: 'border-main', hex: '#E5E5E5', tailwind: 'border-neutral-200', usage: 'Structural Panel Borders' },
      { name: 'text-primary', hex: '#171717', tailwind: 'text-neutral-900', usage: 'Core Headings & Dark Text' },
      { name: 'text-muted', hex: '#737373', tailwind: 'text-neutral-500', usage: 'Secondary Labels & Captions' },
      { name: 'accent-brand', hex: '#2563EB', tailwind: 'bg-blue-600', usage: 'Primary Royal Blue CTA' },
      { name: 'accent-green', hex: '#16A34A', tailwind: 'bg-green-600', usage: 'Success Badges' },
      { name: 'accent-red', hex: '#DC2626', tailwind: 'bg-red-600', usage: 'Danger Actions' },
    ],
    spacingScale: [
      { name: '4px', px: '4px', tailwind: 'p-1 / gap-1' },
      { name: '8px', px: '8px', tailwind: 'p-2 / gap-2' },
      { name: '16px', px: '16px', tailwind: 'p-4 / gap-4' },
      { name: '24px', px: '24px', tailwind: 'p-6 / gap-6' },
    ],
    borderRadius: [
      { name: 'md', px: '6px', tailwind: 'rounded-md' },
      { name: 'lg', px: '8px', tailwind: 'rounded-lg' },
      { name: 'xl', px: '12px', tailwind: 'rounded-xl' },
    ],
    buttonStates: {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2.5 transition-all shadow-md shadow-blue-600/20 active:scale-95',
      secondary: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 rounded-lg px-4 py-2 transition-all',
      outline: 'bg-transparent border border-neutral-300 hover:bg-neutral-100 text-neutral-700 rounded-lg px-4 py-2 transition-all',
      danger: 'bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg px-4 py-2 transition-all',
    },
    responsiveGrid: {
      mobile: 'Grid 1 Column, Padding 16px',
      tablet: 'Grid 2 Columns, Padding 24px',
      desktop: 'Grid 12 Columns (Max-Width 1280px), Padding 32px',
    },
    tailwindMapping: [
      { token: 'App Background', class: 'bg-neutral-50' },
      { token: 'Card Surface', class: 'bg-white border border-neutral-200' },
      { token: 'Primary CTA Button', class: 'bg-blue-600 hover:bg-blue-700 text-white' },
      { token: 'Text Main Heading', class: 'text-neutral-900 font-bold' },
    ],
  },
};
