import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildPRDIR(project: ProjectModel): DocumentIR {
  const builder = new DocumentIRBuilder('PRD', `Product Requirements Document`)
    .setMetadata('Document Status', 'APPROVED & ACTIVE')
    .setMetadata('Target System', project.projectName)
    .setMetadata('Industry Domain', project.domain.domainName)
    .setMetadata('Risk Level', project.signals.riskLevel.toUpperCase())
    .setMetadata('Data Sensitivity', `${project.signals.dataSensitivityScore}/10`);

  // Determine industry-specific nuances dynamically from Domain Knowledge Model
  const km = project.domain.knowledgeModel;
  const entityNames = project.domain.entities.map(e => e.name).filter(n => n !== 'User');
  const entityListStr = entityNames.join(', ') || 'domain records';
  
  const problemStatement = km?.businessRules[0] 
    ? `${project.projectName} resolves critical domain operational challenges: ${project.description}`
    : `Operational bottlenecks, unverified data integrity, and manual tracking delays in managing ${entityListStr}.`;

  const nonGoals = [
    `Legacy batch data ETL migration tooling for ${entityNames[0] || 'entities'}.`,
    `Native desktop OS executable packaging for non-web environments.`,
    `Hardware-level low-level firmware flashing for third-party peripheral sensors.`,
  ];

  const businessRules = km?.businessRules && km.businessRules.length > 0
    ? km.businessRules
    : [
        `Rule BR-01: All state mutations on ${entityNames[0] || 'resources'} must log timestamps and actor identifiers.`,
        `Rule BR-02: Role permission authorization required before executing ${project.domain.coreWorkflows[0] || 'domain actions'}.`,
      ];

  const futureConsiderations = [
    `Automated AI-assisted workflow predictive reporting for ${project.domain.coreWorkflows[0] || 'operations'}.`,
    `Realtime WebSockets push notification infrastructure for ${entityNames[0] || 'system'} updates.`,
    `Mobile native app SDK integration for on-the-field operators.`,
  ];

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

  const personaHeaders = ['Persona Name', 'Role', 'Primary Pain Point', 'Key Motivation'];
  const roleHeaders = ['Role', 'Core Need', 'Permission Level'];

  // 6. User Personas
  builder.addSection({
    id: 'personas',
    title: '6. User Personas',
    level: 2,
    nodes: [
      {
        type: 'table',
        data: {
          headers: personaHeaders,
          rows: project.domain.userRoles.map(u => [
            `Persona: ${u.role}`,
            u.role,
            `Experiencing manual processing overhead in ${u.need}`,
            `Wants streamlined automated interface for ${u.need}`,
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
          headers: roleHeaders,
          rows: project.domain.userRoles.map(u => [u.role, u.need, `Clearance Level ${u.permissionLevel}`]),
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
    Start["User Visits ${project.projectName}"] --> Auth["Authentication & Role Authorization"]
    Auth --> Dashboard["${project.domain.userRoles[0]?.role || 'User'} Operational Dashboard"]
    Dashboard --> Action["Execute ${project.domain.coreWorkflows[0] || 'Domain Operation'}"]
    Action --> Persist["Persist ${project.domain.entities[1]?.name || 'Domain'} Record"]
    Persist --> Success["Operation Completed"]`,
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
