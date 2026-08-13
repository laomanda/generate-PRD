import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildTechStackIR(project: ProjectModel): DocumentIR {
  const builder = new DocumentIRBuilder('TECH_STACK', `Technology Stack`)
    .setMetadata('Target Product', project.projectName)
    .setMetadata('Database Engine', project.dbEngine)
    .setMetadata('Scalability Tier', project.signals.expectedScalability);

  const sections = [
    { id: 'overview', title: '1. Technology Stack Overview', text: `Core technology stack for **${project.projectName}**.` },
    { id: 'runtime', title: '2. Runtime Environment', text: 'Node.js >= 20.0.0 LTS / Serverless Edge Runtime.' },
    { id: 'core-framework', title: '3. Core Framework', text: 'Next.js 14+ App Router with React 19.' },
    { id: 'frontend-tech', title: '4. Frontend Technologies', text: 'React, TypeScript, Tailwind CSS.' },
    { id: 'backend-tech', title: '5. Backend Technologies', text: 'Next.js Serverless Route Handlers.' },
    { id: 'database-tech', title: '6. Database Technologies', text: `${project.dbEngine} Relational Database Cluster.` },
    { id: 'libraries-packages', title: '7. Libraries & Packages', text: 'Zod validation, Lucide-React icons, JSZip exporter.' },
    { id: 'ui-styling', title: '8. UI / Styling Technologies', text: 'Tailwind CSS utility-first framework.' },
    { id: 'animation-tech', title: '9. Animation Technologies', text: 'Tailwind CSS keyframe animations & Framer Motion.' },
    { id: 'state-management', title: '10. State Management', text: 'Zustand lightweight client state store.' },
    { id: 'data-fetching', title: '11. Data Fetching', text: 'TanStack React Query / Native fetch API.' },
    { id: 'forms-validation', title: '12. Forms & Validation', text: 'React Hook Form with Zod schema validation.' },
    { id: 'auth-tech', title: '13. Authentication', text: 'NextAuth.js / Supabase Auth JWT sessions.' },
    { id: 'authorization-tech', title: '14. Authorization', text: `${project.signals.authComplexity.toUpperCase()} role permission engine.` },
    { id: 'api-tech', title: '15. API Technologies', text: 'REST / JSON OpenAPI 3.0 API endpoints.' },
    { id: 'external-integrations', title: '16. External Integrations', text: project.signals.financialInvolvement ? 'Stripe Payment Gateway' : '> Not detected.' },
    { id: 'file-storage', title: '17. File Storage', text: 'AWS S3 / Supabase Storage Buckets.' },
    { id: 'dev-tools', title: '18. Development Tools', text: 'TypeScript, ESLint, Prettier, Vite.' },
    { id: 'testing-stack', title: '19. Testing Stack', text: 'Vitest unit testing & Playwright E2E.' },
    { id: 'code-quality', title: '20. Code Quality & Standards', text: 'Strict TypeScript (`noImplicitAny: true`) & ESLint rules.' },
    { id: 'env-config', title: '21. Environment Configuration', text: 'Environment variables managed via `.env.local`.' },
    { id: 'version-compatibility', title: '22. Version Compatibility', text: 'Node.js 20+ compatible dependencies.' },
    { id: 'deployment-infra', title: '23. Deployment & Infrastructure', text: 'Vercel / Cloudflare Edge infrastructure.' },
    { id: 'tech-decisions', title: '24. Technology Decisions', text: 'TypeScript chosen for zero-runtime type safety.' },
    { id: 'tech-rationale', title: '25. Technology Rationale', text: 'Serverless architecture selected for instant scaling.' },
    { id: 'known-limitations', title: '26. Known Limitations', text: 'Edge runtime limitations on long-lived TCP connections.' },
    { id: 'change-log', title: '27. Tech Stack Change Log', text: 'Initial tech stack specification release.' },
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
