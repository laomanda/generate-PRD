import { ProjectConfig } from '../../engine/types';

/**
 * ============================================================================
 * DEPENDENCY-AWARE DOCUMENT INVALIDATION MAP
 * ============================================================================
 * When project input fields change, invalidates ONLY affected documents,
 * preserving unrelated documents from being unnecessarily rewritten.
 * ============================================================================
 */

export interface ConfigChangeDiff {
  changedFields: (keyof ProjectConfig)[];
}

export const DOCUMENT_DEPENDENCIES: Record<keyof ProjectConfig, string[]> = {
  dbEngine: ['DATABASE.md', 'TECH_STACK.md', 'ARCHITECTURE.md', 'SECURITY.md', 'DEPLOYMENT.md'],
  techStack: ['TECH_STACK.md', 'ARCHITECTURE.md', 'DEPLOYMENT.md'],
  features: ['PRD.md', 'DESIGN.md', 'DATABASE.md', 'API.md'],
  designVibe: ['DESIGN.md'],
  projectName: ['PRD.md', 'DESIGN.md', 'DATABASE.md', 'TECH_STACK.md', 'ARCHITECTURE.md', 'API.md', 'SECURITY.md', 'TESTING.md', 'DEPLOYMENT.md'],
  appType: ['PRD.md', 'DESIGN.md', 'DATABASE.md'],
  description: ['PRD.md', 'ARCHITECTURE.md'],
  rawPrompt: ['PRD.md', 'DATABASE.md'],
};

export function getAffectedDocuments(changedFields: (keyof ProjectConfig)[]): Set<string> {
  const affected = new Set<string>();
  changedFields.forEach(field => {
    const docs = DOCUMENT_DEPENDENCIES[field] || [];
    docs.forEach(d => affected.add(d));
  });
  return affected;
}
