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

// ============================================================================
// 1. PROJECT FIXTURES
// ============================================================================

export const hospitalConfig: ProjectConfig = {
  projectName: 'CareFlow Hospital Suite',
  appType: 'custom',
  description: 'Clinical management system for doctors, patients, appointments, medical records, and prescriptions.',
  techStack: ['React', 'TypeScript', 'PostgreSQL', 'REST API'],
  features: ['Patient Registration', 'Doctor Management', 'Appointments', 'Medical Records', 'Prescriptions'],
  dbEngine: 'PostgreSQL',
  designVibe: 'Modern IDE Dark (Zinc & Indigo)',
};

export const ecommerceConfig: ProjectConfig = {
  projectName: 'EcomSphere Storefront',
  appType: 'custom',
  description: 'Online shop hosting product catalog, inventory tracking, shopping cart, checkout, and shipping.',
  techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'REST API'],
  features: ['Product Catalog', 'Inventory Tracking', 'Shopping Cart', 'Checkout', 'Shipping'],
  dbEngine: 'PostgreSQL',
  designVibe: 'Modern IDE Dark (Zinc & Indigo)',
};

export const eventConfig: ProjectConfig = {
  projectName: 'EventVibe Ticket Engine',
  appType: 'custom',
  description: 'Event management platform for organizers, tickets, attendee registration, and QR check-in.',
  techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'REST API'],
  features: ['Event Creation', 'Ticket Sales', 'Attendee Registration', 'QR Check-in'],
  dbEngine: 'PostgreSQL',
  designVibe: 'Modern IDE Dark (Zinc & Indigo)',
};

export const vehicleRentalConfig: ProjectConfig = {
  projectName: 'Vehicle Rental Management',
  appType: 'custom',
  description: 'Fleet vehicle reservation platform for customers, car rentals, vehicle availability, returns, and inspection tracking.',
  techStack: ['React', 'TypeScript', 'PostgreSQL', 'REST API'],
  features: ['Vehicle Fleet Catalog', 'Customer Reservations', 'Rental Return Tracking', 'Vehicle Inspection'],
  dbEngine: 'PostgreSQL',
  designVibe: 'Modern IDE Dark (Zinc & Indigo)',
};

// MANDATORY NOVEL DOMAIN FIXTURE (Never hardcoded in codebase)
export const droneInspectionConfig: ProjectConfig = {
  projectName: 'Drone Inspection & Maintenance Operations',
  appType: 'custom',
  description: 'Operational platform for scheduling drone inspection missions, managing drones and operators, recording flight telemetry and inspection findings, and tracking battery maintenance cycles.',
  techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'REST API'],
  features: [
    'Drone Fleet Inventory',
    'Inspection Mission Scheduling',
    'Flight Telemetry Logs',
    'Inspection Defect Findings',
    'Battery Maintenance Cycles',
  ],
  dbEngine: 'PostgreSQL',
  designVibe: 'Modern IDE Dark (Zinc & Indigo)',
};

// Bundle generation helper
export function generateBundle(config: ProjectConfig) {
  const { projectModel } = analyzeProjectConfig(config);
  return {
    projectModel,
    docs: {
      'PRD.md': generatePRD(projectModel),
      'DESIGN.md': generateDesignSystem(projectModel),
      'DATABASE.md': generateDatabase(projectModel),
      'TECH_STACK.md': generateTechStack(projectModel),
      'ARCHITECTURE.md': generateArchitecture(projectModel),
      'API.md': generateAPI(projectModel),
      'SECURITY.md': generateSecurity(projectModel),
      'TESTING.md': generateTesting(projectModel),
      'DEPLOYMENT.md': generateDeployment(projectModel),
    },
  };
}

