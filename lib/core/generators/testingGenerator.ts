import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildTestingIR(project: ProjectModel): DocumentIR {
  const builder = new DocumentIRBuilder('TESTING', `Testing Documentation`)
    .setMetadata('Target Product', project.projectName)
    .setMetadata('Test Framework', 'Vitest + Playwright');

  const sections = [
    { id: 'overview', title: '1. Testing Overview', text: `Quality assurance strategy for **${project.projectName}**.` },
    { id: 'strategy', title: '2. Testing Strategy', text: 'Testing pyramid: Unit (70%), Integration (20%), E2E (10%).' },
    { id: 'unit-testing', title: '3. Unit Testing', text: 'Vitest test suite for pure domain logic functions.' },
    { id: 'integration-testing', title: '4. Integration Testing', text: 'Supertest HTTP handler tests verifying Zod contract enforcement.' },
    { id: 'e2e-testing', title: '5. End-to-End Testing', text: 'Playwright test runner executing automated user workflows.' },
    { id: 'component-testing', title: '6. Component Testing', text: 'React Testing Library for isolated component state verification.' },
    { id: 'api-testing', title: '7. API Testing', text: 'Automated test suite verifying REST API endpoints.' },
    { id: 'db-testing', title: '8. Database Testing', text: 'Automated schema migration and database seed verification.' },
    { id: 'auth-testing', title: '9. Authentication Testing', text: 'Test cases for login, session refresh, and token expiration.' },
    { id: 'authorization-testing', title: '10. Authorization Testing', text: 'Permission boundary validation for restricted user roles.' },
    { id: 'validation-testing', title: '11. Validation Testing', text: 'Fuzz testing invalid input payloads against Zod models.' },
    { id: 'error-testing', title: '12. Error Handling Testing', text: 'Simulated network dropouts and unexpected server crash responses.' },
    { id: 'performance-testing', title: '13. Performance Testing', text: 'Lighthouse CI performance scoring and sub-100ms response targets.' },
    { id: 'security-testing', title: '14. Security Testing', text: 'OWASP ZAP automated vulnerability scanning.' },
    { id: 'a11y-testing', title: '15. Accessibility Testing', text: 'axe-core automated WCAG 2.1 AA accessibility checks.' },
    { id: 'test-data', title: '16. Test Data', text: 'Faker.js mock fixtures and seed dataset scripts.' },
    { id: 'test-env', title: '17. Test Environment', text: 'Isolated Docker containerized PostgreSQL database.' },
    { id: 'coverage', title: '18. Coverage', text: 'Targeting minimum 80% line and branch test coverage.' },
    { id: 'ci-testing', title: '19. CI Testing', text: 'GitHub Actions workflow running test suite on every pull request.' },
    { id: 'testing-gaps', title: '20. Testing Gaps', text: 'Third-party webhook callbacks tested via mock server endpoints.' },
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
