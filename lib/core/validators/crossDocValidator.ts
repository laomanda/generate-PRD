import { ProjectModel } from '../project-model/schemas';

export interface CrossDocValidationError {
  sourceDoc: string;
  targetDoc: string;
  issue: string;
}

export class CrossDocumentConsistencyValidator {
  validateCrossDoc(
    project: ProjectModel,
    documents: Record<string, string>
  ): { valid: boolean; errors: CrossDocValidationError[] } {
    const errors: CrossDocValidationError[] = [];

    const dbDoc = documents['DATABASE.md'] || '';
    const techDoc = documents['TECH_STACK.md'] || '';

    // Rule 1: Tech Stack Database vs Database Engine
    if (techDoc.length > 0 && dbDoc.length > 0) {
      if (project.dbEngine === 'PostgreSQL' && dbDoc.includes('MySQL')) {
        errors.push({
          sourceDoc: 'TECH_STACK.md',
          targetDoc: 'DATABASE.md',
          issue: `Contradiction detected: TECH_STACK specifies ${project.dbEngine} but DATABASE mentions MySQL.`,
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export const crossDocValidator = new CrossDocumentConsistencyValidator();