// Token Jaccard overlap helper
export function calculateJaccard(textA: string, textB: string): number {
  const wordsA = new Set(textA.toLowerCase().match(/\b[a-z]{4,}\b/g) || []);
  const wordsB = new Set(textB.toLowerCase().match(/\b[a-z]{4,}\b/g) || []);
  const intersection = new Set([...wordsA].filter(x => wordsB.has(x)));
  const union = new Set([...wordsA, ...wordsB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

// Mermaid Diagram Extraction & Structural Validator
export function validateMermaidDiagrams(docName: string, markdown: string) {
  const mermaidRegex = /```mermaid\s*([\s\S]*?)```/g;
  const matches = [...markdown.matchAll(mermaidRegex)];
  const results: { valid: boolean; code: string; error?: string }[] = [];

  for (const match of matches) {
    const code = match[1].trim();
    if (!code) {
      results.push({ valid: false, code, error: 'Empty Mermaid code block' });
      continue;
    }

    // Clean out Mermaid relationship cardinality notation like '}o--||' or '}o--o{' before brace counting
    const cleanedCodeForBraces = code.replace(/\}o--/g, '---').replace(/--o\{/g, '---');

    // Syntax validation
    const hasValidHeader = /^(graph|flowchart|erDiagram|sequenceDiagram|classDiagram)\b/i.test(code);
    const openBraces = (cleanedCodeForBraces.match(/\{/g) || []).length;
    const closeBraces = (cleanedCodeForBraces.match(/\}/g) || []).length;
    const hasBalancedBraces = openBraces === closeBraces;
    const hasGenericPlaceholder = /\b(placeholder|foo|bar|example_table|dummy_node)\b/i.test(code);

    if (!hasValidHeader) {
      results.push({ valid: false, code, error: 'Missing diagram type header (graph/flowchart/erDiagram)' });
    } else if (!hasBalancedBraces) {
      results.push({ valid: false, code, error: `Unbalanced braces in diagram (${openBraces} open vs ${closeBraces} close)` });
    } else if (hasGenericPlaceholder) {
      results.push({ valid: false, code, error: 'Contains generic placeholder nodes' });
    } else {
      results.push({ valid: true, code });
    }
  }

  return results;
}

// ============================================================================
// MAIN AUDIT SUITE
// ============================================================================

async function runOutputTruthTest() {
  console.log('🔥 RUNNING REAL OUTPUT TRUTH & GENERATED MARKDOWN CONTENT TEST...\n');

  const hospitalBundle = generateBundle(hospitalConfig);
  const ecommerceBundle = generateBundle(ecommerceConfig);
  const eventBundle = generateBundle(eventConfig);
  const vehicleBundle = generateBundle(vehicleRentalConfig);
  const droneBundle = generateBundle(droneInspectionConfig);

  const bundles = {
    Hospital: hospitalBundle,
    Ecommerce: ecommerceBundle,
    Event: eventBundle,
    VehicleRental: vehicleBundle,
    DroneInspection: droneBundle,
  };

  // --------------------------------------------------------------------------
  // 1. NOVEL DOMAIN SANITY CHECK
  // --------------------------------------------------------------------------
  console.log('📌 1. NOVEL DOMAIN CHECK (Drone Inspection & Maintenance Operations):');
  const droneEntities = droneBundle.projectModel.domain.entities.map(e => e.name);
  console.log(`   Derived Entities: [${droneEntities.join(', ')}]`);
  console.log(`   Derived Roles: [${droneBundle.projectModel.domain.userRoles.map(r => r.role).join(', ')}]`);
  console.log(`   Derived Workflows: [${droneBundle.projectModel.domain.coreWorkflows.join(', ')}]`);

  const hasDroneEntity = droneEntities.some(e => /drone/i.test(e));
  const hasInspectionEntity = droneEntities.some(e => /inspection|mission|telemetry|defect/i.test(e));
  console.log(`   ✅ Novel Domain Derived Drone/Inspection Entities: ${hasDroneEntity && hasInspectionEntity}`);

  // --------------------------------------------------------------------------
  // 2. ACTUAL MARKDOWN CONTENT COMPARISON & JACCARD OVERLAP
  // --------------------------------------------------------------------------
  console.log('\n📌 2. GENERATED MARKDOWN CONTENT COMPARISON & JACCARD OVERLAP:');
  const domainKeys = Object.keys(bundles) as (keyof typeof bundles)[];
  let maxCrossJaccard = 0;

  for (let i = 0; i < domainKeys.length; i++) {
    for (let j = i + 1; j < domainKeys.length; j++) {
      const nameA = domainKeys[i];
      const nameB = domainKeys[j];
      const bundleA = bundles[nameA];
      const bundleB = bundles[nameB];

      const fullTextA = Object.values(bundleA.docs).join('\n');
      const fullTextB = Object.values(bundleB.docs).join('\n');

      const jaccard = calculateJaccard(fullTextA, fullTextB);
      if (jaccard > maxCrossJaccard) maxCrossJaccard = jaccard;

      console.log(`   Compare ${nameA} vs ${nameB}: Jaccard Similarity = ${(jaccard * 100).toFixed(1)}%`);
    }
  }

  console.log(`   Cross-Domain Jaccard Overlap: ${(maxCrossJaccard * 100).toFixed(1)}%`);

  // --------------------------------------------------------------------------
  // 3. STALE DOMAIN CONTAMINATION MUTATION TESTS
  // --------------------------------------------------------------------------
  console.log('\n📌 3. STALE DOMAIN CONTAMINATION MUTATION TESTS:');

  const mutationSpecs = [
    {
      from: 'Hospital',
      to: 'Vehicle Rental',
      toConfig: vehicleRentalConfig,
      staleTerms: ['patient_record', 'medical_doctor', 'prescription_issue', 'clinical_appointment', 'hipaa_compliance'],
    },
    {
      from: 'Vehicle Rental',
      to: 'Hospital',
      toConfig: hospitalConfig,
      staleTerms: ['vehicle_fleet', 'car_rental', 'rental_return', 'mileage_tracking', 'vehicle_inspection'],
    },
    {
      from: 'Event',
      to: 'Ecommerce',
      toConfig: ecommerceConfig,
      staleTerms: ['ticket_sales', 'attendee_registration', 'venue_checkin', 'qr_ticket', 'event_organizer'],
    },
    {
      from: 'Ecommerce',
      to: 'Drone Inspection',
      toConfig: droneInspectionConfig,
      staleTerms: ['shopping_cart', 'product_catalog', 'checkout_flow', 'order_fulfillment', 'shipping_tracker'],
    },
    {
      from: 'Drone Inspection',
      to: 'Hospital',
      toConfig: hospitalConfig,
      staleTerms: ['drone_fleet', 'inspection_mission', 'flight_telemetry', 'defect_finding', 'battery_maintenance'],
    },
  ];

  let totalStaleErrors = 0;

  for (const spec of mutationSpecs) {
    console.log(`   Mutation: ${spec.from} ──> ${spec.to}`);
    const mutatedBundle = generateBundle(spec.toConfig);
    const docEntries = Object.entries(mutatedBundle.docs);

    let specStaleCount = 0;
    for (const [filename, content] of docEntries) {
      const lower = content.toLowerCase();
      for (const term of spec.staleTerms) {
        if (lower.includes(term.toLowerCase().replace(/_/g, ' ')) || lower.includes(term.toLowerCase())) {
          console.log(`     ❌ STALE TERM FOUND in ${filename}: "${term}"`);
          specStaleCount++;
          totalStaleErrors++;
        }
      }
    }
    if (specStaleCount === 0) {
      console.log(`     ✅ ZERO stale terms from ${spec.from} found in ${spec.to} bundle.`);
    }
  }

  // --------------------------------------------------------------------------
  // 4. DOMAIN ENTITY TRUTH IN MARKDOWN
  // --------------------------------------------------------------------------
  console.log('\n📌 4. DOMAIN ENTITY TRUTH IN MARKDOWN DOCUMENTS:');

  const entityTruthChecks = [
    {
      domain: 'Vehicle Rental',
      bundle: vehicleBundle,
      expected: ['vehicles', 'customers', 'rentalreturns'],
    },
    {
      domain: 'Drone Inspection',
      bundle: droneBundle,
      expected: ['dronefleetinventories', 'missionschedulings', 'flighttelemetrylogs'],
    },
  ];

  for (const check of entityTruthChecks) {
    console.log(`   Domain: ${check.domain}`);
    const markdownText = Object.values(check.bundle.docs).join('\n').toLowerCase();
    for (const entity of check.expected) {
      const present = markdownText.includes(entity.toLowerCase());
      console.log(`     Entity "${entity}" present in generated Markdown: ${present}`);
    }
  }

  // --------------------------------------------------------------------------
  // 5. TECHNOLOGY ISOLATION TEST
  // --------------------------------------------------------------------------
  console.log('\n📌 5. TECHNOLOGY ISOLATION TEST (React/Express vs Next.js/Supabase):');

  const techReactConfig: ProjectConfig = {
    ...vehicleRentalConfig,
    techStack: ['React', 'Express', 'PostgreSQL', 'REST API'],
  };

  const techNextConfig: ProjectConfig = {
    ...vehicleRentalConfig,
    techStack: ['Next.js', 'Supabase', 'PostgreSQL'],
  };

  const reactBundle = generateBundle(techReactConfig);
  const nextBundle = generateBundle(techNextConfig);

  const reactArch = reactBundle.docs['ARCHITECTURE.md'];
  const nextArch = nextBundle.docs['ARCHITECTURE.md'];

  const hasExpressInReact = reactArch.includes('Express API Server');
  const hasNextInReact = reactArch.includes('Next.js App Router');
  const hasNextInNext = nextArch.includes('Next.js App Router');
  const hasExpressInNext = nextArch.includes('Express API Server');

  console.log(`   React Architecture contains Express API Server: ${hasExpressInReact}`);
  console.log(`   React Architecture DOES NOT contain Next.js App Router: ${!hasNextInReact}`);
  console.log(`   Next.js Architecture contains Next.js App Router: ${hasNextInNext}`);
  console.log(`   Next.js Architecture DOES NOT contain Express API Server: ${!hasExpressInNext}`);

  const techIsolationPassed = hasExpressInReact && !hasNextInReact && hasNextInNext && !hasExpressInNext;
  console.log(`   ✅ Technology Isolation Test Result: ${techIsolationPassed}`);

  // --------------------------------------------------------------------------
  // 6. MERMAID DIAGRAM TRUTH & SYNTAX VALIDATION
  // --------------------------------------------------------------------------
  console.log('\n📌 6. MERMAID DIAGRAM TRUTH & SYNTAX VALIDATION:');
  let totalDiagramsChecked = 0;
  let totalDiagramErrors = 0;

  for (const [name, bundle] of Object.entries(bundles)) {
    for (const [docName, content] of Object.entries(bundle.docs)) {
      const validation = validateMermaidDiagrams(docName, content);
      for (const v of validation) {
        totalDiagramsChecked++;
        if (!v.valid) {
          totalDiagramErrors++;
          console.log(`   ❌ Mermaid Error in ${name} -> ${docName}: ${v.error}`);
        }
      }
    }
  }

  console.log(`   Total Mermaid Diagrams Evaluated: ${totalDiagramsChecked}`);
  console.log(`   ✅ Mermaid Diagram Syntax Success Rate: ${totalDiagramsChecked > 0 ? (((totalDiagramsChecked - totalDiagramErrors) / totalDiagramsChecked) * 100).toFixed(1) : 100}%`);

  // --------------------------------------------------------------------------
  // 7. HUMAN-LIKE EXECUTIVE ACCEPTANCE INTERPRETATION
  // --------------------------------------------------------------------------
  console.log('\n📌 7. HUMAN-LIKE EXECUTIVE ACCEPTANCE INTERPRETATION:');

  for (const [name, bundle] of Object.entries(bundles)) {
    const prdText = bundle.docs['PRD.md'];
    const overviewMatch = prdText.match(/1\. Product Overview\s*\n+([\s\S]*?)(?=\n##|\n# 2)/i);
    const summary = overviewMatch ? overviewMatch[1].trim().replace(/\n+/g, ' ').slice(0, 140) : prdText.slice(0, 140);
    console.log(`   ${name}: "${summary}..."`);
  }

  // --------------------------------------------------------------------------
  // FINAL VERDICT
  // --------------------------------------------------------------------------
  const allTestsPassed =
    hasDroneEntity &&
    hasInspectionEntity &&
    maxCrossJaccard < 0.96 &&
    totalStaleErrors === 0 &&
    techIsolationPassed &&
    totalDiagramErrors === 0;

  console.log('\n================================================--');
  console.log(`🎯 FINAL REAL OUTPUT TRUTH VERDICT: ${allTestsPassed ? 'PASS' : 'FAIL'}`);
  console.log('================================================--\n');
}

runOutputTruthTest().catch(console.error);
