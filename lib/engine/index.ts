import { ProjectConfig, GeneratorResult, GeneratedFile } from './types';
import { analyzeProjectConfig } from '../core/analyzer';
import { generatePRD } from '../core/generators/prdGenerator';
import { generateArchitecture } from '../core/generators/architectureGenerator';
import { generateDatabase } from '../core/generators/databaseGenerator';
import { generateDesignSystem } from '../core/generators/designGenerator';
import { generateTechStack } from '../core/generators/techStackGenerator';
import { generateAPI } from '../core/generators/apiGenerator';
import { generateSecurity } from '../core/generators/securityGenerator';
import { generateTesting } from '../core/generators/testingGenerator';
import { generateDeployment } from '../core/generators/deploymentGenerator';
import { generateCursorRules, generateMegaPrompt } from './generators/rulesGenerator';
import { generateReadme } from './generators/readmeGenerator';

export * from './types';
export * from './dictionaries/techStacks';
export * from './dictionaries/designThemes';
export * from './dictionaries/dbPresets';

export function runDevContextEngine(config: ProjectConfig): GeneratorResult {
  const timestamp = new Date().toISOString();
  
  // 1. Run Knowledge-Driven Project Intelligence Pipeline
  const { projectModel } = analyzeProjectConfig(config);
  
  // 2. Generate Documents from Project Model
  const files: GeneratedFile[] = [
    {
      filename: 'PRD.md',
      path: 'PRD.md',
      content: generatePRD(projectModel),
      language: 'markdown',
    },
    {
      filename: 'ARCHITECTURE.md',
      path: 'ARCHITECTURE.md',
      content: generateArchitecture(projectModel),
      language: 'markdown',
    },
    {
      filename: 'DATABASE.md',
      path: 'DATABASE.md',
      content: generateDatabase(projectModel),
      language: 'markdown',
    },
    {
      filename: 'DESIGN_SYSTEM.md',
      path: 'DESIGN_SYSTEM.md',
      content: generateDesignSystem(projectModel),
      language: 'markdown',
    },
    {
      filename: 'TECH_STACK.md',
      path: 'TECH_STACK.md',
      content: generateTechStack(projectModel),
      language: 'markdown',
    },
    {
      filename: 'API.md',
      path: 'API.md',
      content: generateAPI(projectModel),
      language: 'markdown',
    },
    {
      filename: 'SECURITY.md',
      path: 'SECURITY.md',
      content: generateSecurity(projectModel),
      language: 'markdown',
    },
    {
      filename: 'TESTING.md',
      path: 'TESTING.md',
      content: generateTesting(projectModel),
      language: 'markdown',
    },
    {
      filename: 'DEPLOYMENT.md',
      path: 'DEPLOYMENT.md',
      content: generateDeployment(projectModel),
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
  ];

  return {
    projectName: config.projectName || 'DevContext Project',
    timestamp,
    files,
  };
}
