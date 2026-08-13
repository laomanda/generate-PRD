import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildPRDIR(project: ProjectModel): DocumentIR {
  const builder = new DocumentIRBuilder('PRD', `Product Requirements Document`)
    .setMetadata('Document Status', 'APPROVED & ACTIVE')
    .setMetadata('Target Product', project.projectName)
    .setMetadata('Industry Domain', project.domain.domainName)
    .setMetadata('Risk Level', project.signals.riskLevel.toUpperCase())
    .setMetadata('Data Sensitivity', `${project.signals.dataSensitivityScore}/10`);

  // Determine industry-specific nuances
  const isHealth = project.domain.industryType === 'healthcare';
  const isEcom = project.domain.industryType === 'ecommerce';
  const isEvent = project.domain.industryType === 'event';
  
  const problemStatement = isHealth ? 'Manual paper-based patient records and scheduling conflicts leading to critical care delays.'
    : isEcom ? 'High cart abandonment, inventory desync, and inefficient order fulfillment tracking.'
    : isEvent ? 'Double-booked seats, fraudulent ticket scalping, and chaotic on-site venue check-ins.'
    : `Manual workflow delays and unverified data integrity in ${project.domain.domainName}.`;

  const nonGoals = isHealth ? ['Hardware integration with physical MRI/X-Ray machines.', 'Automated diagnostic AI replacing doctors.']
    : isEcom ? ['Physical warehouse robotics integration.', 'In-house delivery fleet routing system.']
    : isEvent ? ['VR/AR virtual event streaming infrastructure.', 'Secondary ticket reselling marketplace.']
    : ['Legacy data migration tooling (handled via separate ETL CLI).', 'Native desktop executable packaging for non-web environments.'];

  const businessRules = isHealth ? [
    'Rule BR-01: PHI/PII must be encrypted at rest and in transit (HIPAA compliance).',
    'Rule BR-02: Only assigned doctors can modify medical records.',
  ] : isEcom ? [
    'Rule BR-01: Inventory must be locked for 15 minutes during checkout.',
    'Rule BR-02: Refunds cannot exceed original transaction amount.',
  ] : isEvent ? [
    'Rule BR-01: QR codes expire immediately upon successful check-in.',
    'Rule BR-02: Venue capacity cannot be exceeded under any circumstances.',
  ] : [
    'Rule BR-01: Users must authenticate before accessing non-public resources.',
    'Rule BR-02: All state mutations must log timestamps and actor identifiers.',
  ];

  const futureConsiderations = isHealth ? ['Telehealth video consultation integrations.', 'Wearable device health metrics syncing.']
    : isEcom ? ['AI-driven product recommendations.', 'Subscription box recurring billing.']
    : isEvent ? ['Interactive venue seating maps.', 'NFC wristband cashless payments at venues.']
    : ['Realtime WebSockets push notification infrastructure.', 'Automated AI-assisted workflow predictive reporting.'];

  // 1. Product Overview
  builder.addSection({
    id: 'overview',
    title: '1. Product Overview',
    level: 2,
    nodes: [
      { type: 'paragraph', text: project.description || `${project.projectName} domain application.` },
      {
        type: 'list',
        data: {
          ordered: false,
          items: [
            `Category: ${project.domain.domainName}`,
            `Core Tech Stack: ${project.techStack.map(t => typeof t === 'string' ? t : t.name).join(', ') || 'TypeScript, Next.js'}`,
            `Primary Database Engine: ${project.dbEngine}`,
          ],
        },
      },
    ],
  });

  // 2. Problem Statement
  builder.addSection({
    id: 'problem-statement',
    title: '2. Problem Statement',
    level: 2,
    nodes: [
      {
        type: 'callout',
        data: {
          type: 'IMPORTANT',
          title: 'Core Domain Challenge',
          content: `${project.projectName} resolves critical domain operational challenges: ${problemStatement}`,
        },
      },
    ],
  });

  // 3. Goals & Objectives
  builder.addSection({
    id: 'goals',
    title: '3. Goals & Objectives',
    level: 2,
    nodes: [
      {
        type: 'list',
        data: {
          ordered: true,
          items: project.domain.coreWorkflows.map(w => `Achieve automated workflows for ${w}.`),
        },
      },
    ],
  });

  // 4. Non-Goals
  builder.addSection({
    id: 'non-goals',
    title: '4. Non-Goals',
    level: 2,
    nodes: [
      {
        type: 'list',
        data: {
          ordered: false,
          items: nonGoals,
        },
      },
    ],
  });

  // 5. Target Users
  builder.addSection({
    id: 'target-users',
    title: '5. Target Users',
    level: 2,
    nodes: [
      {
        type: 'paragraph',
        text: `Target user demographics for **${project.projectName}** across ${project.domain.domainName} operations:`,
      },
      {
        type: 'list',
        data: {
          ordered: false,
          items: project.domain.userRoles.map(u => `${u.role}: Needs ${u.need}`),
        },
      },
    ],
  });

  // 6. User Personas
  builder.addSection({
    id: 'personas',
    title: '6. User Personas',
    level: 2,
    nodes: [
      {
        type: 'table',
        data: {
          headers: ['Persona Name', 'Role', 'Primary Pain Point', 'Key Motivation'],
          rows: project.domain.userRoles.map(u => [
            `Persona: ${u.role}`,
            u.role,
            `Manual processing overhead in ${u.need}`,
            `Streamlined automated interface for ${u.need}`,
          ]),
        },
      },
    ],
  });

  // 7. User Roles
  builder.addSection({
    id: 'roles',
    title: '7. User Roles',
    level: 2,
    nodes: [
      {
        type: 'table',
        data: {
          headers: ['Role', 'Core Need', 'Permission Level'],
          rows: project.domain.userRoles.map(u => [u.role, u.need, `Level ${u.permissionLevel}`]),
        },
      },
    ],
  });

  // 8. User Stories
  builder.addSection({
    id: 'user-stories',
    title: '8. User Stories',
    level: 2,
    nodes: project.domain.coreWorkflows.map(w => ({
      type: 'paragraph',
      text: `*   *"As a ${project.domain.userRoles[0]?.role || 'User'}, I want to execute ${w} so data is synchronized accurately across the system."*`,
    })),
  });

  // 9. Functional Requirements
  builder.addSection({
    id: 'functional-requirements',
    title: '9. Functional Requirements',
    level: 2,
    nodes: project.domain.coreWorkflows.map((w, i) => ({
      type: 'paragraph',
      text: `**Requirement 9.${i + 1} (${w})**: System must execute automated processing for ${w} with input validation.`,
    })),
  });

  // 10. Non-Functional Requirements
  builder.addSection({
    id: 'non-functional-requirements',
    title: '10. Non-Functional Requirements',
    level: 2,
    nodes: [
      {
        type: 'list',
        data: {
          ordered: false,
          items: [
            'Performance: Sub-100ms client reactivity, <500ms API response latency for 95th percentile.',
            `Security: Data Sensitivity Score ${project.signals.dataSensitivityScore}/10 with strict Zero Trust access control.`,
            'Reliability: 99.9% uptime SLA with automated fallback boundaries.',
          ],
        },
      },
    ],
  });

  // 11. Product Features
  const featureList = project.features.length > 0 ? project.features : project.domain.coreWorkflows;
  builder.addSection({
    id: 'features',
    title: '11. Product Features',
    level: 2,
    nodes: [
      {
        type: 'list',
        data: {
          ordered: false,
          items: featureList.map(f => `Feature Module: ${f}`),
        },
      },
    ],
  });

  // 12. User Flows
  builder.addSection({
    id: 'user-flows',
    title: '12. User Flows',
    level: 2,
    nodes: [
      {
        type: 'diagram',
        data: {
          diagramType: 'mermaid',
          code: `graph TD
    Start["User Visits ${project.projectName}"] --> Auth["Authentication"]
    Auth --> Dashboard["Main Dashboard"]
    Dashboard --> Action["Execute ${project.domain.coreWorkflows[0] || 'Task'}"]
    Action --> Success["Task Complete"]`,
        },
      },
    ],
  });

  // 13. Scope
  builder.addSection({
    id: 'scope',
    title: '13. Scope',
    level: 2,
    nodes: [
      {
        type: 'subsection',
        section: {
          id: 'in-scope',
          title: '13.1 In Scope',
          level: 3,
          nodes: [
            {
              type: 'list',
              data: {
                ordered: false,
                items: project.domain.coreWorkflows.map(w => `Core Workflow: ${w}`),
              },
            },
          ],
        },
      },
      {
        type: 'subsection',
        section: {
          id: 'out-of-scope',
          title: '13.2 Out of Scope',
          level: 3,
          nodes: [
            {
              type: 'list',
              data: {
                ordered: false,
                items: nonGoals,
              },
            },
          ],
        },
      },
    ],
  });

  // 14. Business Rules
  builder.addSection({
    id: 'business-rules',
    title: '14. Business Rules',
    level: 2,
    nodes: [
      {
        type: 'list',
        data: {
          ordered: false,
          items: businessRules,
        },
      },
    ],
  });

  // 15. Acceptance Criteria
  builder.addSection({
    id: 'acceptance-criteria',
    title: '15. Acceptance Criteria',
    level: 2,
    nodes: [
      {
        type: 'list',
        data: {
          ordered: false,
          items: project.domain.coreWorkflows.map(w => ({ text: `Verify automated workflow for ${w}`, checked: false })),
        },
      },
    ],
  });

  // 16. Success Metrics / KPIs
  builder.addSection({
    id: 'metrics',
    title: '16. Success Metrics / KPIs',
    level: 2,
    nodes: [
      {
        type: 'list',
        data: {
          ordered: false,
          items: [
            '95% reduction in manual data processing time.',
            'Zero critical security vulnerabilities on production release.',
          ],
        },
      },
    ],
  });

  // 17. Constraints
  builder.addSection({
    id: 'constraints',
    title: '17. Constraints',
    level: 2,
    nodes: [
      {
        type: 'list',
        data: {
          ordered: false,
          items: project.constraints.map(c => `Constraint: ${c}`),
        },
      },
    ],
  });

  // 18. Dependencies
  builder.addSection({
    id: 'dependencies',
    title: '18. Dependencies',
    level: 2,
    nodes: [
      {
        type: 'list',
        data: {
          ordered: false,
          items: [
            `Database Service: ${project.dbEngine} cluster availability.`,
            `Runtime Platform: Node.js / Serverless Edge runtime environment.`,
          ],
        },
      },
    ],
  });

  // 19. Assumptions
  builder.addSection({
    id: 'assumptions',
    title: '19. Assumptions',
    level: 2,
    nodes: [
      {
        type: 'list',
        data: {
          ordered: false,
          items: [
            'Users access the system using modern standards-compliant web browsers.',
            'Network latency to application host remains under 150ms.',
          ],
        },
      },
    ],
  });

  // 20. Risks
  builder.addSection({
    id: 'risks',
    title: '20. Risks',
    level: 2,
    nodes: [
      {
        type: 'callout',
        data: {
          type: 'WARNING',
          title: 'Risk Factor',
          content: `Risk Level ${project.signals.riskLevel.toUpperCase()}: Potential operational delay if external infrastructure or database availability drops below target SLA.`,
        },
      },
    ],
  });

  // 21. Future Considerations
  builder.addSection({
    id: 'future-considerations',
    title: '21. Future Considerations',
    level: 2,
    nodes: [
      {
        type: 'list',
        data: {
          ordered: false,
          items: futureConsiderations,
        },
      },
    ],
  });

  return builder.build();
}

export function generatePRD(project: ProjectModel): string {
  const ir = buildPRDIR(project);
  return renderDocumentIRToMarkdown(ir);
}
