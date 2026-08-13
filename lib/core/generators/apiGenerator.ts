import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildApiIR(project: ProjectModel): DocumentIR {
  const builder = new DocumentIRBuilder('API', `API Documentation`)
    .setMetadata('Target Product', project.projectName)
    .setMetadata('API Protocol', 'REST / JSON API')
    .setMetadata('Auth Scheme', project.signals.authComplexity);

  const entities = project.domain.entities;
  const workflows = project.domain.coreWorkflows;
  
  // Dynamically derive endpoints from actual entities
  const entityEndpoints = entities.map(e => {
    const resource = e.tableName.replace(/_/g, '-');
    return `\n#### ${e.name} API\n- \`GET /api/v1/${resource}\` — List ${resource}\n- \`POST /api/v1/${resource}\` — Create ${e.name.toLowerCase()}\n- \`GET /api/v1/${resource}/:id\` — Retrieve ${e.name.toLowerCase()}\n- \`PATCH /api/v1/${resource}/:id\` — Update ${e.name.toLowerCase()}\n- \`DELETE /api/v1/${resource}/:id\` — Delete ${e.name.toLowerCase()}`;
  }).join('\n');

  // Dynamically derive workflow specific RPC-style or nested endpoints
  const workflowEndpoints = workflows.map((w, i) => {
    const slug = w.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `- \`POST /api/v1/workflows/${slug}\` — Execute ${w}`;
  }).join('\n');

  // Base API architecture on tech stack
  const techNames = project.techStack.map(t => (typeof t === 'string' ? t : t.name || '')).join(' ').toLowerCase();
  let apiArch = 'Express.js REST API with routing controllers.';
  if (techNames.includes('next')) {
    apiArch = 'Next.js App Router API Route Handlers (Serverless Functions).';
  } else if (techNames.includes('supabase')) {
    apiArch = 'Supabase PostgREST auto-generated API + Edge Functions.';
  } else if (techNames.includes('nest')) {
    apiArch = 'NestJS modular controllers with decorators.';
  }

  const sections = [
    { id: 'overview', title: '1. API Overview', text: `RESTful JSON API specification for **${project.projectName}** supporting ${project.domain.domainName} operations.` },
    { id: 'architecture', title: '2. API Architecture', text: apiArch },
    { id: 'base-url', title: '3. Base URL / Environment', text: 'Base URL: `https://api.domain.com/v1`.' },
    { id: 'auth', title: '4. Authentication', text: project.signals.authComplexity === 'jwt_session' ? 'Bearer JWT token authorization header (`Authorization: Bearer <token>`).' : 'Cookie-based session authentication.' },
    { id: 'authorization', title: '5. Authorization', text: `Role-based permissions (${project.signals.authComplexity}) mapping to: ${project.domain.userRoles.map(r => r.role).join(', ')}.` },
    { id: 'endpoints', title: '6. Core Resource Endpoints', text: entityEndpoints || 'No core entity endpoints defined.' },
    { id: 'workflow-endpoints', title: '7. Workflow Endpoints', text: workflowEndpoints || 'No workflow endpoints defined.' },
    { id: 'request-params', title: '8. Request Parameters', text: 'Query params: `page`, `limit`, `sort`, `filter`.' },
    { id: 'request-body', title: '9. Request Body', text: 'JSON payload format enforced via strict validation schemas (Zod/Joi).' },
    { id: 'response-structure', title: '10. Response Structure', text: 'Standard envelope: `{ success: true, data: {...}, timestamp: "..." }`.' },
    { id: 'status-codes', title: '11. HTTP Status Codes', text: '200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 500 Internal Error.' },
    { id: 'error-responses', title: '12. Error Responses', text: 'Error payload format: `{ success: false, error: { code: "INVALID_INPUT", message: "..." } }`.' },
    { id: 'validation-rules', title: '13. Validation Rules', text: 'Strict type validation on all request parameters and body payloads.' },
    { id: 'pagination', title: '14. Pagination', text: 'Cursor-based or offset pagination with default limit of 20 items.' },
    { id: 'filtering-sorting', title: '15. Filtering & Sorting', text: 'Filtering via `filter[field]=val` and sorting via `sort=-created_at`.' },
    { id: 'rate-limiting', title: '16. Rate Limiting', text: 'Max 100 requests per minute per IP address.' },
    { id: 'security', title: '17. Security Considerations', text: `CORS header validation, rate limiting, and sanitization for ${project.signals.riskLevel} risk profile.` },
    { id: 'external-integrations', title: '18. External API Integrations', text: project.signals.financialInvolvement ? 'Stripe REST API Webhooks integration.' : '> Not detected.' },
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
