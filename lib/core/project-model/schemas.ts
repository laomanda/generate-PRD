import { z } from 'zod';

/**
 * ============================================================================
 * KNOWLEDGE-DRIVEN PROJECT MODEL & FACT SCHEMAS
 * ============================================================================
 * Strongly typed Zod schemas representing project facts, technology facts,
 * domain facts, security facts, context signals, and confidence scores.
 * ============================================================================
 */

export const ConfidenceScoreSchema = z.number().min(0).max(1);

export const SourceTypeSchema = z.enum([
  'USER_EXPLICIT',
  'PROJECT_ANALYZER',
  'KNOWLEDGE_GRAPH',
  'CONTEXT_INFERENCE',
  'RULE_ENGINE',
]);

export const InferredFactSchema = z.object({
  id: z.string(),
  fact: z.string(),
  category: z.enum(['domain', 'technology', 'security', 'architecture', 'database', 'ux', 'framework']),
  confidence: ConfidenceScoreSchema,
  source: SourceTypeSchema,
  reasoning: z.string(),
  affectedDocuments: z.array(z.string()),
});

export type InferredFact = z.infer<typeof InferredFactSchema>;

export const AttributeDefinitionSchema = z.object({
  name: z.string(),
  type: z.string(),
  isPk: z.boolean().optional(),
  isFk: z.boolean().optional(),
  isNullable: z.boolean().optional(),
  description: z.string(),
});

export const RelationshipDefinitionSchema = z.object({
  targetEntity: z.string(),
  type: z.enum(['1:1', '1:N', 'N:M']),
  foreignKey: z.string(),
  description: z.string(),
});

export const ProvenanceSourceSchema = z.enum(['FACT', 'INFERENCE', 'RECOMMENDATION', 'UNKNOWN']);
export type ProvenanceSource = z.infer<typeof ProvenanceSourceSchema>;

export const DomainEntityModelSchema = z.object({
  name: z.string(),
  tableName: z.string(),
  description: z.string(),
  attributes: z.array(AttributeDefinitionSchema),
  relationships: z.array(RelationshipDefinitionSchema),
  constraints: z.array(z.string()),
  indexes: z.array(z.string()),
  lifecycleStates: z.array(z.string()).optional(),
  source: ProvenanceSourceSchema.default('INFERENCE'),
  confidence: ConfidenceScoreSchema.default(0.85),
});

export type AttributeDefinition = z.infer<typeof AttributeDefinitionSchema>;
export type RelationshipDefinition = z.infer<typeof RelationshipDefinitionSchema>;
export type DomainEntityModel = z.infer<typeof DomainEntityModelSchema>;

export const DomainRoleSchema = z.object({
  name: z.string(),
  responsibilities: z.array(z.string()).default([]),
  permissions: z.array(z.string()).default([]),
  permissionLevel: z.number().default(1),
  need: z.string().optional(),
  source: ProvenanceSourceSchema.default('INFERENCE'),
  confidence: ConfidenceScoreSchema.default(0.8),
});

export type DomainRole = z.infer<typeof DomainRoleSchema>;

export const DomainWorkflowSchema = z.object({
  name: z.string(),
  actors: z.array(z.string()).default([]),
  steps: z.array(z.string()).default([]),
  inputs: z.array(z.string()).default([]),
  outputs: z.array(z.string()).default([]),
  relatedEntities: z.array(z.string()).default([]),
  source: ProvenanceSourceSchema.default('INFERENCE'),
  confidence: ConfidenceScoreSchema.default(0.8),
});

export type DomainWorkflow = z.infer<typeof DomainWorkflowSchema>;

export const DomainKnowledgeSchema = z.object({
  domainName: z.string(),
  entities: z.array(DomainEntityModelSchema).default([]),
  roles: z.array(DomainRoleSchema).default([]),
  workflows: z.array(DomainWorkflowSchema).default([]),
  businessRules: z.array(z.string()).default([]),
  dataObjects: z.array(z.string()).default([]),
  integrations: z.array(z.string()).default([]),
  risks: z.array(z.string()).default([]),
  complianceRequirements: z.array(z.string()).default([]),
  terminology: z.array(z.string()).default([]),
  confidence: ConfidenceScoreSchema.default(0.85),
  provenance: z.array(
    z.object({
      subject: z.string(),
      source: ProvenanceSourceSchema,
      confidence: ConfidenceScoreSchema,
      reasoning: z.string(),
    })
  ).default([]),
});

export type DomainKnowledge = z.infer<typeof DomainKnowledgeSchema>;

export const DomainFactSchema = z.object({
  domainKey: z.string(),
  domainName: z.string(),
  primaryEntityNames: z.array(z.string()),
  entities: z.array(DomainEntityModelSchema).default([]),
  knowledgeModel: DomainKnowledgeSchema.optional(),
  industryType: z.enum([
    'saas',
    'ecommerce',
    'healthcare',
    'education',
    'finance',
    'restaurant',
    'rental',
    'realestate',
    'social',
    'custom',
    'event',
  ]),
  userRoles: z.array(
    z.object({
      role: z.string(),
      need: z.string(),
      permissionLevel: z.number().default(1),
    })
  ),
  coreWorkflows: z.array(z.string()),
});

export type DomainFact = z.infer<typeof DomainFactSchema>;

export const TechFactSchema = z.object({
  name: z.string(),
  version: z.string().default('latest'),
  category: z.enum(['frontend', 'backend', 'database', 'auth', 'payment', 'storage', 'tooling']),
  purpose: z.string(),
  implications: z.array(z.string()).default([]),
});

export type TechFact = z.infer<typeof TechFactSchema>;

export const ContextSignalsSchema = z.object({
  dataSensitivityScore: z.number().min(0).max(10).default(3), // 0=public, 10=HIPAA/Financial
  authComplexity: z.enum(['none', 'basic', 'jwt_session', 'rbac', 'multi_tenant_rls']).default('basic'),
  financialInvolvement: z.boolean().default(false),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']).default('low'),
  expectedScalability: z.enum(['single_instance', 'serverless_edge', 'distributed_cluster']).default('serverless_edge'),
  designComplexity: z.enum(['simple', 'moderate', 'high_density_dashboard']).default('moderate'),
  databaseComplexity: z.enum(['simple_sql', 'relational_fk', 'multi_tenant_schema']).default('relational_fk'),
});

export type ContextSignals = z.infer<typeof ContextSignalsSchema>;

export const ProjectModelSchema = z.object({
  id: z.string(),
  projectName: z.string().min(1, 'Project name is required'),
  appType: z.string().default('custom'),
  description: z.string().default(''),
  rawPrompt: z.string().optional(),
  
  // Facts
  domain: DomainFactSchema,
  techStack: z.array(TechFactSchema),
  features: z.array(z.string()),
  dbEngine: z.string().default('PostgreSQL'),
  designVibe: z.string().default('Modern IDE Dark (Zinc & Indigo)'),

  // Context Signals & Inferences
  signals: ContextSignalsSchema,
  inferredFacts: z.array(InferredFactSchema).default([]),
  
  // Constraints
  constraints: z.array(z.string()).default([]),
  createdAt: z.string().default(() => new Date().toISOString()),
});

export type ProjectModel = z.infer<typeof ProjectModelSchema>;
