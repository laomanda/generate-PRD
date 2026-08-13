import { ProjectModel } from '../project-model/schemas';

export interface ConsistencyRule {
  id: string;
  sourceDocuments: string[];
  targetDocuments: string[];
  severity: 'ERROR' | 'WARNING';
  message: string;
  condition: (project: ProjectModel, documents: Record<string, string>) => boolean;
}

export const CONSISTENCY_RULES: ConsistencyRule[] = [
  // CR-101: TECH_STACK Database vs DATABASE.md Engine
  {
    id: 'CR-101',
    sourceDocuments: ['TECH_STACK.md'],
    targetDocuments: ['DATABASE.md'],
    severity: 'ERROR',
    message: 'Contradiction: TECH_STACK specifies PostgreSQL but DATABASE mentions MySQL.',
    condition: (project, docs) => {
      const dbDoc = docs['DATABASE.md'] || '';
      return project.dbEngine === 'PostgreSQL' && dbDoc.toLowerCase().includes('mysql');
    },
  },

  // CR-102: PRD Admin Roles vs SECURITY Access Control
  {
    id: 'CR-102',
    sourceDocuments: ['PRD.md'],
    targetDocuments: ['SECURITY.md'],
    severity: 'ERROR',
    message: 'Contradiction: PRD defines Administrator role but SECURITY document lacks Role & Permission Model.',
    condition: (project, docs) => {
      const prdDoc = docs['PRD.md'] || '';
      const secDoc = docs['SECURITY.md'] || '';
      const hasAdminInPRD = prdDoc.toLowerCase().includes('admin');
      const hasRoleInSec = secDoc.includes('Role & Permission Model') || secDoc.toLowerCase().includes('role');
      return hasAdminInPRD && !hasRoleInSec;
    },
  },

  // CR-103: TECH_STACK Framework vs ARCHITECTURE Application Style
  {
    id: 'CR-103',
    sourceDocuments: ['TECH_STACK.md'],
    targetDocuments: ['ARCHITECTURE.md'],
    severity: 'ERROR',
    message: 'Contradiction: TECH_STACK specifies Next.js App Router but ARCHITECTURE specifies SPA-only routing.',
    condition: (project, docs) => {
      const techDoc = docs['TECH_STACK.md'] || '';
      const archDoc = docs['ARCHITECTURE.md'] || '';
      return techDoc.includes('Next.js') && archDoc.includes('Vite-only SPA Client Router');
    },
  },

  // CR-104: Financial Involvement vs DATABASE Audit Trail
  {
    id: 'CR-104',
    sourceDocuments: ['PRD.md'],
    targetDocuments: ['DATABASE.md'],
    severity: 'ERROR',
    message: 'Contradiction: Financial payment workflow enabled, but DATABASE document lacks transaction/audit table specifications.',
    condition: (project, docs) => {
      const dbDoc = docs['DATABASE.md'] || '';
      return project.signals.financialInvolvement === true && !dbDoc.toLowerCase().includes('transaction') && !dbDoc.toLowerCase().includes('audit');
    },
  },

  // CR-105: TECH_STACK Framework vs DEPLOYMENT Target
  {
    id: 'CR-105',
    sourceDocuments: ['TECH_STACK.md'],
    targetDocuments: ['DEPLOYMENT.md'],
    severity: 'ERROR',
    message: 'Contradiction: TECH_STACK specifies Express/Vite REST API, but DEPLOYMENT forces Next.js App Router serverless deployment.',
    condition: (project, docs) => {
      const techDoc = docs['TECH_STACK.md'] || '';
      const depDoc = docs['DEPLOYMENT.md'] || '';
      const isExpressVite = techDoc.includes('React') && !techDoc.includes('Next.js');
      const specifiesNextBuild = depDoc.includes('`next build` compiling static pages');
      return isExpressVite && specifiesNextBuild;
    },
  },

  // CR-106: PRD Features vs API Endpoints
  {
    id: 'CR-106',
    sourceDocuments: ['PRD.md'],
    targetDocuments: ['API.md'],
    severity: 'ERROR',
    message: 'Contradiction: PRD defines checkout/order features but API document lacks REST endpoint specifications.',
    condition: (project, docs) => {
      const prdDoc = docs['PRD.md'] || '';
      const apiDoc = docs['API.md'] || '';
      const hasCheckoutInPRD = prdDoc.toLowerCase().includes('checkout') || prdDoc.toLowerCase().includes('order');
      const hasEndpointInAPI = apiDoc.toLowerCase().includes('/api/') || apiDoc.toLowerCase().includes('endpoint');
      return hasCheckoutInPRD && !hasEndpointInAPI;
    },
  },

  // CR-107: DATABASE Entities vs ARCHITECTURE Workflows
  {
    id: 'CR-107',
    sourceDocuments: ['DATABASE.md'],
    targetDocuments: ['ARCHITECTURE.md'],
    severity: 'ERROR',
    message: 'Contradiction: DATABASE defines domain entities but ARCHITECTURE omits entity data flow descriptions.',
    condition: (project, docs) => {
      const dbDoc = docs['DATABASE.md'] || '';
      const archDoc = docs['ARCHITECTURE.md'] || '';
      const hasEntitiesInDB = dbDoc.includes('Primary entity tables:');
      const hasFlowInArch = archDoc.includes('Data Flow') || archDoc.toLowerCase().includes('flow');
      return hasEntitiesInDB && !hasFlowInArch;
    },
  },

  // CR-108: Sensitive Data Score vs SECURITY Data Protection
  {
    id: 'CR-108',
    sourceDocuments: ['PRD.md'],
    targetDocuments: ['SECURITY.md'],
    severity: 'ERROR',
    message: 'Contradiction: High data sensitivity score (>= 7) detected but SECURITY document lacks encryption standards.',
    condition: (project, docs) => {
      const secDoc = docs['SECURITY.md'] || '';
      return project.signals.dataSensitivityScore >= 7 && !secDoc.toLowerCase().includes('encryption');
    },
  },

  // CR-109: High Risk Profile vs TESTING Strategy SLA
  {
    id: 'CR-109',
    sourceDocuments: ['PRD.md'],
    targetDocuments: ['TESTING.md'],
    severity: 'ERROR',
    message: 'Contradiction: High risk project profile detected but TESTING document lacks 85%+ coverage SLA.',
    condition: (project, docs) => {
      const testDoc = docs['TESTING.md'] || '';
      return project.signals.riskLevel === 'high' && !testDoc.includes('85%');
    },
  },

  // CR-110: TECH_STACK DB Engine vs DEPLOYMENT Database Host
  {
    id: 'CR-110',
    sourceDocuments: ['TECH_STACK.md'],
    targetDocuments: ['DEPLOYMENT.md'],
    severity: 'ERROR',
    message: 'Contradiction: TECH_STACK specifies PostgreSQL but DEPLOYMENT mentions incompatible database engine target.',
    condition: (project, docs) => {
      const depDoc = docs['DEPLOYMENT.md'] || '';
      return project.dbEngine === 'PostgreSQL' && depDoc.includes('Managed MySQL');
    },
  },
];

export class DeclarativeCrossDocEngine {
  validateAll(
    project: ProjectModel,
    documents: Record<string, string>
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const rule of CONSISTENCY_RULES) {
      if (rule.condition(project, documents)) {
        errors.push(`[${rule.id}] ${rule.message}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const crossDocEngine = new DeclarativeCrossDocEngine();
