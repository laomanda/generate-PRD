import { ProjectConfig } from '../types';
import { composeProjectSpec } from '../composer';

export function generateTestingStrategy(config: ProjectConfig): string {
  const { dbEngine } = config;
  const spec = composeProjectSpec(config);
  const { appName, requirements, tables, apiEndpoints } = spec;

  return `# 🧪 TESTING & QA STRATEGY DOCUMENT

> **Quality Assurance & Verification Plan**  
> **Target Product**: **${appName}**  
> **Database Engine**: **${dbEngine || 'PostgreSQL'}**  
> **Target Standard**: 100% Strict Type Safety & Zero Unhandled Exceptions

---

## 1. Testing Pyramid & Overview
- **Unit Testing**: Vitest / Jest for domain functions and utility algorithms.
- **Integration Testing**: Supertest for API Route Handlers (${apiEndpoints.length} endpoints).
- **End-to-End (E2E) Testing**: Playwright test suite for critical user journeys.
- **Database Schema Validation**: ${tables.length} tables verified for foreign key integrity.

---

## 2. Feature-Specific Test Scenarios for ${appName} ⭐

${requirements.map((r, i) => `
### 2.${i + 1} Test Scenario: ${r.feature}
- **Target Feature**: ${r.description}
- **User Story**: *"${r.userStory}"*
- **Verification Steps**:
${r.acceptanceCriteria.map(ac => `  - [ ] **Test Assertion**: Verify ${ac}`).join('\n')}
`).join('\n')}

---

## 3. API Endpoint Testing Matrix (${apiEndpoints.length} Endpoints)
| Endpoint | Method | Expected Status | Verification Target |
| :--- | :--- | :--- | :--- |
${apiEndpoints.slice(0, 8).map(e => {
  const parts = e.split(' ');
  const method = parts[0] || 'GET';
  const path = parts[1] || e;
  return `| \`${path}\` | **${method}** | \`200 OK\` / \`201 Created\` | Validates response JSON payload schema against Zod model |`;
}).join('\n')}

---

## 4. Database Seed & Migration Testing
- **Test Command**: \`npm run test:db\` or \`npx prisma db seed --environment test\`.
- **Database Cleanup**: Automated truncation of ${tables.length} tables before each test suite execution.
- **Schema Fixtures**:
${tables.map(t => `- **${t.name}**: Seeded with test records for integration testing.`).join('\n')}

---

## 5. Continuous Integration (CI) Pipeline
\`\`\`bash
# 1. Type Check
npx tsc --noEmit

# 2. Linter Verification
npm run lint

# 3. Unit & Integration Tests
npm run test:unit

# 4. End-to-End Test Suite
npx playwright test

# 5. Production Build Test
npm run build
\`\`\`
`;
}
