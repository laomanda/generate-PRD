import { ProjectConfig } from '../types';

export function generateArchitecture(config: ProjectConfig): string {
  const { projectName, techStack, appType } = config;
  return `# 🏗️ SYSTEM ARCHITECTURE DOCUMENT

## 1. High-Level System Architecture
The **${projectName || 'DevContext App'}** architecture follows a modular, client-first design pattern optimized for scalability and maintainability.

\`\`\`mermaid
graph TD
    Client["Client Browser / UI Layer"]
    Store["State Store (Zustand)"]
    Engine["Rule Engine & Services"]
    Storage["Local Cache / Storage"]

    Client --> Store
    Store --> Engine
    Engine --> Storage
\`\`\`

## 2. Technology Stack Breakdown
${techStack.map(tech => `- **${tech}**: Fundamental layer component.`).join('\n') || '- **TypeScript**: Static typing & contract verification.'}

## 3. Directory Layout Pattern
\`\`\`text
${projectName ? projectName.toLowerCase().replace(/\s+/g, '-') : 'app'}/
├── app/                  # Application routes and page components
├── components/           # Reusable UI components & layouts
├── lib/                  # Core domain logic, engines, & helpers
└── public/               # Static assets & icons
\`\`\`

## 4. Architectural Directives
- **Single Source of Truth**: State flows unidirectionally from central stores to subscriber UI components.
- **Pure Functional Core**: Core business algorithms are pure, side-effect free TypeScript functions.
- **Zero API Dependency**: All rule execution happens locally within the runtime context.
`;
}
