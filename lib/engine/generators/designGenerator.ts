import { ProjectConfig } from '../types';

export function generateDesignSystem(config: ProjectConfig): string {
  const { designVibe } = config;
  const vibe = designVibe || 'Modern IDE Dark';

  return `# 🎨 DESIGN SYSTEM & VISUAL GUIDELINES

## 1. Aesthetic Direction
- **Vibe Concept**: ${vibe}
- **Default Theme**: Dark Mode First (\`#09090B\` / Zinc-950)
- **Visual Style**: High contrast, monospaced accents, crisp \`zinc-800\` panel borders, subtle indigo ambient glows.

## 2. Color Token Matrix

| Token Name | Hex Code | Utility Class | Usage |
| :--- | :--- | :--- | :--- |
| \`bg-app\` | \`#09090B\` | \`bg-zinc-950\` | Primary App Background |
| \`bg-surface\` | \`#18181B\` | \`bg-zinc-900\` | Card, Modal, Sidebar Containers |
| \`bg-element\` | \`#27272A\` | \`bg-zinc-800\` | Interactive Inputs, Active Tabs |
| \`border-main\` | \`#27272A\` | \`border-zinc-800\` | Structural Panel Dividers |
| \`text-primary\`| \`#FAFAFA\` | \`text-zinc-50\` | Headings & Core Typography |
| \`text-muted\`  | \`#A1A1AA\` | \`text-zinc-400\` | Secondary Labels & Descriptions |
| \`accent-brand\`| \`#6366F1\` | \`bg-indigo-500\` | Primary Call To Action |

## 3. Tailwind CSS Component Snippets

\`\`\`tsx
// Primary CTA Button
export function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg px-4 py-2.5 transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
      {children}
    </button>
  );
}

// IDE Card Container
export function IdeCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl text-zinc-100">
      {children}
    </div>
  );
}
\`\`\`
`;
}
