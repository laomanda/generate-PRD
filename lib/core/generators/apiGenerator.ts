import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildApiIR(project: ProjectModel): DocumentIR {
  const primaryEntity = (project.domain.primaryEntityNames[0] || 'resource').toLowerCase();
  const builder = new DocumentIRBuilder('API', `API Documentation`)
    .setMetadata('Target Product', project.projectName)
    .setMetadata('API Protocol', 'REST / JSON API')
    .setMetadata('Auth Scheme', project.signals.authComplexity);

  const sections = [
    { id: 'overview', title: '1. API Overview', text: `RESTful JSON API specification for **${project.projectName}**.` },
    { id: 'architecture', title: '2. API Architecture', text: 'Serverless Next.js API Route Handlers.' },
    { id: 'base-url', title: '3. Base URL / Environment', text: 'Base URL: `https://api.domain.com/v1`.' },
    { id: 'auth', title: '4. Authentication', text: 'Bearer JWT token authorization header (`Authorization: Bearer <token>`).' },
    { id: 'authorization', title: '5. Authorization', text: `Role-based permissions (${project.signals.authComplexity}).` },
    { id: 'endpoints', title: '6. Endpoints', text: `Endpoints: \`GET /api/${primaryEntity}s\`, \`POST /api/${primaryEntity}s\`, \`DELETE /api/${primaryEntity}s/:id\`.` },
    { id: 'request-params', title: '7. Request Parameters', text: 'Query params: `page`, `limit`, `sort`, `filter`.' },
    { id: 'request-body', title: '8. Request Body', text: 'JSON payload format enforced via Zod schema.' },
    { id: 'response-structure', title: '9. Response Structure', text: 'Standard envelope: `{ success: true, data: {...}, timestamp: "..." }`.' },
    { id: 'status-codes', title: '10. HTTP Status Codes', text: '200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 500 Internal Error.' },
    { id: 'error-responses', title: '11. Error Responses', text: 'Error payload format: `{ success: false, error: { code: "INVALID_INPUT", message: "..." } }`.' },
    { id: 'validation-rules', title: '12. Validation Rules', text: 'Strict type validation on all request parameters.' },
    { id: 'pagination', title: '13. Pagination', text: 'Cursor-based or offset pagination with default limit of 20 items.' },
    { id: 'filtering-sorting', title: '14. Filtering & Sorting', text: 'Filtering via `filter[field]=val` and sorting via `sort=-created_at`.' },
    { id: 'rate-limiting', title: '15. Rate Limiting', text: 'Max 100 requests per minute per IP address.' },
    { id: 'versioning', title: '16. Versioning', text: 'URI path versioning (`/v1/...`).' },
    { id: 'security', title: '17. Security Considerations', text: 'CORS header validation, rate limiting, and sanitization.' },
    { id: 'external-integrations', title: '18. External API Integrations', text: project.signals.financialInvolvement ? 'Stripe REST API' : '> Not detected.' },
  ];

  sections.forEach(s => {
    builder.addSection({
      id: s.id,
      title: s.title,
      level: 2,
      nodes: [{ type: 'paragraph', text: s.text }],
    });
  });

  return builder.build();
}

export function generateAPI(project: ProjectModel): string {
  const ir = buildApiIR(project);
  return renderDocumentIRToMarkdown(ir);
}
