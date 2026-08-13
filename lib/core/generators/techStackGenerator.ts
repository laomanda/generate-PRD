import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildTechStackIR(project: ProjectModel): DocumentIR {
  return new DocumentIRBuilder('TECH_STACK', `🛠️ TECHNOLOGY STACK SPECIFICATION`)
    .setMetadata('Target Product', project.projectName)
    .setMetadata('Database Engine', project.dbEngine)
    .setMetadata('Scalability Tier', project.signals.expectedScalability)
    .addSection({
      id: 'stack-overview',
      title: '1. Stack Overview',
      level: 2,
      nodes: [
        {
          type: 'table',
          data: {
            headers: ['Category', 'Technology Name', 'Version', 'Purpose & Rationale'],
            rows: project.techStack.map(t => [t.category.toUpperCase(), t.name, t.version, t.purpose]),
          },
        },
      ],
    })
    .addSection({
      id: 'env-vars',
      title: '2. Environment Variables Blueprint',
      level: 2,
      nodes: [
        {
          type: 'code',
          data: {
            language: 'env',
            code: `# Environment Variables Blueprint (.env.example)
NEXT_PUBLIC_APP_NAME="${project.projectName}"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DATABASE_URL="${project.dbEngine.toLowerCase()}://user:pass@localhost:5432/${project.projectName.toLowerCase().replace(/[^a-z0-9]/g, '_')}"
${project.signals.financialInvolvement ? 'STRIPE_SECRET_KEY="sk_test_xxx"\nSTRIPE_WEBHOOK_SECRET="whsec_xxx"' : ''}`,
          },
        },
      ],
    })
    .build();
}

export function generateTechStack(project: ProjectModel): string {
  const ir = buildTechStackIR(project);
  return renderDocumentIRToMarkdown(ir);
}
