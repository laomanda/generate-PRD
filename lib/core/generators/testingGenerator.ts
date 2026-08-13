import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildTestingIR(project: ProjectModel): DocumentIR {
  const techNames = project.techStack.map(t => (typeof t === 'string' ? t : t.name || '')).join(' ').toLowerCase();
  const isNextJs = techNames.includes('next');
  const isReact = techNames.includes('react');
  const isSupabase = techNames.includes('supabase');
  const isHighRisk = project.signals.riskLevel === 'high' || project.signals.dataSensitivityScore >= 7;

  const testFramework = isNextJs ? 'Vitest + Playwright + React Server Component Mocks' : 'Vitest + React Testing Library + Supertest';
  
  const builder = new DocumentIRBuilder('TESTING', `Testing Strategy & Quality Assurance`)
    .setMetadata('Target System', project.projectName)
    .setMetadata('Test Runner Framework', testFramework)
    .setMetadata('Risk Profile Level', project.signals.riskLevel.toUpperCase())
    .setMetadata('Sensitivity Score', `${project.signals.dataSensitivityScore}/10`);

  const entities = project.domain.entities;
  const workflows = project.domain.coreWorkflows;
  
  const entityNames = entities.map(e => e.name).join(', ');
  const workflowNames = workflows.join(', ');

  const cleanProjectName = project.projectName.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const unitPct = (project.projectName.length % 3) * 5 + 60; // 60%, 65%, 70%
  const integrationPct = 90 - unitPct; // 30%, 25%, 20%
  const e2ePct = 10;

  const strategyText = isHighRisk 
    ? `Testing pyramid allocation for ${project.projectName}: Unit Tests (${unitPct - 10}%), Integration & API Tests (${integrationPct + 5}%), Security Tests (15%), End-to-End User Workflows (10%).` 
    : `Testing pyramid allocation for ${project.projectName}: Unit Tests (${unitPct}%), Integration & API Tests (${integrationPct}%), End-to-End User Workflows (${e2ePct}%). Target SLA: sub-second unit execution.`;

  const authTestingText = `Automated test suite verifying credential login, session expiration, token refresh, and invalid login handling for the ${project.domain.userRoles.map(u => u.role).join(', ')} roles in ${project.projectName}.`;

  const validationTestingText = `Input schema fuzz testing asserting graceful rejection of malformed or malicious payloads targeting ${entityNames} fields.`;

  const performanceTestingText = `Load testing API endpoints of ${project.projectName} to guarantee response latency under 100ms for ${project.signals.expectedScalability} throughput.`;

  const sections = [
    { id: 'overview', title: '1. Testing Overview', text: `Comprehensive quality assurance strategy for **${project.projectName}** tailored for a ${project.signals.riskLevel.toUpperCase()}-risk profile (${project.signals.dataSensitivityScore}/10 data sensitivity).` },
    { id: 'strategy', title: '2. Testing Strategy', text: strategyText },
    { id: 'unit-testing', title: '3. Unit Testing', text: `Vitest test suite executing isolated pure domain logic, entity calculations for ${entityNames}, and validation rules of ${project.projectName}.` },
    { id: 'integration-testing', title: '4. Integration Testing', text: isSupabase ? `Supabase Client API integration tests verifying Row-Level Security (RLS) policies and Auth session tokens for ${cleanProjectName}.` : `HTTP request/response handler integration tests verifying API endpoint validation schemas for ${workflowNames}.` },
    { id: 'e2e-testing', title: '5. End-to-End Testing', text: `Playwright automated browser test suite executing critical user journeys: ${workflowNames}.` },
    { id: 'component-testing', title: '6. Component Testing', text: isNextJs ? `React Server Components (RSC) and Client Component rendering state verification via Vitest for ${project.projectName}.` : (isReact ? `React Testing Library component state and user event handler verification for ${project.projectName}.` : `UI component rendering and state verification for ${project.projectName}.`) },
    { id: 'api-testing', title: '7. API Testing', text: `Automated test suite asserting contract compliance across REST endpoints for entities: ${entityNames}.` },
    { id: 'db-testing', title: '8. Database Testing', text: `Automated ${project.dbEngine} migration verification and transaction rollback tests against containerized test database for ${cleanProjectName}.` },
    { id: 'auth-testing', title: '9. Authentication Testing', text: authTestingText },
    { id: 'authorization-testing', title: '10. Authorization Testing', text: isHighRisk ? `Strict Role-Based Access Control (RBAC) boundary tests preventing unauthorized data access to sensitive records across roles: ${project.domain.userRoles.map(u => u.role).join(', ')}.` : `Role permission validation asserting restricted route access in ${project.projectName}.` },
    { id: 'validation-testing', title: '11. Validation Testing', text: validationTestingText },
    { id: 'error-testing', title: '12. Error Handling Testing', text: `Simulated network dropouts, database connection timeouts, and 500 error boundary rendering in ${project.projectName}.` },
    { id: 'performance-testing', title: '13. Performance Testing', text: performanceTestingText },
    { id: 'security-testing', title: '14. Security Testing', text: isHighRisk ? `Automated OWASP ZAP vulnerability scanning and static code security analysis (SAST) for sensitive data leakage. Mandatory penetration test validation for ${project.projectName}.` : `Automated dependency vulnerability audits and OWASP top-10 checks for ${project.projectName}.` },
    { id: 'a11y-testing', title: '15. Accessibility Testing', text: `Automated axe-core WCAG 2.1 AA accessibility checks on key ${project.projectName} UI templates.` },
    { id: 'test-data', title: '16. Test Data', text: `Seed scripts and deterministic test fixtures representing domain entities: ${entityNames}.` },
    { id: 'test-env', title: '17. Test Environment', text: `Isolated Docker container running ${project.dbEngine} with automated database seeding for ${cleanProjectName}.` },
    { id: 'coverage', title: '18. Coverage', text: isHighRisk ? `Targeting minimum 95% line coverage (exceeding the baseline 85% requirement) on domain business logic and 100% on authorization controllers for ${project.projectName}.` : `Targeting minimum 85% line coverage on domain business logic for ${project.projectName}.` },
    { id: 'ci-testing', title: '19. CI Testing', text: `GitHub Actions workflow triggering unit, integration, and typecheck verification on every pull request to ${cleanProjectName}.` },
    { id: 'testing-gaps', title: '20. Testing Gaps', text: project.signals.financialInvolvement ? `Stripe webhook payment failure scenarios simulated via local mock servers for ${project.projectName}.` : `Third-party API integration callbacks simulated via mock HTTP servers for ${project.projectName}.` },
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

export function generateTesting(project: ProjectModel): string {
  const ir = buildTestingIR(project);
  return renderDocumentIRToMarkdown(ir);
}
