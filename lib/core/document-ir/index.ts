/**
 * ============================================================================
 * DOCUMENT INTERMEDIATE REPRESENTATION (IR) AST
 * ============================================================================
 * A framework-independent AST model representing documentation structure
 * before it is rendered into Markdown text.
 * ============================================================================
 */

export type CalloutType = 'NOTE' | 'TIP' | 'IMPORTANT' | 'WARNING' | 'CAUTION';

export interface DocumentTableNode {
  headers: string[];
  rows: string[][];
}

export interface DocumentCodeBlockNode {
  language: string;
  code: string;
}

export interface DocumentDiagramNode {
  diagramType: 'mermaid';
  code: string;
}

export interface DocumentCalloutNode {
  type: CalloutType;
  title?: string;
  content: string;
}

export interface DocumentListNode {
  ordered: boolean;
  items: (string | { text: string; checked?: boolean })[];
}

export interface DocumentSectionNode {
  id: string;
  title: string;
  level: 1 | 2 | 3 | 4;
  rationale?: string; // Explainability: Why this section was included by the engine
  nodes: (
    | { type: 'paragraph'; text: string }
    | { type: 'table'; data: DocumentTableNode }
    | { type: 'code'; data: DocumentCodeBlockNode }
    | { type: 'diagram'; data: DocumentDiagramNode }
    | { type: 'callout'; data: DocumentCalloutNode }
    | { type: 'list'; data: DocumentListNode }
    | { type: 'subsection'; section: DocumentSectionNode }
  )[];
}

export interface DocumentIR {
  id: string;
  documentType: 'PRD' | 'DESIGN' | 'DATABASE' | 'TECH_STACK' | 'ARCHITECTURE' | 'API' | 'SECURITY' | 'TESTING' | 'DEPLOYMENT';
  title: string;
  subtitle?: string;
  metadata: Record<string, string>;
  sections: DocumentSectionNode[];
}

export class DocumentIRBuilder {
  private doc: DocumentIR;

  constructor(documentType: DocumentIR['documentType'], title: string) {
    this.doc = {
      id: `${documentType.toLowerCase()}-${Date.now()}`,
      documentType,
      title,
      metadata: {},
      sections: [],
    };
  }

  setMetadata(key: string, value: string): this {
    this.doc.metadata[key] = value;
    return this;
  }

  addSection(section: DocumentSectionNode): this {
    this.doc.sections.push(section);
    return this;
  }

  build(): DocumentIR {
    return this.doc;
  }
}
