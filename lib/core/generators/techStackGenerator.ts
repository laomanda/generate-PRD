import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildTechStackIR(project: ProjectModel): DocumentIR {
  const builder = new DocumentIRBuilder('TECH_STACK', `Technology Stack`)
    .setMetadata('Target Product', project.projectName)
    .setMetadata('Database Engine', project.dbEngine)
    .setMetadata('Scalability Tier', project.signals.expectedScalability);

  const techNames = project.techStack.map(t => (typeof t === 'string' ? t : t.name || '')).join(' ').toLowerCase();
  
  const isNextJs = techNames.includes('next');
  const isSupabase = techNames.includes('supabase');
  const isLaravel = techNames.includes('laravel');
  const isVue = techNames.includes('vue');
  const isTailwind = techNames.includes('tailwind');

  const coreFramework = isNextJs ? 'Next.js 14+ App Router with React Server Components (RSC).' :
                        isLaravel ? 'Laravel PHP Framework.' :
                        isVue ? 'Vue.js 3 with Composition API.' : 'React SPA (Single Page Application).';

  const backendTech = isNextJs ? 'Next.js Server Actions and Route Handlers.' :
                      isSupabase ? 'Supabase Edge Functions and PostgREST API.' :
                      isLaravel ? 'Laravel Controllers (PHP 8.2+).' : 'Node.js Express Server.';

  const uiStyling = isTailwind ? 'Tailwind CSS utility-first framework.' : 'CSS Modules / Styled Components.';

  const deployment = isNextJs ? 'Vercel / Cloudflare Edge infrastructure.' :
                     isSupabase ? 'Supabase Managed Cloud / Vercel Edge.' :
                     'AWS ECS Docker Containers / AWS EC2.';

  const sections = [
    { id: 'overview', title: '1. Technology Stack Overview', text: `Core technology stack for **${project.projectName}** supporting ${project.domain.domainName}.` },
    { id: 'runtime', title: '2. Runtime Environment', text: isLaravel ? 'PHP 8.2+ / FPM.' : 'Node.js >= 20.0.0 LTS / Serverless Edge Runtime.' },
    { id: 'core-framework', title: '3. Core Framework', text: coreFramework },
    { id: 'frontend-tech', title: '4. Frontend Technologies', text: isVue ? 'Vue 3, TypeScript.' : 'React, TypeScript.' },
    { id: 'backend-tech', title: '5. Backend Technologies', text: backendTech },
    { id: 'database-tech', title: '6. Database Technologies', text: `${project.dbEngine} Relational Database Cluster.` },
    { id: 'libraries-packages', title: '7. Libraries & Packages', text: 'Zod validation, JSZip exporter.' },
    { id: 'ui-styling', title: '8. UI / Styling Technologies', text: uiStyling },
    { id: 'animation-tech', title: '9. Animation Technologies', text: isTailwind ? 'Tailwind CSS keyframe animations.' : 'Framer Motion / CSS Transitions.' },
    { id: 'state-management', title: '10. State Management', text: isVue ? 'Pinia State Store.' : 'Zustand lightweight client state store.' },
    { id: 'data-fetching', title: '11. Data Fetching', text: isNextJs ? 'React Server Components fetch / SWR.' : 'TanStack React Query / Axios API fetch.' },
    { id: 'forms-validation', title: '12. Forms & Validation', text: 'Zod schema validation applied to API payloads.' },
    { id: 'auth-tech', title: '13. Authentication', text: isSupabase ? 'Supabase Auth.' : (isLaravel ? 'Laravel Sanctum.' : 'Session / JWT Auth.') },
    { id: 'authorization-tech', title: '14. Authorization', text: `${project.signals.authComplexity.toUpperCase()} role permission engine.` },
    { id: 'api-tech', title: '15. API Technologies', text: isSupabase ? 'PostgREST OpenAPI schema endpoints.' : 'REST / JSON OpenAPI 3.0 API endpoints.' },
    { id: 'external-integrations', title: '16. External Integrations', text: project.signals.financialInvolvement ? 'Stripe Payment Gateway Webhooks.' : '> Not detected.' },
    { id: 'file-storage', title: '17. File Storage', text: isSupabase ? 'Supabase Storage Buckets.' : 'AWS S3 Cloud Storage.' },
    { id: 'dev-tools', title: '18. Development Tools', text: isLaravel ? 'PHP CS Fixer, Vite.' : 'TypeScript, ESLint, Prettier, Vite.' },
    { id: 'testing-stack', title: '19. Testing Stack', text: isLaravel ? 'Pest / PHPUnit & Dusk E2E.' : 'Vitest unit testing & Playwright E2E.' },
    { id: 'code-quality', title: '20. Code Quality & Standards', text: isLaravel ? 'PSR-12 PHP coding standards.' : 'Strict TypeScript (`noImplicitAny: true`) & ESLint rules.' },
    { id: 'env-config', title: '21. Environment Configuration', text: 'Environment variables managed via `.env` files.' },
    { id: 'deployment-infra', title: '22. Deployment & Infrastructure', text: deployment },
    { id: 'tech-decisions', title: '23. Technology Decisions', text: `Selected ${coreFramework} for ${project.signals.expectedScalability} performance.` },
    { id: 'tech-rationale', title: '24. Technology Rationale', text: 'Architecture selected for rapid iteration and high type safety.' },
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
