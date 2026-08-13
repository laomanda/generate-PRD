import { SECTION_REGISTRY, DocumentContractDefinition } from '../section-registry/registry';

export interface ValidationError {
  type: 'MISSING_SECTION' | 'UNRESOLVED_TOKEN' | 'EMPTY_DOCUMENT' | 'INVALID_STRUCTURE';
  message: string;
  sectionId?: string;
  details?: string;
}

export interface ValidationResult {
  documentId: string;
  filename: string;
  valid: boolean;
  errors: ValidationError[];
}

export class DocumentationCompletenessValidator {
  validate(documentId: string, markdownContent: string): ValidationResult {
    const contract: DocumentContractDefinition | undefined = SECTION_REGISTRY[documentId];
    const errors: ValidationError[] = [];

    if (!contract) {
      return {
        documentId,
        filename: `${documentId}.md`,
        valid: false,
        errors: [{ type: 'INVALID_STRUCTURE', message: `Unknown document contract ID: ${documentId}` }],
      };
    }

    if (!markdownContent || markdownContent.trim().length === 0) {
      return {
        documentId,
        filename: contract.filename,
        valid: false,
        errors: [{ type: 'EMPTY_DOCUMENT', message: `Document content is empty.` }],
      };
    }

    // 1. Check for Mandatory Sections
    for (const reqSection of contract.mandatorySections) {
      const titlePattern = reqSection.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`#{1,3}\\s+${titlePattern}`, 'i');

      if (!regex.test(markdownContent)) {
        errors.push({
          type: 'MISSING_SECTION',
          sectionId: reqSection.id,
          message: `Mandatory section missing: "${reqSection.title}"`,
        });
      }
    }

    // 2. Check for Unresolved Template Tokens
    const forbiddenTokens = ['{{', '}}', '[TODO]', 'UNDEFINED', 'NaN', 'null null'];
    for (const token of forbiddenTokens) {
      if (markdownContent.includes(token)) {
        errors.push({
          type: 'UNRESOLVED_TOKEN',
          message: `Forbidden unresolved token detected: "${token}"`,
        });
      }
    }

    return {
      documentId,
      filename: contract.filename,
      valid: errors.length === 0,
      errors,
    };
  }
}

export const completenessValidator = new DocumentationCompletenessValidator();
