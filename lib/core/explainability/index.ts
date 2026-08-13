import { InferredFact, ProjectModel } from '../project-model/schemas';

export interface AuditExplanation {
  factId: string;
  headline: string;
  category: string;
  source: string;
  confidence: number;
  reasoning: string;
  affectedDocuments: string[];
}

export function generateAuditExplanations(project: ProjectModel): AuditExplanation[] {
  return project.inferredFacts.map((fact: InferredFact) => ({
    factId: fact.id,
    headline: fact.fact,
    category: fact.category,
    source: fact.source,
    confidence: fact.confidence,
    reasoning: fact.reasoning,
    affectedDocuments: fact.affectedDocuments,
  }));
}
