/**
 * ============================================================================
 * STRUCTURAL MERMAID SYNTAX VALIDATOR
 * ============================================================================
 * Performs structural syntax parsing on Mermaid diagram blocks inside Markdown:
 * - Verifies valid diagram header types (graph TD, erDiagram, sequenceDiagram, etc.)
 * - Detects unclosed code fences
 * - Detects empty Mermaid blocks
 * - Detects unquoted node IDs containing spaces (e.g. Database Engine["..."])
 * - Detects invalid ERD attribute key tokens
 * ============================================================================
 */

export interface MermaidValidationError {
  blockIndex: number;
  message: string;
  codeSnippet?: string;
}

export function validateMermaidSyntax(markdownContent: string): {
  valid: boolean;
  errors: MermaidValidationError[];
} {
  const errors: MermaidValidationError[] = [];
  const fencePattern = /```mermaid([\s\S]*?)```/g;

  let match: RegExpExecArray | null;
  let blockIdx = 0;

  // 1. Check for unclosed mermaid blocks
  const openFenceCount = (markdownContent.match(/```mermaid/g) || []).length;
  const matchCount = (markdownContent.match(/```mermaid[\s\S]*?```/g) || []).length;

  if (openFenceCount > matchCount) {
    errors.push({
      blockIndex: -1,
      message: 'Unclosed Mermaid code block detected in document.',
    });
  }

  // 2. Validate contents of each Mermaid diagram block
  while ((match = fencePattern.exec(markdownContent)) !== null) {
    blockIdx++;
    const code = match[1].trim();

    if (code.length === 0) {
      errors.push({
        blockIndex: blockIdx,
        message: `Mermaid diagram block #${blockIdx} is empty.`,
      });
      continue;
    }

    const lines = code.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const headerLine = lines[0] || '';

    // Valid diagram declarations
    const validHeaders = ['graph ', 'flowchart ', 'erdiagram', 'sequencediagram', 'classdiagram', 'statediagram', 'gantt', 'gitgraph', 'pie'];
    const hasValidHeader = validHeaders.some(vh => headerLine.toLowerCase().startsWith(vh));

    if (!hasValidHeader) {
      errors.push({
        blockIndex: blockIdx,
        message: `Mermaid diagram #${blockIdx} missing valid header declaration (e.g. 'graph TD' or 'erDiagram'). Got: "${headerLine}"`,
        codeSnippet: headerLine,
      });
    }

    // Check for spaces in node IDs in graph diagrams (e.g. "Database Engine["..."]")
    if (headerLine.toLowerCase().startsWith('graph') || headerLine.toLowerCase().startsWith('flowchart')) {
      for (const line of lines.slice(1)) {
        if (line.includes('[') && !line.includes('-->') && !line.includes('---')) {
          const parts = line.split('[');
          const nodeId = parts[0].trim();
          if (nodeId.includes(' ') && !nodeId.startsWith('"') && !nodeId.startsWith("'")) {
            errors.push({
              blockIndex: blockIdx,
              message: `Mermaid node ID "${nodeId}" contains spaces without quotes. Node IDs must be single words (e.g. "DatabaseEngine").`,
              codeSnippet: line,
            });
          }
        }
      }
    }

    // Check for invalid attribute keys in erDiagram
    if (headerLine.toLowerCase().startsWith('erdiagram')) {
      for (const line of lines.slice(1)) {
        if (line.includes('{') || line.includes('}')) continue;
        const tokens = line.split(/\s+/).filter(t => t.length > 0);
        if (tokens.length >= 3) {
          const keyToken = tokens[2];
          // Valid erDiagram key tokens are PK, FK, or empty
          if (['unique', 'not_null', 'check'].includes(keyToken.toLowerCase())) {
            errors.push({
              blockIndex: blockIdx,
              message: `Mermaid erDiagram contains invalid key attribute "${keyToken}". Key attributes must be PK or FK only.`,
              codeSnippet: line,
            });
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
