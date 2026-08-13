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
import { qualityGatePipeline } from '../core/pipeline/qualityGate';
import { getAffectedDocuments } from '../core/section-registry/dependencyMap';

export * from './types';
export * from './dictionaries/techStacks';
export * from './dictionaries/designThemes';
export * from './dictionaries/dbPresets';

export interface RunEngineOptions {
  previousFiles?: GeneratedFile[];
  changedFields?: (keyof ProjectConfig)[];
}

export function runDevContextEngine(
  config: ProjectConfig,
  options?: RunEngineOptions
): GeneratorResult {
  const timestamp = new Date().toISOString();
  
  // 1. Run Knowledge-Driven Project Intelligence Pipeline
  const { projectModel } = analyzeProjectConfig(config);
  
  // 2. Determine Partial Regeneration Invalidation Set
  const prevFileMap: Record<string, string> = {};
  if (options?.previousFiles) {
    options.previousFiles.forEach(f => { prevFileMap[f.filename] = f.content; });
  }

  const affectedDocs = options?.changedFields && options.changedFields.length > 0
    ? getAffectedDocuments(options.changedFields)
    : null;

  const getContent = (filename: string, generator: () => string): string => {
    // If partial regeneration options are provided and this file is NOT affected, reuse previous content
    if (affectedDocs && prevFileMap[filename] && !affectedDocs.has(filename)) {
      return prevFileMap[filename];
    }
    return generator();
  };

  // 3. Generate Contract-Enforced Documents from Project Model
  const files: GeneratedFile[] = [
    {
      filename: 'PRD.md',
      path: 'PRD.md',
      content: getContent('PRD.md', () => generatePRD(projectModel)),
      language: 'markdown',
    },
    {
      filename: 'ARCHITECTURE.md',
      path: 'ARCHITECTURE.md',
      content: getContent('ARCHITECTURE.md', () => generateArchitecture(projectModel)),
      language: 'markdown',
    },
    {
      filename: 'DATABASE.md',
      path: 'DATABASE.md',
      content: getContent('DATABASE.md', () => generateDatabase(projectModel)),
      language: 'markdown',
    },
    {
      filename: 'DESIGN.md',
      path: 'DESIGN.md',
      content: getContent('DESIGN.md', () => generateDesignSystem(projectModel)),
      language: 'markdown',
    },
    {
      filename: 'TECH_STACK.md',
      path: 'TECH_STACK.md',
      content: getContent('TECH_STACK.md', () => generateTechStack(projectModel)),
      language: 'markdown',
    },
    {
      filename: 'API.md',
      path: 'API.md',
      content: getContent('API.md', () => generateAPI(projectModel)),
      language: 'markdown',
    },
    {
      filename: 'SECURITY.md',
      path: 'SECURITY.md',
      content: getContent('SECURITY.md', () => generateSecurity(projectModel)),
      language: 'markdown',
    },
    {
      filename: 'TESTING.md',
      path: 'TESTING.md',
      content: getContent('TESTING.md', () => generateTesting(projectModel)),
      language: 'markdown',
    },
    {
      filename: 'DEPLOYMENT.md',
      path: 'DEPLOYMENT.md',
      content: getContent('DEPLOYMENT.md', () => generateDeployment(projectModel)),
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

  // 4. Execute 8-Step Final Quality Gate Pipeline (Hard Enforcement)
  const docMap: Record<string, string> = {};
  files.forEach(f => { docMap[f.filename] = f.content; });

  const gateReport = qualityGatePipeline.runQualityGate(projectModel, docMap);

  if (!gateReport.passed) {
    throw new Error(`[Quality Gate Failure] Generation blocked: ${gateReport.errors.join(' | ')}`);
  }

  return {
    projectName: config.projectName || 'DevContext Project',
    timestamp,
    files,
  };
}
