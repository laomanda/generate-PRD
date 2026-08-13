import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildDeploymentIR(project: ProjectModel): DocumentIR {
  return new DocumentIRBuilder('DEPLOYMENT', `🚀 DEPLOYMENT & CI/CD BLUEPRINT`)
    .setMetadata('Target Product', project.projectName)
    .setMetadata('Scalability Target', project.signals.expectedScalability)
    .addSection({
      id: 'deployment-pipeline',
      title: '1. Deployment Topology & CI/CD Pipeline',
      level: 2,
      nodes: [
        {
          type: 'code',
          data: {
            language: 'bash',
            code: `# CI/CD Deployment Commands
npm run lint
npx tsc --noEmit
npm run test:unit
npm run build`,
          },
        },
      ],
    })
    .build();
}

export function generateDeployment(project: ProjectModel): string {
  const ir = buildDeploymentIR(project);
  return renderDocumentIRToMarkdown(ir);
}
