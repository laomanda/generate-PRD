import { ProjectModel } from '../project-model/schemas';
import { DocumentIRBuilder, DocumentIR } from '../document-ir';
import { renderDocumentIRToMarkdown } from '../markdown-engine';

export function buildPRDIR(project: ProjectModel): DocumentIR {
  const builder = new DocumentIRBuilder('PRD', `📋 PRODUCT REQUIREMENT DOCUMENT (PRD)`)
    .setMetadata('Document Status', 'APPROVED & ACTIVE')
    .setMetadata('Target Product', project.projectName)
    .setMetadata('Industry Domain', project.domain.domainName)
    .setMetadata('Risk Level', project.signals.riskLevel.toUpperCase())
    .setMetadata('Data Sensitivity', `${project.signals.dataSensitivityScore}/10`);

  // 1. Overview
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
            `Core Tech Stack: ${project.techStack.map(t => t.name).join(', ') || 'TypeScript, Next.js'}`,
            `Primary Database Engine: ${project.dbEngine}`,
          ],
        },
      },
    ],
  });

  // 2. Problem Statement & Goals
  builder.addSection({
    id: 'problem-goals',
    title: '2. Problem Statement & Objectives',
    level: 2,
    nodes: [
      {
        type: 'callout',
        data: {
          type: 'IMPORTANT',
          title: 'Core Domain Challenge',
          content: `${project.projectName} resolves critical domain pain points: ${project.domain.coreWorkflows.join(', ')}.`,
        },
      },
      {
        type: 'list',
        data: {
          ordered: true,
          items: project.domain.coreWorkflows.map(w => `Achieve automated workflows for ${w}.`),
        },
      },
    ],
  });

  // 3. Target Users
  builder.addSection({
    id: 'target-users',
    title: '3. Target Users & Personas',
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

  // 4. Functional Requirements
  builder.addSection({
    id: 'requirements',
    title: '4. Functional Requirements & User Stories',
    level: 2,
    nodes: project.domain.coreWorkflows.map((w, i) => ({
      type: 'paragraph',
      text: `**Requirement 4.${i + 1} (${w})**: System must execute automated processing for ${w}. User Story: *"As a ${project.domain.userRoles[0]?.role || 'User'}, I want to execute ${w} so data is synchronized accurately."*`,
    })),
  });

  // 5. Inferred Security & Compliance Requirements (if rules fired)
  if (project.inferredFacts.length > 0) {
    builder.addSection({
      id: 'inferred-rules',
      title: '5. Rule-Engine Intelligence Requirements',
      level: 2,
      nodes: project.inferredFacts.map(fact => ({
        type: 'callout',
        data: {
          type: 'NOTE',
          title: `Inferred Requirement: ${fact.fact}`,
          content: `${fact.reasoning} (Source: ${fact.source}, Confidence: ${Math.round(fact.confidence * 100)}%)`,
        },
      })),
    });
  }

  return builder.build();
}

export function generatePRD(project: ProjectModel): string {
  const ir = buildPRDIR(project);
  return renderDocumentIRToMarkdown(ir);
}
