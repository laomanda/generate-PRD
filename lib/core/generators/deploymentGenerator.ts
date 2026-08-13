import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildDeploymentIR(project: ProjectModel): DocumentIR {
  const builder = new DocumentIRBuilder('DEPLOYMENT', `Deployment Documentation`)
    .setMetadata('Target Product', project.projectName)
    .setMetadata('Scalability Target', project.signals.expectedScalability);

  const sections = [
    { id: 'overview', title: '1. Deployment Overview', text: `Infrastructure deployment specification for **${project.projectName}**.` },
    { id: 'environments', title: '2. Environments', text: 'Development, Staging, and Production deployment tiers.' },
    { id: 'build-process', title: '3. Build Process', text: '`npm run build` compiles Next.js static and serverless edge functions.' },
    { id: 'env-vars', title: '4. Environment Variables', text: 'Managed securely via deployment platform secrets storage.' },
    { id: 'frontend-deployment', title: '5. Frontend Deployment', text: 'Global CDN distribution via Vercel Edge Network.' },
    { id: 'backend-deployment', title: '6. Backend Deployment', text: 'Serverless Node.js / Edge Function execution.' },
    { id: 'db-deployment', title: '7. Database Deployment', text: `Managed ${project.dbEngine} database instance.` },
    { id: 'storage', title: '8. Storage', text: 'Cloud object storage buckets for static media and assets.' },
    { id: 'domain-dns', title: '9. Domain & DNS', text: 'Cloudflare DNS routing with automated Anycast CDN routing.' },
    { id: 'ssl-tls', title: '10. SSL / TLS', text: 'Automated Let’s Encrypt TLS 1.3 SSL certificate generation.' },
    { id: 'cicd', title: '11. CI/CD', text: 'Automated GitHub Actions CI/CD deployment pipeline.' },
    { id: 'migration-deployment', title: '12. Database Migration Deployment', text: 'Migrations executed as pre-deploy release steps.' },
    { id: 'monitoring', title: '13. Monitoring', text: 'Application performance monitoring (APM) & error tracking.' },
    { id: 'logging', title: '14. Logging', text: 'Centralized log aggregation with 30-day retention.' },
    { id: 'backup', title: '15. Backup', text: 'Daily automated WAL archive snapshots with point-in-time recovery.' },
    { id: 'rollback', title: '16. Rollback Strategy', text: 'Instant single-click atomic release deployment rollback.' },
    { id: 'scaling', title: '17. Scaling', text: 'Horizontal auto-scaling based on incoming traffic load.' },
    { id: 'deployment-security', title: '18. Deployment Security', text: 'Strict environment variable scoping and network firewall rules.' },
    { id: 'infra-dependencies', title: '19. Infrastructure Dependencies', text: `${project.dbEngine} Cluster, Edge CDN, DNS Provider.` },
    { id: 'checklist', title: '20. Deployment Checklist', text: 'Pre-flight checks: Linting, Typecheck, Unit Tests, Migration verification.' },
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

export function generateDeployment(project: ProjectModel): string {
  const ir = buildDeploymentIR(project);
  return renderDocumentIRToMarkdown(ir);
}
