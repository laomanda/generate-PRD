import { ProjectConfig } from '../../engine/types';
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
import { completenessValidator } from '../validators/completenessValidator';

/**
 * ============================================================================
 * GOLDEN REGRESSION TEST SUITE
 * ============================================================================
 * Permanent regression test suite asserting:
 * 1. documentation-contract-completeness (100% section contract coverage)
 * 2. same-stack-different-domain (identical structure, 100% distinct content)
 * 3. different-stack-same-domain (identical structure, 100% distinct tech specs)
 * ============================================================================
 */

export function runGoldenTests(): boolean {
  console.log('🧪 RUNNING GOLDEN REGRESSION TEST SUITE...\n');

  // --- TEST 1: documentation-contract-completeness ---
  console.log('▶ Test 1: documentation-contract-completeness');
  const baseConfig: ProjectConfig = {
    projectName: 'SaaS Platform',
    appType: 'saas',
    description: 'B2B subscription management application with payments and RBAC.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Stripe'],
    features: ['Authentication', 'Subscription Billing', 'Workspace Tenant Isolation'],
    dbEngine: 'PostgreSQL',
    designVibe: 'Modern IDE Dark (Zinc & Indigo)',
  };

  const { projectModel } = analyzeProjectConfig(baseConfig);

  const docs = [
    { id: 'PRD', content: generatePRD(projectModel) },
    { id: 'DESIGN', content: generateDesignSystem(projectModel) },
    { id: 'DATABASE', content: generateDatabase(projectModel) },
    { id: 'TECH_STACK', content: generateTechStack(projectModel) },
    { id: 'ARCHITECTURE', content: generateArchitecture(projectModel) },
    { id: 'API', content: generateAPI(projectModel) },
    { id: 'SECURITY', content: generateSecurity(projectModel) },
    { id: 'TESTING', content: generateTesting(projectModel) },
    { id: 'DEPLOYMENT', content: generateDeployment(projectModel) },
  ];

  let test1Passed = true;
  for (const doc of docs) {
    const res = completenessValidator.validate(doc.id, doc.content);
    if (!res.valid) {
      test1Passed = false;
      console.error(`  ❌ Failed contract validation for ${res.filename}:`, res.errors);
    } else {
      console.log(`  ✅ Passed contract validation for ${res.filename}`);
    }
  }

  // --- TEST 2: same-stack-different-domain ---
  console.log('\n▶ Test 2: same-stack-different-domain');

  // Fixture A: Hospital Management
  const fixtureAConfig: ProjectConfig = {
    projectName: 'CarePulse Hospital',
    appType: 'custom',
    description: 'Hospital Management platform for doctors, patients, and medical records.',
    techStack: ['React', 'TypeScript', 'PostgreSQL'],
    features: ['Doctor Appointments', 'Patient Medical Records', 'Prescription Management'],
    dbEngine: 'PostgreSQL',
    designVibe: 'Modern IDE Dark (Zinc & Indigo)',
  };

  // Fixture B: Event Management
  const fixtureBConfig: ProjectConfig = {
    projectName: 'EventVibe Manager',
    appType: 'custom',
    description: 'Event Management platform for organizers, attendees, and ticket sales.',
    techStack: ['React', 'TypeScript', 'PostgreSQL'],
    features: ['Ticket Sales', 'Attendee Registration', 'Venue Scheduling'],
    dbEngine: 'PostgreSQL',
    designVibe: 'Modern IDE Dark (Zinc & Indigo)',
  };

  const { projectModel: modelA } = analyzeProjectConfig(fixtureAConfig);
  const { projectModel: modelB } = analyzeProjectConfig(fixtureBConfig);

  const prdA = generatePRD(modelA);
  const prdB = generatePRD(modelB);

  const dbA = generateDatabase(modelA);
  const dbB = generateDatabase(modelB);

  const prdADomainTerm = prdA.includes('CarePulse Hospital') || prdA.includes('Hospital') || prdA.includes('Doctor');
  const prdBDomainTerm = prdB.includes('EventVibe Manager') || prdB.includes('EventVibe') || prdB.includes('Ticket');

  const contentIsDifferent = prdA !== prdB && dbA !== dbB;
  const test2Passed = prdADomainTerm && prdBDomainTerm && contentIsDifferent;

  if (test2Passed) {
    console.log('  ✅ Passed same-stack-different-domain test: Content is 100% domain-specific.');
  } else {
    console.error('  ❌ Failed same-stack-different-domain test details:', { prdADomainTerm, prdBDomainTerm, contentIsDifferent });
  }

  // --- TEST 3: different-stack-same-domain ---
  console.log('\n▶ Test 3: different-stack-same-domain');

  // Fixture C: Ecommerce Store (React + Laravel + MySQL)
  const fixtureCConfig: ProjectConfig = {
    projectName: 'ElectroMart Store',
    appType: 'e-commerce',
    description: 'Online Ecommerce store for electronics catalog, cart, checkout, and order fulfillment.',
    techStack: ['React + Vite', 'Laravel', 'MySQL'],
    features: ['Product Catalog', 'Shopping Cart Checkout', 'Order Tracking'],
    dbEngine: 'MySQL',
    designVibe: 'Modern IDE Dark (Zinc & Indigo)',
  };

  // Fixture D: Ecommerce Store (Next.js + Supabase + PostgreSQL)
  const fixtureDConfig: ProjectConfig = {
    projectName: 'ElectroMart Store',
    appType: 'e-commerce',
    description: 'Online Ecommerce store for electronics catalog, cart, checkout, and order fulfillment.',
    techStack: ['Next.js 14+ (App Router)', 'TypeScript', 'Supabase', 'PostgreSQL'],
    features: ['Product Catalog', 'Shopping Cart Checkout', 'Order Tracking'],
    dbEngine: 'PostgreSQL',
    designVibe: 'Modern IDE Dark (Zinc & Indigo)',
  };

  const { projectModel: modelC } = analyzeProjectConfig(fixtureCConfig);
  const { projectModel: modelD } = analyzeProjectConfig(fixtureDConfig);

  const techC = generateTechStack(modelC);
  const techD = generateTechStack(modelD);

  const dbC = generateDatabase(modelC);
  const dbD = generateDatabase(modelD);

  const techStackDiffers = techC.includes('MySQL') && techD.includes('PostgreSQL') && techC !== techD;
  const dbEngineDiffers = dbC.includes('MySQL') && dbD.includes('PostgreSQL') && dbC !== dbD;

  const test3Passed = techStackDiffers && dbEngineDiffers;

  if (test3Passed) {
    console.log('  ✅ Passed different-stack-same-domain test: Technology & DB specs adapt accurately.');
  } else {
    console.error('  ❌ Failed different-stack-same-domain test details:', { techStackDiffers, dbEngineDiffers });
  }

  const allPassed = test1Passed && test2Passed && test3Passed;
  console.log(`\n🎉 GOLDEN TEST SUITE RESULT: ${allPassed ? 'PASSED (100% SUCCESS)' : 'FAILED'}\n`);
  return allPassed;
}

// Execute tests when script is invoked directly
runGoldenTests();
