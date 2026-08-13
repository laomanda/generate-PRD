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

// Define fixtures
const hospitalConfig: ProjectConfig = {
  projectName: 'CareFlow Hospital Suite',
  appType: 'custom',
  description: 'A clinical management system for healthcare providers, doctors, patients, appointment bookings, medical records archiving, and prescription issuance. Healthcare-sensitive data.',
  techStack: ['React', 'TypeScript', 'PostgreSQL', 'REST API'],
  features: ['Patient Registration', 'Doctor Management', 'Appointments', 'Medical Records', 'Prescription Management'],
  dbEngine: 'PostgreSQL',
  designVibe: 'Modern IDE Dark (Zinc & Indigo)',
};

const eventConfig: ProjectConfig = {
  projectName: 'EventVibe Ticket Engine',
  appType: 'custom',
  description: 'Event management platform for organizers, ticket sales, attendee registration, QR code check-in, venue capacity management, and ticket scanning.',
  techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'REST API'],
  features: ['Event Creation', 'Ticket Purchasing', 'Attendee Registration', 'QR Check-in', 'Capacity Management'],
  dbEngine: 'PostgreSQL',
  designVibe: 'Modern IDE Dark (Zinc & Indigo)',
};

const ecommerceConfig: ProjectConfig = {
  projectName: 'EcomSphere Storefront',
  appType: 'custom',
  description: 'Online store hosting product catalogs, real-time inventory levels, shopping carts, order checkouts, secure payments, and shipping updates for customers.',
  techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'REST API'],
  features: ['Product Catalog', 'Inventory Tracking', 'Shopping Cart', 'Checkout', 'Shipping Updates'],
  dbEngine: 'PostgreSQL',
  designVibe: 'Modern IDE Dark (Zinc & Indigo)',
};

// Mutation fixture
const mutatedHospitalConfig: ProjectConfig = {
  ...hospitalConfig,
  projectName: 'Vehicle Rental Management',
  description: 'Fleet vehicle reservation platform for customers, car rentals, vehicle availability, returns, and inspection tracking.',
  features: ['Vehicle Fleet Catalog', 'Customer Reservations', 'Rental Return Tracking', 'Vehicle Inspection'],
};

function runGeneration(config: ProjectConfig) {
  const { projectModel } = analyzeProjectConfig(config);
  return {
    prd: generatePRD(projectModel),
    design: generateDesignSystem(projectModel),
    database: generateDatabase(projectModel),
    techStack: generateTechStack(projectModel),
    architecture: generateArchitecture(projectModel),
    api: generateAPI(projectModel),
    security: generateSecurity(projectModel),
    testing: generateTesting(projectModel),
    deployment: generateDeployment(projectModel),
  };
}

async function runAudit() {
  console.log('🔄 Running output truth audit...');
  
  const hospital = runGeneration(hospitalConfig);
  const event = runGeneration(eventConfig);
  const ecommerce = runGeneration(ecommerceConfig);
  const mutated = runGeneration(mutatedHospitalConfig);

  const results = {
    hospital: auditBundle(hospital, 'hospital'),
    event: auditBundle(event, 'event'),
    ecommerce: auditBundle(ecommerce, 'ecommerce'),
    mutation: auditMutation(hospital, mutated),
  };

  console.log(JSON.stringify(results, null, 2));
}

function auditBundle(bundle: Record<string, string>, domain: string) {
  const auditReport: any = {
    domain,
    docs: {},
    crossContamination: [],
    consistency: [],
    mermaidDiagrams: [],
  };

  // Forbidden concepts checklist
  const forbidden: Record<string, string[]> = {
    hospital: ['shopping cart', 'product catalog', 'ticket scanning', 'event capacity'],
    event: ['medical records', 'prescriptions', 'clinical appointments'],
    ecommerce: ['patient medical records', 'prescriptions', 'ticket check-in'],
  };

  // Required concepts checklist
  const required: Record<string, string[]> = {
    hospital: ['patient', 'doctor', 'appointment', 'medical record', 'prescription'],
    event: ['event', 'organizer', 'ticket', 'attendee', 'check-in', 'scanning'],
    ecommerce: ['product', 'inventory', 'cart', 'order', 'payment', 'shipping', 'customer'],
  };

  // Audit each doc
  for (const [key, text] of Object.entries(bundle)) {
    const textLower = text.toLowerCase();
    
    // Check forbidden concepts (contamination)
    for (const concept of forbidden[domain] || []) {
      if (textLower.includes(concept)) {
        auditReport.crossContamination.push({ doc: key, concept });
      }
    }

    // Check required concepts
    const found = [];
    const missing = [];
    for (const concept of required[domain] || []) {
      if (textLower.includes(concept)) {
        found.push(concept);
      } else {
        missing.push(concept);
      }
    }

    // Extract Mermaid diagrams
    const mermaidRegex = /```mermaid([\s\S]*?)```/g;
    let match;
    while ((match = mermaidRegex.exec(text)) !== null) {
      const code = match[1].trim();
      auditReport.mermaidDiagrams.push({
        doc: key,
        code,
        hasRequiredTerms: required[domain].some(term => code.toLowerCase().includes(term)),
      });
    }

    auditReport.docs[key] = {
      foundRequired: found,
      missingRequired: missing,
    };
  }

  // Verify consistency across documents
  const allDocs = Object.keys(bundle);
  const coreTerm = required[domain][0]; // patient, event, product
  const genericCount = allDocs.filter(k => bundle[k].toLowerCase().includes(coreTerm)).length;
  auditReport.consistency.push({
    term: coreTerm,
    matchedDocs: genericCount,
    totalDocs: allDocs.length,
    passed: genericCount === allDocs.length,
  });

  return auditReport;
}

function auditMutation(before: Record<string, string>, after: Record<string, string>) {
  const result: any = {
    changes: [],
  };

  for (const [key, textBefore] of Object.entries(before)) {
    const textAfter = after[key];
    const beforeHasPatient = textBefore.toLowerCase().includes('patient');
    const afterHasVehicle = textAfter.toLowerCase().includes('vehicle');
    const afterHasPatient = textAfter.toLowerCase().includes('patient');

    result.changes.push({
      doc: key,
      beforeHasPatient,
      afterHasVehicle,
      afterHasPatient,
      mutatedSuccessfully: afterHasVehicle && !afterHasPatient,
    });
  }

  return result;
}

runAudit().catch(console.error);
