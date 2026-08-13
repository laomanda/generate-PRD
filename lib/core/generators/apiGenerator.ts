import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildApiIR(project: ProjectModel): DocumentIR {
  const primaryEntity = (project.domain.primaryEntityNames[0] || 'resource').toLowerCase();
  return new DocumentIRBuilder('API', `🔌 API SPECIFICATION & ROUTE HANDLERS`)
    .setMetadata('Target Product', project.projectName)
    .setMetadata('API Protocol', 'REST / JSON API')
    .setMetadata('Auth Scheme', project.signals.authComplexity)
    .addSection({
      id: 'api-overview',
      title: '1. API Overview & Endpoints',
      level: 2,
      nodes: [
        {
          type: 'table',
          data: {
            headers: ['Method', 'Endpoint Route', 'Auth Required', 'Description'],
            rows: [
              ['GET', `/api/${primaryEntity}s`, 'Yes', `List all ${primaryEntity} records (paginated)`],
              ['POST', `/api/${primaryEntity}s`, 'Yes', `Create new ${primaryEntity} entry`],
              ['GET', `/api/${primaryEntity}s/:id`, 'Yes', `Fetch ${primaryEntity} detail by UUID`],
              ['PATCH', `/api/${primaryEntity}s/:id`, 'Yes', `Update ${primaryEntity} record fields`],
              ['DELETE', `/api/${primaryEntity}s/:id`, 'Yes', `Soft-delete ${primaryEntity} entry`],
            ],
          },
        },
      ],
    })
    .build();
}

export function generateAPI(project: ProjectModel): string {
  const ir = buildApiIR(project);
  return renderDocumentIRToMarkdown(ir);
}
