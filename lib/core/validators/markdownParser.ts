/**
 * ============================================================================
 * MARKDOWN SECTION AST PARSER
 * ============================================================================
 * Parses raw Markdown text into a structured AST of sections, headings,
 * line positions, body text lengths, and occurrence counts.
 * ============================================================================
 */

export interface ParsedSectionNode {
  id: string;
  title: string;
  level: number;
  startLine: number;
  endLine: number;
  bodyContent: string;
  hasBody: boolean;
}

export interface MarkdownASTReport {
  documentTitle: string;
  titleValid: boolean;
  sections: ParsedSectionNode[];
  sectionOccurrences: Record<string, number>;
  headingOrder: string[];
}

export function parseMarkdownSections(markdown: string): MarkdownASTReport {
  const lines = markdown.split('\n');
  const sections: ParsedSectionNode[] = [];
  const sectionOccurrences: Record<string, number> = {};
  const headingOrder: string[] = [];

  let documentTitle = '';
  let titleValid = false;

  let currentSection: ParsedSectionNode | null = null;
  let currentBodyLines: string[] = [];

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();

      // Check document H1 title
      if (level === 1 && !documentTitle) {
        documentTitle = title;
        titleValid = true;
      }

      // Close previous section
      if (currentSection) {
        currentSection.endLine = lineIdx - 1;
        currentSection.bodyContent = currentBodyLines.join('\n').trim();
        currentSection.hasBody = currentSection.bodyContent.length > 0;
        sections.push(currentSection);
      }

      // Track occurrence
      const normalizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');
      sectionOccurrences[normalizedTitle] = (sectionOccurrences[normalizedTitle] || 0) + 1;
      headingOrder.push(title);

      // Start new section
      currentSection = {
        id: `sec-${lineIdx}`,
        title,
        level,
        startLine: lineIdx,
        endLine: lineIdx,
        bodyContent: '',
        hasBody: false,
      };
      currentBodyLines = [];
    } else if (currentSection) {
      currentBodyLines.push(line);
    }
  }

  // Close final section
  if (currentSection) {
    currentSection.endLine = lines.length - 1;
    currentSection.bodyContent = currentBodyLines.join('\n').trim();
    currentSection.hasBody = currentSection.bodyContent.length > 0;
    sections.push(currentSection);
  }

  return {
    documentTitle,
    titleValid,
    sections,
    sectionOccurrences,
    headingOrder,
  };
}
