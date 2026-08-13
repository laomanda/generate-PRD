import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildDesignIR(project: ProjectModel): DocumentIR {
  return new DocumentIRBuilder('DESIGN', `🎨 DESIGN SYSTEM & VISUAL DIRECTIVE`)
    .setMetadata('Target Product', project.projectName)
    .setMetadata('Visual Vibe', project.designVibe)
    .setMetadata('Design Complexity', project.signals.designComplexity)
    .addSection({
      id: 'design-overview',
      title: '1. Visual Direction & Principles',
      level: 2,
      nodes: [
        { type: 'paragraph', text: `Visual system for **${project.projectName}** customized for ${project.domain.domainName}.` },
        {
          type: 'list',
          data: {
            ordered: false,
            items: [
              'High Contrast & Accessibility: Meeting WCAG AA contrast standards (>4.5:1 ratio).',
              'Monospaced Data Alignment: Numerical values, table data, and timestamps use code font.',
              'Tactile Feedback: Sub-16ms interactive states for buttons and form inputs.',
            ],
          },
        },
      ],
    })
    .addSection({
      id: 'color-palette',
      title: '2. Color System & Design Tokens',
      level: 2,
      nodes: [
        {
          type: 'table',
          data: {
            headers: ['Token', 'Hex', 'Tailwind Utility', 'Usage'],
            rows: [
              ['Background', '#09090b', 'bg-zinc-950', 'Main dark app background surface'],
              ['Card Surface', '#18181b', 'bg-zinc-900', 'Elevated card container background'],
              ['Border Subdued', '#27272a', 'border-zinc-800', 'Subtle dividing lines and card borders'],
              ['Primary Brand', '#6366f1', 'bg-indigo-500', 'CTA buttons, active links, and brand highlights'],
              ['Text High Contrast', '#f4f4f5', 'text-zinc-100', 'Primary body headers and titles'],
            ],
          },
        },
      ],
    })
    .build();
}

export function generateDesignSystem(project: ProjectModel): string {
  const ir = buildDesignIR(project);
  return renderDocumentIRToMarkdown(ir);
}
