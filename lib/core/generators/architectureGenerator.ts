import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildArchitectureIR(project: ProjectModel): DocumentIR {
  const appSlug = project.projectName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const builder = new DocumentIRBuilder('ARCHITECTURE', `System Architecture`)
    .setMetadata('Target Product', project.projectName)
    .setMetadata('Database Engine', project.dbEngine)
    .setMetadata('Auth Complexity', project.signals.authComplexity);

  const sections = [
    { id: 'overview', title: '1. Architecture Overview', text: `System architectural blueprint for **${project.projectName}**.` },
    { id: 'style', title: '2. Architecture Style', text: 'Client-First Feature-Oriented Modular Architecture.' },
    { id: 'components', title: '3. System Components', text: 'Browser Client UI, Zustand State Store, Route Handlers, Database Cluster.' },
    { id: 'app-layers', title: '4. Application Layers', text: 'Presentation Layer, Business Logic Engine Layer, Data Access Layer.' },
    { id: 'frontend-arch', title: '5. Frontend Architecture', text: 'React Server Components + Zustand state hydration.' },
    { id: 'backend-arch', title: '6. Backend Architecture', text: 'Serverless Next.js API Route Handlers.' },
    { id: 'db-arch', title: '7. Database Architecture', text: `Relational ${project.dbEngine} schema with connection pooling.` },
    { id: 'api-arch', title: '8. API Architecture', text: 'REST API with Zod payload contract verification.' },
    { id: 'auth-arch', title: '9. Authentication Architecture', text: 'JWT / Session token exchange.' },
    { id: 'authorization-arch', title: '10. Authorization Architecture', text: `Role-based access checks (${project.signals.authComplexity}).` },
    { id: 'data-flow', title: '11. Data Flow', text: 'Unidirectional data flow: UI -> Action -> Store -> API -> Database.' },
    { id: 'user-request-flow', title: '12. User Request Flow', text: 'User Action -> Client State Mutation -> API Call -> DB Query -> Response.' },
    { id: 'external-integrations', title: '13. External Integrations', text: project.signals.financialInvolvement ? 'Stripe Financial Webhooks' : '> Not detected.' },
    { id: 'dependency-boundaries', title: '14. Dependency Boundaries', text: 'Core domain logic decoupled from UI rendering framework.' },
    { id: 'security-boundaries', title: '15. Security Boundaries', text: 'Strict CORS policies, Rate limiting, and Input Validation.' },
    { id: 'folder-structure', title: '16. Folder / Module Structure', text: `Directory layout under \`${appSlug}/\`.` },
    { id: 'state-management-arch', title: '17. State Management Architecture', text: 'Zustand atomic slices with local persistence.' },
    { id: 'error-handling', title: '18. Error Handling Strategy', text: 'Global React Error Boundaries & structured JSON error payloads.' },
    { id: 'logging-observability', title: '19. Logging & Observability', text: 'Structured JSON application logging.' },
    { id: 'caching', title: '20. Caching Strategy', text: 'HTTP Cache-Control headers & React SWR / Query stale-while-revalidate.' },
    { id: 'performance', title: '21. Performance Considerations', text: 'Optimistic UI updates with sub-16ms client responsiveness.' },
    { id: 'scalability', title: '22. Scalability Considerations', text: 'Horizontal auto-scaling via serverless edge nodes.' },
    { id: 'reliability', title: '23. Reliability Considerations', text: 'Circuit breaker pattern for third-party HTTP dependencies.' },
    { id: 'arch-decisions', title: '24. Architectural Decisions', text: 'Client-first engine execution chosen for zero latency.' },
    { id: 'tradeoffs', title: '25. Trade-offs', text: 'Initial bundle size trade-off for instant offline evaluation.' },
    { id: 'arch-constraints', title: '26. Known Architectural Constraints', text: 'Stateless serverless function execution timeout boundaries.' },
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

export function generateArchitecture(project: ProjectModel): string {
  const ir = buildArchitectureIR(project);
  return renderDocumentIRToMarkdown(ir);
}
