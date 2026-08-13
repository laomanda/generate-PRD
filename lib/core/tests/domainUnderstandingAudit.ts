import { analyzeProjectConfig } from '../analyzer';
import { ProjectConfig } from '../../engine/types';

const hospitalConfig: ProjectConfig = {
  projectName: 'CareFlow Hospital Suite',
  appType: 'custom',
  description: 'Clinical management system for doctors, patients, appointments, medical records, and prescriptions.',
  techStack: ['React', 'TypeScript', 'PostgreSQL', 'REST API'],
  features: ['Patient Registration', 'Doctor Management', 'Appointments', 'Medical Records', 'Prescriptions'],
  dbEngine: 'PostgreSQL',
  designVibe: 'Modern IDE Dark (Zinc & Indigo)',
};

const eventConfig: ProjectConfig = {
  projectName: 'EventVibe Ticket Engine',
  appType: 'custom',
  description: 'Event management platform for organizers, tickets, attendee registration, and QR check-in.',
  techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'REST API'],
  features: ['Event Creation', 'Ticket Sales', 'Attendee Registration', 'QR Check-in'],
  dbEngine: 'PostgreSQL',
  designVibe: 'Modern IDE Dark (Zinc & Indigo)',
};

const ecommerceConfig: ProjectConfig = {
  projectName: 'EcomSphere Storefront',
  appType: 'custom',
  description: 'Online shop hosting product catalog, inventory tracking, shopping cart, checkout, and shipping.',
  techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'REST API'],
  features: ['Product Catalog', 'Inventory Tracking', 'Shopping Cart', 'Checkout', 'Shipping'],
  dbEngine: 'PostgreSQL',
  designVibe: 'Modern IDE Dark (Zinc & Indigo)',
};

const vehicleRentalConfig: ProjectConfig = {
  projectName: 'Vehicle Rental Management',
  appType: 'custom',
  description: 'Fleet vehicle reservation platform for customers, car rentals, vehicle availability, returns, and inspection tracking.',
  techStack: ['React', 'TypeScript', 'PostgreSQL', 'REST API'],
  features: ['Vehicle Fleet Catalog', 'Customer Reservations', 'Rental Return Tracking', 'Vehicle Inspection'],
  dbEngine: 'PostgreSQL',
  designVibe: 'Modern IDE Dark (Zinc & Indigo)',
};

function auditConfig(label: string, config: ProjectConfig) {
  console.log(`=== AUDITING: ${label} ===`);
  const { projectModel } = analyzeProjectConfig(config);
  
  console.log(`Domain Key: ${projectModel.domain.domainKey}`);
  console.log(`Domain Name: ${projectModel.domain.domainName}`);
  console.log(`Industry Type: ${projectModel.domain.industryType}`);
  console.log(`Roles:`, projectModel.domain.userRoles.map(r => r.role));
  console.log(`Primary Entities:`, projectModel.domain.primaryEntityNames);
  console.log(`Derived Entities:`, projectModel.domain.entities.map(e => `${e.name} (${e.tableName})`));
  console.log(`Core Workflows:`, projectModel.domain.coreWorkflows);
  console.log('--------------------------------------------------\n');

  return {
    label,
    domainKey: projectModel.domain.domainKey,
    domainName: projectModel.domain.domainName,
    industryType: projectModel.domain.industryType,
    roles: projectModel.domain.userRoles.map(r => r.role),
    primaryEntities: projectModel.domain.primaryEntityNames,
    derivedEntities: projectModel.domain.entities.map(e => e.name),
    derivedTables: projectModel.domain.entities.map(e => e.tableName),
    workflows: projectModel.domain.coreWorkflows,
  };
}

function auditMutationTest(fromName: string, fromConfig: ProjectConfig, toName: string, toConfig: ProjectConfig, forbiddenInTo: string[]) {
  console.log(`\n🔄 TESTING DOMAIN MUTATION: ${fromName} ──> ${toName}`);
  const modelBefore = analyzeProjectConfig(fromConfig).projectModel;
  const modelAfter = analyzeProjectConfig(toConfig).projectModel;

  const entitiesBefore = modelBefore.domain.entities.map(e => e.name);
  const entitiesAfter = modelAfter.domain.entities.map(e => e.name);

  const workflowsBefore = modelBefore.domain.coreWorkflows;
  const workflowsAfter = modelAfter.domain.coreWorkflows;

  const rolesBefore = modelBefore.domain.userRoles.map(r => r.role);
  const rolesAfter = modelAfter.domain.userRoles.map(r => r.role);

  // Check for forbidden stale terms in toModel
  const serializedAfter = JSON.stringify(modelAfter).toLowerCase();
  const staleMatches = forbiddenInTo.filter(term => serializedAfter.includes(term.toLowerCase()));

  console.log(`  Entities Before: [${entitiesBefore.join(', ')}]`);
  console.log(`  Entities After:  [${entitiesAfter.join(', ')}]`);
  console.log(`  Workflows After: [${workflowsAfter.join(', ')}]`);
  console.log(`  Roles After:     [${rolesAfter.join(', ')}]`);

  const entitiesChanged = JSON.stringify(entitiesBefore) !== JSON.stringify(entitiesAfter);
  const workflowsChanged = JSON.stringify(workflowsBefore) !== JSON.stringify(workflowsAfter);
  const noStaleTerms = staleMatches.length === 0;

  console.log(`  ✅ Material Entities Change: ${entitiesChanged}`);
  console.log(`  ✅ Material Workflows Change: ${workflowsChanged}`);
  console.log(`  ✅ Zero Stale Cross-Contamination (${forbiddenInTo.join(', ')}): ${noStaleTerms} (Found: [${staleMatches.join(', ')}])`);

  return entitiesChanged && workflowsChanged && noStaleTerms;
}

async function runAudit() {
  console.log('🔍 DOMAIN UNDERSTANDING ANALYZER AUDIT\n');
  const hospital = auditConfig('Hospital', hospitalConfig);
  const event = auditConfig('Event Management', eventConfig);
  const ecommerce = auditConfig('Ecommerce', ecommerceConfig);
  const vehicle = auditConfig('Vehicle Rental', vehicleRentalConfig);

  console.log('Summary Audit Findings:');
  console.log(`Hospital entities count: ${hospital.derivedEntities.length}`);
  console.log(`Event entities count: ${event.derivedEntities.length}`);
  console.log(`Ecommerce entities count: ${ecommerce.derivedEntities.length}`);
  console.log(`Vehicle Rental entities count: ${vehicle.derivedEntities.length}`);
  console.log(`Vehicle Rental entities list: ${vehicle.derivedEntities.join(', ')}`);

  console.log('\n================================================--');
  console.log('PHASE 5 — DOMAIN MUTATION TESTS');
  console.log('================================================--');

  const m1 = auditMutationTest('Hospital', hospitalConfig, 'Vehicle Rental', vehicleRentalConfig, ['patient', 'doctor', 'prescription', 'appointment']);
  const m2 = auditMutationTest('Event', eventConfig, 'Ecommerce', ecommerceConfig, ['ticket', 'attendee', 'checkin']);
  const m3 = auditMutationTest('Ecommerce', ecommerceConfig, 'Vehicle Rental', vehicleRentalConfig, ['product', 'cart']);
  const m4 = auditMutationTest('Vehicle Rental', vehicleRentalConfig, 'Hospital', hospitalConfig, ['vehicle', 'rental', 'inspection']);

  console.log('\n🎯 ALL 4 MUTATION TESTS PASSED:', m1 && m2 && m3 && m4);
}

runAudit().catch(console.error);
