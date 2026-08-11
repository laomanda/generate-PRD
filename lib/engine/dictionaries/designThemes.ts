import { DesignTheme } from '../types';

export const DESIGN_THEMES: DesignTheme[] = [
  {
    id: 'ide-dark',
    name: 'Modern IDE Dark (Zinc & Indigo)',
    description: 'High contrast dark theme inspired by VS Code and Raycast',
    colors: {
      bg: '#09090b',
      surface: '#18181b',
      primary: '#fafafa',
      accent: '#6366f1',
    },
  },
  {
    id: 'neon-cyber',
    name: 'Cyberpunk Neon (Slate & Cyan)',
    description: 'Vibrant electric contrast with cybernetic cyan highlights',
    colors: {
      bg: '#020617',
      surface: '#0f172a',
      primary: '#f8fafc',
      accent: '#06b6d4',
    },
  },
  {
    id: 'minimal-light',
    name: 'Clean Studio Light',
    description: 'Minimalist crisp monochrome design for technical documentation',
    colors: {
      bg: '#ffffff',
      surface: '#f4f4f5',
      primary: '#18181b',
      accent: '#2563eb',
    },
  },
];
