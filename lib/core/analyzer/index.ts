import { ProjectConfig } from '../../engine/types';
import { ProjectModel, TechFact, DomainFact } from '../project-model/schemas';
import { evaluateContextSignals } from '../context-engine';
import { ruleEngine } from '../rule-engine/rules';
import { knowledgeGraph } from '../knowledge-engine/graph';
import { DOMAIN_BLUEPRINTS, synthesizeCustomDomain } from '../../engine/dictionaries/domainSpecs';
import { deriveDomainEntities } from './domainEntities';

/**
 * ============================================================================
 * PROJECT ANALYZER & INTELLIGENCE PIPELINE
 * ============================================================================
 * Analyzes input facts, extracts domain and tech specs, resolves knowledge
 * relationships, computes context signals, and evaluates rules to produce
 * a fully typed ProjectModel ready for document compilation.
 * ============================================================================
 */

import { extractDomainKnowledge } from './domainKnowledge';

export function analyzeProjectConfig(config: ProjectConfig): {
  projectModel: ProjectModel;
  auditTrail: ReturnType<typeof import('../explainability').generateAuditExplanations>;
} {
  const name = config.projectName || 'Custom Project';
  const desc = config.description || name;
  const combinedText = `${name} ${desc} ${(config.features || []).join(' ')}`.toLowerCase();

  // 1. Generic Domain Knowledge Extraction
  const knowledge = extractDomainKnowledge(config);

  let industryType: DomainFact['industryType'] = 'custom';
  if (combinedText.includes('health') || combinedText.includes('hospital') || combinedText.includes('patient') || combinedText.includes('doctor') || combinedText.includes('medical')) {
    industryType = 'healthcare';
  } else if (combinedText.includes('event') || combinedText.includes('ticket') || combinedText.includes('checkin') || combinedText.includes('check-in')) {
    industryType = 'event';
  } else if (combinedText.includes('ecom') || combinedText.includes('shop') || combinedText.includes('product') || combinedText.includes('cart')) {
    industryType = 'ecommerce';
  } else if (combinedText.includes('vehicle') || combinedText.includes('car') || combinedText.includes('rental') || combinedText.includes('renter')) {
    industryType = 'rental';
  }

  const domainName = `${name} Platform`;
  const userRoles = knowledge.roles.map(r => ({
    role: r.name,
    need: r.need || r.responsibilities.join(', '),
    permissionLevel: r.permissionLevel || 1,
  }));
  const primaryEntityNames = knowledge.entities.map(e => e.tableName);
  const coreWorkflows = knowledge.workflows.map(w => w.name);

  // 2. Tech Stack Facts
  const techStack: TechFact[] = (config.techStack || ['Next.js', 'TypeScript', 'PostgreSQL']).map(t => ({
    name: t,
    version: 'latest',
    category: t.toLowerCase().includes('sql') || t.toLowerCase().includes('base') ? 'database' : 'frontend',
    purpose: `Core technical stack layer for ${name}`,
    implications: [`Enforces type safety and scalable rendering.`],
  }));

  // 3. Draft Project Model
  const draftProject: ProjectModel = {
    id: `proj-${Date.now()}`,
    projectName: name,
    appType: config.appType || 'custom',
    description: desc,
    rawPrompt: config.rawPrompt || '',
    domain: {
      domainKey: String(industryType),
      domainName,
      primaryEntityNames,
      entities: knowledge.entities,
      knowledgeModel: knowledge,
      industryType,
      userRoles,
      coreWorkflows,
    },
    techStack,
    features: config.features || [],
    dbEngine: config.dbEngine || 'PostgreSQL',
    designVibe: config.designVibe || 'Modern IDE Dark (Zinc & Indigo)',
    signals: {
      dataSensitivityScore: 3,
      authComplexity: 'basic',
      financialInvolvement: false,
      riskLevel: 'low',
      expectedScalability: 'serverless_edge',
      designComplexity: 'moderate',
      databaseComplexity: 'relational_fk',
    },
    inferredFacts: [],
    constraints: ['Zero plaintext credentials', 'Strict type safety'],
    createdAt: new Date().toISOString(),
  };

  draftProject.domain.entities = deriveDomainEntities(draftProject);

  // 4. Compute Context Signals
  draftProject.signals = evaluateContextSignals(draftProject);

  // 5. Knowledge Graph Traversal
  const activeKnowledgeIds: string[] = [];
  if (draftProject.signals.financialInvolvement) activeKnowledgeIds.push('stripe', 'payment_failure_handling');
  if (draftProject.signals.authComplexity === 'multi_tenant_rls') activeKnowledgeIds.push('supabase', 'rbac');

  const graphResult = knowledgeGraph.resolveKnowledgeGraph(activeKnowledgeIds);

  // Map graph entities to inferred facts
  const graphFacts = graphResult.entities.map(e => ({
    id: `graph-${e.id}`,
    fact: `Knowledge Entity: ${e.name}`,
    category: e.category,
    confidence: 0.9,
    source: 'KNOWLEDGE_GRAPH' as const,
    reasoning: e.purpose,
    affectedDocuments: ['TECH_STACK.md', 'ARCHITECTURE.md', 'SECURITY.md'],
  }));

  draftProject.inferredFacts.push(...graphFacts);

  // 6. Evaluate Rule Engine
  const { evaluatedProject } = ruleEngine.evaluate(draftProject);

  // 7. Generate Audit Explanations
  const auditTrail = evaluatedProject.inferredFacts.map(fact => ({
    factId: fact.id,
    headline: fact.fact,
    category: fact.category,
    source: fact.source,
    confidence: fact.confidence,
    reasoning: fact.reasoning,
    affectedDocuments: fact.affectedDocuments,
  }));

  return {
    projectModel: evaluatedProject,
    auditTrail,
  };
}
