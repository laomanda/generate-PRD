import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR, DocumentSectionNode } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildArchitectureIR(project: ProjectModel): DocumentIR {
  const appSlug = project.projectName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const builder = new DocumentIRBuilder('ARCHITECTURE', `System Architecture`)
    .setMetadata('Target System', project.projectName)
    .setMetadata('Database Engine', project.dbEngine)
    .setMetadata('Auth Complexity', project.signals.authComplexity);

  const techNames = project.techStack.map(t => (typeof t === 'string' ? t : t.name || '')).join(' ').toLowerCase();
  
  let frontendArch = `React SPA (Single Page Application) for ${project.projectName} with client-side routing.`;
  let backendArch = `Express.js Node server providing REST API controllers for the ${project.domain.industryType} domain.`;
  let dataFlow = `Browser -> React Context -> Axios HTTP -> Express API -> Service Layer -> ${project.dbEngine}.`;
  let components = `React Client, Express API Server, ${project.dbEngine} Database Engine.`;
  let archStyle = `Decoupled Client-Server Architecture for ${project.projectName}.`;

  const primaryTablesStr = project.domain.entities.map(e => e.tableName).slice(0, 3).join(', ') || 'tables';
  const primaryRole = project.domain.userRoles[0]?.role || 'User';

  // Custom Architecture Mermaid code
  let architectureDiagram = `flowchart TD
    Client[Client Browser (${primaryRole})]
    API[${project.projectName} Express API Server]
    Controllers[${project.domain.entities[1]?.name || 'Domain'} Controllers & Services]
    DB[(Database: ${project.dbEngine})]
    
    Client -- REST Requests --> API
    API -- Dispatches to --> Controllers
    Controllers -- Queries (${primaryTablesStr}) --> DB
  `;

  if (techNames.includes('next')) {
    frontendArch = `Next.js 14+ App Router with React Server Components (RSC) and Client Components for ${project.projectName}.`;
    backendArch = `Next.js Server Actions and API Route Handlers serving ${project.projectName} features.`;
    dataFlow = 'Browser -> Server Action -> ORM / Query Builder -> Database.';
    components = `Next.js Frontend/Backend Monolith, Edge Functions, ${project.dbEngine} Database Engine.`;
    archStyle = `Server-Side Rendered (SSR) Monolith with Edge Compute for ${project.projectName}.`;
    
    architectureDiagram = `flowchart TD
      Browser[Client Browser (${primaryRole})]
      Next[Next.js App Router for ${project.projectName}]
      RSC[Server Components]
      Actions[Server Actions for ${project.domain.coreWorkflows[0] || 'Workflows'}]
      DB[(Database: ${project.dbEngine})]
      
      Browser -- Page Request --> Next
      Next -- Renders --> RSC
      Browser -- Form Submit --> Actions
      RSC -- Queries (${primaryTablesStr}) --> DB
      Actions -- Mutations --> DB
    `;
  } else if (techNames.includes('supabase')) {
    frontendArch = `Static Frontend application (React/Vue) for ${project.projectName}.`;
    backendArch = `Supabase Managed Postgres with PostgREST auto-API and Edge Functions.`;
    dataFlow = 'Browser -> Supabase JS Client -> PostgREST -> PostgreSQL.';
    components = `Static Client, Supabase API Gateway, Edge Functions, PostgreSQL DB.`;
    archStyle = `Backend-as-a-Service (BaaS) Architecture.`;
    
    architectureDiagram = `flowchart TD
      Client[Frontend Client (${primaryRole})]
      Gateway[Supabase API Gateway]
      Edge[Edge Functions for ${project.domain.coreWorkflows[0] || 'Workflows'}]
      DB[(PostgreSQL Database)]
      
      Client -- REST / Realtime --> Gateway
      Gateway -- PostgREST --> DB
      Client -- Custom Logic --> Edge
      Edge -- Queries (${primaryTablesStr}) --> DB
    `;
  } else if (techNames.includes('laravel')) {
    frontendArch = `Blade Templates with Alpine.js or Vue.js components for ${project.projectName}.`;
    backendArch = `Laravel PHP Framework using Eloquent ORM for ${project.projectName} data layer.`;
    dataFlow = 'Browser -> Laravel Router -> Controller -> Eloquent Model -> DB.';
    components = `Laravel Application Server, Queue Worker, ${project.dbEngine} Database Engine.`;
    archStyle = `Traditional MVC (Model-View-Controller) Monolith for ${project.projectName}.`;
    
    architectureDiagram = `flowchart TD
      Browser[Client Browser (${primaryRole})]
      Router[Laravel Router]
      Controller[Controllers for ${project.domain.entities[1]?.name || 'Domain'}]
      Queue[Queue Workers]
      DB[(Database: ${project.dbEngine})]
      
      Browser -- HTTP --> Router
      Router --> Controller
      Controller -- Eloquent (${primaryTablesStr}) --> DB
      Controller -- Dispatch --> Queue
      Queue -- Async Jobs --> DB
    `;
  }

  const entities = project.domain.entities;
  const entityNames = entities.map(e => e.name).filter(n => n !== 'User');
  const primaryEntity = entityNames[0] || 'Domain Entity';
  const secondaryEntity = entityNames[1] || 'Operational Record';
  const roles = project.domain.userRoles.map(r => r.role);
  const workflows = project.domain.coreWorkflows;

  const sections = [
    { id: 'overview', title: '1. Architecture Overview', text: `System architectural blueprint for **${project.projectName}** supporting ${project.domain.domainName} operations.` },
    { id: 'style', title: '2. Architecture Style', text: archStyle },
    { id: 'components', title: '3. System Components', text: components, code: architectureDiagram },
    { id: 'app-layers', title: '4. Application Layers', text: `Presentation layer, Application layer, Core domain logic layer managing ${entityNames.join(', ')}, Data access layer.` },
    { id: 'frontend-arch', title: '5. Frontend Architecture', text: frontendArch },
    { id: 'backend-arch', title: '6. Backend Architecture', text: backendArch },
    { id: 'db-arch', title: '7. Database Architecture', text: `Relational ${project.dbEngine} schema hosting core tables: ${entities.map(e => e.tableName).join(', ')} with connection pooling.` },
    { id: 'api-arch', title: '8. API Architecture', text: `API interface mapping request/response schema validation and routing for ${primaryEntity} controllers.` },
    { id: 'auth-arch', title: '9. Authentication Architecture', text: project.signals.authComplexity === 'jwt_session' ? `JWT / Session token exchange protecting ${project.projectName} user access.` : `Standard session cookie management for ${project.projectName}.` },
    { id: 'authorization-arch', title: '10. Authorization Architecture', text: `Role-based access checks (${project.signals.authComplexity}) enforcing permissions across roles: ${roles.join(', ')} for ${entityNames.slice(0, 3).join(', ')} entities.` },
    { id: 'data-flow', title: '11. Data Flow', text: dataFlow },
    { id: 'user-request-flow', title: '12. User Request Flow', text: `User Action (${roles[0] || 'User'}) -> Validation -> ${backendArch} -> ${primaryEntity} DB Query -> Client Response.` },
    { id: 'external-integrations', title: '13. External Integrations', text: project.signals.financialInvolvement ? `Stripe Financial Webhooks integration for ${project.projectName}.` : `External API integrations serving ${primaryEntity} data sources.` },
    { id: 'dependency-boundaries', title: '14. Dependency Boundaries', text: `Core ${primaryEntity} domain logic decoupled from UI rendering framework in the ${appSlug} codebase.` },
    { id: 'security-boundaries', title: '15. Security Boundaries', text: `Strict CORS policies, Rate limiting, and Input Validation enforcing protection over ${entityNames.slice(0, 3).join(', ')} records for ${project.signals.riskLevel} risk profile.` },
    { id: 'folder-structure', title: '16. Folder / Module Structure', text: `Directory layout under \`${appSlug}/\` organized by domain modules: ${entityNames.map(e => e.toLowerCase()).join(', ')}.` },
    { id: 'state-management-arch', title: '17. State Management Architecture', text: `Global Zustand store dispatching state updates for ${primaryEntity} client cache.` },
    { id: 'error-handling', title: '18. Error Handling Strategy', text: `Global Error Boundaries & structured JSON error payloads generated during ${primaryEntity} mutation failures.` },
    { id: 'logging-observability', title: '19. Logging & Observability', text: `Structured JSON application logging tracking ${workflows.join(' and ')} execution.` },
    { id: 'caching', title: '20. Caching Strategy', text: `Edge caching for static assets, memory cache for ${primaryEntity} lookup keys.` },
    { id: 'performance', title: '21. Performance Considerations', text: `Optimized query indexing on ${entities.map(e => e.tableName).slice(0, 3).join(', ')} tables for ${project.signals.expectedScalability} throughput.` },
    { id: 'scalability', title: '22. Scalability Considerations', text: `Horizontal auto-scaling for ${project.projectName} backend services under ${project.signals.expectedScalability} workloads.` },
    { id: 'reliability', title: '23. Reliability Considerations', text: `Circuit breaker pattern and automated database retry policies for ${primaryEntity} mutations.` },
    { id: 'arch-decisions', title: '24. Architectural Decisions', text: `Decoupled architecture selected to isolate ${primaryEntity} domain rules from UI presentation.` },
    { id: 'tradeoffs', title: '25. Trade-offs', text: `Decoupled architecture increases initial setup complexity but enables independent scaling of ${primaryEntity} micro-services.` },
    { id: 'arch-constraints', title: '26. Known Architectural Constraints', text: `Relational constraints and transaction latency bounds on ${primaryEntity} state transitions.` },
  ];

  sections.forEach(s => {
    const nodes: DocumentSectionNode['nodes'] = [{ type: 'paragraph', text: s.text || '> Not specified.' }];
    if (s.code) {
      nodes.push({ type: 'diagram', data: { diagramType: 'mermaid', code: s.code } });
    }
    builder.addSection({
      id: s.id,
      title: s.title,
      level: 2,
      nodes,
    });
  });

  return builder.build();
}

export function generateArchitecture(project: ProjectModel): string {
  const ir = buildArchitectureIR(project);
  return renderDocumentIRToMarkdown(ir);
}
