import { ProjectModel, InferredFact } from '../project-model/schemas';

export interface DeclarativeRule {
  id: string;
  name: string;
  description: string;
  priority: number; // Higher = executed first
  confidence: number; // 0 to 1
  affectedDocuments: string[];
  condition: (project: ProjectModel) => boolean;
  effect: (project: ProjectModel) => InferredFact;
}

export const SYSTEM_RULES: DeclarativeRule[] = [
  // R-101: Financial Involvement -> Mandatory Audit Logging & Failure Recovery
  {
    id: 'R-101',
    name: 'Financial Involvement Compliance',
    description: 'When project involves payments or financial transactions, enforce immutable audit logging and payment retry handling.',
    priority: 90,
    confidence: 0.95,
    affectedDocuments: ['DATABASE.md', 'SECURITY.md', 'ARCHITECTURE.md', 'PRD.md'],
    condition: (project) => project.signals.financialInvolvement === true,
    effect: () => ({
      id: 'fact-R-101',
      fact: 'Mandatory Transaction Audit Logging & Payment Retry Workflow',
      category: 'security',
      confidence: 0.95,
      source: 'RULE_ENGINE',
      reasoning: 'Financial Involvement signal detected (payment integration or pricing transactions). Requires non-repudiation logging and graceful payment failure retries.',
      affectedDocuments: ['DATABASE.md', 'SECURITY.md', 'ARCHITECTURE.md', 'PRD.md'],
    }),
  },

  // R-102: Multi-Tenant RLS -> Database Boundary Policies
  {
    id: 'R-102',
    name: 'Multi-Tenant Row Level Security Boundary',
    description: 'Multi-tenant applications with workspace isolation require Row Level Security (RLS) policies.',
    priority: 85,
    confidence: 0.98,
    affectedDocuments: ['DATABASE.md', 'SECURITY.md', 'ARCHITECTURE.md'],
    condition: (project) => project.signals.authComplexity === 'multi_tenant_rls',
    effect: () => ({
      id: 'fact-R-102',
      fact: 'PostgreSQL Row Level Security (RLS) Tenant Isolation Policies',
      category: 'database',
      confidence: 0.98,
      source: 'RULE_ENGINE',
      reasoning: 'Multi-tenant workspace architecture detected. Requires strict RLS policies on all workspace-scoped tables to prevent cross-tenant data leakage.',
      affectedDocuments: ['DATABASE.md', 'SECURITY.md', 'ARCHITECTURE.md'],
    }),
  },

  // R-103: High Sensitivity Data (HIPAA / Medical) -> Enhanced Privacy
  {
    id: 'R-103',
    name: 'High Sensitivity Data Protection',
    description: 'High data sensitivity score requires encrypted storage, zero plaintext fields, and strict access logs.',
    priority: 95,
    confidence: 0.99,
    affectedDocuments: ['SECURITY.md', 'DATABASE.md', 'ARCHITECTURE.md', 'TESTING.md'],
    condition: (project) => project.signals.dataSensitivityScore >= 7,
    effect: (project) => ({
      id: 'fact-R-103',
      fact: `Enhanced Encryption at Rest & HIPAA-grade Audit Controls (Score: ${project.signals.dataSensitivityScore}/10)`,
      category: 'security',
      confidence: 0.99,
      source: 'RULE_ENGINE',
      reasoning: `High Data Sensitivity Score (${project.signals.dataSensitivityScore}/10) detected for ${project.domain.domainName}. Mandates field-level encryption and strict access logging.`,
      affectedDocuments: ['SECURITY.md', 'DATABASE.md', 'ARCHITECTURE.md', 'TESTING.md'],
    }),
  },

  // R-104: High Density Dashboard -> Custom UX Component States
  {
    id: 'R-104',
    name: 'High-Density Dashboard UX Guideline',
    description: 'Analytics and SaaS dashboards require custom loading skeletons, data grid pagination, and dark IDE contrast.',
    priority: 70,
    confidence: 0.85,
    affectedDocuments: ['DESIGN.md', 'PRD.md'],
    condition: (project) => project.signals.designComplexity === 'high_density_dashboard',
    effect: () => ({
      id: 'fact-R-104',
      fact: 'High-Density Data Grid & Monospaced Typography Layout',
      category: 'ux',
      confidence: 0.85,
      source: 'RULE_ENGINE',
      reasoning: 'Dashboard / High-Density design pattern detected. Requires monospaced data alignment, skeleton loaders, and high contrast WCAG AA standards.',
      affectedDocuments: ['DESIGN.md', 'PRD.md'],
    }),
  },
];

export class RuleEngine {
  evaluate(project: ProjectModel): {
    evaluatedProject: ProjectModel;
    firedRules: DeclarativeRule[];
    newInferredFacts: InferredFact[];
  } {
    const firedRules: DeclarativeRule[] = [];
    const newInferredFacts: InferredFact[] = [];

    // Sort rules by priority descending
    const sortedRules = [...SYSTEM_RULES].sort((a, b) => b.priority - a.priority);

    for (const rule of sortedRules) {
      if (rule.condition(project)) {
        firedRules.push(rule);
        const fact = rule.effect(project);
        newInferredFacts.push(fact);
      }
    }

    const updatedProject: ProjectModel = {
      ...project,
      inferredFacts: [...project.inferredFacts, ...newInferredFacts],
    };

    return {
      evaluatedProject: updatedProject,
      firedRules,
      newInferredFacts,
    };
  }
}

export const ruleEngine = new RuleEngine();
