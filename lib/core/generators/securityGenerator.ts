import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildSecurityIR(project: ProjectModel): DocumentIR {
  return new DocumentIRBuilder('SECURITY', `🛡️ SECURITY & COMPLIANCE BLUEPRINT`)
    .setMetadata('Target Product', project.projectName)
    .setMetadata('Data Sensitivity Score', `${project.signals.dataSensitivityScore}/10`)
    .setMetadata('Risk Level', project.signals.riskLevel.toUpperCase())
    .addSection({
      id: 'threat-model',
      title: '1. Threat Model & Risk Controls',
      level: 2,
      nodes: [
        {
          type: 'callout',
          data: {
            type: 'WARNING',
            title: 'Risk Level Controls',
            content: `Project is classified under ${project.signals.riskLevel.toUpperCase()} risk level with data sensitivity ${project.signals.dataSensitivityScore}/10.`,
          },
        },
        {
          type: 'list',
          data: {
            ordered: false,
            items: [
              'Zero Plaintext Storage: Passwords hashed with Argon2id or Bcrypt.',
              'Input Validation: All API request payloads validated via Zod schemas.',
              'Rate Limiting: Endpoints limited to max 100 requests per minute per IP.',
            ],
          },
        },
      ],
    })
    .build();
}

export function generateSecurity(project: ProjectModel): string {
  const ir = buildSecurityIR(project);
  return renderDocumentIRToMarkdown(ir);
}
