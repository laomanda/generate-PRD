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
import { ProjectConfig } from '../../engine/types';

export function runSemanticDiffTest() {
  console.log('🔬 RUNNING SEMANTIC DIFF VERIFICATION...\n');

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

  const generateBundle = (config: ProjectConfig) => {
    const { projectModel } = analyzeProjectConfig(config);
    return {
      PRD: generatePRD(projectModel),
      DESIGN: generateDesignSystem(projectModel),
      DATABASE: generateDatabase(projectModel),
      TECH_STACK: generateTechStack(projectModel),
      ARCHITECTURE: generateArchitecture(projectModel),
      API: generateAPI(projectModel),
      SECURITY: generateSecurity(projectModel),
      TESTING: generateTesting(projectModel),
      DEPLOYMENT: generateDeployment(projectModel),
    };
  };

  const hospitalDocs = generateBundle(fixtureAConfig);
  const eventDocs = generateBundle(fixtureBConfig);
  const ecommerceDocs = generateBundle(fixtureCConfig);

  const calculateOverlap = (doc1: Record<string, string>, doc2: Record<string, string>, name: string): number => {
    let totalLines = 0;
    let overlappingLines = 0;

    console.log(`\n--- Overlap samples for ${name} ---`);
    for (const key of Object.keys(doc1)) {
      const getSemanticLines = (doc: string) => doc.split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 20 && !l.startsWith('#') && !l.startsWith('>'));

      const lines1 = getSemanticLines(doc1[key]);
      const lines2 = getSemanticLines(doc2[key]);

      totalLines += lines1.length;
      const overlapping = lines1.filter(l => lines2.includes(l));
      overlappingLines += overlapping.length;

      if (overlapping.length > 0) {
        console.log(`[${key}] Example overlaps:`);
        console.log(`  - ${overlapping.slice(0, 3).join('\n  - ')}`);
      }
    }

    return (overlappingLines / totalLines) * 100;
  };

  const hVsE = calculateOverlap(hospitalDocs, eventDocs, 'Hospital vs Event');
  const hVsC = calculateOverlap(hospitalDocs, ecommerceDocs, 'Hospital vs Ecommerce');
  const eVsC = calculateOverlap(eventDocs, ecommerceDocs, 'Event vs Ecommerce');

  console.log(`Hospital vs Event Overlap: ${hVsE.toFixed(2)}%`);
  console.log(`Hospital vs Ecommerce Overlap: ${hVsC.toFixed(2)}%`);
  console.log(`Event vs Ecommerce Overlap: ${eVsC.toFixed(2)}%`);

  if (hVsE > 30 || hVsC > 30 || eVsC > 30) {
    console.error('❌ SEMANTIC OVERLAP EXCEEDS 30%. Test Failed.');
    process.exit(1);
  } else {
    console.log('✅ SEMANTIC DIVERSITY CONFIRMED. Test Passed.');
  }
}

runSemanticDiffTest();
