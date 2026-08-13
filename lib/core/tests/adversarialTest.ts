import { analyzeProjectConfig } from '../analyzer';
import { qualityGatePipeline } from '../pipeline/qualityGate';
import { generatePRD } from '../generators/prdGenerator';
import { generateDesignSystem } from '../generators/designGenerator';
import { generateDatabase } from '../generators/databaseGenerator';
import { generateTechStack } from '../generators/techStackGenerator';
import { generateArchitecture } from '../generators/architectureGenerator';
import { generateAPI } from '../generators/apiGenerator';
import { generateSecurity } from '../generators/securityGenerator';
import { generateTesting } from '../generators/testingGenerator';
import { generateDeployment } from '../generators/deploymentGenerator';
import { sectionLockManager } from '../section-registry/sectionState';
import { ProjectConfig } from '../../engine/types';

/**
 * ============================================================================
 * ADVERSARIAL TEST SUITE
 * ============================================================================
 * Intentionally creates broken document bundles to prove that the 8-Step Quality
 * Gate Pipeline BLOCKS invalid exports 100% of the time.
 * ============================================================================
 */

export function runAdversarialTests(): boolean {
  console.log('⚔️ RUNNING ADVERSARIAL FAILURE TEST SUITE...\n');

  const validConfig: ProjectConfig = {
    projectName: 'FinPulse App',
    appType: 'custom',
    description: 'Financial accounting dashboard with payments and strict audit logs.',
    techStack: ['Next.js 14+ (App Router)', 'TypeScript', 'PostgreSQL', 'Stripe'],
    features: ['Payments', 'Transaction Audit Trail', 'Role Permissions'],
    dbEngine: 'PostgreSQL',
    designVibe: 'Modern IDE Dark (Zinc & Indigo)',
  };

  const { projectModel } = analyzeProjectConfig(validConfig);

  const getValidDocs = (): Record<string, string> => ({
    'PRD.md': generatePRD(projectModel),
    'DESIGN.md': generateDesignSystem(projectModel),
    'DATABASE.md': generateDatabase(projectModel),
    'TECH_STACK.md': generateTechStack(projectModel),
    'ARCHITECTURE.md': generateArchitecture(projectModel),
    'API.md': generateAPI(projectModel),
    'SECURITY.md': generateSecurity(projectModel),
    'TESTING.md': generateTesting(projectModel),
    'DEPLOYMENT.md': generateDeployment(projectModel),
  });

  let allAdversarialPassed = true;

  const assertFailure = (testName: string, mutatedDocs: Record<string, string>) => {
    const report = qualityGatePipeline.runQualityGate(projectModel, mutatedDocs);
    if (!report.passed) {
      console.log(`  ✅ ${testName}: BLOCKED EXPORT AS EXPECTED`);
    } else {
      console.error(`  ❌ ${testName}: FAILED TO BLOCK EXPORT (Quality Gate passed invalid docs!)`);
      allAdversarialPassed = false;
    }
  };

  // 1. Missing mandatory section
  const docsMissingSec = getValidDocs();
  docsMissingSec['PRD.md'] = docsMissingSec['PRD.md'].replace('## 4. Non-Goals', '## 4. Removed Section');
  assertFailure('1. missing-mandatory-section', docsMissingSec);

  // 2. Duplicate mandatory section
  const docsDupSec = getValidDocs();
  docsDupSec['PRD.md'] += '\n\n## 1. Product Overview\nDuplicate body content.';
  assertFailure('2. duplicate-mandatory-section', docsDupSec);

  // 3. Wrong section order
  const docsWrongOrder = getValidDocs();
  docsWrongOrder['PRD.md'] = docsWrongOrder['PRD.md'].replace('## 2. Problem Statement', '## 21. Future Considerations');
  assertFailure('3. wrong-section-order', docsWrongOrder);

  // 4. Empty mandatory section
  const docsEmptySec = getValidDocs();
  docsEmptySec['PRD.md'] = docsEmptySec['PRD.md'].replace(/## 3\. Goals & Objectives[\s\S]*?## 4/, '## 3. Goals & Objectives\n\n## 4');
  assertFailure('4. empty-mandatory-section', docsEmptySec);

  // 5. Unresolved template token
  const docsUnresolvedToken = getValidDocs();
  docsUnresolvedToken['PRD.md'] += '\n\nUnresolved token: {{user_name}}';
  assertFailure('5. unresolved-template-token', docsUnresolvedToken);

  // 6. Malformed Markdown title
  const docsMalformedMd = getValidDocs();
  docsMalformedMd['PRD.md'] = docsMalformedMd['PRD.md'].replace('# Product Requirements Document', 'Product Requirements Document');
  assertFailure('6. malformed-markdown-title', docsMalformedMd);

  // 7. Malformed Mermaid syntax (Node ID with spaces)
  const docsMalformedMermaid = getValidDocs();
  docsMalformedMermaid['ARCHITECTURE.md'] += '\n\n```mermaid\ngraph TD\n    Database Engine["Postgres"]\n```';
  assertFailure('7. malformed-mermaid-syntax', docsMalformedMermaid);

  // 8. Cross-document contradiction
  const docsContradiction = getValidDocs();
  docsContradiction['DATABASE.md'] += '\n\nDatabase technology used: MySQL InnoDB cluster.';
  assertFailure('8. cross-document-contradiction', docsContradiction);

  // 9. Invalid missing document file
  const docsMissingFile = getValidDocs();
  delete docsMissingFile['DESIGN.md'];
  assertFailure('9. missing-mandatory-document-file', docsMissingFile);

  // 10. Unclosed Mermaid block
  const docsUnclosedMermaid = getValidDocs();
  docsUnclosedMermaid['PRD.md'] += '\n\n```mermaid\ngraph TD\n  A --> B';
  assertFailure('10. unclosed-mermaid-block', docsUnclosedMermaid);

  // 11. Locked section user protection
  sectionLockManager.setSectionState({
    documentId: 'PRD',
    sectionId: 'goals',
    state: 'locked',
    userContent: 'Custom User Locked Goals Content.',
  });
  const resolved = sectionLockManager.resolveSectionContent('PRD', 'goals', 'Generated Content');
  if (resolved === 'Custom User Locked Goals Content.') {
    console.log('  ✅ 11. locked-section-protection: PRESERVED USER LOCKED CONTENT');
  } else {
    console.error('  ❌ 11. locked-section-protection: FAILED TO PRESERVE USER CONTENT');
    allAdversarialPassed = false;
  }

  // 12. Valid document bundle must pass
  const validDocs = getValidDocs();
  const validReport = qualityGatePipeline.runQualityGate(projectModel, validDocs);
  if (validReport.passed) {
    console.log('  ✅ 12. valid-document-bundle: PASSED QUALITY GATE & ALLOWED EXPORT');
  } else {
    console.error('  ❌ 12. valid-document-bundle: FAILED VALIDATION:', validReport.errors);
    allAdversarialPassed = false;
  }

  console.log(`\n🎉 ADVERSARIAL TEST SUITE RESULT: ${allAdversarialPassed ? 'PASSED (100% SUCCESS)' : 'FAILED'}\n`);
  return allAdversarialPassed;
}

// Execute tests when invoked directly
runAdversarialTests();
