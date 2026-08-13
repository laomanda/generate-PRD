/**
 * ============================================================================
 * KNOWLEDGE ENTITY DEFINITIONS & RELATIONSHIP MODELS
 * ============================================================================
 * Structured knowledge entities for Technologies, Frameworks, Architecture Patterns,
 * Security Controls, and Database Strategies — completely decoupled from templates.
 * ============================================================================
 */

export interface KnowledgeEntity {
  id: string;
  name: string;
  category: 'technology' | 'framework' | 'architecture' | 'database' | 'security' | 'ux' | 'domain';
  description: string;
  purpose: string;
  strengths: string[];
  limitations: string[];
  securityConsiderations: string[];
  databaseConsiderations: string[];
  architectureConsiderations: string[];
  uxConsiderations: string[];
  bestPractices: string[];
}

export type RelationshipType =
  | 'commonly_used_with'
  | 'requires'
  | 'solves'
  | 'implies'
  | 'conflicts_with'
  | 'recommends_security';

export interface KnowledgeRelationship {
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  rationale: string;
  confidence: number;
}

export const KNOWLEDGE_ENTITIES: Record<string, KnowledgeEntity> = {

  // --- TECHNOLOGIES & FRAMEWORKS ---
  'nextjs': {
    id: 'nextjs',
    name: 'Next.js 14+ (App Router)',
    category: 'framework',
    description: 'React framework supporting Server Components, App Router, and Edge runtime execution.',
    purpose: 'Full-stack React rendering and serverless API route handlers.',
    strengths: ['Hybrid SSR/SSG/RSC rendering', 'Built-in routing and API endpoints', 'Edge network deployment support'],
    limitations: ['Vendor lock-in tendencies towards Vercel', 'Complexity in server/client component boundary split'],
    securityConsiderations: ['Enforce strict validation on Server Actions', 'Keep secret keys inside server environment variables'],
    databaseConsiderations: ['Use connection pooling for serverless database connections'],
    architectureConsiderations: ['Maintain clean separation between client components and server actions'],
    uxConsiderations: ['Use streaming loading states (loading.tsx) for sub-second visual reactivity'],
    bestPractices: ['Leverage React Server Components for zero-bundle-size data fetching'],
  },

  'postgresql': {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'database',
    description: 'Advanced open-source object-relational SQL database engine.',
    purpose: 'ACID-compliant relational data storage with JSONB support.',
    strengths: ['Strict relational integrity', 'JSONB semi-structured query capabilities', 'Extensive indexing options (B-Tree, GIN, GiST)'],
    limitations: ['Requires connection poolers (PgBouncer/Prisma Accelerate) in serverless environments'],
    securityConsiderations: ['Enforce Row Level Security (RLS) policies for multi-tenant data isolation', 'Encrypt connection strings'],
    databaseConsiderations: ['Create foreign key indexes to prevent full table scans on joins'],
    architectureConsiderations: ['Use code-first ORM migrations (Prisma/Drizzle) for schema versioning'],
    uxConsiderations: ['Return optimistic UI state updates while waiting for database transaction confirmation'],
    bestPractices: ['Enforce NOT NULL and Foreign Key CASCADE constraints at database schema level'],
  },

  'stripe': {
    id: 'stripe',
    name: 'Stripe Payment Gateway',
    category: 'technology',
    description: 'Financial infrastructure API platform for online payment processing.',
    purpose: 'Secure payment collection, subscription billing, and invoice dispatch.',
    strengths: ['PCI-DSS compliant tokenization', 'Webhook delivery events', 'Global currency support'],
    limitations: ['Webhook event delivery requires idempotent processing logic'],
    securityConsiderations: [
      'Validate Stripe webhook signatures using raw request body before processing events',
      'Never store raw credit card numbers on local databases',
    ],
    databaseConsiderations: [
      'Store stripe_customer_id, stripe_subscription_id, and stripe_invoice_id as UNIQUE foreign references',
      'Maintain an internal payment audit log table for financial reconciliation',
    ],
    architectureConsiderations: ['Use exponential backoff retry for handling async payment webhooks'],
    uxConsiderations: ['Display instant payment processing spinners and clear failure error messages'],
    bestPractices: ['Use Stripe Checkout or Stripe Elements to keep card data out of local server logs'],
  },

  'supabase': {
    id: 'supabase',
    name: 'Supabase',
    category: 'technology',
    description: 'Open-source Firebase alternative powered by PostgreSQL, Auth, and Realtime Engine.',
    purpose: 'Managed backend infrastructure with Row Level Security and instant APIs.',
    strengths: ['Built-in PostgreSQL RLS auth', 'Realtime database subscriptions', 'Storage bucket integration'],
    limitations: ['Couples auth roles directly to database Postgres roles'],
    securityConsiderations: ['Write strict Row Level Security (RLS) policies for every table'],
    databaseConsiderations: ['Manage RLS policies in versioned migration SQL files'],
    architectureConsiderations: ['Use Supabase JS client with typed database definitions'],
    uxConsiderations: ['Leverage realtime subscriptions for instant UI updates'],
    bestPractices: ['Never disable RLS on production tables'],
  },

  'rbac': {
    id: 'rbac',
    name: 'Role-Based Access Control (RBAC)',
    category: 'security',
    description: 'Security architecture pattern restricting resource access based on user roles.',
    purpose: 'Granular access control and permission enforcement.',
    strengths: ['Hierarchical role management', 'Centralized permission matrix', 'Audit trail compliance'],
    limitations: ['Role explosion if permission granularity is too fine-grained'],
    securityConsiderations: ['Enforce role check middleware on all protected route handlers and API endpoints'],
    databaseConsiderations: ['Store roles, user_roles, and permissions in normalized junction tables'],
    architectureConsiderations: ['Define clear role hierarchy: Super Admin > Admin > Manager > Member > Viewer'],
    uxConsiderations: ['Hide restricted UI actions and navigation links from users without sufficient role level'],
    bestPractices: ['Deny access by default (Zero Trust) unless role explicitly permits action'],
  },

  'audit_logging': {
    id: 'audit_logging',
    name: 'Audit Logging & Compliance Trail',
    category: 'security',
    description: 'Immutable record keeping of critical domain events and administrative mutations.',
    purpose: 'Security auditing, forensic analysis, and regulatory compliance.',
    strengths: ['Non-repudiation of user actions', 'Historical state inspection', 'Security incident investigation'],
    limitations: ['High log table row growth requiring partition strategies'],
    securityConsiderations: ['Audit log records must be append-only with immutable permissions'],
    databaseConsiderations: ['Store user_id, action, entity_type, entity_id, previous_state, and new_state in JSONB'],
    architectureConsiderations: ['Dispatch audit log writes asynchronously to prevent blocking primary request flow'],
    uxConsiderations: ['Provide searchable administrative audit log viewer table with date filters'],
    bestPractices: ['Log all destructive actions (DELETE, UPDATE) and privilege changes'],
  },

  'payment_failure_handling': {
    id: 'payment_failure_handling',
    name: 'Payment Failure & Retry Workflow',
    category: 'ux',
    description: 'Graceful handling of declined transactions, dunning periods, and subscription past-due states.',
    purpose: 'Prevent service interruption and recover failed subscription payments.',
    strengths: ['Reduces churn from expired cards', 'Automated email retry reminders', 'Grace period management'],
    limitations: ['Requires clear subscription state tracking in database'],
    securityConsiderations: ['Revoke premium feature access immediately if past-due grace period expires'],
    databaseConsiderations: ['Maintain status column on subscriptions: active, trialing, past_due, canceled'],
    architectureConsiderations: ['Process customer invoice.payment_failed webhooks automatically'],
    uxConsiderations: ['Display prominent banner alerting user to update billing payment method'],
    bestPractices: ['Provide 3-day grace period before downgrading active account tier'],
  },
};
