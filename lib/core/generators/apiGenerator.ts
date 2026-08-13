import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildApiIR(project: ProjectModel): DocumentIR {
  const builder = new DocumentIRBuilder('API', `API Documentation`)
    .setMetadata('Target System', project.projectName)
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
  const workflowEndpoints = workflows.map(w => {
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

  const cleanProjectName = project.projectName.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const isHighRisk = project.signals.riskLevel === 'high' || project.signals.dataSensitivityScore >= 7;

  // Define dynamic endpoints for user identity resource
  const userIdentityEndpoints = `
#### User Management API
- \`GET /api/v1/${cleanProjectName}-users\` — List system users and administrators
- \`POST /api/v1/${cleanProjectName}-users\` — Register a new credentialed user
- \`GET /api/v1/${cleanProjectName}-users/:id\` — Retrieve details for specific user ID`;

  const entityNames = entities.map(e => e.name).filter(n => n !== 'User');
  const primaryEntity = entityNames[0] || 'Domain Entity';

  const sections = [
    { id: 'overview', title: '1. API Overview', text: `RESTful JSON API specification for **${project.projectName}** supporting ${project.domain.domainName} operations.` },
    { id: 'architecture', title: '2. API Architecture', text: `${apiArch} specifically tuned for ${project.signals.expectedScalability} performance.` },
    { id: 'base-url', title: '3. Base URL / Environment', text: `Base URL: \`https://api.${cleanProjectName}.com/v1\`.` },
    { id: 'auth', title: '4. Authentication', text: project.signals.authComplexity === 'jwt_session' ? `Bearer JWT token authorization header (\`Authorization: Bearer <token>\`) for securely verifying ${cleanProjectName} sessions.` : `Cookie-based session authentication with CSRF token protection for ${cleanProjectName}.` },
    { id: 'authorization', title: '5. Authorization', text: `Role-based permissions (${project.signals.authComplexity}) mapping to: ${project.domain.userRoles.map(r => r.role).join(', ')}.` },
    { id: 'endpoints', title: '6. Endpoints', text: `Detailed specifications for all REST API endpoints implemented in the system.\n\n` + (entityEndpoints + '\n\n' + userIdentityEndpoints + '\n\n' + (workflowEndpoints || '')) },
    { id: 'request-params', title: '7. Request Parameters', text: `URL parameters: \`page\`, \`limit\`, \`sort\`, \`filter[${primaryEntity.toLowerCase()}_status]\`.` },
    { id: 'request-body', title: '8. Request Body', text: `JSON payload format enforced via strict validation schemas (Zod) mapping to ${entityNames.slice(0, 3).join(', ')} models.` },
    { id: 'response-structure', title: '9. Response Structure', text: `Standard envelope: \`{ success: true, data: {...}, timestamp: "..." }\` returned by ${cleanProjectName} endpoints.` },
    { id: 'status-codes', title: '10. HTTP Status Codes', text: '200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 500 Internal Error.' },
    { id: 'error-responses', title: '11. Error Responses', text: `Error payload format: \`{ success: false, error: { code: "INVALID_${cleanProjectName.toUpperCase()}_INPUT", message: "..." } }\`.` },
    { id: 'validation-rules', title: '12. Validation Rules', text: `Strict schema type validation on all request parameters and body payloads for ${entityNames.join(', ')}.` },
    { id: 'pagination', title: '13. Pagination', text: `Cursor-based or offset pagination for ${primaryEntity} record lists with default limit of 20 items.` },
    { id: 'filtering-sorting', title: '14. Filtering & Sorting', text: `Filtering via \`filter[status]\` and sorting via \`sort=-created_at\` across ${primaryEntity} tables.` },
    { id: 'rate-limiting', title: '15. Rate Limiting', text: isHighRisk ? `Strict rate limiting: Max 60 requests per minute per IP address, protecting ${primaryEntity} resources.` : `Max 100 requests per minute per IP address for ${cleanProjectName}.` },
    { id: 'versioning', title: '16. Versioning', text: 'API endpoints versioned via URL path prefix (`/v1`).' },
    { id: 'security', title: '17. Security Considerations', text: `CORS header validation, rate limiting, and sanitization for ${project.signals.riskLevel} risk profile protecting ${entityNames.slice(0, 3).join(', ')} data.` },
    { id: 'external-integrations', title: '18. External API Integrations', text: project.signals.financialInvolvement ? `Stripe REST API Webhooks integration for processing financial events in ${cleanProjectName}.` : `External API service endpoints for ${primaryEntity}.` },
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
