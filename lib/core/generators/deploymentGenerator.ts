import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR, DocumentSectionNode } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildDeploymentIR(project: ProjectModel): DocumentIR {
  const techNames = project.techStack.map(t => (typeof t === 'string' ? t : t.name || '')).join(' ').toLowerCase();
  const isNextJs = techNames.includes('next');
  const isSupabase = techNames.includes('supabase');
  const isLaravel = techNames.includes('laravel');
  const isDocker = techNames.includes('docker') || project.signals.expectedScalability === 'distributed_cluster';

  const frontendDeployTarget = isNextJs ? 'Vercel Edge Network / Serverless Node.js' : 'Static CDN Distribution (Cloudflare Pages / AWS S3 + CloudFront)';
  let backendDeployTarget = isDocker ? 'Docker Containerized Express Service (AWS ECS / Render)' : 'Platform-as-a-Service (Heroku/Render)';
  
  if (isSupabase) backendDeployTarget = 'Supabase Managed Edge Functions & API Gateway';
  else if (isNextJs) backendDeployTarget = 'Next.js App Router Serverless Functions';
  else if (isLaravel) backendDeployTarget = 'Laravel Forge / AWS EC2 with PHP-FPM';

  const builder = new DocumentIRBuilder('DEPLOYMENT', `Deployment Architecture & Operations`)
    .setMetadata('Target System', project.projectName)
    .setMetadata('Frontend Runtime Target', frontendDeployTarget)
    .setMetadata('Backend Runtime Target', backendDeployTarget)
    .setMetadata('Database Target', `${project.dbEngine} Instance`);

  let deploymentDiagram = `flowchart TD
    User[User Traffic]
    CDN[Global CDN / Load Balancer]
    App[Application Server (Node/PHP)]
    DB[(Database: ${project.dbEngine})]

    User --> CDN
    CDN --> App
    App --> DB
  `;

  if (isNextJs) {
    deploymentDiagram = `flowchart TD
      User[User Traffic]
      CDN[Vercel Edge Network]
      Static[Static Assets]
      Edge[Edge Functions]
      Serverless[Serverless API Routes]
      DB[(Database: ${project.dbEngine})]

      User --> CDN
      CDN --> Static
      CDN --> Edge
      CDN --> Serverless
      Edge --> DB
      Serverless --> DB
    `;
  } else if (isSupabase) {
    deploymentDiagram = `flowchart TD
      User[User Traffic]
      CDN[Cloudflare Pages / Vercel]
      Gateway[Supabase API Gateway]
      Auth[Supabase Auth]
      Edge[Deno Edge Functions]
      DB[(PostgreSQL)]

      User --> CDN
      User --> Gateway
      Gateway --> Auth
      Gateway --> Edge
      Gateway --> DB
      Edge --> DB
    `;
  } else if (isDocker) {
    deploymentDiagram = `flowchart TD
      User[User Traffic]
      ALB[AWS ALB / Load Balancer]
      subgraph ECS Cluster
        Node1[Docker Container 1]
        Node2[Docker Container 2]
        NodeN[Docker Container N]
      end
      DB[(Database: ${project.dbEngine} Primary)]
      Replica[(Database Replica)]

      User --> ALB
      ALB --> Node1
      ALB --> Node2
      ALB --> NodeN
      Node1 --> DB
      Node2 --> DB
      NodeN --> DB
      DB -. Replication .-> Replica
    `;
  }

  const sections = [
    { id: 'overview', title: '1. Deployment Overview', text: `Deployment strategy for **${project.projectName}** supporting ${project.domain.domainName} operations.`, code: deploymentDiagram },
    { id: 'environments', title: '2. Environments', text: `Development, Staging (isolated preview branch environments for ${project.domain.domainName}), and Production tiers.` },
    { id: 'build-process', title: '3. Build Process', text: isNextJs ? '`next build` compiling static pages, Server Components, and Serverless API routes.' : '`vite build` compiling static single-page client bundles with TypeScript type verification.' },
    { id: 'env-vars', title: '4. Environment Variables', text: `Environment keys for ${project.domain.domainName} scraped and injected securely via deployment environment secret vault storage.` },
    { id: 'frontend-deployment', title: '5. Frontend Deployment', text: `Deployed to ${frontendDeployTarget} with automated cache invalidation.` },
    { id: 'backend-deployment', title: '6. Backend Deployment', text: `Executed on ${backendDeployTarget}.` },
    { id: 'db-deployment', title: '7. Database Deployment', text: isSupabase ? 'Managed Supabase PostgreSQL database cluster with automated failover.' : `Managed **${project.dbEngine}** cloud instance (AWS RDS / GCP Cloud SQL) with connection pooling.` },
    { id: 'storage', title: '8. Storage', text: `Cloud object storage buckets (AWS S3 / Cloudflare R2) hosting dynamic uploads for the ${project.projectName} platform.` },
    { id: 'domain-dns', title: '9. Domain & DNS', text: `Cloudflare DNS routing with Anycast CDN DDoS shielding for ${project.projectName} endpoints.` },
    { id: 'ssl-tls', title: '10. SSL / TLS', text: 'Automated TLS 1.3 SSL certificate generation and HTTPS enforcement.' },
    { id: 'cicd', title: '11. CI/CD', text: `GitHub Actions workflow triggering unit tests, UI component tests, and deploying to ${isNextJs ? 'Vercel' : 'Platform-as-a-Service'} upon merge.` },
    { id: 'migration-deployment', title: '12. Database Migration Deployment', text: 'Database migration scripts executed as pre-release step prior to traffic switching.' },
    { id: 'monitoring', title: '13. Monitoring', text: `Application performance monitoring (APM) and error logging via Sentry for ${project.domain.industryType}.` },
    { id: 'logging', title: '14. Logging', text: 'Centralized log aggregation with 30-day retention policies.' },
    { id: 'backup', title: '15. Backup', text: 'Automated daily database backups with point-in-time recovery (PITR).' },
    { id: 'rollback', title: '16. Rollback Strategy', text: 'Instant single-click release deployment rollback to previous immutable release tag.' },
    { id: 'scaling', title: '17. Scaling', text: isDocker ? 'Horizontal Docker container auto-scaling based on incoming CPU & memory load.' : `Infrastructure scaling tuned for ${project.signals.expectedScalability} throughput.` },
    { id: 'deployment-security', title: '18. Deployment Security', text: 'Network security groups, strict CORS headers, and encrypted secrets storage.' },
    { id: 'infra-dependencies', title: '19. Infrastructure Dependencies', text: `${project.dbEngine} Database, CDN Edge Network, Secret Vault, APM Service.` },
    { id: 'checklist', title: '20. Deployment Checklist', text: 'Pre-flight verification: Typecheck, Unit Tests, Migration verification, Environment Variable validation.' },
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

export function generateDeployment(project: ProjectModel): string {
  const ir = buildDeploymentIR(project);
  return renderDocumentIRToMarkdown(ir);
}
