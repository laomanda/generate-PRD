import { SECTION_REGISTRY, DocumentContractDefinition } from '../section-registry/registry';
import { parseMarkdownSections } from './markdownParser';

export interface ValidationError {
  type: 'MISSING_SECTION' | 'DUPLICATE_SECTION' | 'WRONG_ORDER' | 'EMPTY_SECTION' | 'UNRESOLVED_TOKEN' | 'EMPTY_DOCUMENT' | 'INVALID_STRUCTURE';
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

    // Parse Markdown AST
    const ast = parseMarkdownSections(markdownContent);

    // 0. Check Document Title
    if (!ast.titleValid) {
      errors.push({
        type: 'INVALID_STRUCTURE',
        message: `Missing H1 document title in ${contract.filename}`,
      });
    }

    // 1. Check Missing Sections, Duplicate Sections, and Empty Sections
    const sectionIndexMap: Record<string, number> = {};

    contract.mandatorySections.forEach((reqSection) => {
      // Find matching section in AST by exact normalized title
      const matchingNodes = ast.sections.filter(s => {
        const sNorm = s.title.toLowerCase().replace(/[^a-z0-9]/g, '');
        const rNorm = reqSection.title.toLowerCase().replace(/[^a-z0-9]/g, '');
        return sNorm === rNorm;
      });

      if (matchingNodes.length === 0) {
        errors.push({
          type: 'MISSING_SECTION',
          sectionId: reqSection.id,
          message: `Mandatory section missing: "${reqSection.title}"`,
        });
      } else if (matchingNodes.length > 1) {
        errors.push({
          type: 'DUPLICATE_SECTION',
          sectionId: reqSection.id,
          message: `Duplicate mandatory section detected: "${reqSection.title}" (Found ${matchingNodes.length} occurrences)`,
        });
      } else {
        const node = matchingNodes[0];
        sectionIndexMap[reqSection.id] = node.startLine;

        // Check for empty section body (unless section has defined subsections in contract)
        const isParentWithSubsections = reqSection.subsections && reqSection.subsections.length > 0;
        if (!node.hasBody && !isParentWithSubsections) {
          errors.push({
            type: 'EMPTY_SECTION',
            sectionId: reqSection.id,
            message: `Mandatory section is empty (no body text): "${reqSection.title}"`,
          });
        }
      }
    });

    // 2. Check Section Ordering
    let lastLine = -1;
    for (const reqSection of contract.mandatorySections) {
      const linePos = sectionIndexMap[reqSection.id];
      if (linePos !== undefined) {
        if (linePos < lastLine) {
          errors.push({
            type: 'WRONG_ORDER',
            sectionId: reqSection.id,
            message: `Section out of mandatory order: "${reqSection.title}" appears before preceding mandatory section.`,
          });
        }
        lastLine = linePos;
      }
    }

    // 3. Check for Unresolved Template Tokens
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
