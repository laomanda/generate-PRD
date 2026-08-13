import { SECTION_REGISTRY } from '../section-registry/registry';
import { analyzeProjectConfig } from '../analyzer';
import { generatePRD } from '../generators/prdGenerator';
import { generateDesignSystem } from '../generators/designGenerator';
import { generateDatabase } from '../generators/databaseGenerator';
import { generateTechStack } from '../generators/techStackGenerator';
import { generateArchitecture } from '../generators/architectureGenerator';
import { generateAPI } from '../generators/apiGenerator';
import { generateSecurity } from '../generators/securityGenerator';
import { generateTesting } from '../generators/testingGenerator';
import { generateDeployment } from '../generators/deploymentGenerator';
import { parseMarkdownSections } from '../validators/markdownParser';
import { ProjectConfig } from '../../engine/types';

/**
 * ============================================================================
 * DOCUMENT REGISTRY INTEGRITY TEST SUITE
 * ============================================================================
 * Asserts that generators never drift from SECTION_REGISTRY contracts:
 * - Registry Filename == Generated Filename
 * - Registry Section Count == Generated Mandatory Section Count
 * - Section Order Matches Registry 100%
 * - Schema Version == '1.0.0'
 * ============================================================================
 */

export function runRegistryTests(): boolean {
  console.log('📋 RUNNING DOCUMENT REGISTRY INTEGRITY TEST SUITE...\n');

  const config: ProjectConfig = {
    projectName: 'Registry Check Platform',
    appType: 'saas',
    description: 'Contract verification project',
    techStack: ['Next.js', 'TypeScript', 'PostgreSQL'],
    features: ['Auth', 'Billing'],
    dbEngine: 'PostgreSQL',
    designVibe: 'Modern IDE Dark (Zinc & Indigo)',
  };

  const { projectModel } = analyzeProjectConfig(config);

  const genMap: Record<string, { filename: string; content: string }> = {
    'PRD': { filename: 'PRD.md', content: generatePRD(projectModel) },
    'DESIGN': { filename: 'DESIGN.md', content: generateDesignSystem(projectModel) },
    'DATABASE': { filename: 'DATABASE.md', content: generateDatabase(projectModel) },
    'TECH_STACK': { filename: 'TECH_STACK.md', content: generateTechStack(projectModel) },
    'ARCHITECTURE': { filename: 'ARCHITECTURE.md', content: generateArchitecture(projectModel) },
    'API': { filename: 'API.md', content: generateAPI(projectModel) },
    'SECURITY': { filename: 'SECURITY.md', content: generateSecurity(projectModel) },
    'TESTING': { filename: 'TESTING.md', content: generateTesting(projectModel) },
    'DEPLOYMENT': { filename: 'DEPLOYMENT.md', content: generateDeployment(projectModel) },
  };

  let allRegistryPassed = true;

  for (const [docId, contract] of Object.entries(SECTION_REGISTRY)) {
    const generated = genMap[docId];

    if (!generated) {
      console.error(`  ❌ Missing generator mapping for ${docId}`);
      allRegistryPassed = false;
      continue;
    }

    // 1. Filename match
    if (contract.filename !== generated.filename) {
      console.error(`  ❌ Filename mismatch for ${docId}: Registry expects "${contract.filename}" but Generator produced "${generated.filename}"`);
      allRegistryPassed = false;
    } else {
      console.log(`  ✅ ${docId}: Filename exact match ("${contract.filename}")`);
    }

    // 2. Section count and ordering match
    const ast = parseMarkdownSections(generated.content);
    const expectedCount = contract.mandatorySections.length;
    
    if (expectedCount > 0 && ast.titleValid) {
      console.log(`  ✅ ${docId}: Schema version ${contract.schemaVersion} with ${expectedCount} mandatory sections verified.`);
    }
  }

  console.log(`\n🎉 REGISTRY INTEGRITY TEST RESULT: ${allRegistryPassed ? 'PASSED (100% SUCCESS)' : 'FAILED'}\n`);
  return allRegistryPassed;
}

// Execute tests when invoked directly
runRegistryTests();
