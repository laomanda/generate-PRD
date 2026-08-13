import { analyzeProjectConfig } from '../analyzer';
import { qualityGatePipeline } from '../pipeline/qualityGate';
import { runDevContextEngine } from '../../engine';
import { generateDatabase } from '../generators/databaseGenerator';
import { generateTesting } from '../generators/testingGenerator';
import { generateDeployment } from '../generators/deploymentGenerator';
import { sectionLockManager } from '../section-registry/sectionState';
import { ProjectConfig } from '../../engine/types';

/**
 * ============================================================================
 * REALITY TEST 3 SUITE — DEEP COMPILER SEMANTICS AUDIT
 * ============================================================================
 * Empirically proves deep domain database entities, dynamic testing pyramids,
 * dynamic deployment target compilation, provenance consumption, runtime partial
 * invalidation, section lock protection, and hard export gate enforcement.
 * ============================================================================
 */

export function runRealityTest3(): boolean {
  console.log('🔬 RUNNING DEEP REALITY TEST 3 SUITE...\n');

  let allPass = true;

  // --- 1. DEEP DATABASE ENTITY COMPILER VERIFICATION ---
  console.log('▶ 1. DEEP DATABASE ENTITY COMPILER VERIFICATION');
  const hospitalConfig: ProjectConfig = {
    projectName: 'CarePulse Hospital',
    appType: 'custom',
    description: 'Healthcare hospital management system for patient registration, appointments, medical records, and prescriptions.',
    techStack: ['React', 'TypeScript', 'PostgreSQL', 'Express'],
    features: ['Patient Registration', 'Doctor Appointments', 'Medical Records', 'Prescription Management'],
    dbEngine: 'PostgreSQL',
    designVibe: 'Modern IDE Dark (Zinc & Indigo)',
  };

  const { projectModel: hospModel } = analyzeProjectConfig(hospitalConfig);
  const hospDb = generateDatabase(hospModel);

  const hasPatients = hospDb.includes('patients');
  const hasAppointments = hospDb.includes('appointments');
  const hasMedicalRecords = hospDb.includes('medical_records');

  if (hasPatients && hasAppointments && hasMedicalRecords) {
    console.log('  ✅ Hospital DATABASE.md dynamically compiled deep domain entities (patients, appointments, medical_records).');
  } else {
    console.error('  ❌ Hospital DATABASE.md failed to compile deep domain entities.');
    allPass = false;
  }

  // --- 2. DYNAMIC DEPLOYMENT & TESTING COMPILER VERIFICATION ---
  console.log('\n▶ 2. DYNAMIC DEPLOYMENT & TESTING COMPILER VERIFICATION');
  const hospDep = generateDeployment(hospModel);

  const ecomConfig: ProjectConfig = {
    projectName: 'ElectroMart Store',
    appType: 'e-commerce',
    description: 'Online store with Next.js App Router, Supabase, and Stripe.',
    techStack: ['Next.js 14+ (App Router)', 'TypeScript', 'Supabase', 'PostgreSQL'],
    features: ['Product Catalog', 'Shopping Cart', 'Checkout', 'Orders'],
    dbEngine: 'PostgreSQL',
    designVibe: 'Modern IDE Dark (Zinc & Indigo)',
  };

  const { projectModel: ecomModel } = analyzeProjectConfig(ecomConfig);
  const ecomDep = generateDeployment(ecomModel);
  const ecomTest = generateTesting(ecomModel);

  const hospNoNextInBuild = !hospDep.includes('`next build` compiling static pages');
  const ecomHasNextInBuild = ecomDep.includes('`next build` compiling static pages');

  if (hospNoNextInBuild && ecomHasNextInBuild) {
    console.log('  ✅ DEPLOYMENT.md dynamically compiles exact stack runtime targets (Express SPA vs Next.js App Router).');
  } else {
    console.error('  ❌ DEPLOYMENT.md failed stack target adaptation.');
    allPass = false;
  }

  const ecomHasRscTest = ecomTest.includes('React Server Components (RSC)');
  if (ecomHasRscTest) {
    console.log('  ✅ TESTING.md dynamically adapts runner framework for Next.js RSC & Supabase Auth.');
  } else {
    console.error('  ❌ TESTING.md failed framework runner adaptation.');
    allPass = false;
  }

  // --- 3. RUNTIME PARTIAL REGENERATION VERIFICATION ---
  console.log('\n▶ 3. RUNTIME PARTIAL REGENERATION VERIFICATION');
  const run1 = runDevContextEngine(hospitalConfig);
  const modHospitalConfig: ProjectConfig = {
    ...hospitalConfig,
    dbEngine: 'PostgreSQL',
    features: ['Patient Registration', 'Doctor Appointments', 'Medical Records', 'Prescription Management', 'Telehealth Video Calls'],
  };

  const run2 = runDevContextEngine(modHospitalConfig, {
    previousFiles: run1.files,
    changedFields: ['features'],
  });

  const prd1 = run1.files.find(f => f.filename === 'PRD.md')?.content;
  const prd2 = run2.files.find(f => f.filename === 'PRD.md')?.content;
  const dep1 = run1.files.find(f => f.filename === 'DEPLOYMENT.md')?.content;
  const dep2 = run2.files.find(f => f.filename === 'DEPLOYMENT.md')?.content;

  const prdUpdated = prd1 !== prd2;
  const depPreserved = dep1 === dep2;

  if (prdUpdated && depPreserved) {
    console.log('  ✅ Partial regeneration in runDevContextEngine correctly updated dependent PRD.md while preserving unchanged DEPLOYMENT.md.');
  } else {
    console.error('  ❌ Partial regeneration runtime verification failed details:', { prdUpdated, depPreserved });
    allPass = false;
  }

  // --- 4. SECTION LOCK PROTECTION VERIFICATION ---
  console.log('\n▶ 4. SECTION LOCK PROTECTION VERIFICATION');
  sectionLockManager.setSectionState({
    documentId: 'PRD',
    sectionId: 'goals',
    state: 'locked',
    userContent: 'Manual User Locked Hospital Goals Content.',
  });

  const userGoals = sectionLockManager.resolveSectionContent('PRD', 'goals', 'Generated Content');
  if (userGoals === 'Manual User Locked Hospital Goals Content.') {
    console.log('  ✅ Section Lock Protection manager successfully preserved user-locked content.');
  } else {
    console.error('  ❌ Section Lock Protection failed.');
    allPass = false;
  }

  // --- 5. HARD EXPORT GATE ENFORCEMENT VERIFICATION ---
  console.log('\n▶ 5. HARD EXPORT GATE ENFORCEMENT VERIFICATION');
  let gateBlocked = false;
  try {
    const invalidDocs: Record<string, string> = { ...run1.files.reduce((acc, f) => ({ ...acc, [f.filename]: f.content }), {}) };
    delete invalidDocs['PRD.md']; // Remove mandatory document file to trigger Quality Gate failure
    const report = qualityGatePipeline.runQualityGate(hospModel, invalidDocs);
    if (!report.passed) {
      gateBlocked = true;
    }
  } catch {
    gateBlocked = true;
  }

  if (gateBlocked) {
    console.log('  ✅ Hard Quality Gate successfully BLOCKED export for invalid document bundle.');
  } else {
    console.error('  ❌ Quality Gate failed to block invalid export.');
    allPass = false;
  }

  console.log(`\n🎉 REALITY TEST 3 RESULT: ${allPass ? 'PASSED (100% SUCCESS)' : 'FAILED'}\n`);
  return allPass;
}

runRealityTest3();
