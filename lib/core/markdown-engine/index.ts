import { DocumentIR, DocumentSectionNode } from '../document-ir';

/**
 * ============================================================================
 * MARKDOWN AST & RENDERER ENGINE
 * ============================================================================
 * Converts Document Intermediate Representation (IR) into deterministic,
 * perfectly formatted GitHub Flavored Markdown (.md) text.
 * ============================================================================
 */

export function renderDocumentIRToMarkdown(doc: DocumentIR): string {
  const lines: string[] = [];

  // Header Title
  lines.push(`# ${doc.title}`);
  if (doc.subtitle) {
    lines.push(`> ${doc.subtitle}`);
  }
  lines.push('');

  // Metadata Block
  if (Object.keys(doc.metadata).length > 0) {
    for (const [key, value] of Object.entries(doc.metadata)) {
      lines.push(`> **${key}**: ${value}  `);
    }
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  // Sections
  for (const section of doc.sections) {
    lines.push(renderSectionNode(section));
    lines.push('');
  }

  return lines.join('\n').trim();
}

function renderSectionNode(section: DocumentSectionNode): string {
  const lines: string[] = [];

  const hashes = '#'.repeat(section.level);
  lines.push(`${hashes} ${section.title}`);

  if (section.nodes) {
    for (const node of section.nodes) {
      if (node.type === 'paragraph') {
        lines.push(node.text);
        lines.push('');
      } else if (node.type === 'callout') {
        lines.push(`> [!${node.data.type}]`);
        if (node.data.title) {
          lines.push(`> **${node.data.title}**`);
        }
        lines.push(`> ${node.data.content}`);
        lines.push('');
      } else if (node.type === 'list') {
        const { ordered, items } = node.data;
        items.forEach((item, i) => {
          if (typeof item === 'string') {
            lines.push(ordered ? `${i + 1}. ${item}` : `- ${item}`);
          } else {
            const check = item.checked ? '[x]' : '[ ]';
            lines.push(`- ${check} ${item.text}`);
          }
        });
        lines.push('');
      } else if (node.type === 'table') {
        const { headers, rows } = node.data;
        lines.push(`| ${headers.join(' | ')} |`);
        lines.push(`| ${headers.map(() => ':---').join(' | ')} |`);
        rows.forEach(row => {
          lines.push(`| ${row.join(' | ')} |`);
        });
        lines.push('');
      } else if (node.type === 'code') {
        lines.push(`\`\`\`${node.data.language}`);
        lines.push(node.data.code);
        lines.push('```');
        lines.push('');
      } else if (node.type === 'diagram') {
        lines.push('```mermaid');
        lines.push(node.data.code);
        lines.push('```');
        lines.push('');
      } else if (node.type === 'subsection') {
        lines.push(renderSectionNode(node.section));
        lines.push('');
      }
    }
  }

  return lines.join('\n');
}
