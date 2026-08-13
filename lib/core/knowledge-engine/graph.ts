import { KNOWLEDGE_ENTITIES, KnowledgeEntity, KnowledgeRelationship } from './entities';

/**
 * ============================================================================
 * KNOWLEDGE GRAPH ENGINE
 * ============================================================================
 * Traverses relationships between technologies, security practices, UX rules,
 * and database patterns.
 * Allows the engine to infer:
 * `Stripe` -> `requires` -> `payment_failure_handling`
 * `PostgreSQL` -> `commonly_used_with` -> `supabase`
 * `Financial Domain` -> `implies` -> `audit_logging` & `rbac`
 * ============================================================================
 */

export const KNOWLEDGE_RELATIONSHIPS: KnowledgeRelationship[] = [
  {
    sourceId: 'stripe',
    targetId: 'payment_failure_handling',
    type: 'requires',
    rationale: 'Stripe webhook payment failures require automated retry and dunning period handling.',
    confidence: 0.95,
  },
  {
    sourceId: 'stripe',
    targetId: 'audit_logging',
    type: 'implies',
    rationale: 'Financial transactions executed via Stripe mandate immutable transaction audit logging.',
    confidence: 0.9,
  },
  {
    sourceId: 'supabase',
    targetId: 'postgresql',
    type: 'requires',
    rationale: 'Supabase infrastructure is built directly on PostgreSQL database clusters.',
    confidence: 1.0,
  },
  {
    sourceId: 'rbac',
    targetId: 'audit_logging',
    type: 'commonly_used_with',
    rationale: 'Role-based access control systems require audit logs to track privilege mutations.',
    confidence: 0.85,
  },
  {
    sourceId: 'nextjs',
    targetId: 'postgresql',
    type: 'commonly_used_with',
    rationale: 'Next.js serverless route handlers pair seamlessly with relational PostgreSQL storage.',
    confidence: 0.8,
  },
];

export class KnowledgeGraphEngine {
  /**
   * Get entity by ID
   */
  getEntity(id: string): KnowledgeEntity | undefined {
    return KNOWLEDGE_ENTITIES[id];
  }

  /**
   * Get all relationships where `sourceId` matches
   */
  getOutgoingRelationships(sourceId: string): KnowledgeRelationship[] {
    return KNOWLEDGE_RELATIONSHIPS.filter(r => r.sourceId === sourceId);
  }

  /**
   * Get all entities implied, required, or recommended by a given set of active technology/domain IDs
   */
  resolveKnowledgeGraph(activeIds: string[]): {
    entities: KnowledgeEntity[];
    relationships: KnowledgeRelationship[];
    inferredEntityIds: string[];
  } {
    const activeSet = new Set(activeIds);
    const inferredSet = new Set<string>();
    const resolvedRelationships: KnowledgeRelationship[] = [];

    // Traverse relationships 1 level deep
    for (const sourceId of activeSet) {
      const outgoing = this.getOutgoingRelationships(sourceId);
      for (const rel of outgoing) {
        resolvedRelationships.push(rel);
        if (!activeSet.has(rel.targetId)) {
          inferredSet.add(rel.targetId);
        }
      }
    }

    const allEntityIds = [...new Set([...activeSet, ...inferredSet])];
    const entities = allEntityIds
      .map(id => KNOWLEDGE_ENTITIES[id])
      .filter((e): e is KnowledgeEntity => e !== undefined);

    return {
      entities,
      relationships: resolvedRelationships,
      inferredEntityIds: Array.from(inferredSet),
    };
  }
}

export const knowledgeGraph = new KnowledgeGraphEngine();
