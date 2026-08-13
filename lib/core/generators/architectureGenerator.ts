import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildArchitectureIR(project: ProjectModel): DocumentIR {
  const appSlug = project.projectName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const builder = new DocumentIRBuilder('ARCHITECTURE', `System Architecture`)
    .setMetadata('Target Product', project.projectName)
    .setMetadata('Database Engine', project.dbEngine)
    .setMetadata('Auth Complexity', project.signals.authComplexity);

  const techNames = project.techStack.map(t => (typeof t === 'string' ? t : t.name || '')).join(' ').toLowerCase();
  
  let frontendArch = 'React SPA (Single Page Application) with client-side routing.';
  let backendArch = 'Express.js Node server providing REST API controllers.';
  let dataFlow = 'Browser -> React Context -> Axios HTTP -> Express API -> Service Layer -> DB.';
  let components = 'React Client, Express API Server, Database Engine.';
  let archStyle = 'Decoupled Client-Server Architecture.';
  
  // Custom Architecture Mermaid code
  let architectureDiagram = `flowchart TD
    Client[Browser Client]
    API[REST API Server]
    DB[(Database: ${project.dbEngine})]
    
    Client -- HTTP Requests --> API
    API -- SQL Queries --> DB
  `;

  if (techNames.includes('next')) {
    frontendArch = 'Next.js App Router with React Server Components (RSC) and Client Components.';
    backendArch = 'Next.js Server Actions and API Route Handlers deployed on edge/serverless compute.';
    dataFlow = 'Browser -> Server Action -> ORM / Query Builder -> Database.';
    components = 'Next.js Frontend/Backend Monolith, Edge Functions, Database Engine.';
    archStyle = 'Server-Side Rendered (SSR) Monolith with Edge Compute.';
    
    architectureDiagram = `flowchart TD
      Browser[Client Browser]
      Next[Next.js App Router]
      RSC[Server Components]
      Actions[Server Actions]
      DB[(Database: ${project.dbEngine})]
      
      Browser -- Page Request --> Next
      Next -- Renders --> RSC
      Browser -- Form Submit --> Actions
      RSC -- Queries --> DB
      Actions -- Mutations --> DB
    `;
  } else if (techNames.includes('supabase')) {
    frontendArch = 'Static Frontend application (React/Vue).';
    backendArch = 'Supabase Managed Postgres with PostgREST auto-API and Edge Functions.';
    dataFlow = 'Browser -> Supabase JS Client -> PostgREST -> PostgreSQL.';
    components = 'Static Client, Supabase API Gateway, Edge Functions, PostgreSQL DB.';
    archStyle = 'Backend-as-a-Service (BaaS) Architecture.';
    
    architectureDiagram = `flowchart TD
      Client[Frontend Client]
      Gateway[Supabase API Gateway]
      Edge[Edge Functions]
      DB[(PostgreSQL)]
      
      Client -- REST / Realtime --> Gateway
      Gateway -- PostgREST --> DB
      Client -- Custom Logic --> Edge
      Edge -- Queries --> DB
    `;
  } else if (techNames.includes('laravel')) {
    frontendArch = 'Blade Templates with Alpine.js or Vue.js components.';
    backendArch = 'Laravel PHP Framework using Eloquent ORM.';
    dataFlow = 'Browser -> Laravel Router -> Controller -> Eloquent Model -> DB.';
    components = 'Laravel Application Server, Queue Worker, Database Engine.';
    archStyle = 'Traditional MVC (Model-View-Controller) Monolith.';
    
    architectureDiagram = `flowchart TD
      Browser[Client Browser]
      Router[Laravel Router]
      Controller[Controllers]
      Queue[Queue Workers]
      DB[(Database: ${project.dbEngine})]
      
      Browser -- HTTP --> Router
      Router --> Controller
      Controller -- Eloquent --> DB
      Controller -- Dispatch --> Queue
      Queue -- Async Jobs --> DB
    `;
  }

  const sections = [
    { id: 'overview', title: '1. Architecture Overview', text: `System architectural blueprint for **${project.projectName}** supporting ${project.domain.domainName} operations.` },
    { id: 'style', title: '2. Architecture Style', text: archStyle },
    { id: 'components', title: '3. System Components', text: components },
    { id: 'diagram', title: '4. Component Architecture Diagram', code: architectureDiagram },
    { id: 'frontend-arch', title: '5. Frontend Architecture', text: frontendArch },
    { id: 'backend-arch', title: '6. Backend Architecture', text: backendArch },
    { id: 'db-arch', title: '7. Database Architecture', text: `Relational ${project.dbEngine} schema with connection pooling.` },
    { id: 'data-flow', title: '8. Data Flow', text: dataFlow },
    { id: 'user-request-flow', title: '9. User Request Flow', text: `User Action -> Validation -> ${backendArch} -> DB Query -> Response.` },
    { id: 'auth-arch', title: '10. Authentication Architecture', text: project.signals.authComplexity === 'jwt_session' ? 'JWT / Session token exchange.' : 'Standard session cookie management.' },
    { id: 'authorization-arch', title: '11. Authorization Architecture', text: `Role-based access checks (${project.signals.authComplexity}) mapping to: ${project.domain.userRoles.map(r => r.role).join(', ')}.` },
    { id: 'external-integrations', title: '12. External Integrations', text: project.signals.financialInvolvement ? 'Stripe Financial Webhooks integration.' : '> Not detected.' },
    { id: 'dependency-boundaries', title: '13. Dependency Boundaries', text: 'Core domain logic decoupled from UI rendering framework.' },
    { id: 'security-boundaries', title: '14. Security Boundaries', text: `Strict CORS policies, Rate limiting, and Input Validation suitable for ${project.signals.riskLevel} risk level.` },
    { id: 'folder-structure', title: '15. Folder / Module Structure', text: `Directory layout under \`${appSlug}/\`.` },
    { id: 'error-handling', title: '16. Error Handling Strategy', text: 'Global Error Boundaries & structured JSON error payloads.' },
    { id: 'logging-observability', title: '17. Logging & Observability', text: 'Structured JSON application logging.' },
    { id: 'performance', title: '18. Performance Considerations', text: `Optimized for ${project.signals.expectedScalability} throughput scenarios.` },
    { id: 'scalability', title: '19. Scalability Considerations', text: `Targeting ${project.signals.expectedScalability} scaling paradigms.` },
    { id: 'reliability', title: '20. Reliability Considerations', text: 'Circuit breaker pattern for third-party HTTP dependencies.' },
  ];

  sections.forEach(s => {
    builder.addSection({
      id: s.id,
      title: s.title,
      level: 2,
      nodes: s.code
        ? [{ type: 'diagram', data: { diagramType: 'mermaid', code: s.code } }]
        : [{ type: 'paragraph', text: s.text || '> Not specified.' }],
    });
  });

  return builder.build();
}

export function generateArchitecture(project: ProjectModel): string {
  const ir = buildArchitectureIR(project);
  return renderDocumentIRToMarkdown(ir);
}
