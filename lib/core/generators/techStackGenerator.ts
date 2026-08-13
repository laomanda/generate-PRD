import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildTechStackIR(project: ProjectModel): DocumentIR {
  const builder = new DocumentIRBuilder('TECH_STACK', `Technology Stack`)
    .setMetadata('Target System', project.projectName)
    .setMetadata('Database Engine', project.dbEngine)
    .setMetadata('Scalability Tier', project.signals.expectedScalability);

  const cleanProjectName = project.projectName.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const techNames = project.techStack.map(t => (typeof t === 'string' ? t : t.name || '')).join(' ').toLowerCase();
  const isNextJs = techNames.includes('next');
  const isSupabase = techNames.includes('supabase');
  const isLaravel = techNames.includes('laravel');
  const isVue = techNames.includes('vue');
  const isTailwind = techNames.includes('tailwind');

  const entities = project.domain.entities;
  const entityNames = entities.map(e => e.name).filter(n => n !== 'User');
  const primaryEntity = entityNames[0] || 'Domain Entity';
  const secondaryEntity = entityNames[1] || 'Operational Record';

  const runtimeText = `Node.js >= 20.0.0 LTS / Serverless Edge Runtime environment for processing ${project.projectName} ${primaryEntity} workflows.`;
  const databaseText = `${project.dbEngine} Relational Database instance executing query operations across tables: ${entities.map(e => e.tableName).join(', ')}.`;
  const packagesText = `Zod schemas for ${primaryEntity} payloads, JSZip utilities, and ${project.projectName} dependencies.`;

  const coreFramework = isNextJs ? `Next.js 14+ App Router with React Server Components for ${project.projectName}.` :
                        isLaravel ? `Laravel PHP Framework powering ${project.projectName}.` :
                        isVue ? `Vue.js 3 with Composition API for ${project.projectName}.` : `React SPA (Single Page Application) for ${project.projectName}.`;

  const backendTech = isNextJs ? `Next.js Server Actions and Route Handlers for ${primaryEntity} mutations.` :
                      isSupabase ? `Supabase Edge Functions and PostgREST API serving ${cleanProjectName}.` :
                      isLaravel ? `Laravel Controllers managing ${secondaryEntity} records.` : `Node.js Express Server handling ${primaryEntity} API controllers.`;

  const uiStyling = isTailwind ? `Tailwind CSS utility framework styling ${primaryEntity} interface components.` : `CSS Modules scoping visual components for ${project.projectName}.`;
  const animationTech = `Framer Motion transition effects applied to ${secondaryEntity} UI drawers and screens.`;

  const deployment = isNextJs ? `Vercel / Cloudflare Edge infrastructure hosting ${project.projectName}.` :
                     isSupabase ? `Supabase Managed Cloud / Vercel Edge hosting ${project.projectName}.` :
                     `AWS ECS Docker Containers hosting ${cleanProjectName}.`;

  const stateMgmt = isVue ? 'Pinia State Store.' : `Zustand store managing client-side ${primaryEntity} UI cache.`;

  const sections = [
    { id: 'overview', title: '1. Technology Stack Overview', text: `Core technology stack for **${project.projectName}** tailored for ${project.domain.domainName} operations.` },
    { id: 'runtime', title: '2. Runtime Environment', text: runtimeText },
    { id: 'core-framework', title: '3. Core Framework', text: coreFramework },
    { id: 'frontend-tech', title: '4. Frontend Technologies', text: isVue ? 'Vue 3, TypeScript.' : 'React, TypeScript.' },
    { id: 'backend-tech', title: '5. Backend Technologies', text: backendTech },
    { id: 'database-tech', title: '6. Database Technologies', text: databaseText },
    { id: 'libraries-packages', title: '7. Libraries & Packages', text: packagesText },
    { id: 'ui-styling', title: '8. UI / Styling Technologies', text: uiStyling },
    { id: 'animation-tech', title: '9. Animation Technologies', text: animationTech },
    { id: 'state-management', title: '10. State Management', text: stateMgmt },
    { id: 'data-fetching', title: '11. Data Fetching', text: isNextJs ? `React Server Components fetch for ${primaryEntity} queries.` : `TanStack React Query for ${primaryEntity} API requests.` },
    { id: 'forms-validation', title: '12. Forms & Validation', text: `Zod schema validation enforcing contract integrity for ${entityNames.slice(0, 3).join(', ')} fields.` },
    { id: 'auth-tech', title: '13. Authentication', text: isSupabase ? 'Supabase Auth.' : (isLaravel ? 'Laravel Sanctum.' : `Session / JWT Authentication for ${project.projectName}.`) },
    { id: 'authorization-tech', title: '14. Authorization', text: `Role Permission RBAC engine protecting ${entities.map(e => e.name).join(', ')} endpoints.` },
    { id: 'api-tech', title: '15. API Technologies', text: isSupabase ? 'PostgREST OpenAPI schema endpoints.' : `REST / JSON OpenAPI 3.0 endpoints for ${primaryEntity} controllers.` },
    { id: 'external-integrations', title: '16. External Integrations', text: project.signals.financialInvolvement ? `Stripe Webhooks for ${project.projectName} transactions.` : `Domain-specific external service endpoints for ${primaryEntity}.` },
    { id: 'file-storage', title: '17. File Storage', text: isSupabase ? 'Supabase Storage Buckets.' : `AWS S3 Storage storing ${primaryEntity} digital assets.` },
    { id: 'dev-tools', title: '18. Development Tools', text: isLaravel ? 'PHP CS Fixer, Vite.' : `TypeScript, ESLint, Prettier, Vite for ${cleanProjectName}.` },
    { id: 'testing-stack', title: '19. Testing Stack', text: isLaravel ? 'Pest / PHPUnit & Dusk E2E.' : `Vitest unit suite & Playwright E2E asserting ${primaryEntity} workflows.` },
    { id: 'code-quality', title: '20. Code Quality & Standards', text: isLaravel ? 'PSR-12 PHP coding standards.' : `Strict TypeScript rules enforcing type correctness on ${primaryEntity} models.` },
    { id: 'env-config', title: '21. Environment Configuration', text: 'Environment variables managed via `.env` files.' },
    { id: 'version-compatibility', title: '22. Version Compatibility', text: 'All third-party libraries pinned to compatible semver ranges.' },
    { id: 'deployment-infra', title: '23. Deployment & Infrastructure', text: deployment },
    { id: 'tech-decisions', title: '24. Technology Decisions', text: `Selected ${coreFramework} for ${project.signals.expectedScalability} performance.` },
    { id: 'tech-rationale', title: '25. Technology Rationale', text: 'Architecture selected for rapid iteration and high type safety.' },
    { id: 'known-limitations', title: '26. Known Limitations', text: 'Cold start latency for serverless functions, and local file storage limitations.' },
    { id: 'change-log', title: '27. Tech Stack Change Log', text: 'Initial tech stack specification defined.' },
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

export function generateTechStack(project: ProjectModel): string {
  const ir = buildTechStackIR(project);
  return renderDocumentIRToMarkdown(ir);
}
