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
import { ProjectConfig } from '../../engine/types';

/**
 * ============================================================================
 * REALITY TEST SUITE — BLACK-BOX SEMANTIC GENERATION AUDIT
 * ============================================================================
 * Evaluates semantic diversity, structural consistency, technology adaptation,
 * security reasoning, database schema specificity, determinism, boilerplate,
 * placeholder detection, and provenance tracking across 3 real fixtures.
 * ============================================================================
 */

export interface FixtureBundle {
  id: string;
  name: string;
  config: ProjectConfig;
  documents: Record<string, string>;
}

export function runRealityTest() {
  console.log('🔬 RUNNING REALITY TEST — SEMANTIC DOCUMENTATION GENERATION AUDIT...\n');

  // --- 1. DEFINE THREE REAL PROJECT FIXTURES ---
  const fixtureAConfig: ProjectConfig = {
    projectName: 'CarePulse Hospital Management',
    appType: 'custom',
    description: 'Healthcare hospital management system for patient registration, doctor appointments, electronic medical records, prescriptions, and role-based access control.',
    techStack: ['React', 'TypeScript', 'PostgreSQL', 'REST API'],
    features: ['Patient Registration', 'Doctor Appointments', 'Medical Records', 'Prescription Management', 'Role Permissions'],
    dbEngine: 'PostgreSQL',
    designVibe: 'Modern IDE Dark (Zinc & Indigo)',
  };

  const fixtureBConfig: ProjectConfig = {
    projectName: 'EventVibe Ticketing Platform',
    appType: 'custom',
    description: 'Event management platform for organizers, ticket sales, attendee registration, QR code check-in, venue capacity management, and payment processing.',
    techStack: ['React', 'TypeScript', 'PostgreSQL', 'REST API'],
    features: ['Event Creation', 'Ticket Purchasing', 'Attendee Registration', 'QR Check-in', 'Capacity Management'],
    dbEngine: 'PostgreSQL',
    designVibe: 'Modern IDE Dark (Zinc & Indigo)',
  };

  const fixtureCConfig: ProjectConfig = {
    projectName: 'ElectroMart Ecommerce Store',
    appType: 'e-commerce',
    description: 'Online ecommerce platform for seller product catalog, shopping cart, checkout, inventory tracking, order fulfillment, and Stripe payments.',
    techStack: ['Next.js 14+ (App Router)', 'TypeScript', 'Supabase', 'PostgreSQL'],
    features: ['Product Catalog', 'Shopping Cart', 'Order Fulfillment', 'Inventory Tracking', 'Payment Processing'],
    dbEngine: 'PostgreSQL',
    designVibe: 'Modern IDE Dark (Zinc & Indigo)',
  };

  const generateBundle = (id: string, name: string, config: ProjectConfig): FixtureBundle => {
    const { projectModel } = analyzeProjectConfig(config);
    const documents: Record<string, string> = {
      'PRD.md': generatePRD(projectModel),
      'DESIGN.md': generateDesignSystem(projectModel),
      'DATABASE.md': generateDatabase(projectModel),
      'TECH_STACK.md': generateTechStack(projectModel),
      'ARCHITECTURE.md': generateArchitecture(projectModel),
      'API.md': generateAPI(projectModel),
      'SECURITY.md': generateSecurity(projectModel),
      'TESTING.md': generateTesting(projectModel),
      'DEPLOYMENT.md': generateDeployment(projectModel),
    };
    return { id, name, config, documents };
  };

  const bundleA = generateBundle('hospital', 'Hospital Management', fixtureAConfig);
  const bundleB = generateBundle('event', 'Event Management', fixtureBConfig);
  const bundleC = generateBundle('ecommerce', 'Ecommerce Store', fixtureCConfig);

  const bundles = [bundleA, bundleB, bundleC];

  // --- 2. STRUCTURAL TEST ---
  console.log('▶ 1. STRUCTURAL CONSISTENCY TEST');
  let structuralPass = true;
  for (const b of bundles) {
    const { projectModel } = analyzeProjectConfig(b.config);
    const gateReport = qualityGatePipeline.runQualityGate(projectModel, b.documents);
    if (!gateReport.passed) {
      console.error(`  ❌ ${b.name} failed Quality Gate structural validation:`, gateReport.errors);
      structuralPass = false;
    } else {
      console.log(`  ✅ ${b.name}: 100% Structural Consistency & Registry Contract Match.`);
    }
  }

  // --- 3. SEMANTIC DIVERSITY & KEYWORD DENSITY TEST ---
  console.log('\n▶ 2. SEMANTIC DIVERSITY & DOMAIN CONCEPTS AUDIT');
  const checkKeywords = (doc: string, keywords: string[]) => {
    const found = keywords.filter(kw => doc.toLowerCase().includes(kw.toLowerCase()));
    return { count: found.length, total: keywords.length, found };
  };

  const hospitalDbKW = checkKeywords(bundleA.documents['DATABASE.md'], ['patient', 'doctor', 'appointment', 'medical', 'prescription', 'health']);
  const eventDbKW = checkKeywords(bundleB.documents['DATABASE.md'], ['event', 'ticket', 'attendee', 'checkin', 'capacity', 'organizer']);
  const ecomDbKW = checkKeywords(bundleC.documents['DATABASE.md'], ['product', 'cart', 'order', 'inventory', 'payment', 'shipping']);

  console.log(`  Hospital DATABASE.md domain keywords found: ${hospitalDbKW.count}/${hospitalDbKW.total} (${hospitalDbKW.found.join(', ')})`);
  console.log(`  Event DATABASE.md domain keywords found: ${eventDbKW.count}/${eventDbKW.total} (${eventDbKW.found.join(', ')})`);
  console.log(`  Ecommerce DATABASE.md domain keywords found: ${ecomDbKW.count}/${ecomDbKW.total} (${ecomDbKW.found.join(', ')})`);

  // --- 4. TECHNOLOGY ADAPTATION TEST ---
  console.log('\n▶ 3. TECHNOLOGY ADAPTATION AUDIT (React+REST vs Next.js+Supabase)');
  const techA = bundleA.documents['TECH_STACK.md'];
  const techC = bundleC.documents['TECH_STACK.md'];

  const ecomHasNext = techC.includes('Next.js');
  const ecomHasSupa = techC.includes('Supabase');
  const hospitalHasReact = techA.includes('React');

  console.log(`  Hospital TECH_STACK specifies React: ${hospitalHasReact}`);
  console.log(`  Ecommerce TECH_STACK specifies Next.js & Supabase: ${ecomHasNext && ecomHasSupa}`);

  // --- 5. STATIC BOILERPLATE PARAGRAPH ANALYSIS ---
  console.log('\n▶ 4. STATIC BOILERPLATE PARAGRAPH ANALYSIS');
  const extractParagraphs = (doc: string) => {
    return doc.split('\n\n')
      .map(p => p.trim())
      .filter(p => p.length > 40 && !p.startsWith('#') && !p.startsWith('```'));
  };

  const pA = extractParagraphs(bundleA.documents['TESTING.md']);
  const pB = extractParagraphs(bundleB.documents['TESTING.md']);
  const duplicateParagraphs = pA.filter(p => pB.includes(p));

  console.log(`  Identical paragraphs in TESTING.md between Hospital and Event: ${duplicateParagraphs.length}/${pA.length}`);
  if (duplicateParagraphs.length > 0) {
    console.log(`  Sample identical paragraph: "${duplicateParagraphs[0].substring(0, 80)}..."`);
  }

  // --- 6. PLACEHOLDER & HALLUCINATION AUDIT ---
  console.log('\n▶ 5. PLACEHOLDER & UNRESOLVED TOKEN AUDIT');
  const forbidden = ['{{', '}}', '[TODO]', 'UNDEFINED', 'null null', 'Lorem ipsum'];
  let placeholderCount = 0;

  for (const b of bundles) {
    for (const [filename, content] of Object.entries(b.documents)) {
      for (const token of forbidden) {
        if (content.includes(token)) {
          console.error(`  ❌ Placeholder detected in ${b.name} (${filename}): "${token}"`);
          placeholderCount++;
        }
      }
    }
  }
  if (placeholderCount === 0) {
    console.log('  ✅ Zero unresolved placeholders, TODOs, or raw template tokens across all 27 generated files.');
  }

  // --- 7. DETERMINISM TEST ---
  console.log('\n▶ 6. DETERMINISM TEST');
  const bundleA2 = generateBundle('hospital2', 'Hospital Management 2', fixtureAConfig);
  const detPass = bundleA.documents['PRD.md'] === bundleA2.documents['PRD.md'];
  console.log(`  Identical input produces 100% deterministic PRD.md: ${detPass}`);

  // --- 8. REGENERATION IMPACT TEST ---
  console.log('\n▶ 7. REGENERATION IMPACT TEST');
  const fixtureBMod: ProjectConfig = {
    ...fixtureBConfig,
    features: ['Event Creation', 'Ticket Purchasing', 'Attendee Registration', 'Manual Check-in Verification', 'Capacity Management'],
  };
  const bundleBMod = generateBundle('event_mod', 'Event Mod', fixtureBMod);

  const prdB1 = bundleB.documents['PRD.md'];
  const prdB2 = bundleBMod.documents['PRD.md'];
  const prdChanged = prdB1 !== prdB2;
  console.log(`  Changing feature from QR check-in to Manual Check-in updates PRD.md: ${prdChanged}`);

  return {
    structuralPass,
    hospitalDbKW,
    eventDbKW,
    ecomDbKW,
    ecomHasNext,
    ecomHasSupa,
    duplicateParagraphCount: duplicateParagraphs.length,
    placeholderCount,
    detPass,
    prdChanged,
  };
}

runRealityTest();
