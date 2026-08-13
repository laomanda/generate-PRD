import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildTestingIR(project: ProjectModel): DocumentIR {
  return new DocumentIRBuilder('TESTING', `🧪 QA & TESTING STRATEGY`)
    .setMetadata('Target Product', project.projectName)
    .setMetadata('Test Suite Framework', 'Vitest + Playwright')
    .addSection({
      id: 'testing-matrix',
      title: '1. Quality Assurance Matrix',
      level: 2,
      nodes: [
        {
          type: 'list',
          data: {
            ordered: false,
            items: [
              'Unit Tests: Vitest for pure core business functions.',
              'Integration Tests: API Route Handlers testing payload Zod contracts.',
              'E2E Tests: Playwright suites for user journey workflows.',
            ],
          },
        },
      ],
    })
    .build();
}

export function generateTesting(project: ProjectModel): string {
  const ir = buildTestingIR(project);
  return renderDocumentIRToMarkdown(ir);
}
