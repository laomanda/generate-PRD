import { ProjectConfig } from '../types';

export function generateCursorRules(config: ProjectConfig): string {
  const { projectName, techStack } = config;

  return `# Cursor Agent Rules for ${projectName || 'DevContext Project'}

## Project Directives
- **Project Name**: ${projectName || 'DevContext Project'}
- **Tech Stack**: ${techStack.join(', ') || 'Next.js 14, TypeScript, Tailwind CSS'}

## Strict Coding Guidelines
1. **TypeScript First**: Never output \`any\` types. Define strict interfaces for all data structures.
2. **Client-Side Safety**: Validate user inputs with Zod schemas before state updates.
3. **UI Consistency**: Adhere to the Zinc-950 dark mode palette with Indigo (\`#6366F1\`) accents.
4. **Code Structure**: Keep components modular, self-contained, and focused on single responsibilities.
5. **No External AI Key Dependency**: All business logic functions must execute locally within pure TypeScript helpers.
`;
}

export function generateMegaPrompt(config: ProjectConfig): string {
  const { projectName, description, techStack, features } = config;

  return `================================================================================
MEGA PROMPT: ${projectName || 'DevContext Engine Blueprint'}
================================================================================

I am building a high-performance web application called "${projectName || 'DevContext Engine'}".

Description:
${description || 'A modern client-side web application.'}

Tech Stack:
${techStack.map(t => `- ${t}`).join('\n')}

Key Features:
${features.map(f => `- ${f}`).join('\n')}

Execution Instructions for LLM/Coding Assistant:
1. Follow standard modular folder conventions.
2. Implement clean responsive UI layouts using Tailwind CSS.
3. Write clean, self-documenting code with comprehensive TypeScript type annotations.
4. Maintain deterministic client state management.
`;
}
