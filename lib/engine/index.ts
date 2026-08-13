import { ProjectConfig, GeneratorResult, GeneratedFile } from './types';
import { generatePRD } from './generators/prdGenerator';
import { generateArchitecture } from './generators/archGenerator';
import { generateDatabase } from './generators/dbGenerator';
import { generateDesignSystem } from './generators/designGenerator';
import { generateTechStack } from './generators/techStackGenerator';
import { generateCursorRules, generateMegaPrompt } from './generators/rulesGenerator';
import { generateReadme } from './generators/readmeGenerator';

export * from './types';
export * from './dictionaries/techStacks';
export * from './dictionaries/designThemes';
export * from './dictionaries/dbPresets';

export function runDevContextEngine(config: ProjectConfig): GeneratorResult {
  const timestamp = new Date().toISOString();
  
  const files: GeneratedFile[] = [
    {
      filename: 'PRD.md',
      path: 'PRD.md',
      content: generatePRD(config),
      language: 'markdown',
    },
    {
      filename: 'ARCHITECTURE.md',
      path: 'ARCHITECTURE.md',
      content: generateArchitecture(config),
      language: 'markdown',
    },
    {
      filename: 'DATABASE.md',
      path: 'DATABASE.md',
      content: generateDatabase(config),
      language: 'markdown',
    },
    {
      filename: 'DESIGN_SYSTEM.md',
      path: 'DESIGN_SYSTEM.md',
      content: generateDesignSystem(config),
      language: 'markdown',
    },
    {
      filename: 'TECH_STACK.md',
      path: 'TECH_STACK.md',
      content: generateTechStack(config),
      language: 'markdown',
    },
    {
      filename: '.cursorrules',
      path: '.cursorrules',
      content: generateCursorRules(config),
      language: 'text',
    },
    {
      filename: 'README.md',
      path: 'README.md',
      content: generateReadme(config),
      language: 'markdown',
    },
    {
      filename: 'MEGA_PROMPT.txt',
      path: 'MEGA_PROMPT.txt',
      content: generateMegaPrompt(config),
      language: 'text',
    },
    {
      filename: 'TESTING.md',
      path: 'TESTING.md',
      content: `# 🧪 TESTING STRATEGY\n\n- Run unit tests with Vitest/Jest.\n- End-to-end user journeys with Playwright.\n`,
      language: 'markdown',
    },
  ];

  return {
    projectName: config.projectName || 'DevContext Project',
    timestamp,
    files,
  };
}
