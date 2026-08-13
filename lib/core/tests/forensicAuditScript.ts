import * as fs from 'fs';
import * as path from 'path';
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
// FIXTURES
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

const domains = {
  'hospital': hospitalConfig,
  'ecommerce': ecommerceConfig,
  'event': eventConfig,
  'vehicle-rental': vehicleRentalConfig,
  'drone-inspection': droneInspectionConfig,
};

// ============================================================================
// RAW OUTPUT CAPTURE & FORENSIC ANALYSIS
// ============================================================================

export function runForensicAudit() {
  console.log('🔬 EXECUTING FORENSIC CONTENT AUDIT...\n');

  const outputBase = path.join(process.cwd(), 'test-output');
  if (!fs.existsSync(outputBase)) {
    fs.mkdirSync(outputBase, { recursive: true });
  }

  const rawBundles: Record<string, Record<string, string>> = {};

  for (const [key, config] of Object.entries(domains)) {
    const dir = path.join(outputBase, key);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const { projectModel } = analyzeProjectConfig(config);

    const bundle: Record<string, string> = {
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

    rawBundles[key] = bundle;

    for (const [filename, content] of Object.entries(bundle)) {
      fs.writeFileSync(path.join(dir, filename), content, 'utf-8');
    }
    console.log(`📁 Saved raw output for: ${key} (${Object.keys(bundle).length} files)`);
  }

  // Measure whole-bundle Jaccard similarity across all pairs
  const keys = Object.keys(rawBundles);
  console.log('\n📊 FORENSIC WHOLE-BUNDLE JACCARD SIMILARITY:');
  const pairSimilarities: { pair: string; jaccard: number }[] = [];

  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const k1 = keys[i];
      const k2 = keys[j];
      const text1 = Object.values(rawBundles[k1]).join('\n');
      const text2 = Object.values(rawBundles[k2]).join('\n');

      const sim = calculateJaccard(text1, text2);
      pairSimilarities.push({ pair: `${k1} vs ${k2}`, jaccard: sim });
      console.log(`   ${k1} vs ${k2}: ${(sim * 100).toFixed(1)}%`);
    }
  }

  const avgJaccard = pairSimilarities.reduce((a, b) => a + b.jaccard, 0) / pairSimilarities.length;
  console.log(`\n🔴 AVERAGE CROSS-DOMAIN JACCARD SIMILARITY: ${(avgJaccard * 100).toFixed(1)}%`);

  // SECTION-BY-SECTION BOILERPLATE DETECTION
  console.log('\n🔍 SECTION-LEVEL FORENSIC PARAGRAPH BOILERPLATE AUDIT:');
  const docNames = Object.keys(rawBundles['hospital']);
  let totalParagraphsChecked = 0;
  let totalIdenticalParagraphs = 0;

  for (const docName of docNames) {
    const hospitalParagraphs = extractParagraphs(rawBundles['hospital'][docName]);
    const ecommerceParagraphs = extractParagraphs(rawBundles['ecommerce'][docName]);
    const droneParagraphs = extractParagraphs(rawBundles['drone-inspection'][docName]);

    let docShared = 0;
    for (const p of hospitalParagraphs) {
      if (p.length < 30) continue;
      totalParagraphsChecked++;
      
      // Check if normalized paragraph appears in other domains
      const normP = normalizeForComparison(p);
      const inEcom = ecommerceParagraphs.some(ep => normalizeForComparison(ep) === normP);
      const inDrone = droneParagraphs.some(dp => normalizeForComparison(dp) === normP);

      if (inEcom || inDrone) {
        docShared++;
        totalIdenticalParagraphs++;
        console.log(`     ⚠️ BOILERPLATE PARAGRAPH in ${docName}: "${p.slice(0, 70)}..."`);
      }
    }
    const sharedPct = hospitalParagraphs.length > 0 ? (docShared / hospitalParagraphs.length) * 100 : 0;
    console.log(`   ${docName}: ${sharedPct.toFixed(1)}% Identical/Near-Identical Paragraphs across domains`);
  }

  console.log(`\n🚨 GLOBAL BOILERPLATE RATIO: ${((totalIdenticalParagraphs / Math.max(1, totalParagraphsChecked)) * 100).toFixed(1)}% identical paragraphs across unrelated domains.`);

  // --------------------------------------------------------------------------
  // DOMAIN REASONING AUDIT (QUESTIONS A - L)
  // --------------------------------------------------------------------------
  console.log('\n==================================================');
  console.log('🧠 DOMAIN REASONING AUDIT FROM GENERATED MARKDOWN');
  console.log('==================================================\n');

  for (const [key, bundle] of Object.entries(rawBundles)) {
    console.log(`📌 DOMAIN: ${key.toUpperCase()}`);
    const prd = bundle['PRD.md'];
    const db = bundle['DATABASE.md'];
    const api = bundle['API.md'];
    const sec = bundle['SECURITY.md'];
    const design = bundle['DESIGN.md'];
    const testing = bundle['TESTING.md'];

    const businessRules = extractSectionText(prd, 'Business Rules');
    const entities = extractSectionText(db, 'Entity Tables') || extractSectionText(db, 'Overview');
    const apis = extractSectionText(api, 'Endpoints');
    const security = extractSectionText(sec, 'Security Overview') + ' ' + extractSectionText(sec, 'Threat Considerations');
    const colorTheme = extractSectionText(design, 'Color System') || extractSectionText(design, 'Visual Direction');
    const tests = extractSectionText(testing, 'Strategy') || extractSectionText(testing, 'Overview');

    console.log(`   A. Business Rules / Invariants: ${businessRules.slice(0, 140).replace(/\n/g, ' ')}...`);
    console.log(`   B. Security & Threat Profile: ${security.slice(0, 140).replace(/\n/g, ' ')}...`);
    console.log(`   C. Visual Theme & UI Vibe: ${colorTheme.slice(0, 140).replace(/\n/g, ' ')}...`);
    console.log(`   D. Testing Focus: ${tests.slice(0, 140).replace(/\n/g, ' ')}...`);
    console.log('');
  }
}

function extractSectionText(md: string, sectionTitle: string): string {
  const regex = new RegExp(`##\\s*\\d*\\.?\\s*${sectionTitle}[\\s\\S]*?(?=\\n##|$)`, 'i');
  const match = md.match(regex);
  return match ? match[0].trim() : '';
}

function calculateJaccard(textA: string, textB: string): number {
  const wordsA = new Set(textA.toLowerCase().match(/\b[a-z]{3,}\b/g) || []);
  const wordsB = new Set(textB.toLowerCase().match(/\b[a-z]{3,}\b/g) || []);
  const intersection = new Set([...wordsA].filter(x => wordsB.has(x)));
  const union = new Set([...wordsA, ...wordsB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

function extractParagraphs(md: string): string[] {
  return md
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0 && !p.startsWith('#') && !p.startsWith('```') && !p.startsWith('|') && !p.startsWith('>'));
}

function normalizeForComparison(text: string): string {
  return text
    .toLowerCase()
    .replace(/\b(careflow hospital suite|ecomsphere storefront|eventvibe ticket engine|vehicle rental management|drone inspection & maintenance operations)\b/g, '[project]')
    .replace(/[^a-z0-9]/g, '');
}

runForensicAudit();
