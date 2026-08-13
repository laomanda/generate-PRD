/**
 * ============================================================================
 * CENTRALIZED SECTION REGISTRY
 * ============================================================================
 * Single Source of Truth defining exact titles, IDs, order, and mandatory
 * documentation contracts for all 9 document types.
 *
 * FIXED DOCUMENTATION CONTRACT + DYNAMIC CONTEXTUAL CONTENT = CONSISTENT OUTPUT
 * ============================================================================
 */

export interface MandatorySectionDefinition {
  id: string;
  title: string;
  level: 1 | 2 | 3;
  subsections?: { id: string; title: string; level: 3 }[];
}

export interface DocumentContractDefinition {
  id: string;
  filename: string;
  title: string;
  schemaVersion: string;
  mandatorySections: MandatorySectionDefinition[];
}

export const SECTION_REGISTRY: Record<string, DocumentContractDefinition> = {

  // --- 1. PRD.md Contract (21 Mandatory Sections) ---
  'PRD': {
    id: 'PRD',
    filename: 'PRD.md',
    title: 'Product Requirements Document',
    schemaVersion: '1.0.0',
    mandatorySections: [
      { id: 'overview', title: '1. Product Overview', level: 2 },
      { id: 'problem-statement', title: '2. Problem Statement', level: 2 },
      { id: 'goals', title: '3. Goals & Objectives', level: 2 },
      { id: 'non-goals', title: '4. Non-Goals', level: 2 },
      { id: 'target-users', title: '5. Target Users', level: 2 },
      { id: 'personas', title: '6. User Personas', level: 2 },
      { id: 'roles', title: '7. User Roles', level: 2 },
      { id: 'user-stories', title: '8. User Stories', level: 2 },
      { id: 'functional-requirements', title: '9. Functional Requirements', level: 2 },
      { id: 'non-functional-requirements', title: '10. Non-Functional Requirements', level: 2 },
      { id: 'features', title: '11. Product Features', level: 2 },
      { id: 'user-flows', title: '12. User Flows', level: 2 },
      {
        id: 'scope',
        title: '13. Scope',
        level: 2,
        subsections: [
          { id: 'in-scope', title: '13.1 In Scope', level: 3 },
          { id: 'out-of-scope', title: '13.2 Out of Scope', level: 3 },
        ],
      },
      { id: 'business-rules', title: '14. Business Rules', level: 2 },
      { id: 'acceptance-criteria', title: '15. Acceptance Criteria', level: 2 },
      { id: 'metrics', title: '16. Success Metrics / KPIs', level: 2 },
      { id: 'constraints', title: '17. Constraints', level: 2 },
      { id: 'dependencies', title: '18. Dependencies', level: 2 },
      { id: 'assumptions', title: '19. Assumptions', level: 2 },
      { id: 'risks', title: '20. Risks', level: 2 },
      { id: 'future-considerations', title: '21. Future Considerations', level: 2 },
    ],
  },

  // --- 2. DESIGN.md Contract (30 Mandatory Sections) ---
  'DESIGN': {
    id: 'DESIGN',
    filename: 'DESIGN.md',
    title: 'Design System & UX Specification',
    schemaVersion: '1.0.0',
    mandatorySections: [
      { id: 'design-overview', title: '1. Design Overview', level: 2 },
      { id: 'design-principles', title: '2. Design Principles', level: 2 },
      { id: 'visual-direction', title: '3. Visual Direction', level: 2 },
      { id: 'color-system', title: '4. Color System', level: 2 },
      { id: 'typography', title: '5. Typography', level: 2 },
      { id: 'spacing-system', title: '6. Spacing System', level: 2 },
      { id: 'border-radius', title: '7. Border Radius', level: 2 },
      { id: 'elevation-shadows', title: '8. Elevation & Shadows', level: 2 },
      { id: 'layout-grid', title: '9. Layout & Grid', level: 2 },
      { id: 'responsive-design', title: '10. Responsive Design', level: 2 },
      { id: 'breakpoints', title: '11. Breakpoints', level: 2 },
      { id: 'components', title: '12. Components', level: 2 },
      { id: 'component-variants', title: '13. Component Variants', level: 2 },
      { id: 'component-states', title: '14. Component States', level: 2 },
      { id: 'pages-screens', title: '15. Pages & Screens', level: 2 },
      { id: 'navigation', title: '16. Navigation', level: 2 },
      { id: 'user-flows', title: '17. User Flows', level: 2 },
      { id: 'interaction-behavior', title: '18. Interaction & Behavior', level: 2 },
      { id: 'forms-ux', title: '19. Forms & Validation UX', level: 2 },
      { id: 'loading-states', title: '20. Loading States', level: 2 },
      { id: 'empty-states', title: '21. Empty States', level: 2 },
      { id: 'error-states', title: '22. Error States', level: 2 },
      { id: 'success-feedback', title: '23. Success Feedback', level: 2 },
      { id: 'animation-motion', title: '24. Animation & Motion', level: 2 },
      { id: 'ux-rules', title: '25. UX Rules', level: 2 },
      { id: 'accessibility', title: '26. Accessibility', level: 2 },
      { id: 'iconography', title: '27. Iconography', level: 2 },
      { id: 'imagery-assets', title: '28. Imagery & Assets', level: 2 },
      { id: 'design-tokens', title: '29. Design Tokens', level: 2 },
      { id: 'design-decisions', title: '30. Design Decisions & Rationale', level: 2 },
    ],
  },

  // --- 3. DATABASE.md Contract (26 Mandatory Sections) ---
  'DATABASE': {
    id: 'DATABASE',
    filename: 'DATABASE.md',
    title: 'Database Documentation',
    schemaVersion: '1.0.0',
    mandatorySections: [
      { id: 'db-overview', title: '1. Database Overview', level: 2 },
      { id: 'db-tech', title: '2. Database Technology', level: 2 },
      { id: 'db-architecture', title: '3. Database Architecture', level: 2 },
      { id: 'schema-overview', title: '4. Schema Overview', level: 2 },
      { id: 'erd', title: '5. Entity Relationship Diagram', level: 2 },
      { id: 'tables', title: '6. Tables', level: 2 },
      { id: 'columns-types', title: '7. Columns & Data Types', level: 2 },
      { id: 'primary-keys', title: '8. Primary Keys', level: 2 },
      { id: 'foreign-keys', title: '9. Foreign Keys', level: 2 },
      { id: 'relationships', title: '10. Relationships', level: 2 },
      { id: 'constraints', title: '11. Constraints', level: 2 },
      { id: 'unique-constraints', title: '12. Unique Constraints', level: 2 },
      { id: 'indexes', title: '13. Indexes', level: 2 },
      { id: 'business-rules', title: '14. Database Business Rules', level: 2 },
      { id: 'auth-data', title: '15. Authentication Data', level: 2 },
      { id: 'authorization-data', title: '16. Authorization Data', level: 2 },
      { id: 'rls-policies', title: '17. Row-Level Security / Access Policies', level: 2 },
      { id: 'data-validation', title: '18. Data Validation', level: 2 },
      { id: 'migrations', title: '19. Migrations', level: 2 },
      { id: 'seed-data', title: '20. Seed Data', level: 2 },
      { id: 'transactions-integrity', title: '21. Transactions & Data Integrity', level: 2 },
      { id: 'backup-recovery', title: '22. Backup & Recovery', level: 2 },
      { id: 'db-security', title: '23. Database Security', level: 2 },
      { id: 'db-performance', title: '24. Performance Considerations', level: 2 },
      { id: 'data-retention', title: '25. Data Retention', level: 2 },
      { id: 'change-log', title: '26. Database Change Log', level: 2 },
    ],
  },

  // --- 4. TECH_STACK.md Contract (27 Mandatory Sections) ---
  'TECH_STACK': {
    id: 'TECH_STACK',
    filename: 'TECH_STACK.md',
    title: 'Technology Stack',
    schemaVersion: '1.0.0',
    mandatorySections: [
      { id: 'overview', title: '1. Technology Stack Overview', level: 2 },
      { id: 'runtime', title: '2. Runtime Environment', level: 2 },
      { id: 'core-framework', title: '3. Core Framework', level: 2 },
      { id: 'frontend-tech', title: '4. Frontend Technologies', level: 2 },
      { id: 'backend-tech', title: '5. Backend Technologies', level: 2 },
      { id: 'database-tech', title: '6. Database Technologies', level: 2 },
      { id: 'libraries-packages', title: '7. Libraries & Packages', level: 2 },
      { id: 'ui-styling', title: '8. UI / Styling Technologies', level: 2 },
      { id: 'animation-tech', title: '9. Animation Technologies', level: 2 },
      { id: 'state-management', title: '10. State Management', level: 2 },
      { id: 'data-fetching', title: '11. Data Fetching', level: 2 },
      { id: 'forms-validation', title: '12. Forms & Validation', level: 2 },
      { id: 'auth-tech', title: '13. Authentication', level: 2 },
      { id: 'authorization-tech', title: '14. Authorization', level: 2 },
      { id: 'api-tech', title: '15. API Technologies', level: 2 },
      { id: 'external-integrations', title: '16. External Integrations', level: 2 },
      { id: 'file-storage', title: '17. File Storage', level: 2 },
      { id: 'dev-tools', title: '18. Development Tools', level: 2 },
      { id: 'testing-stack', title: '19. Testing Stack', level: 2 },
      { id: 'code-quality', title: '20. Code Quality & Standards', level: 2 },
      { id: 'env-config', title: '21. Environment Configuration', level: 2 },
      { id: 'version-compatibility', title: '22. Version Compatibility', level: 2 },
      { id: 'deployment-infra', title: '23. Deployment & Infrastructure', level: 2 },
      { id: 'tech-decisions', title: '24. Technology Decisions', level: 2 },
      { id: 'tech-rationale', title: '25. Technology Rationale', level: 2 },
      { id: 'known-limitations', title: '26. Known Limitations', level: 2 },
      { id: 'change-log', title: '27. Tech Stack Change Log', level: 2 },
    ],
  },

  // --- 5. ARCHITECTURE.md Contract (26 Mandatory Sections) ---
  'ARCHITECTURE': {
    id: 'ARCHITECTURE',
    filename: 'ARCHITECTURE.md',
    title: 'System Architecture',
    schemaVersion: '1.0.0',
    mandatorySections: [
      { id: 'overview', title: '1. Architecture Overview', level: 2 },
      { id: 'style', title: '2. Architecture Style', level: 2 },
      { id: 'components', title: '3. System Components', level: 2 },
      { id: 'app-layers', title: '4. Application Layers', level: 2 },
      { id: 'frontend-arch', title: '5. Frontend Architecture', level: 2 },
      { id: 'backend-arch', title: '6. Backend Architecture', level: 2 },
      { id: 'db-arch', title: '7. Database Architecture', level: 2 },
      { id: 'api-arch', title: '8. API Architecture', level: 2 },
      { id: 'auth-arch', title: '9. Authentication Architecture', level: 2 },
      { id: 'authorization-arch', title: '10. Authorization Architecture', level: 2 },
      { id: 'data-flow', title: '11. Data Flow', level: 2 },
      { id: 'user-request-flow', title: '12. User Request Flow', level: 2 },
      { id: 'external-integrations', title: '13. External Integrations', level: 2 },
      { id: 'dependency-boundaries', title: '14. Dependency Boundaries', level: 2 },
      { id: 'security-boundaries', title: '15. Security Boundaries', level: 2 },
      { id: 'folder-structure', title: '16. Folder / Module Structure', level: 2 },
      { id: 'state-management-arch', title: '17. State Management Architecture', level: 2 },
      { id: 'error-handling', title: '18. Error Handling Strategy', level: 2 },
      { id: 'logging-observability', title: '19. Logging & Observability', level: 2 },
      { id: 'caching', title: '20. Caching Strategy', level: 2 },
      { id: 'performance', title: '21. Performance Considerations', level: 2 },
      { id: 'scalability', title: '22. Scalability Considerations', level: 2 },
      { id: 'reliability', title: '23. Reliability Considerations', level: 2 },
      { id: 'arch-decisions', title: '24. Architectural Decisions', level: 2 },
      { id: 'tradeoffs', title: '25. Trade-offs', level: 2 },
      { id: 'arch-constraints', title: '26. Known Architectural Constraints', level: 2 },
    ],
  },

  // --- 6. API.md Contract (18 Mandatory Sections) ---
  'API': {
    id: 'API',
    filename: 'API.md',
    title: 'API Documentation',
    schemaVersion: '1.0.0',
    mandatorySections: [
      { id: 'overview', title: '1. API Overview', level: 2 },
      { id: 'architecture', title: '2. API Architecture', level: 2 },
      { id: 'base-url', title: '3. Base URL / Environment', level: 2 },
      { id: 'auth', title: '4. Authentication', level: 2 },
      { id: 'authorization', title: '5. Authorization', level: 2 },
      { id: 'endpoints', title: '6. Endpoints', level: 2 },
      { id: 'request-params', title: '7. Request Parameters', level: 2 },
      { id: 'request-body', title: '8. Request Body', level: 2 },
      { id: 'response-structure', title: '9. Response Structure', level: 2 },
      { id: 'status-codes', title: '10. HTTP Status Codes', level: 2 },
      { id: 'error-responses', title: '11. Error Responses', level: 2 },
      { id: 'validation-rules', title: '12. Validation Rules', level: 2 },
      { id: 'pagination', title: '13. Pagination', level: 2 },
      { id: 'filtering-sorting', title: '14. Filtering & Sorting', level: 2 },
      { id: 'rate-limiting', title: '15. Rate Limiting', level: 2 },
      { id: 'versioning', title: '16. Versioning', level: 2 },
      { id: 'security', title: '17. Security Considerations', level: 2 },
      { id: 'external-integrations', title: '18. External API Integrations', level: 2 },
    ],
  },

  // --- 7. SECURITY.md Contract (20 Mandatory Sections) ---
  'SECURITY': {
    id: 'SECURITY',
    filename: 'SECURITY.md',
    title: 'Security Documentation',
    schemaVersion: '1.0.0',
    mandatorySections: [
      { id: 'overview', title: '1. Security Overview', level: 2 },
      { id: 'auth', title: '2. Authentication', level: 2 },
      { id: 'authorization', title: '3. Authorization', level: 2 },
      { id: 'rbac-model', title: '4. Role & Permission Model', level: 2 },
      { id: 'session-mgmt', title: '5. Session Management', level: 2 },
      { id: 'password-sec', title: '6. Password Security', level: 2 },
      { id: 'data-protection', title: '7. Data Protection', level: 2 },
      { id: 'input-validation', title: '8. Input Validation', level: 2 },
      { id: 'output-encoding', title: '9. Output Encoding', level: 2 },
      { id: 'api-security', title: '10. API Security', level: 2 },
      { id: 'db-security', title: '11. Database Security', level: 2 },
      { id: 'file-upload-sec', title: '12. File Upload Security', level: 2 },
      { id: 'secrets-mgmt', title: '13. Secrets Management', level: 2 },
      { id: 'env-security', title: '14. Environment Security', level: 2 },
      { id: 'access-control', title: '15. Access Control', level: 2 },
      { id: 'audit-trail', title: '16. Logging & Audit Trail', level: 2 },
      { id: 'sec-headers', title: '17. Security Headers', level: 2 },
      { id: 'dependency-sec', title: '18. Dependency Security', level: 2 },
      { id: 'threat-considerations', title: '19. Threat Considerations', level: 2 },
      { id: 'recommendations', title: '20. Security Recommendations', level: 2 },
    ],
  },

  // --- 8. TESTING.md Contract (20 Mandatory Sections) ---
  'TESTING': {
    id: 'TESTING',
    filename: 'TESTING.md',
    title: 'Testing Documentation',
    schemaVersion: '1.0.0',
    mandatorySections: [
      { id: 'overview', title: '1. Testing Overview', level: 2 },
      { id: 'strategy', title: '2. Testing Strategy', level: 2 },
      { id: 'unit-testing', title: '3. Unit Testing', level: 2 },
      { id: 'integration-testing', title: '4. Integration Testing', level: 2 },
      { id: 'e2e-testing', title: '5. End-to-End Testing', level: 2 },
      { id: 'component-testing', title: '6. Component Testing', level: 2 },
      { id: 'api-testing', title: '7. API Testing', level: 2 },
      { id: 'db-testing', title: '8. Database Testing', level: 2 },
      { id: 'auth-testing', title: '9. Authentication Testing', level: 2 },
      { id: 'authorization-testing', title: '10. Authorization Testing', level: 2 },
      { id: 'validation-testing', title: '11. Validation Testing', level: 2 },
      { id: 'error-testing', title: '12. Error Handling Testing', level: 2 },
      { id: 'performance-testing', title: '13. Performance Testing', level: 2 },
      { id: 'security-testing', title: '14. Security Testing', level: 2 },
      { id: 'a11y-testing', title: '15. Accessibility Testing', level: 2 },
      { id: 'test-data', title: '16. Test Data', level: 2 },
      { id: 'test-env', title: '17. Test Environment', level: 2 },
      { id: 'coverage', title: '18. Coverage', level: 2 },
      { id: 'ci-testing', title: '19. CI Testing', level: 2 },
      { id: 'testing-gaps', title: '20. Testing Gaps', level: 2 },
    ],
  },

  // --- 9. DEPLOYMENT.md Contract (20 Mandatory Sections) ---
  'DEPLOYMENT': {
    id: 'DEPLOYMENT',
    filename: 'DEPLOYMENT.md',
    title: 'Deployment Documentation',
    schemaVersion: '1.0.0',
    mandatorySections: [
      { id: 'overview', title: '1. Deployment Overview', level: 2 },
      { id: 'environments', title: '2. Environments', level: 2 },
      { id: 'build-process', title: '3. Build Process', level: 2 },
      { id: 'env-vars', title: '4. Environment Variables', level: 2 },
      { id: 'frontend-deployment', title: '5. Frontend Deployment', level: 2 },
      { id: 'backend-deployment', title: '6. Backend Deployment', level: 2 },
      { id: 'db-deployment', title: '7. Database Deployment', level: 2 },
      { id: 'storage', title: '8. Storage', level: 2 },
      { id: 'domain-dns', title: '9. Domain & DNS', level: 2 },
      { id: 'ssl-tls', title: '10. SSL / TLS', level: 2 },
      { id: 'cicd', title: '11. CI/CD', level: 2 },
      { id: 'migration-deployment', title: '12. Database Migration Deployment', level: 2 },
      { id: 'monitoring', title: '13. Monitoring', level: 2 },
      { id: 'logging', title: '14. Logging', level: 2 },
      { id: 'backup', title: '15. Backup', level: 2 },
      { id: 'rollback', title: '16. Rollback Strategy', level: 2 },
      { id: 'scaling', title: '17. Scaling', level: 2 },
      { id: 'deployment-security', title: '18. Deployment Security', level: 2 },
      { id: 'infra-dependencies', title: '19. Infrastructure Dependencies', level: 2 },
      { id: 'checklist', title: '20. Deployment Checklist', level: 2 },
    ],
  },
};
